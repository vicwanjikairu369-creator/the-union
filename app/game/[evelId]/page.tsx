"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SceneCanvas from "@/components/SceneCanvas";

export default function LevelPlay() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [stability, setStability] = useState(100);
  const [timeLeft, setTimeLeft] = useState(25);
  const [currentScene, setCurrentScene] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCounselor, setShowCounselor] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const [sceneCount, setSceneCount] = useState(0);
  const [rewards, setRewards] = useState<{strength: number, iq: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function fetchScene() {
    setLoading(true);
    setError(null);
    try {
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
      
      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentScene(data);
      setTimeLeft(25);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to the AI.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchScene();
  }, []);

  useEffect(() => {
    if (loading || showCounselor || gameOver || !currentScene || error) return;
    if (timeLeft <= 0) {
      const newStability = Math.max(0, stability - 20);
      setStability(newStability);
      if (newStability <= 0) setGameOver(true);
      else handleNextScene();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, loading, showCounselor, gameOver, currentScene, error]);

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

  const enable3D = process.env.NEXT_PUBLIC_ENABLE_3D === "true";

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="text-center max-w-lg border border-red-500/30 bg-red-950/20 p-8 rounded-3xl">
          <h1 className="text-3xl font-serif text-red-400 mb-4">System Error</h1>
          <p className="text-white/80 mb-8">{error}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => fetchScene()} className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90">
              Try Again
            </button>
            <button onClick={() => router.push('/game')} className="border border-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10">
              Back to Menu
            </button>
          </div>
        </div>
      </main>
    );
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
    <div className="relative h-screen w-screen overflow-hidden bg-black flex flex-col font-sans">
      
      {/* 3D GRAPHICS LAYER (Or Cinematic Fallback) */}
      {enable3D ? (
        <SceneCanvas stability={stability} />
      ) : (
        <motion.div 
          className="absolute inset-0 z-0 opacity-50"
          animate={{
            background: stability > 50 
              ? "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #000000 100%)" 
              : stability > 25
              ? "radial-gradient(circle at 50% 50%, #4c1d95 0%, #000000 100%)"
              : "radial-gradient(circle at 50% 50%, #7f1d1d 0%, #000000 100%)"
          }}
          transition={{ duration: 2 }}
        />
      )}

      {/* TOP HUD - Glassmorphism */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30 pointer-events-none">
        
        {/* Stability Meter */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-72 pointer-events-auto shadow-2xl">
          <div className="text-white/80 text-xs uppercase tracking-[0.2em] mb-3 flex justify-between font-medium">
            <span>Emotional Stability</span>
            <span className="font-mono text-white">{stability}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: stability > 50 ? '#10b981' : stability > 25 ? '#f59e0b' : '#ef4444' }}
              animate={{ width: `${stability}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className={`relative w-20 h-20 bg-black/40 backdrop-blur-xl border rounded-full flex items-center justify-center shadow-2xl pointer-events-auto transition-colors duration-500 ${timeLeft <= 5 ? 'border-red-500/50 text-red-500 shadow-red-900/20' : 'border-white/10 text-white'}`}>
          <span className="font-mono text-2xl font-light">{timeLeft}</span>
        </div>
      </div>

      {/* CENTER DIALOGUE - Cinematic Subtitles */}
      <div className="flex-1 flex items-center justify-center px-6 z-20 pointer-events-none relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneCount}
            initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-center"
          >
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-6 font-semibold drop-shadow-md">Partner</p>
            <p className="text-white text-3xl md:text-5xl font-serif italic leading-tight drop-shadow-2xl text-shadow">
              "{currentScene?.partnerDialogue}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM CHOICES - Sleek Glassmorphism Buttons */}
      <div className="p-8 pb-12 w-full max-w-5xl mx-auto z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentScene?.choices?.map((choice: any, i: number) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleChoice(choice.stability_delta)}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-2xl p-5 text-left transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 group-hover:text-white/70 transition-colors">
                {choice.emotion_tag}
              </div>
              <div className="text-white/90 text-lg font-light leading-snug">{choice.text}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}