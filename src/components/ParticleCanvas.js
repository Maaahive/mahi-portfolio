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
      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      const drops = Array(columns).fill(1);
      const chars = '01ABCDEFMAHI01010101985';

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

    const isMobile = width < 768;
    const particleCount = isMobile
      ? Math.min(Math.floor((width * height) / 25000), 32)
      : Math.min(Math.floor((width * height) / 18000), 60);

    // Cyber celestial color palette matching portfolio aesthetic
    const PALETTE = [
      'rgba(168, 85, 247, ', // Cyber Violet
      'rgba(0, 229, 255, ',  // Neon Cyan
      'rgba(255, 107, 74, ', // Radiant Coral
      'rgba(240, 240, 255, ', // Astral Starlight
    ];

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const isAnchor = Math.random() > 0.82; // ~18% are brighter anchor stars
      const baseVx = (Math.random() - 0.5) * 0.32;
      const baseVy = (Math.random() - 0.5) * 0.32;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        radius: isAnchor ? Math.random() * 1.5 + 2.2 : Math.random() * 1.2 + 0.9,
        isAnchor,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        baseAlpha: isAnchor ? 0.65 : Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.035 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        flare: 0,
      });
    }

    // Interactive shockwave ripple pulses on click
    const ripples = [];
    const onPointerDown = (e) => {
      // Don't trigger if clicking an input, button, or link
      if (e.target && e.target.closest('a, button, input, textarea')) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 150,
        alpha: 0.6,
      });

      // Flare nearby stars and give a subtle push
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 1) {
          p.flare = 1;
          const force = (1 - dist / 180) * 2.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
    };
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    const mouseDistMax = 160;
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

      // 1. Render and expand click ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 5.5;
        rip.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${rip.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          ripples.splice(r, 1);
        }
      }

      // 2. Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulsePhase += p.pulseSpeed;

        // Smooth damping back to ambient velocity
        p.vx = p.vx * 0.965 + p.baseVx * 0.035;
        p.vy = p.vy * 0.965 + p.baseVy * 0.035;
        p.x += p.vx;
        p.y += p.vy;

        // Gentle flare decay
        if (p.flare > 0) p.flare *= 0.93;

        // Screen boundary wrap-around
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Twinkling starlight oscillation
        const twinkle = Math.sin(p.pulsePhase) * 0.18;
        const currentAlpha = Math.min(1, Math.max(0.1, p.baseAlpha + twinkle + p.flare * 0.6));

        // Outer glowing halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (p.isAnchor ? 2.4 : 1.9), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha * 0.22})`;
        ctx.fill();

        // Inner bright stellar core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();

        // While not actively scrolling fast, compute interactive gravity and constellation webs
        if (!isScrolling) {
          // Interactive gravitational attraction & glowing beam to cursor
          const dxMouse = mouse.x - p.x;
          const dyMouse = mouse.y - p.y;
          const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

          if (distMouseSq < mouseDistMaxSq) {
            const distMouse = Math.sqrt(distMouseSq);
            // Subtle cosmic magnetic attraction toward cursor
            const pull = (1 - distMouse / mouseDistMax) * 0.28;
            p.vx += (dxMouse / distMouse) * pull * 0.08;
            p.vy += (dyMouse / distMouse) * pull * 0.08;

            // Radiant gradient connection line to cursor
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const lineAlpha = (1 - distMouse / mouseDistMax) * 0.45;
            ctx.strokeStyle = `${p.color}${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }

          // Luminescent constellation geometry between nearby stars
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
              const linkAlpha = (1 - dist / linkDistMax) * 0.14;
              ctx.strokeStyle = `${p.color}${linkAlpha})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderParticles);
    };

    if (matrixMode) {
      renderMatrix();
    } else {
      renderParticles();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (scrollTimer) clearTimeout(scrollTimer);
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
