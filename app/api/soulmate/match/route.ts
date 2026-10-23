import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: me } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!me || me.total_levels_conquered < 12) {
    return NextResponse.json({ error: 'Complete all levels first.' }, { status: 400 });
  }

  const opposite = me.gender === 'male' ? 'female' : 'male';

  const { data: candidates } = await supabase
    .from('profiles')
    .select('*')
    .eq('gender', opposite)
    .eq('total_levels_conquered', 12)
    .neq('id', user.id);

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ match: null, message: 'No candidates yet. Check back soon.' });
  }

  // Closest EIQ wins
  const sorted = candidates
    .map(c => ({ ...c, diff: Math.abs(c.emotional_iq - me.emotional_iq) }))
    .sort((a, b) => a.diff - b.diff);

  const match = sorted[0];

  await supabase.from('soulmate_matches').insert({
    player_id: user.id,
    matched_player_id: match.id,
    eiq_difference: match.diff,
    match_score: 100 - match.diff,
  });

  return NextResponse.json({ match, score: 100 - match.diff });
}