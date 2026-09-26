import React, { useEffect, useRef, useState, useCallback } from 'react';
import './ParticleCanvas.css';

export default function MatrixCanvas() {
  const canvasRef = useRef(null);
  const [matrixMode, setMatrixMode] = useState(false);

  const toggle = useCallback(() => {
    setMatrixMode((prev) => !prev);
  }, []);

  // Register global toggle on window
  useEffect(() => {
    window.toggleMatrixMode = toggle;
    return () => {
      delete window.toggleMatrixMode;
    };
  }, [toggle]);

  // Escape key to exit
  useEffect(() => {
    if (!matrixMode) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMatrixMode(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [matrixMode]);

  // Handle matrix mode lifecycle, body class & canvas render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!matrixMode) {
      document.body.classList.remove('matrix-mode-active');
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    document.body.classList.add('matrix-mode-active');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 15;
    let columns = Math.max(1, Math.floor(width / fontSize));
    // Stagger drops across screen height so rain starts falling immediately
    let drops = Array(columns)
      .fill(0)
      .map(() => Math.floor(Math.random() * (height / fontSize)));
    const chars = '0123456789ABCDEFHIJKLMNOXYZMAHI01010101985<>/*+-~#{}';

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.max(1, Math.floor(width / fontSize));
      drops = Array(columns)
        .fill(0)
        .map(() => Math.floor(Math.random() * (height / fontSize)));
      ctx.fillStyle = '#040508';
      ctx.fillRect(0, 0, width, height);
    };
    window.addEventListener('resize', onResize);

    // Initial background wipe
    ctx.fillStyle = '#040508';
    ctx.fillRect(0, 0, width, height);

    let rafId;

    const render = () => {
      // Trailing fade wash
      ctx.fillStyle = 'rgba(4, 5, 8, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading head has glowing white accent, body is vibrant cyber green
        if (Math.random() > 0.88) {
          ctx.fillStyle = '#e8ffe8';
        } else {
          ctx.fillStyle = '#00ff88';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('matrix-mode-active');
      if (canvas) {
        const c = canvas.getContext('2d');
        if (c) c.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [matrixMode]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`particle-canvas ${matrixMode ? 'matrix-active' : ''}`}
        style={{
          display: matrixMode ? 'block' : 'none',
          zIndex: matrixMode ? 1 : 0,
        }}
      />
      {matrixMode && (
        <div className="matrix-hud-banner">
          <div className="matrix-hud-indicator">
            <span className="matrix-hud-dot" />
            <span>[ MATRIX PROTOCOL ACTIVE ]</span>
          </div>
          <button onClick={() => setMatrixMode(false)} title="Exit Matrix Mode (Esc)">
            Exit Matrix [ESC]
          </button>
        </div>
      )}
    </>
  );
}
