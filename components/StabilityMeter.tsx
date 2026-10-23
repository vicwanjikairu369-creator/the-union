'use client';
import { motion } from 'framer-motion';

export default function StabilityMeter({ value }: { value: number }) {
  const color = value > 60 ? '#22c55e' : value > 30 ? '#eab308' : '#ef4444';
  return (
    <div className="bg-black/60 backdrop-blur rounded-2xl p-4 w-64">
      <div className="text-white text-xs uppercase tracking-widest mb-2">Emotional Stability</div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-white text-sm mt-2 font-mono">{value}%</div>
    </div>
  );
}