"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push("/game");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-serif mb-6 text-center">Welcome back</h1>

        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-white !text-black py-3 rounded-xl font-medium disabled:opacity-40"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-white/50 text-sm">
          New here?{" "}
          <Link href="/age-gate" className="underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}