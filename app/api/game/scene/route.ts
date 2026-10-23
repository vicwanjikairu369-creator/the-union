import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { levelId, stability, partnerData } = await req.json();

    // Map the level ID to the specific theme
    const levelThemes: Record<number, string> = {
      1: "Newlyweds - The Unwashed Dish (Small annoyance, testing patience)",
      2: "In-Laws - The Unexpected Visit (Boundaries and family loyalty)",
      3: "Money - The Hidden Purchase (Trust vs independence)",
      4: "Career - The Big Promotion (Ambition vs sacrifice)",
      5: "Parenthood - The Sleepless Nights (Exhaustion, crying baby)",
      8: "Loss - The Empty Chair (Grief and mourning)",
    };

    const theme = levelThemes[levelId] || "A tense marital conflict";

    const systemPrompt = `
You are the Game Master for "THE UNION" — an emotionally immersive marriage simulation.
The player is currently playing Level ${levelId}: ${theme}.

=== PLAYER'S PARTNER ===
Physical Traits: ${JSON.stringify(partnerData?.physical || ["warm eyes"])}
Character Traits: ${JSON.stringify(partnerData?.character_traits || ["patient"])}
Conflict Style: ${partnerData?.conflict_style || "withdraws when stressed"}

=== CURRENT STATE ===
Player's Emotional Stability: ${stability}%

=== YOUR TASK ===
Generate a highly emotional, realistic conflict scene based on the level theme and the partner's traits.
The partner should say something that triggers the conflict.
Then, provide exactly 4 choices for the player.
The choices MUST have different emotional tags (e.g., Empathetic, Defensive, Humorous, Vulnerable, Stonewalling).
One choice should be healthy (increases stability by 10-20), one should be toxic (decreases by 15-25), and two should be mixed.

Return ONLY a JSON object with this exact structure:
{
  "partnerDialogue": "What the partner says",
  "choices": [
    { "text": "What the player says", "emotion_tag": "Empathetic", "stability_delta": 15 },
    { "text": "What the player says", "emotion_tag": "Defensive", "stability_delta": -15 },
    { "text": "What the player says", "emotion_tag": "Vulnerable", "stability_delta": 10 },
    { "text": "What the player says", "emotion_tag": "Stonewalling", "stability_delta": -20 }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cheap
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const sceneData = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(sceneData);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate scene" }, { status: 500 });
  }
}