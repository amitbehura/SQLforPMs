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

  // Find the first test that is neither completed nor skipped
  const currentTest = assignment.tests.find(t => !completedTests.includes(t.id) && !skippedTests.includes(t.id));

  useEffect(() => {
    setVerifyError(null);
  }, [currentTest?.id]);

  const handleVerify = async () => {
    setVerifyError(null);
    if (!activeQuery || !activeQuery.trim()) {
      setVerifyError("Your query is completely empty. Write some SQL!");
      return;
    }
    
    if (!currentTest) return;

    try {
      const db = await getDb();
      const userRes = await db.query(activeQuery);
      const solutionRes = await db.query(currentTest.solutionQuery);

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

      passTest(currentTest.id);

    } catch (e: any) {
      setVerifyError("SQL Error: " + e.message);
    }
  };

  const handleAskDataEngineer = () => {
    if (currentTest) {
      onFillQuery(currentTest.solutionQuery);
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
              const isCurrent = currentTest?.id === t.id;
              
              let bgColor = 'var(--bg-active)';
              if (isCompleted) bgColor = 'var(--success)';
              else if (isSkipped) bgColor = 'var(--warning)';
              else if (isCurrent) bgColor = 'var(--accent-color)';

              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div title={t.prompt} style={{ 
                    width: '14px', height: '14px', borderRadius: '50%', 
                    backgroundColor: bgColor,
                    border: isCurrent ? '2px solid white' : '1px solid var(--border-color)',
                    boxShadow: isCurrent ? '0 0 8px var(--accent-color)' : 'none'
                  }} />
                  {idx < assignment.tests.length - 1 && (
                    <div style={{ width: '10px', height: '2px', backgroundColor: 'var(--border-color)', marginLeft: '8px' }} />
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
            {currentTest ? (
              <>
                <p style={{ fontSize: '15px', lineHeight: '1.4', margin: '10px 0', padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: '6px', borderLeft: '3px solid var(--accent-color)' }}>
                  <strong>Challenge:</strong> {currentTest.prompt}
                </p>
                {verifyError && (
                  <div style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '8px', padding: '8px', backgroundColor: 'rgba(255, 77, 77, 0.1)', borderRadius: '4px' }}>
                    ❌ {verifyError}
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '12px', backgroundColor: 'var(--success-faint)', borderRadius: '6px', border: '1px solid var(--success)', color: 'var(--success)', fontSize: '14px' }}>
                ✅ Level Complete! Use the dropdown or tracker above to navigate.
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
        {phase === 'testing' && currentTest && (
          <>
            <button className="primary" onClick={handleVerify}>
              ✓ Verify Script
            </button>
            <button onClick={() => skipTest(currentTest.id)}>
              ⏭ Skip Challenge
            </button>
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
