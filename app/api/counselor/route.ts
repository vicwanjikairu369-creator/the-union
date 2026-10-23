import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { counselSession } from '@/lib/ai/counselor';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { transcript, levelId } = await req.json();
  const verdict = await counselSession(transcript, levelId);

  await supabase.from('counselor_sessions').insert({
    player_id: user.id,
    level_id: levelId,
    transcript,
    counselor_verdict: verdict.verdict,
    key_insight: verdict.keyInsight,
    growth_area: verdict.growthArea,
  });

  return NextResponse.json(verdict);
}