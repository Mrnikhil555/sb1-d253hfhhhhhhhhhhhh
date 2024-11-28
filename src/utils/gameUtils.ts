import { GameType } from '../types';

export const getGameTitle = (gameType: GameType): string => {
  switch (gameType) {
    case 'wordguess':
      return 'Word Guess';
    case 'numberguess':
      return 'Number Guess';
    case 'memory':
      return 'Memory Match';
    case 'simon':
      return 'Simon Says';
    case 'quiz':
      return 'Voice Quiz';
    case 'adventure':
      return 'Voice Adventure';
    default:
      return 'Game';
  }
};

export const calculateScore = (level: number, basePoints: number): number => {
  return basePoints * Math.max(1, Math.floor(level / 10));
};

export const getDifficultyMultiplier = (level: number): number => {
  if (level <= 5000) return 1;
  if (level <= 10000) return 1.5;
  if (level <= 15000) return 2;
  return 2.5;
};