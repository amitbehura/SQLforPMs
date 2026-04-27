import React from 'react';
import { useCurriculumStore } from '../lib/store';
import { getCurriculum } from '../data/assignments';

export function MissionIntelTab() {
  const { currentLevel, role } = useCurriculumStore();
  const curriculum = getCurriculum(role);
  const assignment = curriculum.find(a => a.level === currentLevel);

  if (!assignment) {
    return <div style={{ padding: '24px', color: 'var(--text-muted)' }}>No mission intel available.</div>;
  }

  return (
    <div style={{ 
      padding: '32px', height: '100%', overflowY: 'auto', 
      backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          display: 'inline-block', padding: '4px 12px', backgroundColor: 'var(--bg-active)', 
          border: '1px solid var(--border-color)', borderRadius: '16px', 
          fontSize: '12px', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '16px'
        }}>
          CURRENT LEVEL: {currentLevel}
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 16px 0', color: '#fff' }}>
          {assignment.title}
        </h1>
        
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '32px', borderLeft: '3px solid var(--border-color)', paddingLeft: '16px' }}>
          {assignment.goal}
        </p>

        <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧠</span> {assignment.teaching.title}
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#ccc', margin: 0 }}>
            {assignment.teaching.description}
          </p>
        </div>

        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Reference Query
        </h3>
        <div style={{ 
          backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', 
          padding: '16px', overflowX: 'auto' 
        }}>
          <code style={{ fontSize: '14px', color: '#9cdcfe', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {assignment.teaching.query}
          </code>
        </div>
      </div>
    </div>
  );
}
