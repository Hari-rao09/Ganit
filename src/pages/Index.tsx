
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

  // WARNING: This is not secure and only for demonstration purposes
  // In a production environment, this API key should be stored securely on a backend
  const API_KEY = "AIzaSyCH_Z4QbjfvJ9kRAPCi-7xxLc6aPr460hY"; // This should NOT be in client-side code

  const handleSend = async (message: string) => {
    try {
      setIsLoading(true);
      // Add user message to chat
      setMessages((prev) => [...prev, { content: message, isBot: false }]);

      // Call Gemini API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a math assistant that explains mathematical concepts. Use LaTeX notation for equations where appropriate.
                    
                    User question: ${message}
                    
                    Provide a detailed explanation with LaTeX notation for mathematical expressions. Format complex equations on their own lines using $$ notation.`
                  }
                ]
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                          "I couldn't process that. Could you try asking another math question?";

      // Add bot response to chat
      setMessages((prev) => [...prev, { content: botResponse, isBot: true }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: "Failed to get response from Gemini. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback response
      setMessages((prev) => [
        ...prev, 
        { 
          content: "Sorry, I encountered an error. Please try asking another question.", 
          isBot: true 
        }
      ]);
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
