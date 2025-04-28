
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import ChatContainer from '@/components/ChatContainer';
import { generateMathResponse, fileToBase64, API_KEY } from '@/utils/api';
import type { Message } from '@/types/chat';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your math assistant. Ask me any math-related question, upload an image of a math problem, and I'll help solve it step by step.",
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPrompt = (userInput: string) => `You are a math assistant that explains and solves mathematical problems with clear, numbered steps. Format your response like this:

Step 1: [First step of the solution]
Step 2: [Second step]
Step 3: [Third step]
...etc.

Use LaTeX notation for mathematical expressions, wrapping them in $$ symbols.
Make each step clear and concise.
If there's a final answer, put it in the last step.

User question: ${userInput}

Provide a step-by-step solution following the format above.`;

  const handleSend = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { content: message, isBot: false }]);
      
      const botResponse = await generateMathResponse(createPrompt(message));
      setMessages((prev) => [...prev, { content: botResponse, isBot: true }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: "Failed to get response from Gemini. Please try again.",
        variant: "destructive",
      });
      
      setMessages((prev) => [
        ...prev, 
        { 
          content: "Sorry, I encountered an error processing your question. Please try again.", 
          isBot: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { 
        content: `Uploading image: ${file.name}`, 
        isBot: false 
      }]);
      
      const base64Image = await fileToBase64(file);
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
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
                    text: "You are a math assistant that solves problems from images. Extract the math problem from the image, then provide a step-by-step solution with clear explanations. Use LaTeX notation for equations where appropriate."
                  },
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: base64Image.split(',')[1]
                    }
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
                       "I couldn't extract or solve the math problem from this image. Please try a clearer image or type your question instead.";

      setMessages((prev) => [...prev, { content: botResponse, isBot: true }]);
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again with a clearer image.",
        variant: "destructive",
      });
      
      setMessages((prev) => [
        ...prev, 
        { 
          content: "Sorry, I couldn't process the image you uploaded. Please make sure it contains clear text of a math problem and try again.", 
          isBot: true 
        }
      ]);
    } finally {
      setIsLoading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-blue-900 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Math Assistant
            </CardTitle>
            <CardDescription className="text-blue-600">
              Ask any math question or upload an image of a math problem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatContainer
              messages={messages}
              onSend={handleSend}
              onImageUpload={handleFileUpload}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

