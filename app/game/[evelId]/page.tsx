"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function LevelPlay() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [stability, setStability] = useState(100);
  const [timeLeft, setTimeLeft] = useState(25);
  const [currentScene, setCurrentScene] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCounselor, setShowCounselor] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [rewards, setRewards] = useState<{strength: number, iq: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track how many scenes played in this level
  const [sceneCount, setSceneCount] = useState(0);

  // 1. Fetch a new scene from the AI
  async function fetchScene() {
    setLoading(true);
    try {
      // Get player's partner data to feed to the AI
      const { data: { user } } = await supabase.auth.getUser();
      const { data: partnerProfile } = await supabase
        .from("partner_profiles")
        .select("fictitious_partner_data")
        .eq("player_id", user?.id)
        .single();

      const res = await fetch("/api/game/scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId: Number(params.levelId),
          stability,
          partnerData: partnerProfile?.fictitious_partner_data || {}
        }),
      });
      
      const data = await res.json();
      setCurrentScene(data);
      setTimeLeft(25); // Reset timer
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchScene();
  }, []);

  // Timer
  useEffect(() => {
    if (loading || showCounselor || gameOver || !currentScene) return;
    if (timeLeft <= 0) {
      // Time ran out = penalty and next scene
      const newStability = Math.max(0, stability - 20);
      setStability(newStability);
      if (newStability <= 0) setGameOver(true);
      else handleNextScene();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, loading, showCounselor, gameOver, currentScene]);

  function handleChoice(delta: number) {
    const newStability = Math.max(0, Math.min(100, stability + delta));
    setStability(newStability);

    if (newStability <= 0) {
      setGameOver(true);
      return;
    }
    handleNextScene();
  }

    async function handleNextScene() {
    if (sceneCount >= 2) {
      setShowCounselor(true);
      setIsSaving(true);
      
      // Save progress to database
      try {
        const res = await fetch("/api/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            levelId: Number(params.levelId),
            finalStability: stability,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setRewards({ strength: data.strengthGained, iq: data.iqGained });
        }
      } catch (err) {
        console.error("Failed to save progress");
      }
      setIsSaving(false);
      
    } else {
      setSceneCount((c) => c + 1);
      fetchScene();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mb-6" />
        <p className="text-white/50 font-serif text-xl">The AI is writing your partner's dialogue...</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-950 px-6">
        <div className="text-center max-w-lg">
          <h1 className="text-5xl font-serif text-white mb-4">Emotional Breakdown</h1>
          <p className="text-white/70 mb-8">The conflict escalated beyond repair. You need to try again.</p>
          <button onClick={() => window.location.reload()} className="bg-white text-black px-8 py-3 rounded-full font-medium">
            Restart Level
          </button>
        </div>
      </main>
    );
  }

    if (showCounselor) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-serif text-white mb-4 text-center">Level Complete</h2>
          
          <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl mb-6 text-center">
            <h3 className="text-xl text-emerald-400 mb-2 font-medium">You survived the conflict</h3>
            {isSaving ? (
              <p className="text-white/60">Saving your growth...</p>
            ) : rewards ? (
              <div className="flex justify-center gap-8 mt-4">
                <div>
                  <div className="text-3xl font-mono text-white">+{rewards.strength}</div>
                  <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Character Strength</div>
                </div>
                <div>
                  <div className="text-3xl font-mono text-white">+{rewards.iq}</div>
                  <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Emotional IQ</div>
                </div>
              </div>
            ) : null}
          </div>

          <p className="text-white/80 mb-8 italic text-center">
            "A marriage survives not on perfection, but on repair. You made an effort to repair. Your Emotional IQ has grown."
          </p>
          <div className="flex justify-center">
            <button onClick={() => router.push('/game')} className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-white/90 transition">
              Continue Journey
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 flex flex-col">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30">
        <div className="bg-black/60 backdrop-blur rounded-2xl p-4 w-64 border border-white/10">
          <div className="text-white text-xs uppercase tracking-widest mb-2 flex justify-between">
            <span>Emotional Stability</span>
            <span className="font-mono">{stability}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: stability > 50 ? '#22c55e' : stability > 25 ? '#eab308' : '#ef4444' }}
              animate={{ width: `${stability}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className={`relative w-16 h-16 bg-black/60 backdrop-blur border rounded-full flex items-center justify-center ${timeLeft <= 5 ? 'border-red-500 text-red-500' : 'border-white/20 text-white'}`}>
          <span className="font-mono text-xl font-bold">{timeLeft}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl text-center"
          >
            <p className="text-white/50 text-sm uppercase tracking-widest mb-4">Partner</p>
            <p className="text-white text-3xl md:text-4xl font-light italic leading-tight">
              "{currentScene?.partnerDialogue}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentScene?.choices?.map((choice: any, i: number) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleChoice(choice.stability_delta)}
              className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 rounded-2xl p-5 text-left transition group"
            >
              <div className="text-xs uppercase tracking-widest text-white/40 mb-2 group-hover:text-white/80 transition">
                {choice.emotion_tag}
              </div>
              <div className="text-white/90 text-lg">{choice.text}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}