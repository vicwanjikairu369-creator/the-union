import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { levelId, finalStability } = await req.json();

  // 1. Get current profile stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("character_strength, emotional_iq, total_levels_conquered")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // 2. Calculate rewards (based on how well you did)
  // E.g., 80% stability = +16 Character Strength, +16 Emotional IQ
  const strengthGained = Math.floor(finalStability / 5);
  const iqGained = Math.floor(finalStability / 10);

  // 3. Update the player's profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      character_strength: profile.character_strength + strengthGained,
      emotional_iq: profile.emotional_iq + iqGained,
      total_levels_conquered: profile.total_levels_conquered + 1,
    })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 4. Save the progress to the game_progress table
  await supabase.from("game_progress").upsert({
    player_id: user.id,
    level_id: levelId,
    emotional_stability: finalStability,
    is_completed: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: "player_id, level_id" });

  return NextResponse.json({ 
    success: true, 
    strengthGained, 
    iqGained,
    newTotalIQ: profile.emotional_iq + iqGained
  });
}