
import React from 'react';
import { ChevronRight, ChevronDown, FileIcon, FolderIcon } from 'lucide-react';

interface FileNode {
  name: string;
  content?: string;
  short_description?: string;
  type?: 'file' | 'folder';
  children?: FileNode[];
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
}

const processFiles = (files: FileNode[]): FileNode[] => {
  return files.map(file => {
    if (file.children) {
      return {
        ...file,
        type: 'folder',
        children: processFiles(file.children)
      };
    }
    return {
      ...file,
      type: 'file'
    };
  });
};

const FileExplorerItem = ({ node, level = 0, onFileSelect }: { node: FileNode; level?: number; onFileSelect: (file: FileNode) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 hover:bg-vscode-active/10 cursor-pointer text-vscode-text overflow-hidden`}
        style={{ paddingLeft: `${level * 1.2}rem` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="flex-shrink-0 mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {node.type === 'folder' ? (
          <FolderIcon size={16} className="flex-shrink-0 mr-2 text-yellow-400" />
        ) : (
          <FileIcon size={16} className="flex-shrink-0 mr-2" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div className="overflow-hidden">
          {node.children.map((child, index) => (
            <FileExplorerItem
              key={index}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect }) => {
  const processedFiles = processFiles(files);

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-vscode-border overflow-y-auto">
      <div className="p-2 text-sm font-medium text-vscode-text">EXPLORER</div>
      <div className="overflow-x-hidden">
        {processedFiles.length > 0 ? (
          processedFiles.map((file, index) => (
            <FileExplorerItem key={index} node={file} onFileSelect={onFileSelect} />
          ))
        ) : (
          <div className="p-3 text-sm text-gray-400 italic">
            Nenhum arquivo disponível. Faça uma pergunta que retorne código.
          </div>
        )}
      </div>
    </div>
  );
};
