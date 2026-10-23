export const EMOTIONS = {
  EMPATHETIC: { tag: 'empathetic', color: '#FFB6C1', healthy: true },
  ASSERTIVE: { tag: 'assertive', color: '#87CEEB', healthy: true },
  DEFENSIVE: { tag: 'defensive', color: '#FFA500', healthy: false },
  HUMOROUS: { tag: 'humorous', color: '#98FB98', healthy: true },
  CONTEMPTUOUS: { tag: 'contemptuous', color: '#FF4500', healthy: false },
  STONEWALLING: { tag: 'stonewall', color: '#4B0082', healthy: false },
  APOLOGETIC: { tag: 'apologetic', color: '#DDA0DD', healthy: true },
  VULNERABLE: { tag: 'vulnerable', color: '#F0E68C', healthy: true },
} as const;

export type EmotionTag = keyof typeof EMOTIONS;

export function isHealthy(tag: string): boolean {
  return Object.values(EMOTIONS).find(e => e.tag === tag)?.healthy ?? false;
}