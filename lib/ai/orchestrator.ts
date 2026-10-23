import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export interface SceneContext {
  playerId: string;
  levelId: number;
  partnerProfile: any;
  currentStability: number;
  supabase: any;
}

export async function recallMemories(playerId: string, query: string) {
  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: query,
    });
    const index = pinecone.index('union-memories');
    const results = await index.namespace(playerId).query({
      vector: embedding.data[0].embedding,
      topK: 8,
      includeMetadata: true,
    });
    return results.matches.map(m => m.metadata);
  } catch {
    return [];
  }
}

export async function getGhostCallbacks(supabase: any, playerId: string) {
  const { data } = await supabase
    .from('choice_history')
    .select('*')
    .eq('player_id', playerId)
    .eq('is_ghost', true)
    .order('stability_delta', { ascending: true })
    .limit(3);
  return data || [];
}

export async function getWeaknesses(supabase: any, playerId: string) {
  const { data } = await supabase
    .from('emotional_weaknesses')
    .select('weakness_tag, failure_count')
    .eq('player_id', playerId)
    .order('failure_count', { ascending: false });
  return data || [];
}

export async function generateScene(ctx: SceneContext) {
  const memories = await recallMemories(ctx.playerId, `Level ${ctx.levelId}`);
  const ghosts = await getGhostCallbacks(ctx.supabase, ctx.playerId);
  const weaknesses = await getWeaknesses(ctx.supabase, ctx.playerId);

  const systemPrompt = `
You are the Game Master for "THE UNION" — an emotionally immersive marriage simulation.

=== PLAYER'S PARTNER ===
Name: ${ctx.partnerProfile?.name ?? 'Alex'}
Character: ${JSON.stringify(ctx.partnerProfile?.character_traits ?? [])}
Conflict Style: ${ctx.partnerProfile?.conflict_style ?? 'withdraws when stressed'}

=== MEMORY ===
${memories.map((m: any) => `- ${m.text}`).join('\n') || '- (no memories yet)'}

=== GHOSTS ===
${ghosts.map((g: any) => `- Player once chose: "${g.choice_text}" (hurt the marriage)`).join('\n') || '- (none)'}

=== WEAKNESSES ===
${weaknesses.map((w: any) => `- ${w.weakness_tag} (failed ${w.failure_count}x)`).join('\n') || '- (none)'}

=== STATE ===
Level: ${ctx.levelId}
Emotional Stability: ${ctx.currentStability}%

Return ONLY valid JSON:
{
  "sceneDescription": string,
  "partnerDialogue": string,
  "choices": [
    { "text": string, "emotion_tag": string, "stability_delta": number, "why_it_matters": string }
  ],
  "ghostWhisper": string | null,
  "timerSeconds": number
}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate Level ${ctx.levelId} scene.` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.9,
  });

  return JSON.parse(completion.choices[0].message.content!);
}