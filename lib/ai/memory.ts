import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function rememberMoment(
  playerId: string,
  moment: string,
  emotionalWeight: number,
  memoryType: string
) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: moment,
  });

  const index = pinecone.index('union-memories');
  const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  await index.namespace(playerId).upsert([
    {
      id,
      values: embedding.data[0].embedding,
      metadata: { text: moment, weight: emotionalWeight, type: memoryType },
    },
  ]);

  return id;
}