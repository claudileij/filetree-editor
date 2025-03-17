
import React, { useState, useCallback } from 'react';
import { FileExplorer, addFilesToExplorer } from '@/components/FileExplorer';
import { Editor } from '@/components/Editor';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Controls } from '@/components/Controls';
import { Chat } from '@/components/Chat/Chat';

interface FileNode {
  name: string;
  type?: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  short_description?: string;
}

// Criamos um evento personalizado para comunicação entre componentes
export const fileUpdateEvent = new EventTarget();

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

// Configuramos um listener global para atualizações de arquivos
// Isso permite que o Chat.tsx possa atualizar o Explorer
document.addEventListener('update-files', ((event: CustomEvent) => {
  const files = event.detail;
  if (files && Array.isArray(files)) {
    const updateEvent = new CustomEvent('explorer-update-files', { detail: files });
    fileUpdateEvent.dispatchEvent(updateEvent);
  }
}) as EventListener);

const Index = () => {
  const [files, setFiles] = useState<FileNode[]>(sampleFiles);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showExplorer, setShowExplorer] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Atualiza os arquivos quando recebemos eventos do Chat
  React.useEffect(() => {
    const handleFileUpdate = ((event: CustomEvent) => {
      const newFiles = event.detail;
      if (newFiles && Array.isArray(newFiles)) {
        setFiles(prevFiles => {
          const updatedFiles = addFilesToExplorer(newFiles, prevFiles);
          return updatedFiles;
        });
      }
    }) as EventListener;

    fileUpdateEvent.addEventListener('explorer-update-files', handleFileUpdate);
    
    return () => {
      fileUpdateEvent.removeEventListener('explorer-update-files', handleFileUpdate);
    };
  }, []);

  const handleFileSelect = useCallback((file: FileNode) => {
    if (file.type === 'file' || !file.type) {
      console.log('Selected file:', file.name);
      setSelectedFile(file);
      setActiveTab('editor');
      if (isMobile) {
        setShowExplorer(false);
      }
    }
  }, [isMobile]);

  const handleSave = useCallback((newContent: string) => {
    if (selectedFile) {
      console.log('Saving file:', selectedFile.name, newContent);
      
      // Atualiza o conteúdo do arquivo no estado
      setFiles(prevFiles => {
        const updateFileContent = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.name === selectedFile.name && node.type === 'file') {
              return { ...node, content: newContent };
            }
            
            if (node.children) {
              return { ...node, children: updateFileContent(node.children) };
            }
            
            return node;
          });
        };
        
        return updateFileContent(prevFiles);
      });
      
      // Atualiza também o arquivo selecionado para refletir mudanças
      setSelectedFile({ ...selectedFile, content: newContent });
      
      toast({
        title: "Arquivo salvo",
        description: `${selectedFile.name} foi salvo com sucesso.`
      });
    }
  }, [selectedFile, toast]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
      <header className="h-[60px] bg-[#252526] border-b border-[#333] flex items-center px-6">
        <h1 className="text-[#E2E8F0] font-inter text-xl font-semibold">AI Code Assistant</h1>
      </header>
      <div className="flex flex-1 h-[calc(100vh-60px)] overflow-hidden">
        <div className="w-[300px] flex-shrink-0 border-r border-[#333] flex flex-col">
          <Controls activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as 'editor' | 'chat')} />
        </div>
        <div className="flex-1 flex overflow-hidden">
          {(showExplorer || !isMobile) && (
            <div className="w-64 flex-shrink-0 h-full border-r border-[#333] overflow-hidden">
              <FileExplorer
                files={files}
                onFileSelect={handleFileSelect}
              />
            </div>
          )}
          <div className="flex-1 flex flex-col overflow-hidden">
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
            
            {activeTab === 'editor' ? (
              selectedFile ? (
                <Editor
                  content={selectedFile.content || ''}
                  filename={selectedFile.name}
                  onSave={handleSave}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#E2E8F0]">
                  Select a file to view its contents
                </div>
              )
            ) : (
              <Chat />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
