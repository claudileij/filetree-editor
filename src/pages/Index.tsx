import React, { useState } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { Editor } from '@/components/Editor';

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
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      console.log('Selected file:', file.name);
      setSelectedFile(file);
    }
  };

  return (
    <div className="flex h-screen bg-vscode-bg">
      <FileExplorer files={sampleFiles} onFileSelect={handleFileSelect} />
      {selectedFile ? (
        <Editor content={selectedFile.content || ''} filename={selectedFile.name} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-vscode-text">
          Select a file to view its contents
        </div>
      )}
    </div>
  );
};

export default Index;