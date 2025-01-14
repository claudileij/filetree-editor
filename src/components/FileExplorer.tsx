import React from 'react';
import { ChevronRight, ChevronDown, FileIcon, FolderIcon } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
}

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
        className={`flex items-center px-2 py-1 hover:bg-vscode-active/10 cursor-pointer text-vscode-text`}
        style={{ paddingLeft: `${level * 1.2}rem` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {node.type === 'folder' ? (
          <FolderIcon size={16} className="mr-2 text-yellow-400" />
        ) : (
          <FileIcon size={16} className="mr-2" />
        )}
        <span>{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
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
  return (
    <div className="w-64 bg-vscode-sidebar border-r border-vscode-border h-full overflow-y-auto">
      <div className="p-2 text-sm font-medium text-vscode-text">EXPLORER</div>
      <div>
        {files.map((file, index) => (
          <FileExplorerItem key={index} node={file} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
};