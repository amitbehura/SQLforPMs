import React from 'react';
import { Award, RefreshCcw } from 'lucide-react';
import { useCurriculumStore } from '../lib/store';

export function VictoryScreen({ onReset }: { onReset?: () => void }) {
  const { resetProgress, role } = useCurriculumStore();

  const handleRestart = () => {
    resetProgress();
    if (onReset) onReset();
  };

  const renderCopy = () => {
    if (role === 'Stakeholder') {
      return (
        <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', lineHeight: 1.6, marginBottom: '40px' }}>
          You have successfully mastered the PayPaySQL Stakeholder Curriculum. 
          You now know how to pull core metrics, filter datasets, and build simple aggregations. 
          Get back to making business decisions with confidence!
        </p>
      );
    }
    if (role === 'Analyst') {
      return (
        <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', lineHeight: 1.6, marginBottom: '40px' }}>
          You have successfully mastered the PayPaySQL Analyst Curriculum. 
          You crushed CTEs, Window Functions, and Subqueries. 
          You are officially ready to tackle the hardest data problems in the company!
        </p>
      );
    }
    return (
      <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', lineHeight: 1.6, marginBottom: '40px' }}>
        You have successfully mastered the PayPaySQL Product Manager Curriculum. 
        From basic `SELECT` statements to advanced `Window Functions`, you are now a fully data-driven Product Manager. 
        No more waiting on the data team—you have the power to find your own answers!
      </p>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      backgroundColor: '#0f172a',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', color: '#f8fafc', textAlign: 'center', padding: '40px'
    }}>
      <div style={{ marginBottom: '32px', animation: 'bounce 2s infinite' }}>
        <Award size={120} color="#fbbf24" />
      </div>
      
      <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px 0', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Curriculum Complete!
      </h1>
      
      {renderCopy()}

      <button 
        onClick={handleRestart}
        style={{
          backgroundColor: '#38bdf8', color: '#0f172a', border: 'none',
          padding: '16px 32px', borderRadius: '8px', fontSize: '18px', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)', transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <RefreshCcw size={20} />
        Start Over
      </button>
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
