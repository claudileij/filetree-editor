import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Como posso ajudar você hoje?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = { 
      role: "user", 
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Esta é uma resposta simulada.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E]">
      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-2 py-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex gap-1 items-center p-2">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-[#333] bg-[#1E1E1E]">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};