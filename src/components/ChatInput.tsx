
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t rounded-lg shadow-sm bg-white">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your math question here..."
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !message.trim()}>
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        Send
      </Button>
    </form>
  );
};

export default ChatInput;
