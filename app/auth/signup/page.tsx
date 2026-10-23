"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  const supabase = createClient();
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Create the user and pass the profile data
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          gender: gender,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Bypass rate limit: If no session exists, sign in immediately
    if (data.user && !data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
    }

    // 3. Send them to the game
    router.push("/game");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-serif mb-6 text-center text-white">
          Create your account
        </h1>

        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
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
          placeholder="Password (min 6 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <div className="flex gap-3">
          {(["female", "male", "other"] as const).map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setGender(g)}
              style={gender === g ? { color: "#000", backgroundColor: "#fff" } : undefined}
              className={`flex-1 py-3 rounded-xl border font-medium ${
                gender === g ? "border-white" : "border-white/20 text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-xl font-medium disabled:opacity-40"
        >
          {loading ? "Creating account..." : "Begin"}
        </button>

        <p className="text-center text-white/50 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}