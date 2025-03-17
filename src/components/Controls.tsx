
import React from 'react';
import { TerminalIcon, MessageSquareIcon } from 'lucide-react';

interface ControlsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({ activeTab = 'editor', onTabChange }) => {
  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 text-[#E2E8F0] font-inter text-sm font-semibold">CONTROLS</div>
      <div className="flex flex-col">
        <button
          className={`flex items-center gap-2 p-3 text-sm ${
            activeTab === 'editor'
              ? 'bg-[#1F2937] text-white'
              : 'hover:bg-[#1F2937]/50 text-[#E2E8F0]'
          }`}
          onClick={() => handleTabChange('editor')}
        >
          <TerminalIcon size={16} />
          <span>Terminal</span>
        </button>
        <button
          className={`flex items-center gap-2 p-3 text-sm ${
            activeTab === 'chat'
              ? 'bg-[#1F2937] text-white'
              : 'hover:bg-[#1F2937]/50 text-[#E2E8F0]'
          }`}
          onClick={() => handleTabChange('chat')}
        >
          <MessageSquareIcon size={16} />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
};
