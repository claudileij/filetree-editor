
import React from 'react';
import { ChevronRight, ChevronDown, FileIcon, FolderIcon, Download } from 'lucide-react';
import JSZip from 'jszip';
import { Button } from './ui/button';

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

// Helper function to sort nodes (folders first, then files, both alphabetically)
const sortNodes = (nodes: FileNode[]): FileNode[] => {
  return [...nodes].sort((a, b) => {
    // If both are the same type, sort alphabetically
    if ((a.type === 'folder' && b.type === 'folder') || 
        (a.type !== 'folder' && b.type !== 'folder')) {
      return a.name.localeCompare(b.name);
    }
    // Folders come before files
    return a.type === 'folder' ? -1 : 1;
  });
};

const processFiles = (files: FileNode[]): FileNode[] => {
  return sortNodes(files.map(file => {
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
  }));
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
          {sortNodes(node.children).map((child, index) => (
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

  const handleDownloadZip = async () => {
    if (files.length === 0) return;
    
    const zip = new JSZip();
    
    // Recursive function to add files to zip
    const addToZip = (nodes: FileNode[], currentPath: string = '') => {
      nodes.forEach(node => {
        if (node.type === 'folder' && node.children) {
          // Create folder path
          const folderPath = `${currentPath}${node.name}/`;
          // Add folder's children
          addToZip(node.children, folderPath);
        } else if (node.content) {
          // Add file with its content
          const filePath = `${currentPath}${node.name}`;
          zip.file(filePath, node.content);
        }
      });
    };
    
    // Add all files to the zip
    addToZip(files);
    
    // Generate zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Create download link
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project-files.zip';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-vscode-border overflow-y-auto">
      <div className="p-2 text-sm font-medium text-vscode-text flex justify-between items-center">
        <span>EXPLORER</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDownloadZip}
          disabled={files.length === 0}
          title="Download as ZIP"
          className="h-6 w-6"
        >
          <Download size={16} />
        </Button>
      </div>
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
