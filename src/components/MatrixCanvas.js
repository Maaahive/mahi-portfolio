import React, { useEffect, useRef, useState } from 'react';
import './ParticleCanvas.css';

export default function MatrixCanvas() {
  const canvasRef = useRef(null);
  const [matrixMode, setMatrixMode] = useState(false);

  // Register global toggle
  useEffect(() => {
    window.toggleMatrixMode = () => setMatrixMode((prev) => !prev);
    return () => { delete window.toggleMatrixMode; };
  }, []);

  // Escape key to exit
  useEffect(() => {
    if (!matrixMode) return;
    const onKey = (e) => { if (e.key === 'Escape') setMatrixMode(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [matrixMode]);

  // Matrix rain render loop
  useEffect(() => {
    if (!matrixMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    // willReadFrequently hint avoids GPU<->CPU readback stalls
    const ctx = canvas.getContext('2d', { willReadFrequently: false });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 15;
    let columns = Math.max(1, Math.floor(width / fontSize));
    let drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));
    const chars = '0123456789ABCDEFHIJKLMNOXYZMAHI01010101985<>/*+-~#{}';

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.max(1, Math.floor(width / fontSize));
      drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));
      ctx.fillStyle = '#040508';
      ctx.fillRect(0, 0, width, height);
    };
    window.addEventListener('resize', onResize);

    // Initial black fill
    ctx.fillStyle = '#040508';
    ctx.fillRect(0, 0, width, height);

    let rafId;
    let lastTime = 0;
    const FPS = 30;
    const INTERVAL = 1000 / FPS;

    const render = (now) => {
      rafId = requestAnimationFrame(render);
      const delta = now - lastTime;
      if (delta < INTERVAL) return; // throttle to 30fps
      lastTime = now - (delta % INTERVAL);

      // Fade trail
      ctx.fillStyle = 'rgba(4, 5, 8, 0.13)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        if (y < 0) { drops[i]++; continue; }

        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        // Bright white head ~12% of the time, green body otherwise
        // No shadowBlur — it's very expensive on canvas
        if (Math.random() > 0.88) {
          ctx.fillStyle = '#e8ffe8';
        } else {
          ctx.fillStyle = '#00e87a';
        }
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      // Clear canvas on exit
      const c = canvasRef.current;
      if (c) {
        const cx = c.getContext('2d');
        cx.clearRect(0, 0, c.width, c.height);
      }
    };
  }, [matrixMode]);

  if (!matrixMode) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="particle-canvas matrix-active"
        style={{ zIndex: 1 }}
      />
      <div className="matrix-hud-banner">
        <div className="matrix-hud-indicator">
          <span className="matrix-hud-dot" />
          <span>[ MATRIX PROTOCOL ACTIVE ]</span>
        </div>
        <button onClick={() => setMatrixMode(false)} title="Exit Matrix Mode (Esc)">
          Exit Matrix [ESC]
        </button>
      </div>
    </>
  );
}
