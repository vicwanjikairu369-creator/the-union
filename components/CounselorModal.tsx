'use client';
import { motion } from 'framer-motion';

export default function CounselorModal({
  verdict,
  onClose,
}: {
  verdict: any;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full"
      >
        <h2 className="text-2xl font-serif mb-4">Counselor's Notes</h2>
        <p className="text-gray-800 mb-4">{verdict.verdict}</p>
        <div className="bg-amber-50 p-4 rounded-2xl mb-3">
          <div className="text-xs uppercase tracking-widest text-amber-800">Key Insight</div>
          <div className="text-gray-900 mt-1">{verdict.keyInsight}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl mb-3">
          <div className="text-xs uppercase tracking-widest text-blue-800">Growth Area</div>
          <div className="text-gray-900 mt-1">{verdict.growthArea}</div>
        </div>
        <p className="italic text-gray-700 mb-6">"{verdict.encouragement}"</p>
        <button
          onClick={onClose}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}