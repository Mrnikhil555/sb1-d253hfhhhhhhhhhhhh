import React from 'react';
import { motion } from 'framer-motion';

interface WordRevealProps {
  word: string;
  timeLeft: number;
}

const WordReveal: React.FC<WordRevealProps> = ({ word, timeLeft }) => {
  return (
    <motion.div 
      className="text-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
    >
      <motion.div 
        className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        {word}
      </motion.div>
      
      <motion.div 
        className="text-2xl text-white/80"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        Memorize the word!
      </motion.div>
      
      <motion.div 
        className="text-4xl font-bold mt-4"
        key={timeLeft}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {timeLeft}s
      </motion.div>
    </motion.div>
  );
};

export default WordReveal;