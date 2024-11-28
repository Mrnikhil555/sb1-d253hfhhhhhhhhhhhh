import { Difficulty } from '../types/stages';

export const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'EASY':
      return 'text-green-400';
    case 'NORMAL':
      return 'text-blue-400';
    case 'HARD':
      return 'text-orange-400';
    case 'EXTREME':
      return 'text-red-400';
  }
};

export const getDifficultyBadgeClass = (difficulty: Difficulty): string => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
  switch (difficulty) {
    case 'EASY':
      return `${baseClasses} bg-green-500/20 text-green-400`;
    case 'NORMAL':
      return `${baseClasses} bg-blue-500/20 text-blue-400`;
    case 'HARD':
      return `${baseClasses} bg-orange-500/20 text-orange-400`;
    case 'EXTREME':
      return `${baseClasses} bg-red-500/20 text-red-400`;
  }
};

export const getDifficultyFromLevel = (level: number): Difficulty => {
  if (level <= 5000) return 'EASY';
  if (level <= 10000) return 'NORMAL';
  if (level <= 15000) return 'HARD';
  return 'EXTREME';
};

export const getTimeBonus = (timeLeft: number, difficulty: Difficulty): number => {
  const multiplier = difficulty === 'EASY' ? 1 :
                    difficulty === 'NORMAL' ? 1.5 :
                    difficulty === 'HARD' ? 2 : 2.5;
  return Math.floor(timeLeft * multiplier);
};