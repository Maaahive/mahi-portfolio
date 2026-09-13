import React, { useEffect, useRef, useState } from 'react';
import './ParticleCanvas.css';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const [matrixMode, setMatrixMode] = useState(false);

  useEffect(() => {
    window.toggleMatrixMode = () => {
      setMatrixMode((prev) => !prev);
    };
    return () => {
      delete window.toggleMatrixMode;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

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
    };
    window.addEventListener('resize', onResize);

    const mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    let isTabActive = !document.hidden;
    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(matrixMode ? renderMatrix : renderParticles);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const renderMatrix = () => {
      if (!isTabActive) return;

      // Dark translucent wash to create the iconic trailing effect
      ctx.fillStyle = 'rgba(3, 4, 6, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y >= 0) {
          if (Math.random() > 0.88) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 6;
          } else {
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 2;
          }

          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(renderMatrix);
    };

    const isMobile = width < 768;
    const particleCount = isMobile
      ? Math.min(Math.floor((width * height) / 22000), 30)
      : Math.min(Math.floor((width * height) / 16000), 62);

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        radius: Math.random() * 1.4 + 0.9,
        alpha: Math.random() * 0.35 + 0.35,
      });
    }

    const mouseDistMax = 150;
    const mouseDistMaxSq = mouseDistMax * mouseDistMax;
    const linkDistMax = 105;
    const linkDistMaxSq = linkDistMax * linkDistMax;

    let isScrolling = false;
    let scrollTimer = null;
    const onScroll = () => {
      isScrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 90);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const renderParticles = () => {
      if (!isTabActive) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Crisp, glowing celestial particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 74, ${p.alpha * 0.75})`;
        ctx.fill();

        // While not actively scrolling, draw clearly visible constellation connections
        if (!isScrolling) {
          // Responsive mouse connection line
          const dxMouse = mouse.x - p.x;
          const dyMouse = mouse.y - p.y;
          const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

          if (distMouseSq < mouseDistMaxSq) {
            const distMouse = Math.sqrt(distMouseSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const lineAlpha = (1 - distMouse / mouseDistMax) * 0.42;
            ctx.strokeStyle = `rgba(255, 107, 74, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }

          // Clearly defined constellation lines between nearby stars
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < linkDistMaxSq) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              const linkAlpha = (1 - dist / linkDistMax) * 0.11;
              ctx.strokeStyle = `rgba(255, 255, 255, ${linkAlpha})`;
              ctx.lineWidth = 0.65;
              ctx.stroke();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderParticles);
    };

    if (matrixMode) {
      ctx.fillStyle = '#040508';
      ctx.fillRect(0, 0, width, height);
      renderMatrix();
    } else {
      ctx.clearRect(0, 0, width, height);
      renderParticles();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, width, height);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [matrixMode]);

  useEffect(() => {
    if (!matrixMode) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMatrixMode(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [matrixMode]);

  return (
    <>
      <canvas ref={canvasRef} className={`particle-canvas ${matrixMode ? 'matrix-active' : ''}`} />
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
