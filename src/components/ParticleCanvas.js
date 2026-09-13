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

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    if (matrixMode) {
      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      const drops = Array(columns).fill(1);
      const chars = '01ABCDEFMAHI01010101985';

      const renderMatrix = () => {
        ctx.fillStyle = 'rgba(5, 5, 8, 0.12)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillStyle = Math.random() > 0.85 ? '#ffffff' : '#00ff88';
          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        animationFrameId = requestAnimationFrame(renderMatrix);
      };
      renderMatrix();
    } else {
      const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
      const particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.4 + 0.2,
        });
      }

      const renderParticles = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 107, 74, ${p.alpha * 0.6})`;
          ctx.fill();

          const dxMouse = mouse.x - p.x;
          const dyMouse = mouse.y - p.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - distMouse / 140) * 0.35;
            ctx.strokeStyle = `rgba(255, 107, 74, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 95) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 95) * 0.08})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
        animationFrameId = requestAnimationFrame(renderParticles);
      };
      renderParticles();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [matrixMode]);

  return (
    <>
      <canvas ref={canvasRef} className={`particle-canvas ${matrixMode ? 'matrix-active' : ''}`} />
      {matrixMode && (
        <div className="matrix-hud-banner">
          <span>[ MATRIX PROTOCOL ACTIVE ]</span>
          <button onClick={() => setMatrixMode(false)}>Exit Matrix</button>
        </div>
      )}
    </>
  );
}
