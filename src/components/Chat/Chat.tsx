import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Como posso ajudar você hoje? Estou aqui para auxiliar no desenvolvimento do seu código.",
    },
  ]);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newMessage]);

    // Simula resposta do assistente (aqui você integraria com sua API)
    const assistantMessage: Message = {
      role: "assistant",
      content: "Esta é uma resposta simulada. Integre com sua API de IA para respostas reais sobre desenvolvimento de código.",
    };
    
    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-vscode-border">
        <h2 className="text-lg font-semibold text-vscode-text">AI Code Assistant</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
        </div>
      </ScrollArea>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};