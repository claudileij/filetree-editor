import { User2, Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export const ChatMessage = ({ content, role }: ChatMessageProps) => {
  return (
    <div className="flex gap-3 p-4">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        {role === "user" ? (
          <User2 className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-primary-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};