import { useState, useRef } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  content: string;
  isBot: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your math assistant. Ask me any math-related question, upload an image of a math problem, and I'll help solve it step by step.",
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_KEY = "AIzaSyCH_Z4QbjfvJ9kRAPCi-7xxLc6aPr460hY";

  const handleSend = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { content: message, isBot: false }]);

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
                    text: `You are a math assistant that explains and solves mathematical problems. Use LaTeX notation for equations where appropriate.
                    
                    User question: ${message}
                    
                    Provide a step-by-step solution with clear explanations. Format complex equations using $$ notation. If applicable, include a final answer clearly marked.`
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
          <CardContent className="space-y-6">
            <ScrollArea className="h-[60vh] px-4 rounded-lg border bg-white">
              <div className="space-y-4 p-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    content={message.content}
                    isBot={message.isBot}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4">
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={triggerFileInput}
                  disabled={isLoading}
                  className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
