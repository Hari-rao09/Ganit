
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

const ChatMessage = ({ content, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg max-w-[85%] mb-4 shadow-sm",
        isBot 
          ? "bg-blue-50 mr-auto border-l-4 border-blue-400" 
          : "bg-blue-100 ml-auto"
      )}
    >
      <div className="prose prose-sm">
        <Latex>{content}</Latex>
      </div>
    </div>
  );
};

export default ChatMessage;
