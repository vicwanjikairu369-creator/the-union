'use client';
import { motion } from 'framer-motion';

export default function GhostWhisper({ text }: { text: string }) {
  if (!text) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
    >
      <div className="text-white/80 text-xl italic font-light max-w-xl text-center px-8">
        "{text}"
      </div>
    </motion.div>
  );
}