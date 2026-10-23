'use client';
import { motion } from 'framer-motion';

interface Choice {
  text: string;
  emotion_tag: string;
  stability_delta: number;
  why_it_matters?: string;
}

export default function EmotionWheel({
  choices,
  onChoose,
}: {
  choices: Choice[];
  onChoose: (c: Choice) => void;
}) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-3 w-full max-w-3xl px-4">
      {choices?.map((c, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChoose(c)}
          className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-white text-left hover:bg-white/20 transition"
        >
          <div className="text-xs uppercase tracking-widest text-white/50 mb-1">
            {c.emotion_tag}
          </div>
          <div className="text-sm">{c.text}</div>
        </motion.button>
      ))}
    </div>
  );
}