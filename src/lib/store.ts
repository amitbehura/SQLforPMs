import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurriculum } from '../data/assignments';

interface CurriculumState {
  role: string | null;
  lastActiveRole: string | null; // Track the role the progress belongs to
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

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set, get) => ({
      role: null,
      lastActiveRole: null,
      currentLevel: 1,
      phase: 'teaching',
      completedTests: [],
      skippedTests: [],

      setRole: (newRole) => set((state) => {
        // Case 1: Leaving the desk
        if (newRole === null) {
          return { role: null };
        }

        // Case 2: Selecting a role (either first time or returning)
        // Only reset if the new role is DIFFERENT from the last role we had progress in
        if (state.lastActiveRole !== null && state.lastActiveRole !== newRole) {
          return { 
            role: newRole, 
            lastActiveRole: newRole,
            currentLevel: 1, 
            phase: 'teaching', 
            completedTests: [], 
            skippedTests: [] 
          };
        }

        // Case 3: Returning to the same role or first time initialization
        return { role: newRole, lastActiveRole: newRole };
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
        if (!assignment) return;

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
    }),
    {
      name: 'paypaysql-storage',
    }
  )
);
