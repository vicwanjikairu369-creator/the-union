'use client';
export default function TimerRing({ seconds, max }: { seconds: number; max: number }) {
  const pct = (seconds / max) * 100;
  return (
    <div className="relative w-20 h-20">
      <svg className="rotate-[-90deg]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="45" fill="none"
          stroke={seconds < 5 ? '#ef4444' : '#facc15'}
          strokeWidth="8"
          strokeDasharray={`${(pct / 100) * 283} 283`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white font-mono text-lg">
        {seconds}
      </div>
    </div>
  );
}