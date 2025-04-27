
import { useState } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  content: string;
  isBot: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your math assistant. Ask me any math-related question, and I'll explain it using mathematical notation and clear explanations.",
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async (message: string) => {
    try {
      setIsLoading(true);
      // Add user message to chat
      setMessages((prev) => [...prev, { content: message, isBot: false }]);

      // For now, we'll use a placeholder response until you connect Gemini
      const response = "Let me explain this mathematically:\n When we consider the quadratic equation $ax^2 + bx + c = 0$, we can find its solutions using the quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$";
      
      // Add bot response to chat
      setMessages((prev) => [...prev, { content: response, isBot: true }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Math Assistant</h1>
        <p className="text-gray-600">Ask me anything about mathematics</p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isBot={message.isBot}
          />
        ))}
      </div>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default Index;
