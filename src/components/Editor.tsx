import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import { useIsMobile } from '@/hooks/use-mobile';
import { Textarea } from './ui/textarea';

interface EditorProps {
  content: string;
  filename: string;
  onSave?: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content: initialContent, filename, onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('File changed, updating content:', filename);
    setContent(initialContent);
    setIsEditing(false);
  }, [initialContent, filename]);

  useEffect(() => {
    if (!isEditing) {
      Prism.highlightAll();
    }
  }, [content, isEditing]);

  const getLanguage = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'jsx':
        return 'jsx';
      case 'tsx':
        return 'tsx';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'typescript';
    }
  };

  const handleSave = () => {
    console.log('Saving file:', filename);
    onSave?.(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div 
      className="flex-1 h-full overflow-hidden flex flex-col"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-vscode-sidebar px-4 py-2 text-vscode-text border-b border-vscode-border flex justify-between items-center">
        <span className="truncate">{filename}</span>
        <div className="flex gap-2 flex-shrink-0">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-2 py-1 text-sm bg-vscode-active text-white rounded hover:bg-vscode-active/80"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-sm bg-vscode-active text-white rounded hover:bg-vscode-active/80"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className={`flex-1 p-4 overflow-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full font-mono bg-vscode-bg text-vscode-text resize-none focus:outline-none focus:ring-1 focus:ring-vscode-active"
          />
        ) : (
          <pre className="text-vscode-text font-mono whitespace-pre-wrap break-words max-w-full overflow-x-hidden">
            <code className={`language-${getLanguage(filename)}`}>
              {content}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};