import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Workspace } from './Workspace';

// Mock the child components and hooks
vi.mock('./DatabaseNavigator', () => ({
  DatabaseNavigator: () => <div data-testid="db-nav">DB Nav</div>
}));
vi.mock('./QueryEditor', () => ({
  QueryEditor: () => <div data-testid="query-editor">Query Editor</div>
}));
vi.mock('./ResultsPanel', () => ({
  ResultsPanel: () => <div data-testid="results-panel">Results Panel</div>
}));
vi.mock('./CurriculumPanel', () => ({
  CurriculumPanel: () => <div data-testid="curriculum-panel">Curriculum Panel</div>
}));
vi.mock('./TeachingModal', () => ({
  TeachingModal: () => <div data-testid="teaching-modal">Teaching Modal</div>
}));
vi.mock('./MissionIntelTab', () => ({
  MissionIntelTab: () => <div data-testid="mission-intel">Mission Intel</div>
}));

// Mock the database library
vi.mock('../lib/db', () => ({
  getDb: vi.fn().mockResolvedValue({
    query: vi.fn().mockResolvedValue({ rows: [], fields: [] })
  })
}));

describe('Workspace', () => {
  it('renders correctly once DB is ready', async () => {
    render(<Workspace role="PM" onExit={() => {}} />);
    
    // Should show loading initially
    expect(screen.getByText(/Initializing Database/i)).toBeDefined();
    
    // Should show workspace components after mock DB resolves
    await waitFor(() => {
      expect(screen.getByTestId('db-nav')).toBeDefined();
      expect(screen.getByTestId('curriculum-panel')).toBeDefined();
      expect(screen.getByTestId('teaching-modal')).toBeDefined();
    });
  });

  it('shows mission intel by default', async () => {
    render(<Workspace role="PM" onExit={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('mission-intel')).toBeDefined();
    });
  });
});
