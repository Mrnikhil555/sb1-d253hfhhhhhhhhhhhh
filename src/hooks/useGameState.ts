import { useState, useCallback } from 'react';
import { GameType } from '../types';
import { useGameStore } from '../store/gameStore';
import { calculateScore, getDifficultyMultiplier } from '../utils/gameUtils';
import { showToast } from '../components/Toast';
import { playSoundEffect } from '../utils/soundUtils';

export const useGameState = (gameType: GameType) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { updateProgress, progress } = useGameStore();
  const currentProgress = progress[gameType];

  const addScore = useCallback((basePoints: number) => {
    const multiplier = getDifficultyMultiplier(currentProgress.currentLevel);
    const points = calculateScore(currentProgress.currentLevel, basePoints) * multiplier;
    
    updateProgress(gameType, {
      ...currentProgress,
      totalScore: currentProgress.totalScore + points
    });

    showToast(`+${points} points!`, 'success');
    playSoundEffect('score', '/sounds/score.mp3');
    
    return points;
  }, [gameType, currentProgress, updateProgress]);

  const advanceLevel = useCallback(() => {
    const newLevel = currentProgress.currentLevel + 1;
    updateProgress(gameType, {
      ...currentProgress,
      currentLevel: newLevel,
      highestLevel: Math.max(currentProgress.highestLevel, newLevel)
    });
    showToast(`Level ${newLevel} Unlocked!`, 'success');
    playSoundEffect('levelup', '/sounds/levelup.mp3');
  }, [gameType, currentProgress, updateProgress]);

  return {
    isPlaying,
    isPaused,
    setIsPlaying,
    setIsPaused,
    addScore,
    advanceLevel,
    currentLevel: currentProgress.currentLevel,
    highestLevel: currentProgress.highestLevel,
    totalScore: currentProgress.totalScore
  };
};