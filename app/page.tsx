"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-black to-indigo-900/30" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-3xl"
      >
        <h1 className="text-6xl md:text-8xl font-serif mb-6">The Union</h1>
        <p className="text-xl text-white/70 mb-12">
          A marriage. A mirror. A test of who you really are.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/age-gate"
            className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-white/90 transition"
          >
            Begin
          </Link>
          <Link
            href="/weather"
            className="border border-white/30 px-8 py-4 rounded-full font-medium hover:bg-white/10 transition"
          >
            Global Weather
          </Link>
        </div>
        <p className="text-xs text-white/40 mt-12">
          Fiction. Not therapy. If you are in crisis, call 988 (US) or your local helpline.
        </p>
      </motion.div>
    </main>
  );
}