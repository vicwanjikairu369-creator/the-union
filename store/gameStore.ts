import { create } from 'zustand';

interface GameState {
  stability: number;
  characterStrength: number;
  currentLevel: number;
  setStability: (v: number) => void;
  addStrength: (v: number) => void;
  setLevel: (v: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  stability: 100,
  characterStrength: 0,
  currentLevel: 1,
  setStability: (v) => set({ stability: v }),
  addStrength: (v) => set((s) => ({ characterStrength: s.characterStrength + v })),
  setLevel: (v) => set({ currentLevel: v }),
}));