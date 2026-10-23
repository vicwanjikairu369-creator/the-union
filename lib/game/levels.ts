export interface Level {
  id: number;
  title: string;
  theme: string;
  description: string;
  baseDifficulty: number; // 1–10
}

export const LEVELS: Level[] = [
  { id: 1, title: 'Newlyweds', theme: 'The Unwashed Dish', description: 'A small annoyance becomes a test of patience.', baseDifficulty: 2 },
  { id: 2, title: 'In-Laws', theme: 'The Unexpected Visit', description: 'Boundaries collide with family loyalty.', baseDifficulty: 3 },
  { id: 3, title: 'Money', theme: 'The Hidden Purchase', description: 'Trust vs. independence.', baseDifficulty: 4 },
  { id: 4, title: 'Career', theme: 'The Big Promotion', description: 'Ambition meets sacrifice.', baseDifficulty: 5 },
  { id: 5, title: 'Parenthood', theme: 'The Sleepless Nights', description: 'Two exhausted people, one crying baby.', baseDifficulty: 6 },
  { id: 6, title: 'Routines', theme: 'The Silent Dinner', description: 'When did you stop talking?', baseDifficulty: 6 },
  { id: 7, title: 'Jealousy', theme: 'The Old Friend', description: 'A name from the past returns.', baseDifficulty: 7 },
  { id: 8, title: 'Loss', theme: 'The Empty Chair', description: 'Grief hits differently for each of you.', baseDifficulty: 8 },
  { id: 9, title: 'Faith', theme: 'The Sunday Question', description: 'Values that no longer align.', baseDifficulty: 8 },
  { id: 10, title: 'Illness', theme: 'The Diagnosis', description: 'For better or worse, in sickness.', baseDifficulty: 9 },
  { id: 11, title: 'Betrayal', theme: 'The Text Message', description: 'The line was crossed. Was it?', baseDifficulty: 9 },
  { id: 12, title: 'Renewal', theme: 'The Vow Revisited', description: 'Ten years in. Do you still choose each other?', baseDifficulty: 10 },
];