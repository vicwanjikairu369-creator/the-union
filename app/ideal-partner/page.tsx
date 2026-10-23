"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function IdealPartner() {
  const supabase = createClient();
  const router = useRouter();
  
  const [physical, setPhysical] = useState("");
  const [character, setCharacter] = useState("");
  const [conflict, setConflict] = useState("withdraws when stressed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Format the traits into arrays
    const ideal = {
      physical: physical.split(",").map((s) => s.trim()),
      character_traits: character.split(",").map((s) => s.trim()),
    };

    // Create the partner data (We will use this for the AI later)
    const fictitious = {
      name: "Alex",
      physical: ideal.physical,
      character_traits: ideal.character_traits,
      conflict_style: conflict,
    };

        const { error: dbError } = await supabase
      .from("partner_profiles")
      .upsert(
        {
          player_id: user.id,
          ideal_traits: ideal,
          fictitious_partner_data: fictitious,
        },
        { onConflict: "player_id" }
      );

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    // Mark in local storage that we finished setup
    localStorage.setItem("setup_complete", "true");
    
    // Go back to the game menu
    router.push("/game");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-black text-white">
      <form onSubmit={submit} className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-serif text-center mb-8">Describe your ideal partner</h1>

        <div>
          <label className="text-sm text-white/60">Physical traits (comma separated)</label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white focus:outline-none focus:border-white/30"
            placeholder="warm eyes, tall, soft smile"
            value={physical}
            onChange={(e) => setPhysical(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm text-white/60">Character traits (comma separated)</label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white focus:outline-none focus:border-white/30"
            placeholder="patient, funny, values family"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm text-white/60">How do they handle conflict?</label>
          <select
            value={conflict}
            onChange={(e) => setConflict(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white focus:outline-none focus:border-white/30 appearance-none"
          >
            <option className="bg-black" value="withdraws when stressed">Withdraws when stressed</option>
            <option className="bg-black" value="gets critical and loud">Gets critical and loud</option>
            <option className="bg-black" value="tries to fix everything immediately">Tries to fix everything immediately</option>
            <option className="bg-black" value="goes quiet and needs space">Goes quiet and needs space</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          disabled={loading || !physical || !character}
          className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-40"
        >
          {loading ? "Saving..." : "Meet them"}
        </button>
      </form>
    </main>
  );
}