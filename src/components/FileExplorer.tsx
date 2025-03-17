
import React, { useState, useEffect } from 'react';
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
  onFilesUpdate?: (files: FileNode[]) => void;
}

// Função para converter um caminho de arquivo em uma estrutura de nós
export const pathToFileNodes = (path: string, content: string, existingFiles: FileNode[] = []): FileNode[] => {
  const parts = path.split('/');
  const fileName = parts.pop() || '';
  
  // Se não tem mais diretórios no caminho, adicione o arquivo
  if (parts.length === 0) {
    const newFiles = [...existingFiles];
    const existingFileIndex = newFiles.findIndex(f => f.name === fileName && f.type === 'file');
    
    // Atualiza o arquivo se ele já existir, ou adiciona um novo
    if (existingFileIndex >= 0) {
      newFiles[existingFileIndex] = {
        ...newFiles[existingFileIndex],
        content,
        type: 'file'
      };
    } else {
      newFiles.push({
        name: fileName,
        content,
        type: 'file'
      });
    }
    
    return newFiles;
  }
  
  // Caso contrário, navegue pela árvore de diretórios
  const dirName = parts[0];
  const remainingPath = parts.slice(1).join('/') + '/' + fileName;
  
  const newFiles = [...existingFiles];
  let dir = newFiles.find(f => f.name === dirName && f.type === 'folder');
  
  if (!dir) {
    // Cria o diretório se ele não existir
    dir = {
      name: dirName,
      type: 'folder',
      children: []
    };
    newFiles.push(dir);
  }
  
  // Garante que children existe
  if (!dir.children) {
    dir.children = [];
  }
  
  // Recursivamente adiciona o arquivo no subdiretório
  dir.children = pathToFileNodes(remainingPath, content, dir.children);
  
  return newFiles;
};

// Função para adicionar vários arquivos à estrutura existente
export const addFilesToExplorer = (files: { path: string, content: string }[], existingFiles: FileNode[]): FileNode[] => {
  let updatedFiles = [...existingFiles];
  
  files.forEach(file => {
    updatedFiles = pathToFileNodes(file.path, file.content, updatedFiles);
  });
  
  return updatedFiles;
};

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

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect, onFilesUpdate }) => {
  const [processedFiles, setProcessedFiles] = useState<FileNode[]>([]);
  
  useEffect(() => {
    const processed = processFiles(files);
    setProcessedFiles(processed);
    console.log('Processed files:', processed);
  }, [files]);

  return (
    <div className="w-full h-full bg-vscode-sidebar border-r border-vscode-border flex flex-col">
      <div className="p-2 text-sm font-medium text-vscode-text">EXPLORER</div>
      <div className="flex-1 overflow-y-auto">
        {processedFiles.map((file, index) => (
          <FileExplorerItem key={index} node={file} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
};
