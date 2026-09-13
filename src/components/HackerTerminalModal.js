import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiTerminal, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { sound } from '../utils/audio';
import './HackerTerminalModal.css';

const INITIAL_LOGS = [
  { text: '[SYSTEM] Initializing quantum shell handshake...', type: 'info' },
  { text: '[SECURITY] Probing target: mahiagarwal.com (IPv4: 104.21.68.102)', type: 'info' },
  { text: '[PORT_SCAN] Open services discovered:', type: 'system' },
  { text: '  PORT 80    [HTTP]      REDIRECT 301 (FORCE HTTPS)', type: 'meta' },
  { text: '  PORT 443   [HTTPS]     TLS 1.3 ENCRYPTED (AES-256-GCM)', type: 'meta' },
  { text: '  PORT 8080  [REACT]     VIRTUAL DOM ENGINE ACTIVE', type: 'meta' },
  { text: '  PORT 9000  [AUDIO]     CHILLHOP INSTRUMENTAL RADIO ONLINE', type: 'meta' },
  { text: '[FIREWALL] Circumventing client CORS perimeter... [BYPASS OK]', type: 'success' },
  { text: '[PAYLOAD] Injecting caffeine.pkg into Mahi neural stack... [SUCCESS]', type: 'success' },
  { text: '[DECRYPT] React, Python, C++, Node.js, Electron, ML Pipelines unlocked.', type: 'info' },
  { text: '------------------------------------------------------------', type: 'divider' },
  { text: '⚡ ACCESS LEVEL 5 GRANTED. Welcome Operator to Mahi Core Shell.', type: 'success' },
  { text: 'Type "help" to inspect available terminal commands, or "exit" to close.', type: 'system' },
];

