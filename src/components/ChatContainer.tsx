import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon } from 'lucide-react';
import type { ChatProps } from '@/types/chat';

const ChatContainer = ({ messages, onSend, onImageUpload, isLoading }: ChatProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <ScrollArea 
        ref={scrollAreaRef}
        className="h-[60vh] px-4 rounded-lg border bg-white/50 backdrop-blur-sm"
      >
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
            className="flex items-center gap-2 hover:bg-indigo-50 transition-all duration-300 border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-300"
          >
            <ImageIcon className="w-4 h-4" />
            Upload Math Problem Image
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={onImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
