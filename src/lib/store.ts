import { create } from 'zustand';
import { getCurriculum } from '../data/assignments';

interface CurriculumState {
  role: string | null;
  currentLevel: number;
  phase: 'teaching' | 'testing';
  completedTests: string[];
  skippedTests: string[];
  setRole: (role: string | null) => void;
  startTesting: () => void;
  passTest: (testId: string) => void;
  skipTest: (testId: string) => void;
  jumpToLevel: (level: number) => void;
  resetProgress: () => void;
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  role: null,
  currentLevel: 1,
  phase: 'teaching',
  completedTests: [],
  skippedTests: [],

  setRole: (role) => set((state) => {
    if (state.role !== role) {
      return { role, currentLevel: 1, phase: 'teaching', completedTests: [], skippedTests: [] };
    }
    return { role };
  }),
  
  startTesting: () => set({ phase: 'testing' }),
  
  passTest: (testId) => {
    const state = get();
    const newCompleted = [...state.completedTests, testId];
    
    const curriculum = getCurriculum(state.role);
    const currentAssignment = curriculum.find(a => a.level === state.currentLevel);
    if (!currentAssignment) return;
    
    const allTestsForLevel = currentAssignment.tests.map(t => t.id);
    const completedAndSkipped = [...newCompleted, ...state.skippedTests];
    const finishedForLevel = completedAndSkipped.filter(id => allTestsForLevel.includes(id));
    
    if (finishedForLevel.length >= 3) {
      set({
        currentLevel: state.currentLevel + 1,
        phase: 'teaching',
        completedTests: newCompleted
      });
    } else {
      set({ completedTests: newCompleted });
    }
  },
  
  skipTest: (testId) => {
    const state = get();
    const newSkipped = [...state.skippedTests, testId];
    
    const curriculum = getCurriculum(state.role);
    const currentAssignment = curriculum.find(a => a.level === state.currentLevel);
    if (!currentAssignment) return;
    
    const allTestsForLevel = currentAssignment.tests.map(t => t.id);
    const completedAndSkipped = [...state.completedTests, ...newSkipped];
    const finishedForLevel = completedAndSkipped.filter(id => allTestsForLevel.includes(id));
    
    if (finishedForLevel.length >= 3) {
      set({
        currentLevel: state.currentLevel + 1,
        phase: 'teaching',
        skippedTests: newSkipped
      });
    } else {
      set({ skippedTests: newSkipped });
    }
  },

  jumpToLevel: (level) => {
    const state = get();
    const curriculum = getCurriculum(state.role);
    const assignment = curriculum.find(a => a.level === level);
    if (!assignment) return; // Prevent jumping to invalid levels

    const testsInLevel = assignment.tests.map(t => t.id);
    const newCompleted = state.completedTests.filter(id => !testsInLevel.includes(id));
    const newSkipped = state.skippedTests.filter(id => !testsInLevel.includes(id));

    set({
      currentLevel: level,
      phase: 'teaching',
      completedTests: newCompleted,
      skippedTests: newSkipped
    });
  },
  
  resetProgress: () => set({ currentLevel: 1, phase: 'teaching', completedTests: [], skippedTests: [] })
}));
