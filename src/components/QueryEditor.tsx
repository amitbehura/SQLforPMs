import React, { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface QueryEditorProps {
  query: string;
  onChange: (value: string) => void;
  onExecute: () => void;
}

export function QueryEditor({ query, onChange, onExecute }: QueryEditorProps) {
  
  // Custom key handler to intercept Alt+Enter or Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.altKey || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }} onKeyDown={handleKeyDown}>
      <CodeMirror
        value={query}
        height="100%"
        theme={vscodeDark}
        extensions={[sql()]}
        onChange={onChange}
        style={{ height: '100%', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
        }}
      />
    </div>
  );
}
