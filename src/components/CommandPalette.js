import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTerminal,
  FiFileText,
  FiCode,
  FiLayers,
  FiMail,
  FiExternalLink,
  FiVolume2,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { sound } from '../utils/audio';
import resumePdf from '../assets/resume.pdf';
import './CommandPalette.css';

const COMMANDS = [
  { id: 'projects', title: 'Jump to Projects', category: 'Navigation', icon: FiCode, shortcut: 'P' },
  { id: 'skills', title: 'Explore Core Skills & Tech', category: 'Navigation', icon: FiLayers, shortcut: 'S' },
  { id: 'about', title: 'About Mahi Agarwal', category: 'Navigation', icon: FiTerminal, shortcut: 'A' },
  { id: 'contact', title: 'Send a Message / Contact', category: 'Navigation', icon: FiMail, shortcut: 'C' },
  { id: 'off-track', title: 'Case Study: Off-Track (Desktop Music Player)', category: 'Case Studies', icon: FiZap, slug: '/projects/off-track' },
  { id: 'cartel', title: 'Case Study: Cartel (Real-Time Grocery App)', category: 'Case Studies', icon: FiZap, slug: '/projects/cartel' },
  { id: 'resume', title: 'Download / View Resume (PDF)', category: 'Documents', icon: FiFileText, action: 'resume' },
  { id: 'github', title: 'Open GitHub Profile (@Maaahive)', category: 'External', icon: FiExternalLink, action: 'github' },
  { id: 'matrix', title: 'Matrix Mode (Toggle Cyber Green Rain)', category: 'Easter Eggs', icon: FiTerminal, action: 'matrix' },
  { id: 'sound', title: 'Toggle Audio FX (Sound Engine)', category: 'Settings', icon: FiVolume2, action: 'sound' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [easterEggMessage, setEasterEggMessage] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for Ctrl+K, Cmd+K, Escape, or custom event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) sound.playClick();
          return !prev;
        });
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setEasterEggMessage(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.id.includes(q) ||
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const executeCommand = (cmd) => {
    sound.playSuccess();
    setIsOpen(false);

    if (cmd.slug) {
      navigate(cmd.slug);
      return;
    }

    if (cmd.action === 'resume') {
      window.open(resumePdf, '_blank');
      return;
    }

    if (cmd.action === 'github') {
      window.open('https://github.com/Maaahive', '_blank');
      return;
    }

    if (cmd.action === 'matrix') {
      if (window.toggleMatrixMode) {
        window.toggleMatrixMode();
      }
      return;
    }

    if (cmd.action === 'sound') {
      sound.toggle();
      return;
    }

    // Scroll to section on home page
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(cmd.id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(cmd.id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputKeyDown = (e) => {
    sound.playHover();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const q = query.toLowerCase().trim();

      // Check special terminal easter eggs
      if (q === 'sudo') {
        sound.playGlitch();
        setEasterEggMessage('bash: sudo: permission denied: only Mahi has root access 🔒');
        return;
      }
      if (q === 'matrix') {
        sound.playGlitch();
        if (window.toggleMatrixMode) window.toggleMatrixMode();
        setIsOpen(false);
        return;
      }
      if (q === 'clear') {
        setQuery('');
        setEasterEggMessage(null);
        return;
      }

      if (filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="cmd-modal"
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal bar header */}
            <div className="cmd-header-bar">
              <div className="cmd-dots">
                <span className="dot dot-r" />
                <span className="dot dot-y" />
                <span className="dot dot-g" />
              </div>
              <span className="cmd-header-title">mahi@portfolio:~ terminal</span>
              <button className="cmd-close-btn" onClick={() => setIsOpen(false)}>
                <FiX size={14} />
              </button>
            </div>

            {/* Input bar */}
            <div className="cmd-input-wrap">
              <span className="cmd-prompt-prefix">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                className="cmd-input"
                placeholder="Type a command (e.g. projects, resume, matrix, sudo)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                  setEasterEggMessage(null);
                }}
                onKeyDown={handleInputKeyDown}
              />
              <span className="cmd-shortcut-badge">ESC to close</span>
            </div>

            {/* Easter egg terminal response */}
            {easterEggMessage && (
              <div className="cmd-easter-egg">
                {easterEggMessage}
              </div>
            )}

            {/* Command List */}
            <div className="cmd-list">
              {filtered.length === 0 ? (
                <div className="cmd-empty">
                  No matching command found. Try typing <code>projects</code>, <code>matrix</code>, or <code>resume</code>.
                </div>
              ) : (
                filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      className={`cmd-item ${isSelected ? 'selected' : ''}`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => executeCommand(cmd)}
                    >
                      <div className="cmd-item-left">
                        <span className="cmd-item-icon">
                          <Icon size={14} />
                        </span>
                        <div className="cmd-item-text">
                          <span className="cmd-item-title">{cmd.title}</span>
                          <span className="cmd-item-category">{cmd.category}</span>
                        </div>
                      </div>
                      {cmd.shortcut && (
                        <span className="cmd-item-shortcut">{cmd.shortcut}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer tips */}
            <div className="cmd-footer">
              <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
              <span><kbd>↵</kbd> to execute</span>
              <span>Protip: type <code>matrix</code> or <code>sudo</code></span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
