import React, { useState, useEffect } from 'react';

type Position = { x: number; y: number };
type Role = 'Analyst' | 'PM' | 'Stakeholder';

interface Desk {
  x: number;
  y: number;
  role: Role;
  label: string;
  themeColor: string;
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 12;

const DESKS: Desk[] = [
  { x: 4, y: 5, role: 'Stakeholder', label: 'Sr. Stakeholder', themeColor: '#10b981' }, // Green
  { x: 10, y: 5, role: 'PM', label: 'Product Manager', themeColor: '#3b82f6' }, // Blue
  { x: 16, y: 5, role: 'Analyst', label: 'Business Analyst', themeColor: '#f59e0b' }, // Orange
];

export function OfficeGame({ onSelectRole }: { onSelectRole: (role: Role) => void }) {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 10, y: 10 });
  const [facing, setFacing] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      setPlayerPosition((prev) => {
        let newPos = { ...prev };
        let newFacing = facing;

        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') { newPos.y -= 1; newFacing = 'up'; }
        if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') { newPos.y += 1; newFacing = 'down'; }
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') { newPos.x -= 1; newFacing = 'left'; }
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { newPos.x += 1; newFacing = 'right'; }

        setFacing(newFacing);

        // Room Boundaries
        newPos.x = Math.max(1, Math.min(GRID_WIDTH - 2, newPos.x));
        newPos.y = Math.max(1, Math.min(GRID_HEIGHT - 2, newPos.y));

        // Check collision with desks (desks are 2x2 physically, but origin is top-left)
        const hitDesk = DESKS.find(d =>
          (newPos.x === d.x || newPos.x === d.x + 1) &&
          (newPos.y === d.y || newPos.y === d.y + 1)
        );

        if (hitDesk) {
          setTimeout(() => onSelectRole(hitDesk.role), 0);
          return prev; // bounce off desk
        }

        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [facing, onSelectRole]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: '#0f172a', // Deep slate background
      color: '#f8fafc',
      fontFamily: 'var(--font-sans)',
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 10 }}>
        <h1 style={{ fontSize: 'min(36px, 5vw)', fontWeight: 800, margin: '0 0 12px 0', color: '#f8fafc', letterSpacing: '-0.02em' }}>
          PayPaySQL Headquarters
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 'min(16px, 2.5vw)', margin: 0, fontWeight: 500 }}>
          Welcome to your first day. Walk to your desk to begin.
        </p>
      </div>

      <div className="office-grid-container" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '20px',
        overflow: 'hidden'
      }}>
        <div className="office-grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, var(--tile-size))`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, var(--tile-size))`,
          backgroundColor: '#1e293b',
          border: 'min(10px, 1vw) solid #334155',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
          backgroundSize: 'var(--tile-size) var(--tile-size)',
        } as React.CSSProperties}>

        {/* Render Plants/Decorations */}
        <div style={{ position: 'absolute', top: 10, left: 10, fontSize: '24px' }}>🪴</div>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '24px' }}>🪴</div>
        <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '24px' }}>🗄️</div>

        {/* Render Grid Elements */}
        {Array.from({ length: GRID_HEIGHT }).map((_, y) => (
          Array.from({ length: GRID_WIDTH }).map((_, x) => {
            const isPlayer = playerPosition.x === x && playerPosition.y === y;
            const desk = DESKS.find(d => d.x === x && d.y === y);

            return (
              <div key={`${x}-${y}`} style={{ width: 'var(--tile-size)', height: 'var(--tile-size)', position: 'relative' }}>

                {/* Desks (Rendered as 2x2 blocks starting from top-left) */}
                {desk && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '80px', height: '80px', zIndex: 5,
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                  }}>
                    {/* Desk Surface */}
                    <div style={{
                      width: 'calc(var(--tile-size) * 1.7)', height: 'calc(var(--tile-size) * 0.8)',
                      backgroundColor: '#475569',
                      borderRadius: '4px',
                      marginTop: 'calc(var(--tile-size) * 0.3)',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                      position: 'relative',
                      display: 'flex', justifyContent: 'center'
                    }}>
                      {/* Monitors */}
                      <div style={{
                        position: 'absolute', top: '-15px',
                        width: '40px', height: '20px',
                        backgroundColor: '#0f172a',
                        border: '2px solid #334155',
                        borderRadius: '2px',
                        boxShadow: `0 0 10px ${desk.themeColor}80` // Glowing screen effect
                      }}>
                        {/* Screen Glow */}
                        <div style={{ width: '100%', height: '100%', backgroundColor: `${desk.themeColor}30` }} />
                      </div>

                      {/* Keyboard */}
                      <div style={{
                        position: 'absolute', bottom: '5px',
                        width: '25px', height: '8px',
                        backgroundColor: '#cbd5e1', borderRadius: '1px'
                      }} />
                    </div>

                    {/* Chair */}
                    <div style={{
                      width: 'calc(var(--tile-size) * 0.4)', height: 'calc(var(--tile-size) * 0.3)',
                      backgroundColor: '#334155',
                      borderRadius: '10px 10px 0 0',
                      marginTop: 'calc(var(--tile-size) * 0.1)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }} />

                    {/* Label floating above */}
                    <div style={{
                      position: 'absolute', top: 'calc(var(--tile-size) * -0.8)',
                      backgroundColor: '#0f172a', color: '#f8fafc',
                      padding: 'calc(var(--tile-size) * 0.1) calc(var(--tile-size) * 0.2)', 
                      borderRadius: '4px',
                      fontSize: 'calc(var(--tile-size) * 0.25)', fontWeight: 700,
                      borderBottom: `2px solid ${desk.themeColor}`,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                      animation: 'float 3s ease-in-out infinite'
                    }}>
                      {desk.label}
                    </div>
                  </div>
                )}

                {/* Player Character */}
                {isPlayer && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10, 
                    width: 'calc(var(--tile-size) * 0.6)', 
                    height: 'calc(var(--tile-size) * 0.6)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                  }}>
                    {/* Player Head */}
                    <div style={{
                      width: 'calc(var(--tile-size) * 0.35)', height: 'calc(var(--tile-size) * 0.35)',
                      backgroundColor: '#fca5a5',
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 2
                    }}>
                      {/* Directional indicator */}
                      <div style={{
                        width: '100%', height: '100%', position: 'relative',
                        transform: facing === 'left' ? 'rotate(-90deg)' : facing === 'right' ? 'rotate(90deg)' : facing === 'down' ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '30%', backgroundColor: '#451a03', borderRadius: '8px 8px 0 0' }} />
                      </div>
                    </div>
                    {/* Player Body */}
                    <div style={{
                      width: 'calc(var(--tile-size) * 0.5)', height: 'calc(var(--tile-size) * 0.25)',
                      backgroundColor: '#3b82f6',
                      borderRadius: '12px 12px 4px 4px',
                      marginTop: 'calc(var(--tile-size) * -0.1)',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                      zIndex: 1
                    }} />
                  </div>
                )}
              </div>
            );
          })
        ))}

        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }
          
          :root {
            --tile-size: min(3.8vw, 5.5vh);
          }

          @media (max-width: 600px) {
            :root {
              --tile-size: min(4.8vw, 5vh);
            }
          }
        `}</style>

        {/* Intro Overlay */}
        {showIntro && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '16px'
          }}>
            <div style={{
              maxWidth: '450px', textAlign: 'center', padding: '40px',
              backgroundColor: '#1e293b', border: '1px solid #334155',
              borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏙️</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
                Welcome to Headquarters!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                Use <strong style={{ color: '#f8fafc' }}>WASD</strong> or <strong style={{ color: '#f8fafc' }}>Arrow Keys</strong> to move your character.
                <br /><br />
                Walk up to any desk to start your mission. Each desk represents a different SQL role in the company.
              </p>
              <button 
                className="primary" 
                onClick={() => setShowIntro(false)}
                style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
              >
                Let's Go! 🚀
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '20px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <kbd style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', border: '1px solid #334155', color: '#f8fafc' }}>W</kbd>
          <kbd style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', border: '1px solid #334155', color: '#f8fafc' }}>A</kbd>
          <kbd style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', border: '1px solid #334155', color: '#f8fafc' }}>S</kbd>
          <kbd style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', border: '1px solid #334155', color: '#f8fafc' }}>D</kbd>
          <span>to move</span>
        </div>
      </div>
    </div>
  );
}
