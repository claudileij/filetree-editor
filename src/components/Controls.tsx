import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Terminal, Power, RefreshCw, Square } from 'lucide-react';

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
    <div className={`flex flex-col ${className}`}>
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
      {isRunning && (
        <ScrollArea className="flex-1 bg-black p-2 text-sm font-mono text-green-500">
          {logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap">{log}</div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};