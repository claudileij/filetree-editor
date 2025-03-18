
import React, { useState, useEffect } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { Editor } from '@/components/Editor';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Controls } from '@/components/Controls';
import { FILE_UPDATE_EVENT } from '@/components/Chat/Chat';
import { DeepSeekFile } from '@/lib/deepseek';

interface FileNode {
  name: string;
  type?: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  short_description?: string;
}

// Helper function to convert DeepSeek files to FileNode structure
const convertToFileTree = (files: DeepSeekFile[]): FileNode[] => {
  const rootNode: { [key: string]: FileNode } = {};
  
  files.forEach(file => {
    const pathParts = file.name.split('/').filter(part => part !== '');
    let currentLevel = rootNode;
    
    // Process path parts except the last one (filename)
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!currentLevel[part]) {
        currentLevel[part] = {
          name: part,
          type: 'folder',
          children: []
        };
      }
      if (!currentLevel[part].children) {
        currentLevel[part].children = [];
      }
      currentLevel = currentLevel[part].children as { [key: string]: FileNode };
    }
    
    // Add the file to the last directory
    const fileName = pathParts[pathParts.length - 1];
    const fileNode: FileNode = {
      name: fileName,
      type: 'file',
      content: file.content
    };
    
    // If there's only one part (file at root level)
    if (pathParts.length === 1) {
      rootNode[fileName] = fileNode;
    } else {
      // Get parent folder and add file to its children
      const parentFolder = pathParts[pathParts.length - 2];
      if (currentLevel[parentFolder] && currentLevel[parentFolder].children) {
        (currentLevel[parentFolder].children as FileNode[]).push(fileNode);
      } else if (currentLevel instanceof Array) {
        currentLevel.push(fileNode);
      }
    }
  });
  
  // Convert object to array
  return Object.values(rootNode);
};

const Index = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showExplorer, setShowExplorer] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Listen for file updates from the Chat component
  useEffect(() => {
    const handleFileUpdate = (event: CustomEvent<{files: DeepSeekFile[]}>) => {
      const newFiles = event.detail.files;
      
      // Convert received files to the file tree structure
      const fileTree = convertToFileTree(newFiles);
      
      setFiles(prevFiles => {
        // Merge with existing files, replacing any with the same name
        const updatedFiles = [...prevFiles];
        
        fileTree.forEach(newFile => {
          const existingFileIndex = updatedFiles.findIndex(f => f.name === newFile.name);
          if (existingFileIndex >= 0) {
            updatedFiles[existingFileIndex] = newFile;
          } else {
            updatedFiles.push(newFile);
          }
        });
        
        return updatedFiles;
      });
      
      toast({
        title: "Arquivos recebidos",
        description: `${newFiles.length} arquivo(s) foram adicionados ao explorador.`
      });
    };
    
    window.addEventListener(FILE_UPDATE_EVENT, handleFileUpdate as EventListener);
    return () => {
      window.removeEventListener(FILE_UPDATE_EVENT, handleFileUpdate as EventListener);
    };
  }, [toast]);

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
      
      // Update the content of the selected file
      setFiles(prevFiles => {
        // Find and update the file in the tree structure
        const updateFileContent = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node === selectedFile) {
              return { ...node, content: newContent };
            } else if (node.children) {
              return { ...node, children: updateFileContent(node.children) };
            }
            return node;
          });
        };
        
        return updateFileContent(prevFiles);
      });
      
      // Update the selected file reference
      setSelectedFile({ ...selectedFile, content: newContent });
      
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
        <div className="w-[300px] flex-shrink-0 border-r border-[#333] flex flex-col">
          <Controls />
        </div>
        <div className="flex-1 flex">
          {(showExplorer || !isMobile) && (
            <div className="flex flex-col h-full border-r border-[#333]">
              <FileExplorer
                files={files}
                onFileSelect={handleFileSelect}
              />
            </div>
          )}
          <div className="flex-1 flex flex-col">
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
