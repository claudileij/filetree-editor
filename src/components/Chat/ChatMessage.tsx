import { User2, Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export const ChatMessage = ({ content, role, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        {role === "user" ? (
          <User2 className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-primary-foreground" />
        )}
      </div>
      <div className={`flex flex-col gap-1 max-w-[80%]`}>
        <div className={`rounded-xl px-4 py-3 ${
          role === "user" 
            ? "bg-[#3B82F6] text-[#FFFFFF]" 
            : "bg-[#334155] text-[#E2E8F0]"
        }`}>
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        <span className="text-[12px] text-[#64748B] px-2">
          {timestamp}
        </span>
      </div>
    </div>
  );
};