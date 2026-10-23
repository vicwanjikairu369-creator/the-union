"use client";
import { useRouter } from "next/navigation";

export default function AgeGate() {
  const router = useRouter();

  function accept() {
    document.cookie = "age_verified=true; path=/; max-age=31536000";
    router.push("/auth/signup");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-serif mb-6">Before you enter</h1>
        <p className="text-white/70 mb-8">
          This experience touches on adult relationships. Are you 18 or older?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={accept}
            className="bg-white !text-black px-6 py-3 rounded-full font-medium"
          >
            Yes, I am 18+
          </button>
          <a
            href="https://www.google.com"
            className="border border-white/30 px-6 py-3 rounded-full"
          >
            No, take me back
          </a>
        </div>
      </div>
    </main>
  );
}