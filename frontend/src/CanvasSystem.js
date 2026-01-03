import { useEffect, useRef } from "react";

export default function CanvasSystem() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* ===== DOT CONFIG ===== */
    const POINT_COUNT = 130;           // MORE DOTS
    const MAX_LINK_DIST = 200;          // LONGER CONNECTIONS
    const CURSOR_RADIUS = 220;          // BIGGER INTERACTION ZONE

    const points = Array.from({ length: POINT_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
    }));

    function animate() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        /* Idle movement */
        p.x += p.vx;
        p.y += p.vy;

        /* Wrap around screen */
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        /* Cursor interaction (soft magnet with release) */
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_RADIUS) {
          p.x += dx * 0.0025;
          p.y += dy * 0.0025;
        }

        /* Connections */
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);

          if (d < MAX_LINK_DIST) {
            ctx.strokeStyle = `rgba(0,250,255,${0.35 - d / 600})`;
            ctx.lineWidth = 1.6;       // THICKER LINES
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        /* Dots */
        ctx.fillStyle = "rgba(0,250,255,0.95)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2); // BIGGER DOTS
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("mousemove", e => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}
