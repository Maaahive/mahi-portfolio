import React, { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    let isMoving = false;
    let moveTimeout = null;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
      isMoving = true;
      if (moveTimeout) clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 150);
    };

    const onOver = (e) => {
      if (!isMoving) return; // ignore during fast scrolling to maintain 60/120fps
      if (
        e.target &&
        e.target.closest(
          "a, button, [role='button'], .project-card, .clickable, .pd-gallery-thumb, .filter-chip"
        )
      ) {
        ringRef.current?.classList.add("hovered");
      } else {
        ringRef.current?.classList.remove("hovered");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    let raf;
    const animate = () => {
      const dx = pos.current.x - ring.current.x - 16;
      const dy = pos.current.y - ring.current.y - 16;

      // Only re-apply transform if ring is actively moving
      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        ring.current.x += dx * 0.18;
        ring.current.y += dy * 0.18;
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
        }
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (moveTimeout) clearTimeout(moveTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
