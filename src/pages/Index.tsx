
import React, { useState } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { Editor } from '@/components/Editor';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';
import { Controls } from '@/components/Controls';

interface FileNode {
  name: string;
  type?: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  short_description?: string;
}

const sampleFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          {
            name: "App.tsx",
            content: "function App() {\n  return <div>Hello World</div>;\n}",
            short_description: "The functions thats return React component"
          }
        ]
      },
      {
        name: "main.tsx",
        content: "import React from 'react';\nimport ReactDOM from 'react-dom';\n\nReactDOM.render(<App />, document.getElementById('root'));",
        short_description: "The main file to render ReactDOM"
      }
    ]
  },
  {
    name: "package.json",
    content: "{\n  \"name\": \"vscode-web\",\n  \"version\": \"1.0.0\"\n}",
    short_description: "Packages to install with npm install command"
  }
];

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showExplorer, setShowExplorer] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file' || !file.type) {
      console.log('Selected file:', file.name);
      setSelectedFile(file);
      if (isMobile) {
        setShowExplorer(false);
      }
    }
  };

  const handleSave = (newContent: string) => {
    if (selectedFile) {
      console.log('Saving file:', selectedFile.name, newContent);
      toast({
        title: "Arquivo salvo",
        description: `${selectedFile.name} foi salvo com sucesso.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
      <header className="h-[60px] bg-[#252526] border-b border-[#333] flex items-center px-6">
        <h1 className="text-[#E2E8F0] font-inter text-xl font-semibold">AI Code Assistant</h1>
      </header>
      <div className="flex flex-1 h-[calc(100vh-60px)] overflow-hidden">
        <div className="w-[300px] flex-shrink-0 border-r border-[#333] flex flex-col h-full">
          <Controls />
        </div>
        <div className="flex-1 flex h-full overflow-hidden">
          {(showExplorer || !isMobile) && (
            <FileExplorer
              files={sampleFiles}
              onFileSelect={handleFileSelect}
            />
          )}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {isMobile && (
              <div className="bg-[#252526] p-2 flex justify-between items-center">
                <button
                  onClick={() => setShowExplorer(!showExplorer)}
                  className="text-[#E2E8F0] hover:text-white"
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
              <div className="flex-1 flex items-center justify-center text-[#E2E8F0]">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
