"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const QUESTIONS = [
  "Describe your ideal Saturday. What are you doing, and with whom?",
  "When you are hurt by someone you love, what do you do first?",
  "What does family mean to you?",
  "What is one thing you would never compromise on in a marriage?",
  "How do you handle money — save, spend, or somewhere between?",
  "What is a small thing that makes you feel loved?",
];

export default function Interview() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState("");

  function next() {
    const newAnswers = [...answers, current];
    setAnswers(newAnswers);
    setCurrent("");
    
    if (i + 1 < QUESTIONS.length) {
      setI(i + 1);
    } else {
      // Save to browser storage so we can use it on the next page
      localStorage.setItem("interview_answers", JSON.stringify(newAnswers));
      router.push("/ideal-partner"); // We will build this page next
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-black">
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-white/50 text-sm mb-4 font-mono">
          Question {i + 1} of {QUESTIONS.length}
        </div>
        <h2 className="text-3xl font-serif mb-8 text-white">{QUESTIONS[i]}</h2>
        <textarea
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30"
          placeholder="Take your time..."
        />
        <button
          onClick={next}
          disabled={current.trim().length < 3}
          className="mt-6 bg-white text-black px-8 py-3 rounded-full font-medium disabled:opacity-30 transition"
        >
          {i + 1 === QUESTIONS.length ? "Finish" : "Next"}
        </button>
      </motion.div>
    </main>
  );
}