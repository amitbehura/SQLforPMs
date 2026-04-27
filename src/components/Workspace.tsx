import React, { useState, useEffect } from 'react';
import { DatabaseNavigator } from './DatabaseNavigator';
import { QueryEditor } from './QueryEditor';
import { ResultsPanel } from './ResultsPanel';
import { CurriculumPanel } from './CurriculumPanel';
import { TeachingModal } from './TeachingModal';
import { MissionIntelTab } from './MissionIntelTab';
import { getDb } from '../lib/db';
import { Play, Plus, X, Database, Table2 } from 'lucide-react';

type Role = 'Analyst' | 'PM' | 'Stakeholder';

interface Tab {
  id: string;
  name: string;
  query: string;
  results: Record<string, unknown>[] | null;
  columns: string[] | null;
  error: string | null;
}

export function Workspace({ role, onExit }: { role: Role; onExit: () => void }) {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'tutorial', name: '📖 Mission Intel', query: '', results: null, columns: null, error: null },
    { id: '1', name: 'SQL Script 1', query: '', results: null, columns: null, error: null }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tutorial');

  useEffect(() => {
    getDb().then(() => setDbReady(true)).catch(err => setDbError(err.message));
  }, []);

  const handleAddTab = () => {
    if (tabs.length >= 6) {
      alert('Max 6 tabs allowed.');
      return;
    }
    const newId = Date.now().toString();
    setTabs([...tabs, { id: newId, name: `SQL Script ${tabs.length + 1}`, query: '', results: null, columns: null, error: null }]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === 'tutorial') return; // Don't close tutorial tab
    if (tabs.length === 2 && tabs.find(t => t.id === 'tutorial')) return; // Don't close last SQL script

    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleQueryChange = (id: string, query: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, query } : t));
  };

  const executeQuery = async (id: string) => {
    const tab = tabs.find(t => t.id === id);
    if (!tab || !tab.query.trim()) return;

    try {
      const db = await getDb();
      const res = await db.query(tab.query);
      
      setTabs(tabs.map(t => t.id === id ? {
        ...t,
        results: res.rows,
        columns: res.fields.map(f => f.name),
        error: null
      } : t));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setTabs(tabs.map(t => t.id === id ? {
        ...t,
        results: null,
        columns: null,
        error: errorMessage
      } : t));
    }
  };

  if (dbError) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'var(--bg-dark)', color: 'var(--error)' }}>Database Error: {dbError}</div>;
  }

  if (!dbReady) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'var(--bg-dark)' }}>Initializing Database...</div>;
  }

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      <TeachingModal />
      {/* Top Header / Curriculum Panel */}
      <div style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <CurriculumPanel role={role} onExit={onExit} activeQuery={activeTab.query} onFillQuery={(q) => handleQueryChange(activeTab.id, q)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1" style={{ overflow: 'hidden' }}>
        
        {/* Left Panel: Database Navigator */}
        <div style={{ width: '250px', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            Database Navigator
          </div>
          <DatabaseNavigator />
        </div>

        {/* Right Panel: Editors and Results */}
        <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
          
          {/* Query Editor Section */}
          <div style={{ height: activeTabId === 'tutorial' ? '100%' : '50%', display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', transition: 'height 0.2s ease' }}>
            <div className="tabs-header">
              {tabs.map(t => (
                <div key={t.id} className={`tab ${activeTabId === t.id ? 'active' : ''}`} onClick={() => setActiveTabId(t.id)}>
                  <Table2 size={14} /> {t.name}
                  {t.id !== 'tutorial' && tabs.length > 2 && (
                    <span className="tab-close" onClick={(e) => handleCloseTab(t.id, e)}>
                      <X size={12} />
                    </span>
                  )}
                </div>
              ))}
              <div className="tab" style={{ minWidth: '40px', justifyContent: 'center' }} onClick={handleAddTab}>
                <Plus size={16} />
              </div>
            </div>
            
            <div className="flex-1" style={{ position: 'relative', overflow: 'hidden' }}>
              {activeTabId === 'tutorial' ? (
                <MissionIntelTab />
              ) : (
                <>
                  <QueryEditor 
                    query={activeTab.query} 
                    onChange={(q) => handleQueryChange(activeTab.id, q)} 
                    onExecute={() => executeQuery(activeTab.id)}
                  />
                  <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 10 }}>
                    <button className="primary" onClick={() => executeQuery(activeTab.id)} style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                      <Play size={14} fill="currentColor" /> Run Script (Alt+Enter)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results Section */}
          {activeTabId !== 'tutorial' && (
            <div style={{ height: '50%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)' }}>
              <div className="tabs-header">
                <div className="tab active"><Database size={14} /> Results ({activeTab.name})</div>
              </div>
              <div className="flex-1" style={{ overflow: 'hidden' }}>
                <ResultsPanel 
                  results={activeTab.results} 
                  columns={activeTab.columns} 
                  error={activeTab.error} 
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
