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
  // Create a root map to store our file tree
  const rootMap: Record<string, FileNode> = {};
  
  files.forEach(file => {
    const pathParts = file.name.split('/').filter(part => part !== '');
    
    // If it's a file at the root level (no directories)
    if (pathParts.length === 1) {
      const fileName = pathParts[0];
      rootMap[fileName] = {
        name: fileName,
        type: 'file',
        content: file.content
      };
      return;
    }
    
    // Handle files in subdirectories
    let currentPath = '';
    let currentMap = rootMap;
    
    // Process directories in the path
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      // Create directory if it doesn't exist
      if (!currentMap[part]) {
        currentMap[part] = {
          name: part,
          type: 'folder',
          children: []
        };
      } else if (!currentMap[part].children) {
        // Ensure children array exists
        currentMap[part].children = [];
      }
      
      // Move into the children map
      const folderNode = currentMap[part];
      if (!folderNode.children) folderNode.children = [];
      
      // Create a new map for this level if needed
      currentMap = folderNode.children.reduce((map, child) => {
        map[child.name] = child;
        return map;
      }, {} as Record<string, FileNode>);
    }
    
    // Add the file to the last directory
    const fileName = pathParts[pathParts.length - 1];
    const fileNode: FileNode = {
      name: fileName,
      type: 'file',
      content: file.content
    };
    
    // Get the parent folder name
    const parentFolder = pathParts[pathParts.length - 2];
    
    // Find the parent folder in the current map
    const parentNode = rootMap[parentFolder] || 
                       Object.values(currentMap).find(node => node.name === parentFolder);
    
    if (parentNode && parentNode.children) {
      parentNode.children.push(fileNode);
    } else {
      // If we couldn't find the parent, add it to the root
      rootMap[fileName] = fileNode;
    }
  });
  
  // Convert rootMap to array and return
  return Object.values(rootMap);
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
