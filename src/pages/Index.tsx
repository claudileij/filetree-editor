import React, { useState } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { Editor } from '@/components/Editor';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

const sampleFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'App.tsx',
            type: 'file',
            content: 'function App() {\n  return <div>Hello World</div>;\n}'
          }
        ]
      },
      {
        name: 'main.tsx',
        type: 'file',
        content: 'import React from "react";\nimport ReactDOM from "react-dom";\n\nReactDOM.render(<App />, document.getElementById("root"));'
      }
    ]
  },
  {
    name: 'package.json',
    type: 'file',
    content: '{\n  "name": "vscode-web",\n  "version": "1.0.0"\n}'
  }
];

const Index = () => {
  const [files, setFiles] = useState<FileNode[]>(sampleFiles);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showExplorer, setShowExplorer] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      console.log('Selected file:', file.name);
      setSelectedFile(file);
      if (isMobile) {
        setShowExplorer(false);
      }
    }
  };

  const updateFileContent = (files: FileNode[], filename: string, newContent: string): FileNode[] => {
    return files.map(file => {
      if (file.type === 'file' && file.name === filename) {
        return { ...file, content: newContent };
      }
      if (file.type === 'folder' && file.children) {
        return {
          ...file,
          children: updateFileContent(file.children, filename, newContent)
        };
      }
      return file;
    });
  };

  const handleSave = (newContent: string) => {
    if (selectedFile) {
      setFiles(prevFiles => updateFileContent(prevFiles, selectedFile.name, newContent));
      // Aqui você pode adicionar a chamada para a API para salvar o arquivo
      console.log('Saving file to API:', selectedFile.name, newContent);
      toast({
        title: "Arquivo salvo",
        description: `${selectedFile.name} foi salvo com sucesso.`
      });
    }
  };

  return (
    <div className="flex h-screen bg-vscode-bg">
      {(showExplorer || !isMobile) && (
        <FileExplorer
          files={files}
          onFileSelect={handleFileSelect}
        />
      )}
      <div className="flex-1 flex flex-col">
        {isMobile && (
          <div className="bg-vscode-sidebar p-2 flex justify-between items-center">
            <button
              onClick={() => setShowExplorer(!showExplorer)}
              className="text-vscode-text hover:text-white"
            >
              {showExplorer ? 'Hide Explorer' : 'Show Explorer'}
            </button>
          </div>
        )}
        {selectedFile ? (
          <Editor
            content={selectedFile.content || ''}
            filename={selectedFile.name}
            onSave={handleSave}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-vscode-text">
            Select a file to view its contents
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;