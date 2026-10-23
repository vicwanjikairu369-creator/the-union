import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { emotion, intensity, latitude, longitude, country_code } = await req.json();

  await supabase.from('emotional_weather').insert({
    player_id: user.id,
    emotion,
    intensity,
    latitude,
    longitude,
    country_code,
  });

  await pusher.trigger('emotional-weather', 'emotion-ping', {
    emotion,
    intensity,
    latitude,
    longitude,
    country_code,
    timestamp: Date.now(),
  });

  return NextResponse.json({ ok: true });
}