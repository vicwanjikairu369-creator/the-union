import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function counselSession(transcript: any[], levelId: number) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: `You are a warm, wise marriage counselor.
Analyze this level transcript. Be honest but kind.
Focus on patterns, not single moments.
Return ONLY valid JSON with: { "verdict": string, "keyInsight": string, "growthArea": string, "encouragement": string }`,
    messages: [
      {
        role: 'user',
        content: `Level ${levelId} transcript:\n${JSON.stringify(transcript, null, 2)}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}