import { QuizQuestion, WordStage, NumberStage, MemoryStage, SimonStage, AdventureStage } from '../types';

// Difficulty configurations
const DIFFICULTY_CONFIGS = {
  EASY: { level: 1, multiplier: 1, maxTime: 60, minTime: 30 },
  NORMAL: { level: 2, multiplier: 1.5, maxTime: 45, minTime: 25 },
  HARD: { level: 3, multiplier: 2, maxTime: 30, minTime: 20 },
  EXTREME: { level: 4, multiplier: 2.5, maxTime: 20, minTime: 15 }
};

// Quiz categories and questions
const QUIZ_CATEGORIES = [
  'Science', 'History', 'Geography', 'Technology', 'Arts',
  'Literature', 'Sports', 'Music', 'Movies', 'Nature'
];

export const generateQuizStages = (): QuizQuestion[] => {
  return Array.from({ length: 20000 }, (_, index) => {
    const difficulty = index < 5000 ? 'EASY' : 
                      index < 10000 ? 'NORMAL' :
                      index < 15000 ? 'HARD' : 'EXTREME';
    const config = DIFFICULTY_CONFIGS[difficulty];
    const category = QUIZ_CATEGORIES[index % QUIZ_CATEGORIES.length];
    
    return {
      id: index + 1,
      category,
      difficulty,
      timeLimit: Math.max(config.minTime, config.maxTime - Math.floor(index / 1000)),
      question: `${category} Question #${index + 1}`,
      options: [
        `Option A for Q${index + 1}`,
        `Option B for Q${index + 1}`,
        `Option C for Q${index + 1}`,
        `Option D for Q${index + 1}`
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      points: 100 * config.multiplier
    };
  });
};

// Memory Match stages
export const generateMemoryStages = (): MemoryStage[] => {
  return Array.from({ length: 20000 }, (_, index) => {
    const difficulty = index < 5000 ? 'EASY' : 
                      index < 10000 ? 'NORMAL' :
                      index < 15000 ? 'HARD' : 'EXTREME';
    const config = DIFFICULTY_CONFIGS[difficulty];
    
    return {
      id: index + 1,
      difficulty,
      gridSize: Math.min(8, 4 + Math.floor(index / 2000)),
      pairs: Math.min(16, 4 + Math.floor(index / 1000)),
      timeLimit: Math.max(config.minTime, config.maxTime - Math.floor(index / 1000)),
      points: 100 * config.multiplier
    };
  });
};

// Simon Says stages
export const generateSimonStages = (): SimonStage[] => {
  return Array.from({ length: 20000 }, (_, index) => {
    const difficulty = index < 5000 ? 'EASY' : 
                      index < 10000 ? 'NORMAL' :
                      index < 15000 ? 'HARD' : 'EXTREME';
    const config = DIFFICULTY_CONFIGS[difficulty];
    
    return {
      id: index + 1,
      difficulty,
      sequenceLength: Math.min(20, 3 + Math.floor(index / 1000)),
      speed: Math.max(200, 1000 - (Math.floor(index / 500) * 50)),
      colors: Math.min(8, 4 + Math.floor(index / 4000)),
      timeLimit: Math.max(config.minTime, config.maxTime - Math.floor(index / 1000)),
      points: 100 * config.multiplier
    };
  });
};

// Number Guess stages
export const generateNumberStages = (): NumberStage[] => {
  return Array.from({ length: 20000 }, (_, index) => {
    const difficulty = index < 5000 ? 'EASY' : 
                      index < 10000 ? 'NORMAL' :
                      index < 15000 ? 'HARD' : 'EXTREME';
    const config = DIFFICULTY_CONFIGS[difficulty];
    const range = Math.pow(10, 1 + Math.floor(index / 5000));
    
    return {
      id: index + 1,
      difficulty,
      minNumber: 1,
      maxNumber: range,
      target: Math.floor(Math.random() * range) + 1,
      maxAttempts: Math.max(5, 15 - Math.floor(index / 2000)),
      timeLimit: Math.max(config.minTime, config.maxTime - Math.floor(index / 1000)),
      points: 100 * config.multiplier
    };
  });
};

// Adventure stages
export const generateAdventureStages = (): AdventureStage[] => {
  return Array.from({ length: 20000 }, (_, index) => {
    const difficulty = index < 5000 ? 'EASY' : 
                      index < 10000 ? 'NORMAL' :
                      index < 15000 ? 'HARD' : 'EXTREME';
    const config = DIFFICULTY_CONFIGS[difficulty];
    
    return {
      id: index + 1,
      difficulty,
      gridSize: Math.min(20, 8 + Math.floor(index / 1000)),
      obstacles: Math.min(40, 5 + Math.floor(index / 500)),
      powerUps: Math.max(1, 5 - Math.floor(index / 4000)),
      timeLimit: Math.max(config.minTime, config.maxTime - Math.floor(index / 1000)),
      points: 100 * config.multiplier,
      traps: Math.min(10, Math.floor(index / 2000)),
      enemies: Math.min(5, Math.floor(index / 4000))
    };
  });
};