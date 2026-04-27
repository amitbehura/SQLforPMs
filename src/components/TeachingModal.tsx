import React from 'react';
import { useCurriculumStore } from '../lib/store';
import { getCurriculum } from '../data/assignments';

export function TeachingModal() {
  const { currentLevel, phase, role, startTesting } = useCurriculumStore();
  const curriculum = getCurriculum(role);
  const assignment = curriculum.find(a => a.level === currentLevel);

  if (phase !== 'teaching' || !assignment) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, 
      display: 'flex', backgroundColor: '#000',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Left Side: Hero Area */}
      <div style={{ 
        flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', padding: '60px 80px', overflow: 'hidden' 
      }}>
        {/* Glowing Orb Background */}
        <div style={{ 
          position: 'absolute', top: '-30%', left: '-30%', width: '160%', height: '160%', 
          background: 'radial-gradient(circle, rgba(0,112,243,0.15) 0%, rgba(0,0,0,0) 60%)', 
          zIndex: 0, pointerEvents: 'none' 
        }} />
        
        <div style={{ zIndex: 1 }}>
          <div style={{ 
            color: 'var(--accent-color)', fontWeight: 800, fontSize: '20px', 
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-color)' }} />
            Mission {currentLevel}
          </div>
          
          <h1 style={{ 
            fontSize: '64px', fontWeight: 800, lineHeight: 1.1, margin: '0 0 32px 0', 
            background: 'linear-gradient(to right, #ffffff, #a1a1aa)', 
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
          }}>
            {assignment.title}
          </h1>
          
          <div style={{ 
            fontSize: '22px', color: 'var(--text-muted)', maxWidth: '90%', 
            lineHeight: 1.5, borderLeft: '4px solid var(--accent-color)', 
            paddingLeft: '32px', fontStyle: 'italic'
          }}>
            "{assignment.goal}"
          </div>
        </div>
      </div>

      {/* Right Side: Briefing Details */}
      <div style={{ 
        flex: 1, backgroundColor: '#0a0a0a', borderLeft: '1px solid #222', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', 
        padding: '0 100px', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)', zIndex: 2
      }}>
        <h2 style={{ 
          fontSize: '32px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px',
          color: '#fff'
        }}>
          <span style={{ fontSize: '28px' }}>🎯</span> {assignment.teaching.title}
        </h2>
        
        <p style={{ 
          fontSize: '18px', color: '#cccccc', lineHeight: 1.6, marginBottom: '48px' 
        }}>
          {assignment.teaching.description}
        </p>

        <div style={{ marginBottom: '56px' }}>
          <div style={{ 
            fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', 
            color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600
          }}>
            Example Intel (SQL)
          </div>
          
          {/* Faux Mac Terminal Window */}
          <div style={{ 
            backgroundColor: '#000000', border: '1px solid #333', borderRadius: '12px', 
            overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' 
          }}>
            <div style={{ 
              display: 'flex', gap: '8px', padding: '12px 16px', 
              borderBottom: '1px solid #222', backgroundColor: '#111' 
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>
            <div style={{ padding: '24px', overflowX: 'auto' }}>
              <code style={{ 
                fontSize: '16px', color: '#9cdcfe', fontFamily: 'var(--font-mono)', 
                whiteSpace: 'pre-wrap', lineHeight: 1.6 
              }}>
                {assignment.teaching.query}
              </code>
            </div>
          </div>
        </div>

        <button 
          className="primary" 
          onClick={startTesting} 
          style={{ 
            padding: '24px 32px', fontSize: '20px', borderRadius: '12px', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', 
            width: '100%', transition: 'all 0.2s ease', cursor: 'pointer',
            border: 'none', background: 'linear-gradient(135deg, #0070f3, #00c6ff)',
            color: '#fff', fontWeight: 700, boxShadow: '0 10px 30px rgba(0, 112, 243, 0.4)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Accept Mission <span style={{ fontSize: '24px' }}>🚀</span>
        </button>
      </div>
    </div>
  );
}
