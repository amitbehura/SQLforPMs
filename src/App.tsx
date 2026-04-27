import { useState } from 'react';
import { OfficeGame } from './components/OfficeGame';
import { Workspace } from './components/Workspace';
import { SQLReferenceBook } from './components/SQLReferenceBook';
import { VictoryScreen } from './components/VictoryScreen';
import { useCurriculumStore } from './lib/store';
import { getCurriculum } from './data/assignments';
import { BookOpen } from 'lucide-react';

import './styles/theme.css';

export default function App() {
  const [showReference, setShowReference] = useState(false);
  const { currentLevel, role, setRole } = useCurriculumStore();

  const curriculum = getCurriculum(role);

  if (role && currentLevel > curriculum.length) {
    return <VictoryScreen onReset={() => setRole(null)} />;
  }

  return (
    <>

      {/* Global SQL Reference Button */}
      <button 
        className="reference-button"
        onClick={() => setShowReference(true)}
      >
        <BookOpen size={18} />
        SQL Survival Guide
      </button>

      {showReference && <SQLReferenceBook onClose={() => setShowReference(false)} />}

      {!role ? (
        <OfficeGame onSelectRole={setRole} />
      ) : (
        <Workspace role={role as any} onExit={() => setRole(null)} />
      )}
    </>
  );
}
