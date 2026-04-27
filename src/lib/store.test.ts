import { describe, it, expect, beforeEach } from 'vitest';
import { useCurriculumStore } from './store';

describe('useCurriculumStore', () => {
  beforeEach(() => {
    useCurriculumStore.getState().setRole(null);
    useCurriculumStore.getState().resetProgress();
  });

  it('should initialize with default values', () => {
    const state = useCurriculumStore.getState();
    expect(state.role).toBe(null);
    expect(state.currentLevel).toBe(1);
    expect(state.phase).toBe('teaching');
    expect(state.completedTests).toEqual([]);
  });

  it('should update role and reset level', () => {
    const { setRole } = useCurriculumStore.getState();
    
    setRole('PM');
    expect(useCurriculumStore.getState().role).toBe('PM');
    expect(useCurriculumStore.getState().currentLevel).toBe(1);
  });

  it('should handle startTesting', () => {
    const { startTesting } = useCurriculumStore.getState();
    startTesting();
    expect(useCurriculumStore.getState().phase).toBe('testing');
  });

  it('should reset progress correctly', () => {
    const { setRole, startTesting, resetProgress } = useCurriculumStore.getState();
    setRole('Analyst');
    startTesting();
    
    resetProgress();
    const state = useCurriculumStore.getState();
    expect(state.currentLevel).toBe(1);
    expect(state.phase).toBe('teaching');
    expect(state.completedTests).toEqual([]);
    expect(state.role).toBe('Analyst'); // Role should persist through resetProgress based on current impl
  });
});
