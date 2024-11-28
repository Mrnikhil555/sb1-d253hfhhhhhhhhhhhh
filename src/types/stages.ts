export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'EXTREME';

export interface BaseStage {
  id: number;
  difficulty: Difficulty;
  timeLimit: number;
  points: number;
}

export interface QuizQuestion extends BaseStage {
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface MemoryStage extends BaseStage {
  gridSize: number;
  pairs: number;
}

export interface SimonStage extends BaseStage {
  sequenceLength: number;
  speed: number;
  colors: number;
}

export interface NumberStage extends BaseStage {
  minNumber: number;
  maxNumber: number;
  target: number;
  maxAttempts: number;
}

export interface AdventureStage extends BaseStage {
  gridSize: number;
  obstacles: number;
  powerUps: number;
  traps: number;
  enemies: number;
}