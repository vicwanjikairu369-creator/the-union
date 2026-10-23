import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: NextRequest) {
  try {
    const { frame } = await req.json();
    // Placeholder — connect to a real rPPG model on Replicate.
    // For now, return a plausible BPM based on randomness.
    const simulatedBpm = 65 + Math.floor(Math.random() * 40);
    return NextResponse.json({ bpm: simulatedBpm });
  } catch {
    return NextResponse.json({ bpm: 72 });
  }
}