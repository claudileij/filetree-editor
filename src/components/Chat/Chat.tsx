
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useState, useRef, useEffect } from "react";
import { useDeepSeekStore, generateResponse, processCodeBlocks } from "@/lib/deepseek";
import { ApiKeyConfig } from "./ApiKeyConfig";
import { useToast } from "@/hooks/use-toast";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

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
      
      const responseContent = await generateResponse(apiMessagesToSend, apiKey);
      
      // Process the response to extract code blocks
      const { message: cleanedMessage, files } = processCodeBlocks(responseContent);
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: cleanedMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      // Handle generated files
      if (files.length > 0) {
        // In a real app, this would update the file system
        // Here we just show a notification
        toast({
          title: "Arquivos gerados",
          description: `${files.length} arquivo(s) foram gerados ou atualizados`
        });
        
        console.log("Generated files:", files);
        // In a complete implementation, we would update the file explorer and save the files
      }
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
      <ScrollArea className="flex-1 px-2" ref={scrollAreaRef}>
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
