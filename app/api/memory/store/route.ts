import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rememberMoment } from '@/lib/ai/memory';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { moment, weight, type } = await req.json();
  const id = await rememberMoment(user.id, moment, weight, type);

  await supabase.from('partner_memories').insert({
    player_id: user.id,
    memory_text: moment,
    emotional_weight: weight,
    embedding_id: id,
    memory_type: type,
  });

  return NextResponse.json({ id });
}