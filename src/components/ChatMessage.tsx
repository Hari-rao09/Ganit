import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

const ChatMessage = ({ content, isBot }: ChatMessageProps) => {
  const formatSteps = (content: string) => {
    if (!isBot) return content;

    // Split content by step indicators
    const parts = content.split(/Step \d+:/);
    if (parts.length <= 1) return content;

    return parts.map((step, index) => {
      if (index === 0) return null; // Skip the content before first "Step"
      return (
        <div key={index} className="mb-4 last:mb-0 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium shadow-sm">
              {index}
            </div>
            <h3 className="font-medium text-indigo-900">Step {index}</h3>
          </div>
          <div className="pl-8">
            <Latex>{step.trim()}</Latex>
          </div>
          {index < parts.length - 1 && (
            <div className="pl-8 mt-4">
              <Separator className="bg-gradient-to-r from-indigo-100 to-blue-100" />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        "p-6 rounded-2xl max-w-[85%] mb-4 transition-all duration-300 transform hover:scale-[1.01]",
        isBot 
          ? "bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 mr-auto border-l-4 border-indigo-400 shadow-sm" 
          : "bg-gradient-to-r from-purple-50 to-indigo-50 ml-auto border-r-4 border-purple-400 shadow-sm"
      )}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className={cn(
          "p-2 rounded-full",
          isBot ? "bg-indigo-100" : "bg-purple-100"
        )}>
          {isBot ? (
            <Bot className="w-4 h-4 text-indigo-600" />
          ) : (
            <User className="w-4 h-4 text-purple-600" />
          )}
        </div>
        <div className={cn(
          "prose prose-sm max-w-none flex-1",
          isBot ? "prose-headings:text-indigo-900 prose-p:text-gray-700" : "prose-p:text-gray-600"
        )}>
          {isBot ? formatSteps(content) : <Latex>{content}</Latex>}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
