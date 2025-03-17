
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useState } from "react";
import { useDeepSeekStore, generateResponse } from "@/lib/deepseek";
import { ApiKeyConfig } from "./ApiKeyConfig";

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
  const { apiKey } = useDeepSeekStore();

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = { 
      role: "user", 
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      // Prepare messages for the API format
      const apiMessages = messages
        .concat(newMessage)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Remove the first welcome message when sending to API
      const apiMessagesToSend = apiMessages.slice(1);
      
      const response = await generateResponse(apiMessagesToSend, apiKey);
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua solicitação.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
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
      <ApiKeyConfig />
      <div className="border-t border-[#333] bg-[#1E1E1E]">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};
