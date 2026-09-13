import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlay, FiRotateCcw, FiVolume2, FiVolumeX, FiAward } from 'react-icons/fi';
import { sound } from '../utils/audio';
import './MiniGameModal.css';

const BUG_TYPES = [
  { label: 'NULL_PTR', symbol: '🐛', color: '#00ff88', points: 10, hp: 1, speed: 1.2 },
  { label: '404', symbol: '⚡', color: '#ffbd2e', points: 15, hp: 1, speed: 1.6 },
  { label: 'SYNTAX', symbol: '💥', color: '#ff5370', points: 20, hp: 2, speed: 1.0 },
  { label: 'LEAK', symbol: '💧', color: '#00e5ff', points: 25, hp: 1, speed: 2.0 },
  { label: 'CONFLICT', symbol: '🔥', color: '#c084fc', points: 30, hp: 3, speed: 0.8 },
];

export default function MiniGameModal({ onClose }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, playing, gameover
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('bug_blaster_highscore') || '0', 10);
  });
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const gameRef = useRef({
    player: { x: 240, y: 480, w: 34, h: 28, speed: 6 },
    keys: {},
    lasers: [],
    bugs: [],
    particles: [],
    lastShotTime: 0,
    lastSpawnTime: 0,
    waveKills: 0,
    reqId: null,
    score: 0,
    lives: 3,
    wave: 1,
  });

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    if (next && sound.enabled) sound.toggle();
    else if (!next && !sound.enabled) sound.toggle();
  };

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keyboard listeners for window
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      gameRef.current.keys[e.code] = true;
      gameRef.current.keys[e.key] = true;

      if (e.code === 'Space' || e.key === ' ') {
        if (gameState === 'ready' || gameState === 'gameover') {
          startGame();
        }
      }
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.code] = false;
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, onClose]);

  const createExplosion = (x, y, color) => {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5);
      const spd = 1.5 + Math.random() * 3.5;
      gameRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        color,
        size: 2 + Math.random() * 2.5,
      });
    }
  };

  const spawnBug = () => {
    const type = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
    const speedMultiplier = 1 + (gameRef.current.wave - 1) * 0.15;
    gameRef.current.bugs.push({
      x: 30 + Math.random() * 420,
      y: -20,
      w: 32,
      h: 24,
      type,
      hp: type.hp,
      maxHp: type.hp,
      vy: type.speed * speedMultiplier,
      vx: (Math.random() - 0.5) * 0.8,
    });
  };

  const shootLaser = () => {
    const now = Date.now();
    if (now - gameRef.current.lastShotTime < 160) return;
    gameRef.current.lastShotTime = now;

    const p = gameRef.current.player;
    gameRef.current.lasers.push({
      x: p.x,
      y: p.y - 12,
      w: 3,
      h: 12,
      vy: -8.5,
    });

    if (!soundMuted) sound.playLaser();
  };

  const updateGame = () => {
    const g = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear with motion trails
    ctx.fillStyle = 'rgba(6, 9, 14, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Subtle star field
    ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect((Date.now() * 0.05 + i * 160) % width, (i * 180) % height, 1.5, 1.5);
    }

    // Player input
    if (g.keys['ArrowLeft'] || g.keys['KeyA'] || g.keys['a']) {
      g.player.x -= g.player.speed;
    }
    if (g.keys['ArrowRight'] || g.keys['KeyD'] || g.keys['d']) {
      g.player.x += g.player.speed;
    }
    if (g.keys['Space'] || g.keys[' '] || g.keys['ArrowUp'] || g.keys['KeyW']) {
      shootLaser();
    }

    // Clamp player
    g.player.x = Math.max(24, Math.min(width - 24, g.player.x));

    // Spawn bugs
    const now = Date.now();
    const spawnRate = Math.max(700, 1500 - (g.wave - 1) * 120);
    if (now - g.lastSpawnTime > spawnRate) {
      spawnBug();
      g.lastSpawnTime = now;
    }

    // Update lasers
    for (let i = g.lasers.length - 1; i >= 0; i--) {
      const l = g.lasers[i];
      l.y += l.vy;
      if (l.y < -10) {
        g.lasers.splice(i, 1);
        continue;
      }

      // Draw laser
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;
      ctx.fillRect(l.x - l.w / 2, l.y, l.w, l.h);
      ctx.shadowBlur = 0;
    }

    // Update and draw bugs
    for (let i = g.bugs.length - 1; i >= 0; i--) {
      const b = g.bugs[i];
      b.y += b.vy;
      b.x += b.vx;

      // Bounce horizontal walls
      if (b.x < 15 || b.x > width - 15) b.vx *= -1;

      // Laser collision
      for (let j = g.lasers.length - 1; j >= 0; j--) {
        const l = g.lasers[j];
        if (
          Math.abs(l.x - b.x) < b.w / 2 + l.w &&
          Math.abs(l.y - b.y) < b.h / 2 + l.h
        ) {
          g.lasers.splice(j, 1);
          b.hp -= 1;
          createExplosion(l.x, l.y, '#00ff88');

          if (b.hp <= 0) {
            createExplosion(b.x, b.y, b.type.color);
            if (!soundMuted) sound.playExplosion();
            g.score += b.type.points;
            g.waveKills += 1;
            setScore(g.score);

            if (g.score > highScore) {
              setHighScore(g.score);
              localStorage.setItem('bug_blaster_highscore', g.score.toString());
            }

            // Wave progression every 10 bugs
            if (g.waveKills % 10 === 0) {
              g.wave += 1;
              setWave(g.wave);
              if (!soundMuted) sound.playSuccess();
            }

            g.bugs.splice(i, 1);
            break;
          }
        }
      }

      // Bug reached bottom / hit server
      if (b.y > height - 30) {
        createExplosion(b.x, height - 20, '#ff5370');
        if (!soundMuted) sound.playGlitch();
        g.bugs.splice(i, 1);
        g.lives -= 1;
        setLives(g.lives);

        if (g.lives <= 0) {
          setGameState('gameover');
          return;
        }
        continue;
      }

      // Draw bug
      ctx.save();
      ctx.translate(b.x, b.y);

      // Symbol
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.type.symbol, 0, 0);

      // Label
      ctx.font = '10px monospace';
      ctx.fillStyle = b.type.color;
      ctx.fillText(b.type.label, 0, 16);

      // Health bar for tanky bugs
      if (b.maxHp > 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(-12, -14, 24, 3);
        ctx.fillStyle = b.type.color;
        ctx.fillRect(-12, -14, (24 * b.hp) / b.maxHp, 3);
      }
      ctx.restore();
    }

    // Update particles
    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.035;
      if (p.life <= 0) {
        g.particles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1;
    }

    // Draw Player Ship
    const p = g.player;
    ctx.save();
    ctx.translate(p.x, p.y);

    // Ship thruster glow
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(-6, 12);
    ctx.lineTo(0, 18 + Math.random() * 5);
    ctx.lineTo(6, 12);
    ctx.fill();

    // Ship body
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(16, 12);
    ctx.lineTo(0, 7);
    ctx.lineTo(-16, 12);
    ctx.closePath();
    ctx.fill();

    // Ship cockpit
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(0, -2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  };

  // Game animation loop - runs cleanly while gameState === 'playing'
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId;
    const loop = () => {
      updateGame();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const startGame = () => {
    sound.playSuccess();
    setScore(0);
    setWave(1);
    setLives(3);

    gameRef.current.score = 0;
    gameRef.current.wave = 1;
    gameRef.current.lives = 3;
    gameRef.current.waveKills = 0;
    gameRef.current.bugs = [];
    gameRef.current.lasers = [];
    gameRef.current.particles = [];
    gameRef.current.player.x = 240;
    gameRef.current.lastSpawnTime = Date.now();
    gameRef.current.lastShotTime = 0;

    setGameState('playing');
  };

  // Touch / mouse dragging for controls
  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const scaleX = canvas.width / rect.width;
    gameRef.current.player.x = (clientX - rect.left) * scaleX;
  };

  return (
    <motion.div
      className="game-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="game-modal-card"
        initial={{ scale: 0.92, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 15, opacity: 0 }}
        transition={{ duration: 0.22 }}
      >
        {/* Header Bar */}
        <div className="game-header">
          <div className="game-header-title">
            <span className="game-icon">👾</span>
            <span>BUG BLASTER: MAHI ARCADE</span>
          </div>

          <div className="game-header-actions">
            <button
              className="game-header-btn"
              onClick={toggleSound}
              title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {soundMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
            </button>
            <button className="game-header-btn" onClick={onClose} title="Close (Esc)">
              <FiX size={15} />
            </button>
          </div>
        </div>

        {/* Game Stats HUD */}
        <div className="game-hud">
          <div className="hud-metric">
            <span className="hud-label">SCORE</span>
            <span className="hud-val">{score}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">WAVE</span>
            <span className="hud-val">#{wave}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">SERVER HP</span>
            <span className="hud-val hearts">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < lives ? 'heart-full' : 'heart-empty'}>
                  ♥
                </span>
              ))}
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">HIGH</span>
            <span className="hud-val gold"><FiAward size={11} /> {highScore}</span>
          </div>
        </div>

        {/* Canvas Screen */}
        <div
          className="game-canvas-container"
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onClick={() => {
            if (gameState === 'playing') shootLaser();
          }}
        >
          <canvas
            ref={canvasRef}
            width={480}
            height={520}
            className="game-canvas"
          />

          {/* Ready Overlay */}
          {gameState === 'ready' && (
            <div className="game-screen-overlay">
              <div className="screen-title">DEFEND THE PRODUCTION SERVER</div>
              <p className="screen-desc">
                Null pointers, 404s, and merge conflicts are swarming the deployment.
                Blast them before they crash Mahi's stack!
              </p>
              <div className="screen-controls-tip">
                <span>[A] [D] or [←] [→] to Move</span>
                <span>[SPACE] or [TAP] to Shoot</span>
              </div>
              <button className="game-start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                <FiPlay size={16} />
                <span>START MISSION</span>
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'gameover' && (
            <div className="game-screen-overlay">
              <div className="screen-title error">500 INTERNAL SERVER ERROR</div>
              <div className="screen-subtitle">Bugs overwhelmed the stack!</div>
              <div className="screen-final-score">
                Final Score: <strong>{score}</strong>
                {score >= highScore && score > 0 && (
                  <div className="new-high-score">🏆 NEW ALL-TIME RECORD!</div>
                )}
              </div>
              <button className="game-start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                <FiRotateCcw size={15} />
                <span>DEPLOY HOTFIX (PLAY AGAIN)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer controls hint */}
        <div className="game-footer">
          <span>Controls: <code>←</code> <code>→</code> Move | <code>Space</code> Fire | <code>Esc</code> Close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
