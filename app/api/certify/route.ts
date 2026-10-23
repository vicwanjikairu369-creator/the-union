import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.total_levels_conquered < 12) {
    return NextResponse.json({ error: 'Not eligible — complete all 12 levels.' }, { status: 400 });
  }

  const certId = `UNION-${nanoid(12).toUpperCase()}`;

  await supabase
    .from('profiles')
    .update({ is_certified: true, certification_id: certId })
    .eq('id', user.id);

  return NextResponse.json({ certificateId: certId, verifyUrl: `/verify/${certId}` });
}