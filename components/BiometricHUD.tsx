'use client';
export default function BiometricHUD({ bpm }: { bpm: number }) {
  return (
    <div className="bg-black/60 backdrop-blur rounded-2xl px-4 py-3 text-white">
      <div className="text-xs uppercase tracking-widest text-white/60">Heart Rate</div>
      <div className="text-2xl font-mono">
        {bpm} <span className="text-sm text-red-400">♥</span>
      </div>
    </div>
  );
}