import React, { useState, useEffect } from 'react';
import { useCurriculumStore } from '../lib/store';
import { getCurriculum } from '../data/assignments';
import { getDb } from '../lib/db';

interface CurriculumPanelProps {
  role: string;
  onExit: () => void;
  activeQuery: string;
  onFillQuery: (query: string) => void;
}

export function CurriculumPanel({ role, onExit, activeQuery, onFillQuery }: CurriculumPanelProps) {
  const { currentLevel, phase, completedTests, skippedTests, passTest, skipTest, jumpToLevel, startTesting } = useCurriculumStore();
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const curriculum = getCurriculum(role);
  const assignment = curriculum.find(a => a.level === currentLevel);

  // Fallback if level not found
  if (!assignment) {
    return (
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Congratulations!</h2>
          <p>You have completed the entire PayPaySQL PM Curriculum.</p>
        </div>
        <button className="primary" onClick={onExit}>Return to Lobby</button>
      </div>
    );
  }

  // Find the current test based on selection or first uncompleted
  const autoNextTest = assignment.tests.find(t => !completedTests.includes(t.id) && !skippedTests.includes(t.id));
  const activeTest = assignment.tests.find(t => t.id === selectedTestId) || autoNextTest;

  useEffect(() => {
    setVerifyError(null);
    // When level changes, reset selection to let auto-next handle it
    setSelectedTestId(null);
  }, [currentLevel]);

  const handleVerify = async () => {
    setVerifyError(null);
    if (!activeQuery || !activeQuery.trim()) {
      setVerifyError("Your query is completely empty. Write some SQL!");
      return;
    }
    
    if (!activeTest) return;

    try {
      const db = await getDb();
      const userRes = await db.query(activeQuery);
      const solutionRes = await db.query(activeTest.solutionQuery);

      const userCols = userRes.fields.map(f => f.name).join(', ');
      const solCols = solutionRes.fields.map(f => f.name).join(', ');
      if (userCols !== solCols) {
        setVerifyError(`Incorrect columns returned.\nExpected: [${solCols}]\nGot: [${userCols}]`);
        return;
      }

      if (userRes.rows.length !== solutionRes.rows.length) {
        setVerifyError(`Incorrect row count. Expected ${solutionRes.rows.length} rows, but got ${userRes.rows.length} rows.`);
        return;
      }
      
      const userStr = JSON.stringify(userRes.rows);
      const solStr = JSON.stringify(solutionRes.rows);
      
      if (userStr !== solStr) {
        setVerifyError("The rows returned do not perfectly match the expected output. Check your filters and sorting.");
        return;
      }

      // If it's a re-attempt of a finished test, don't trigger store level-up logic unnecessarily
      if (!completedTests.includes(activeTest.id)) {
        passTest(activeTest.id);
      } else {
        alert("Verification successful! You've cleared this challenge again.");
      }

    } catch (e: any) {
      setVerifyError("SQL Error: " + e.message);
    }
  };

  const handleAskDataEngineer = () => {
    if (activeTest) {
      onFillQuery(activeTest.solutionQuery);
    }
  };

  return (
    <div style={{ padding: '12px 20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
          <select 
            value={currentLevel}
            onChange={(e) => jumpToLevel(Number(e.target.value))}
            style={{ 
              backgroundColor: 'var(--accent-color)', color: 'white', 
              padding: '6px 12px', borderRadius: '8px', fontSize: '13px', 
              fontWeight: 'bold', border: 'none', cursor: 'pointer', outline: 'none'
            }}
          >
            {curriculum.map(a => (
              <option key={a.level} value={a.level}>
                Level {a.level}: {a.title}
              </option>
            ))}
          </select>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Tracker:</span>
            <div title="Tutorial" style={{ 
              width: '14px', height: '14px', borderRadius: '4px', 
              backgroundColor: 'var(--accent-color)', border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }} onClick={() => jumpToLevel(currentLevel)} />
            <div style={{ width: '10px', height: '2px', backgroundColor: 'var(--border-color)' }} />
            
            {assignment.tests.map((t, idx) => {
              const isCompleted = completedTests.includes(t.id);
              const isSkipped = skippedTests.includes(t.id);
              const isSelected = activeTest?.id === t.id;
              
              let bgColor = 'var(--bg-active)';
              if (isCompleted) bgColor = 'var(--success)';
              else if (isSkipped) bgColor = 'var(--warning)';

              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div 
                    title={t.prompt} 
                    onClick={() => {
                      setSelectedTestId(t.id);
                      if (phase === 'teaching') startTesting();
                    }}
                    style={{ 
                      width: '22px', height: '22px', borderRadius: '50%', 
                      backgroundColor: bgColor,
                      border: isSelected ? '2px solid white' : '1px solid var(--border-color)',
                      boxShadow: isSelected ? '0 0 10px var(--gold)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: isCompleted || isSkipped ? 'white' : 'var(--text-muted)'
                    }} 
                  >
                    {idx + 1}
                  </div>
                  {idx < assignment.tests.length - 1 && (
                    <div style={{ width: '10px', height: '2px', backgroundColor: 'var(--border-color)', marginLeft: '4px', marginRight: '4px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {phase === 'teaching' && (
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
              Reading Intel for <strong>Level {currentLevel}</strong>...
            </p>
            <button className="primary" onClick={startTesting} style={{ padding: '6px 12px', fontSize: '12px' }}>
              Accept Mission 🚀
            </button>
          </div>
        )}

        {phase === 'testing' && (
          <>
            {activeTest ? (
              <>
                <p style={{ fontSize: '15px', lineHeight: '1.4', margin: '10px 0', padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: '6px', borderLeft: '3px solid var(--gold)' }}>
                  {completedTests.includes(activeTest.id) && <span style={{ color: 'var(--success)', marginRight: '8px' }}>[COMPLETED]</span>}
                  <strong style={{ color: 'var(--gold)', textShadow: '0 0 10px var(--gold-glow)' }}>Challenge:</strong> {activeTest.prompt}
                </p>
                {verifyError && (
                  <div style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '8px', padding: '8px', backgroundColor: 'rgba(255, 77, 77, 0.1)', borderRadius: '4px' }}>
                    ❌ {verifyError}
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '12px', backgroundColor: 'var(--success-faint)', borderRadius: '6px', border: '1px solid var(--success)', color: 'var(--success)', fontSize: '14px' }}>
                ✅ Level Complete! You can click any circle in the tracker to re-attempt specific challenges.
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
        {phase === 'testing' && activeTest && (
          <>
            <button className="primary" onClick={handleVerify}>
              ✓ Verify Script
            </button>
            {!completedTests.includes(activeTest.id) && (
              <button onClick={() => skipTest(activeTest.id)}>
                ⏭ Skip Challenge
              </button>
            )}
            <button onClick={handleAskDataEngineer} style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
              🆘 Ask Data Engineer
            </button>
          </>
        )}
        <button onClick={onExit} style={{ marginTop: '10px', opacity: 0.7 }}>
          🚪 Leave Desk
        </button>
      </div>
    </div>
  );
}
