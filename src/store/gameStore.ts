import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { GameProgress, GameType, Difficulty } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storageUtils';
import {
  generateQuizStages,
  generateMemoryStages,
  generateSimonStages,
  generateNumberStages,
  generateAdventureStages
} from '../data/stageGenerators';

interface GameStore {
  progress: Record<GameType, GameProgress>;
  currentStageIndex: Record<GameType, number>;
  updateProgress: (gameType: GameType, progress: GameProgress) => void;
  resetProgress: (gameType: GameType) => void;
  getStageForGame: (gameType: GameType) => any;
}

const initialProgress: GameProgress = {
  currentLevel: 1,
  highestLevel: 1,
  totalScore: 0
};

// Custom storage implementation to handle chunks
const createChunkedStorage = () => {
  const CHUNK_SIZE = 50; // Store stages in smaller chunks
  
  return {
    getItem: async (key: string) => {
      const value = loadFromStorage(key, null);
      return value ? JSON.parse(value) : null;
    },
    setItem: async (key: string, value: string) => {
      const data = JSON.parse(value);
      saveToStorage(key, JSON.stringify({
        ...data,
        // Only store the current chunk of stages
        stages: data.stages?.slice(
          Math.floor(data.currentStageIndex / CHUNK_SIZE) * CHUNK_SIZE,
          (Math.floor(data.currentStageIndex / CHUNK_SIZE) + 1) * CHUNK_SIZE
        )
      }));
    },
    removeItem: async (key: string) => {
      localStorage.removeItem(key);
    }
  };
};

// Generate stages lazily
const stageGenerators = {
  quiz: generateQuizStages,
  memory: generateMemoryStages,
  simon: generateSimonStages,
  numberguess: generateNumberStages,
  adventure: generateAdventureStages,
  wordguess: () => generateWordStages() // Implement this based on your word list
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      progress: {
        quiz: { ...initialProgress },
        wordguess: { ...initialProgress },
        numberguess: { ...initialProgress },
        memory: { ...initialProgress },
        simon: { ...initialProgress },
        adventure: { ...initialProgress }
      },
      currentStageIndex: {
        quiz: 0,
        wordguess: 0,
        numberguess: 0,
        memory: 0,
        simon: 0,
        adventure: 0
      },
      updateProgress: (gameType, progress) => set(
        produce((state) => {
          state.progress[gameType] = progress;
          state.currentStageIndex[gameType] = progress.currentLevel - 1;
        })
      ),
      resetProgress: (gameType) => set(
        produce((state) => {
          state.progress[gameType] = { ...initialProgress };
          state.currentStageIndex[gameType] = 0;
        })
      ),
      getStageForGame: (gameType) => {
        const state = get();
        const index = state.currentStageIndex[gameType];
        const generator = stageGenerators[gameType];
        
        // Generate stages only when needed
        if (generator) {
          const stages = generator();
          return stages[index];
        }
        return null;
      }
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => createChunkedStorage()),
      partialize: (state) => ({
        progress: state.progress,
        currentStageIndex: state.currentStageIndex
      })
    }
  )
);

export const getDifficultyLabel = (level: number): Difficulty => {
  if (level <= 5000) return 'EASY';
  if (level <= 10000) return 'NORMAL';
  if (level <= 15000) return 'HARD';
  return 'EXTREME';
};

// Helper function to generate word stages
const generateWordStages = () => {
  const words = [
    'APPLE', 'BANANA', 'CHERRY', 'DOLPHIN', 'ELEPHANT',
    'FOREST', 'GUITAR', 'HAMMER', 'ISLAND', 'JACKET',
    // Add more words as needed
  ];

  return Array.from({ length: 20000 }, (_, index) => ({
    id: index + 1,
    word: words[index % words.length],
    difficulty: getDifficultyLabel(index + 1),
    timeLimit: Math.max(15, 30 - Math.floor(index / 1000)),
    points: 100 * (Math.floor(index / 5000) + 1)
  }));
};