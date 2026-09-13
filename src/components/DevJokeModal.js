import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiRefreshCw, FiCopy, FiCheck, FiSmile } from 'react-icons/fi';
import { sound } from '../utils/audio';
import './DevJokeModal.css';

const DEV_JOKES = [
  {
    category: 'DEBUGGING',
    setup: 'Debugging is like being the detective in a crime movie...',
    punchline: '...where you are also the murderer.',
    color: '#ff5370',
  },
  {
    category: 'LIGHT THEME',
    setup: 'Why do programmers always prefer dark mode?',
    punchline: 'Because light attracts bugs. 🐛',
    color: '#00ff88',
  },
  {
    category: 'BINARY',
    setup: 'There are 10 types of people in the world:',
    punchline: 'Those who understand binary, and those who do not.',
    color: '#00e5ff',
  },
  {
    category: 'SQL',
    setup: 'A SQL query walks into a bar, walks up to two tables and asks:',
    punchline: '“Can I join you?”',
    color: '#c084fc',
  },
  {
    category: 'OBJECT ORIENTED',
    setup: 'Why do Java programmers wear glasses?',
    punchline: 'Because they cannot C#.',
    color: '#ffbd2e',
  },
  {
    category: 'HARDWARE',
    setup: 'How many programmers does it take to change a lightbulb?',
    punchline: 'None. That is a hardware problem.',
    color: '#00e5ff',
  },
  {
    category: 'BOOLEAN',
    setup: '!false',
    punchline: 'It is funny because it is true.',
    color: '#00ff88',
  },
  {
    category: 'NODE.JS',
    setup: 'Why was the JavaScript developer sad?',
    punchline: 'Because they did not Node how to Express themselves.',
    color: '#c084fc',
  },
  {
    category: 'GIT',
    setup: 'In case of fire:',
    punchline: '1. git add .  2. git commit -m "fire"  3. git push origin HEAD --force  4. exit building.',
    color: '#ff5370',
  },
  {
    category: 'PROD DEPLOY',
    setup: 'A QA engineer walks into a bar.',
    punchline: 'Orders a beer. Orders 0 beers. Orders 999999999 beers. Orders a lizard. Orders -1 beers. Orders a sfdeljknesv. First real customer walks in and asks where the restroom is. The bar bursts into flames.',
    color: '#ffbd2e',
  },
  {
    category: 'ARCHITECTURE',
    setup: 'A user interface is like a joke.',
    punchline: 'If you have to explain it, it is not that good.',
    color: '#00ff88',
  },
  {
    category: 'RECURSION',
    setup: 'In order to understand recursion...',
    punchline: '...you must first understand recursion.',
    color: '#00e5ff',
  },
  {
    category: 'ESTIMATES',
    setup: 'The 90-90 rule of software engineering:',
    punchline: 'The first 90% of the code accounts for the first 90% of the development time. The remaining 10% of the code accounts for the other 90% of the development time.',
    color: '#c084fc',
  },
  {
    category: 'FULL-STACK',
    setup: 'Why did the frontend developer break up with the backend developer?',
    punchline: 'There were too many unresolved promises and zero commitment.',
    color: '#ff5370',
  },
  {
    category: 'PYTHON',
    setup: 'Why does Python not have switch-case for so long?',
    punchline: 'Because Guido van Rossum decided we should all just make good choices with "if".',
    color: '#ffbd2e',
  },
  {
    category: 'CAFFEINE',
    setup: 'What is a programmer?',
    punchline: 'An organism that turns caffeine into clean code and inexplicable stack traces.',
    color: '#00ff88',
  },
];

export default function DevJokeModal({ onClose }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * DEV_JOKES.length));
  const [copied, setCopied] = useState(false);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.key === 'Enter') nextJoke();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const currentJoke = DEV_JOKES[index];

  const nextJoke = () => {
    sound.playClick();
    setCopied(false);
    setIndex((prev) => (prev + 1) % DEV_JOKES.length);
  };

  const copyJoke = () => {
    sound.playSuccess();
    const text = currentJoke.setup + '\n' + currentJoke.punchline;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="joke-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="joke-modal-card"
        initial={{ scale: 0.94, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 15, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="joke-header">
          <div className="joke-header-left">
            <FiSmile size={16} color="#c084fc" />
            <span>DEV HUMOR // BYTE-SIZED JOKES</span>
          </div>
          <button className="joke-close-btn" onClick={onClose} title="Close (Esc)">
            <FiX size={15} />
          </button>
        </div>

        {/* Joke Content */}
        <div className="joke-body">
          <div className="joke-category-tag" style={{ color: currentJoke.color, borderColor: currentJoke.color + '40' }}>
            [{currentJoke.category}]
          </div>

          <div className="joke-setup">{currentJoke.setup}</div>
          <div className="joke-punchline">{currentJoke.punchline}</div>
        </div>

        {/* Action Controls */}
        <div className="joke-footer">
          <button className="joke-action-btn secondary" onClick={copyJoke}>
            {copied ? <FiCheck size={14} color="#00ff88" /> : <FiCopy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Joke'}</span>
          </button>

          <button className="joke-action-btn primary" onClick={nextJoke}>
            <FiRefreshCw size={14} />
            <span>Next Joke (Space)</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
