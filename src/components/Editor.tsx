import React from 'react';

interface EditorProps {
  content: string;
  filename: string;
}

export const Editor: React.FC<EditorProps> = ({ content, filename }) => {
  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col">
      <div className="bg-vscode-sidebar px-4 py-2 text-vscode-text border-b border-vscode-border">
        {filename}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className="text-vscode-text font-mono text-sm whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
};