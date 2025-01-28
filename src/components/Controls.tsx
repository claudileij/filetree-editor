import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Terminal, Power, RefreshCw, Square, MessageSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Chat } from './Chat/Chat';

interface ControlsProps {
  className?: string;
}

export const Controls = ({ className }: ControlsProps) => {
  const [status, setStatus] = useState<'online' | 'offline'>('offline');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleStart = () => {
    setIsRunning(true);
    setStatus('online');
    setLogs(prev => [...prev, '> Starting server...', '> Initializing components...', '> Server is running on port 3000']);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStatus('offline');
    setLogs(prev => [...prev, '> Stopping server...', '> Server stopped']);
  };

  const handleRestart = () => {
    setLogs(prev => [...prev, '> Restarting server...']);
    handleStop();
    setTimeout(handleStart, 1000);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-2 p-2 bg-[#1E1E1E] border-b border-[#333]">
        <div className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleStart}
          disabled={isRunning}
          className="gap-1 bg-slate-700 hover:bg-slate-600 text-white"
        >
          <Power className="w-4 h-4" />
          Start
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRestart}
          disabled={!isRunning}
          className="gap-1 bg-slate-700 hover:bg-slate-600 text-white"
        >
          <RefreshCw className="w-4 h-4" />
          Restart
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleStop}
          disabled={!isRunning}
          className="gap-1 bg-slate-700 hover:bg-slate-600 text-white"
        >
          <Square className="w-4 h-4" />
          Stop
        </Button>
      </div>
      
      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="w-full bg-[#1E1E1E] border-b border-[#333] rounded-none">
          <TabsTrigger value="chat" className="flex-1 data-[state=active]:bg-[#2D2D2D]">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="terminal" className="flex-1 data-[state=active]:bg-[#2D2D2D]">
            <Terminal className="w-4 h-4 mr-2" />
            Terminal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 m-0 h-full">
          <Chat />
        </TabsContent>
        
        <TabsContent value="terminal" className="flex-1 m-0 h-full">
          <div className="h-full">
            {isRunning ? (
              <ScrollArea className="h-full bg-black p-2 text-sm font-mono text-green-500">
                {logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap">{log}</div>
                ))}
              </ScrollArea>
            ) : (
              <div className="h-full bg-black p-2 text-sm font-mono text-gray-500 flex items-center justify-center">
                Aguardando logs
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};