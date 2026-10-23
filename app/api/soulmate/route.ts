import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Get the current player
  const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  // Require at least 1 level conquered to match (for testing)
  if (!me || me.total_levels_conquered < 1) {
    return NextResponse.json({ error: "You must conquer at least 1 level first." }, { status: 400 });
  }

  // 2. Determine opposite gender
  const opposite = me.gender === "male" ? "female" : "male";

  // 3. Find candidates in the database who have also completed levels
  const { data: candidates } = await supabase
    .from("profiles")
    .select("*")
    .eq("gender", opposite)
    .gt("total_levels_conquered", 0)
    .neq("id", user.id); // Don't match with yourself

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ match: null, message: "No other players found yet. Be the first to finish!" });
  }

  // 4. Find the player with the closest Emotional IQ
  const sorted = candidates
    .map(c => ({ ...c, diff: Math.abs(c.emotional_iq - me.emotional_iq) }))
    .sort((a, b) => a.diff - b.diff);

  const match = sorted[0];

  // 5. Save the match
  await supabase.from("soulmate_matches").insert({
    player_id: user.id,
    matched_player_id: match.id,
    eiq_difference: match.diff,
    match_score: 100 - match.diff,
  });

  return NextResponse.json({ match, score: 100 - match.diff });
}