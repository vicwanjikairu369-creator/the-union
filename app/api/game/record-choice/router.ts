import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isHealthy } from '@/lib/game/emotions';
import { rememberMoment } from '@/lib/ai/memory';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { levelId, choice, newStability, heartRate } = await req.json();

  const healthy = isHealthy(choice.emotion_tag);

  await supabase.from('choice_history').insert({
    player_id: user.id,
    level_id: levelId,
    scene_id: `L${levelId}_${Date.now()}`,
    choice_text: choice.text,
    emotion_tag: choice.emotion_tag,
    stability_delta: choice.stability_delta,
    was_healthy: healthy,
    is_ghost: !healthy && choice.stability_delta <= -10,
  });

  // Track weaknesses
  if (!healthy) {
    const { data: existing } = await supabase
      .from('emotional_weaknesses')
      .select('*')
      .eq('player_id', user.id)
      .eq('weakness_tag', choice.emotion_tag)
      .single();

    if (existing) {
      await supabase
        .from('emotional_weaknesses')
        .update({ failure_count: existing.failure_count + 1, last_failed_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase.from('emotional_weaknesses').insert({
        player_id: user.id,
        weakness_tag: choice.emotion_tag,
        failure_count: 1,
        last_failed_at: new Date().toISOString(),
      });
    }
  }

  // Store memory if significant
  if (Math.abs(choice.stability_delta) >= 10) {
    const memoryId = await rememberMoment(
      user.id,
      `Player chose "${choice.text}" — partner felt ${choice.emotion_tag}`,
      choice.stability_delta,
      choice.stability_delta < 0 ? 'conflict' : 'joy'
    );

    await supabase.from('partner_memories').insert({
      player_id: user.id,
      memory_text: `Player chose "${choice.text}" — partner felt ${choice.emotion_tag}`,
      emotional_weight: choice.stability_delta,
      embedding_id: memoryId,
      memory_type: choice.stability_delta < 0 ? 'conflict' : 'joy',
    });
  }

  // Biometric
  if (heartRate) {
    await supabase.from('biometric_readings').insert({
      player_id: user.id,
      level_id: levelId,
      avg_heart_rate: heartRate,
      peak_heart_rate: heartRate,
      stress_events: !healthy ? 1 : 0,
    });
  }

  // Update progress
  const { data: progress } = await supabase
    .from('game_progress')
    .select('*')
    .eq('player_id', user.id)
    .eq('level_id', levelId)
    .single();

  if (progress) {
    await supabase
      .from('game_progress')
      .update({
        emotional_stability: newStability,
        is_completed: newStability >= 100,
        updated_at: new Date().toISOString(),
      })
      .eq('id', progress.id);
  } else {
    await supabase.from('game_progress').insert({
      player_id: user.id,
      level_id: levelId,
      emotional_stability: newStability,
      is_completed: newStability >= 100,
    });
  }

  return NextResponse.json({ ok: true });
}