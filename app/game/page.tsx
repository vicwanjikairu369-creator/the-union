"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const LEVELS = [
  { id: 1, title: "Newlyweds", theme: "The Unwashed Dish", desc: "A small annoyance becomes a test of patience." },
  { id: 2, title: "In-Laws", theme: "The Unexpected Visit", desc: "Boundaries collide with family loyalty." },
  { id: 3, title: "Money", theme: "The Hidden Purchase", desc: "Trust vs. independence." },
  { id: 4, title: "Career", theme: "The Big Promotion", desc: "Ambition meets sacrifice." },
  { id: 5, title: "Parenthood", theme: "The Sleepless Nights", desc: "Two exhausted people, one crying baby." },
  { id: 6, title: "Routines", theme: "The Silent Dinner", desc: "When did you stop talking?" },
  { id: 7, title: "Jealousy", theme: "The Old Friend", desc: "A name from the past returns." },
  { id: 8, title: "Loss", theme: "The Empty Chair", desc: "Grief hits differently for each of you." },
  { id: 9, title: "Faith", theme: "The Sunday Question", desc: "Values that no longer align." },
  { id: 10, title: "Illness", theme: "The Diagnosis", desc: "For better or worse, in sickness." },
  { id: 11, title: "Betrayal", theme: "The Text Message", desc: "The line was crossed. Was it?" },
  { id: 12, title: "Renewal", theme: "The Vow Revisited", desc: "Ten years in. Do you still choose each other?" },
];

export default function Game() {
  const supabase = createClient();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      setUsername(data?.username ?? "Player");
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return <div className="p-8 text-white min-h-screen bg-black">Loading...</div>;

  return (
    <main className="min-h-screen p-8 md:p-16 bg-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-white">Welcome, {username}</h1>
          <p className="text-white/50 mt-2">Choose a level to begin your marriage simulation.</p>
        </div>
        <button
          onClick={logout}
          className="text-white/60 hover:text-white text-sm underline"
        >
          Log out
        </button>
      </div>

      {/* BUTTONS TO ACCESS SETUP PAGES */}
      <div className="flex flex-wrap gap-4 mb-12">
        <Link
          href="/interview"
          className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl text-white hover:bg-white/20 transition text-sm font-medium"
        >
          Redo Personality Interview
        </Link>
        <Link
          href="/ideal-partner"
          className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl text-white hover:bg-white/20 transition text-sm font-medium"
        >
          Update Ideal Partner
        </Link>
      </div>
              <Link
          href="/soulmate"
          className="bg-emerald-900/40 border border-emerald-500/30 px-6 py-3 rounded-xl text-emerald-300 hover:bg-emerald-900/60 transition text-sm font-medium"
        >
          Find Your Soulmate
        </Link>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
        {LEVELS.map((l) => (
          <Link
            key={l.id}
            href={`/game/${l.id}`}
            className="border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition group"
          >
            <div className="text-white/40 text-sm font-mono group-hover:text-white/60 transition">Level {l.id}</div>
            <div className="text-2xl font-serif mt-2 text-white">{l.title}</div>
            <div className="text-white/80 mt-1">{l.theme}</div>
            <div className="text-white/40 text-sm mt-4">{l.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}