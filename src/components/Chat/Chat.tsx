import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
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
      content: "Olá! Como posso ajudar você hoje? Estou aqui para auxiliar no desenvolvimento do seu código.",
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

    // Simula resposta do assistente (aqui você integraria com sua API)
    const assistantMessage: Message = {
      role: "assistant",
      content: "Esta é uma resposta simulada. Integre com sua API de IA para respostas reais sobre desenvolvimento de código.",
      timestamp: new Date().toLocaleTimeString()
    };
    
    setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#020617]">
      <ScrollArea className="flex-1 px-4" style={{ scrollbarGutter: 'stable' }}>
        <div className="flex flex-col gap-4 py-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex gap-2 items-center p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-[#334155] bg-[#1E293B]">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};