export default function HackerTerminalModal({
  onClose,
  onTriggerMatrix,
  onTriggerSpecs,
  onTriggerGame,
  onTriggerJoke,
}) {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Play entry chime on open
  useEffect(() => {
    sound.playClick();
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Internal terminal container auto-scroll (NEVER touches window.scroll)
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [logs]);

  // Esc to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCommand = (cmdStr) => {
    const cmd = cmdStr.trim().toLowerCase();
    sound.playClick();

    const newLogs = [...logs, { text: `operator@mahi-shell:~$ ${cmdStr}`, type: 'prompt' }];

    if (cmd === 'help') {
      newLogs.push(
        { text: 'AVAILABLE COMMANDS:', type: 'system' },
        { text: '  help       - Display this command index', type: 'meta' },
        { text: '  game       - Launch retro arcade mini-game (Bug Blaster 👾)', type: 'meta' },
        { text: '  joke       - Print random programmer joke / roast 🎲', type: 'meta' },
        { text: '  skills     - Query Mahi\'s technical architecture & stack', type: 'meta' },
        { text: '  projects   - Query featured production deployments', type: 'meta' },
        { text: '  specs      - Run live hardware & GPU diagnostic scan', type: 'meta' },
        { text: '  matrix     - Engage raining Matrix protocol stream', type: 'meta' },
        { text: '  contact    - Retrieve direct transmission channels (email/github)', type: 'meta' },
        { text: '  sudo       - Elevate privileges', type: 'meta' },
        { text: '  clear      - Wipe terminal display', type: 'meta' },
        { text: '  exit       - Terminate terminal session', type: 'meta' }
      );
    } else if (cmd === 'game' || cmd === 'arcade' || cmd === 'play') {
      onClose();
      if (onTriggerGame) onTriggerGame();
      return;
    } else if (cmd === 'joke' || cmd === 'humor') {
      newLogs.push(
        { text: '[DEV HUMOR]', type: 'system' },
        { text: '  Why do programmers always prefer dark mode?', type: 'info' },
        { text: '  Because light attracts bugs. 🐛', type: 'success' }
      );
    } else if (cmd === 'skills') {
      newLogs.push(
        { text: '[CORE TECH ARCHITECTURE]', type: 'system' },
        { text: '  Languages : JavaScript (ES6+), Python, C++, C, SQL, HTML5, CSS3', type: 'info' },
        { text: '  Frameworks: React.js, Node.js, Express, Electron, Socket.io, Tailwind CSS', type: 'info' },
        { text: '  Database  : MongoDB, MySQL, Redis, Firebase', type: 'info' },
        { text: '  AI / ML   : OpenCV, Scikit-learn, Pandas, NumPy', type: 'info' }
      );
    } else if (cmd === 'projects') {
      newLogs.push(
        { text: '[DEPLOYED PRODUCTIONS]', type: 'system' },
        { text: '  001. OFF-TRACK  - Frosted-glass desktop music player (Electron + Spotify)', type: 'success' },
        { text: '  002. CARTEL     - Real-time grocery delivery engine (MERN + WebSockets)', type: 'success' },
        { text: '  003. GIRVI      - Financial loan ledger system (Secure Full-Stack)', type: 'success' }
      );
    } else if (cmd === 'specs') {
      onClose();
      if (onTriggerSpecs) onTriggerSpecs();
      return;
    } else if (cmd === 'matrix') {
      onClose();
      if (onTriggerMatrix) onTriggerMatrix();
      return;
    } else if (cmd === 'contact') {
      newLogs.push(
        { text: '[COMMS CHANNELS]', type: 'system' },
        { text: '  Email   : mahiagarwal.official@gmail.com', type: 'info' },
        { text: '  GitHub  : https://github.com/Maaahive', type: 'info' },
        { text: '  LinkedIn: https://linkedin.com/in/mahi-agarwal', type: 'info' }
      );
    } else if (cmd === 'sudo') {
      sound.playGlitch();
      newLogs.push({
        text: 'bash: sudo: permission denied: only Mahi has root access 🔒',
        type: 'error',
      });
    } else if (cmd === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (cmd === 'exit' || cmd === 'quit') {
      onClose();
      return;
    } else if (cmd === '') {
      // blank line
    } else {
      newLogs.push({
        text: `zsh: command not found: "${cmd}". Type "help" for allowed commands.`,
        type: 'error',
      });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    }
  };

  return (
    <motion.div
      className="hacker-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className={`hacker-terminal ${isMaximized ? 'maximized' : ''}`}
        initial={{ scale: 0.94, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 15, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
          {/* CRT scanline scan */}
          <div className="crt-scanline" />

          {/* Window Header */}
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot dot-r" onClick={onClose} title="Close" />
              <span className="dot dot-y" onClick={() => setLogs([])} title="Clear Screen" />
              <span className="dot dot-g" onClick={() => setIsMaximized(!isMaximized)} title="Maximize" />
            </div>
            <div className="terminal-title">
              <FiTerminal size={13} />
              <span>operator@mahi-core-shell: ~ (session: active)</span>
            </div>
            <div className="terminal-actions">
              <button
                className="term-btn"
                onClick={() => setIsMaximized(!isMaximized)}
                title="Toggle Maximize"
              >
                {isMaximized ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
              </button>
              <button className="term-btn" onClick={onClose} title="Close (Esc)">
                <FiX size={14} />
              </button>
            </div>
          </div>

          {/* Terminal Screen Body */}
          <div
            className="terminal-body"
            ref={terminalBodyRef}
            onClick={() => inputRef.current?.focus()}
          >
            {logs.map((log, idx) => (
              <div key={idx} className={`term-line term-line-${log.type}`}>
                {log.text}
              </div>
            ))}

            {/* Input Line */}
            <div className="terminal-prompt-line">
              <span className="prompt-label">operator@mahi-shell:~$</span>
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="terminal-footer">
            <span>[ENCRYPTION: 256-BIT QUANTUM TLS]</span>
            <span>Commands: <code>help</code>, <code>skills</code>, <code>projects</code>, <code>matrix</code>, <code>specs</code>, <code>exit</code></span>
          </div>
        </motion.div>
      </motion.div>
  );
}
