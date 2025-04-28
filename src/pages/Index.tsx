import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Calculator, Brain } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <div className="max-w-5xl mx-auto p-4 space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8 text-purple-400 animate-bounce" />
            <Brain className="w-8 h-8 text-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Sparkles className="w-8 h-8 text-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 drop-shadow-lg animate-gradient-move tracking-widest">
            <span className="inline-block animate-bounce-slow text-blue-400">G</span>
            <span className="inline-block animate-bounce-slower text-white">A</span>
            <span className="inline-block animate-bounce text-blue-400">N</span>
            <span className="inline-block animate-bounce-slow text-white">I</span>
            <span className="inline-block animate-bounce-slower text-blue-400">T</span>
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/10 via-transparent to-white/5" />
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              {/* Popping animated quotes/formulas */}
            </div>
            <p className="relative text-lg max-w-2xl mx-auto px-6 py-3 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/20">
              <span className="inline-block animate-typing overflow-hidden whitespace-nowrap border-r-2 border-r-purple-400 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">
                Ask me anything and you will learn something
              </span>
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-black/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 drop-shadow-lg">
              Ask Me Buddy.
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-blue-400 to-yellow-400 animate-pop">
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

