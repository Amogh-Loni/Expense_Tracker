import { useEffect } from 'react';

export default function BootOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  const chunks = ['EX', 'PEN', 'SE', ' ', 'SP', 'LI', 'TT', 'ER'];

  return (
    <div className="boot-overlay">
      <div className="assembly-container">
        {chunks.map((c, i) => (
          <span
            key={i}
            className="assembly-piece"
            style={{
              '--tx': `${Math.random() * 400 - 200}px`,
              '--ty': `${Math.random() * 300 - 150}px`,
              '--rx': `${Math.random() * 90 - 45}deg`,
              '--ry': `${Math.random() * 90 - 45}deg`,
              '--d': `${i * 0.15}s`
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="boot-sub">
        NEURAL SETTLEMENT CORE
      </div>
    </div>
  );
}
