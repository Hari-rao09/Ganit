
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
        "p-4 rounded-2xl max-w-[85%] mb-4 transition-all duration-200 hover:shadow-md",
        isBot 
          ? "bg-gradient-to-r from-blue-50 to-blue-100 mr-auto border-l-4 border-blue-400" 
          : "bg-gradient-to-r from-indigo-50 to-indigo-100 ml-auto"
      )}
    >
      <div className="prose prose-sm prose-blue max-w-none">
        <Latex>{content}</Latex>
      </div>
    </div>
  );
};

export default ChatMessage;
