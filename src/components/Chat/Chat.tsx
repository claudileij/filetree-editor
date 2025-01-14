import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { MessageCircle, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Como posso ajudar você hoje?",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newMessage]);

    // Simula resposta do assistente (aqui você integraria com sua API)
    const assistantMessage: Message = {
      role: "assistant",
      content: "Esta é uma resposta simulada. Integre com sua API para respostas reais.",
    };
    
    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Chat Assistant</SheetTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
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
      </SheetContent>
    </Sheet>
  );
};