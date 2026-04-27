import React from 'react';

interface ResultsPanelProps {
  results: any[] | null;
  columns: string[] | null;
  error: string | null;
}

export function ResultsPanel({ results, columns, error }: ResultsPanelProps) {
  if (error) {
    return (
      <div style={{ padding: '16px', color: 'var(--error)', fontFamily: 'var(--font-mono)' }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!results || !columns) {
    return (
      <div style={{ padding: '16px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        No results yet. Run a query using Alt+Enter.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ padding: '16px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Query returned 0 rows.
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>#</th>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{rowIdx + 1}</td>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {row[col] === null ? <span style={{ color: 'var(--text-muted)' }}>null</span> : String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
