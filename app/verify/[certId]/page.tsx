import { createClient } from '@/lib/supabase/server';

export default async function Verify({ params }: { params: { certId: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('username, emotional_iq, certification_id, is_certified')
    .eq('certification_id', params.certId)
    .single();

  if (!data || !data.is_certified) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">Not verified</h1>
          <p className="text-white/60">This certificate does not exist or has not been issued.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
        <div className="text-xs uppercase tracking-widest text-emerald-400">Verified</div>
        <h1 className="text-4xl font-serif mt-2">{data.username}</h1>
        <div className="text-white/60 mt-4">Emotional IQ</div>
        <div className="text-5xl font-mono mt-1">{data.emotional_iq}</div>
        <div className="text-white/40 text-xs mt-8">Certificate ID: {params.certId}</div>
      </div>
    </main>
  );
}