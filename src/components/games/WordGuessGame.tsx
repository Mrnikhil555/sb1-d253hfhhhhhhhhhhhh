import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../Header';
import CommandList from '../CommandList';
import LevelProgress from '../LevelProgress';
import WordReveal from './WordReveal';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useGameState } from '../../hooks/useGameState';
import { useSound } from '../../hooks/useSound';
import { showToast } from '../Toast';
import { useGameStore } from '../../store/gameStore';
import { getDifficultyFromLevel, getDifficultyBadgeClass } from '../../utils/difficultyUtils';

interface WordGuessGameProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const COMMANDS = [
  { command: "guess [letter]", description: "Guess a letter" },
  { command: "solve [word]", description: "Try to solve the word" },
  { command: "new game", description: "Start a new game" }
];

const WordGuessGame: React.FC<WordGuessGameProps> = ({ isMuted, onToggleMute, onBack }) => {
  const { playSound } = useSound(isMuted);
  const gameState = useGameState('wordguess');
  const words = useGameStore(state => state.words);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [showWord, setShowWord] = useState(true);
  const [wordRevealTime, setWordRevealTime] = useState(3);
  const [currentWord, setCurrentWord] = useState('');

  const initGame = useCallback(() => {
    const word = words[gameState.currentLevel - 1].word;
    setCurrentWord(word);
    setGuessedLetters([]);
    setRemainingAttempts(6);
    setShowWord(true);
    setWordRevealTime(3);
  }, [gameState.currentLevel, words]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showWord && wordRevealTime > 0) {
      timer = setInterval(() => {
        setWordRevealTime(prev => prev - 1);
      }, 1000);
    } else if (wordRevealTime === 0) {
      setShowWord(false);
    }
    return () => clearInterval(timer);
  }, [showWord, wordRevealTime]);

  const handleGuess = useCallback((letter: string) => {
    if (showWord) return;
    
    if (guessedLetters.includes(letter)) {
      showToast('Letter already guessed!', 'error');
      return;
    }

    setGuessedLetters(prev => [...prev, letter]);
    
    if (currentWord.includes(letter)) {
      const occurrences = currentWord.split('').filter(l => l === letter).length;
      gameState.addScore(10 * occurrences);
      playSound('correct', '/sounds/correct.mp3');
    } else {
      setRemainingAttempts(prev => prev - 1);
      playSound('wrong', '/sounds/wrong.mp3');
      showToast('Incorrect guess!', 'error');
    }
  }, [showWord, guessedLetters, currentWord, gameState, playSound]);

  const handleSolve = useCallback((attempt: string) => {
    if (showWord) return;
    
    if (attempt.toUpperCase() === currentWord) {
      setGuessedLetters([...new Set(currentWord.split(''))]);
      gameState.addScore(100);
      gameState.advanceLevel();
      playSound('win', '/sounds/win.mp3');
      setTimeout(initGame, 1500);
    } else {
      setRemainingAttempts(prev => prev - 1);
      playSound('wrong', '/sounds/wrong.mp3');
      showToast('Incorrect solution!', 'error');
    }
  }, [showWord, currentWord, gameState, playSound, initGame]);

  const handleCommand = useCallback((command: string) => {
    const guessMatch = command.match(/guess (\w)/i);
    const solveMatch = command.match(/solve (\w+)/i);
    
    if (guessMatch) {
      handleGuess(guessMatch[1].toUpperCase());
    } else if (solveMatch) {
      handleSolve(solveMatch[1].toUpperCase());
    } else if (command.toLowerCase().includes('new game')) {
      initGame();
    }
  }, [handleGuess, handleSolve, initGame]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onCommand: handleCommand,
    onError: (error) => showToast(error, 'error'),
    onStart: () => showToast('Voice recognition started', 'success'),
    onStop: () => showToast('Voice recognition stopped', 'success')
  });

  const maskedWord = currentWord
    .split('')
    .map(letter => guessedLetters.includes(letter) ? letter : '_')
    .join(' ');

  const isGameOver = remainingAttempts === 0;
  const isWon = currentWord.split('').every(letter => guessedLetters.includes(letter));
  const difficulty = getDifficultyFromLevel(gameState.currentLevel);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onToggleListening={isListening ? stopListening : startListening}
          onBack={onBack}
          title="Word Guess"
        />

        <LevelProgress
          gameType="wordguess"
          currentLevel={gameState.currentLevel}
          highestLevel={gameState.highestLevel}
          totalScore={gameState.totalScore}
        />

        <CommandList commands={COMMANDS} />

        <motion.div 
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <span className={getDifficultyBadgeClass(difficulty)}>
              {difficulty}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {showWord ? (
              <WordReveal word={currentWord} timeLeft={wordRevealTime} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="text-4xl font-mono mb-4">{maskedWord}</div>
                  <div className="text-xl">Attempts remaining: {remainingAttempts}</div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={guessedLetters.includes(letter) || isGameOver || isWon}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        guessedLetters.includes(letter)
                          ? currentWord.includes(letter)
                            ? 'bg-green-500'
                            : 'bg-red-500/50'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>

                {(isGameOver || isWon) && (
                  <motion.div 
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-2xl mb-4">
                      {isWon ? 'Congratulations!' : 'Game Over!'}
                    </div>
                    <div className="mb-4">The word was: {currentWord}</div>
                    <button
                      onClick={initGame}
                      className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      New Game
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default WordGuessGame;