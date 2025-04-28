
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
        <div key={index} className="mb-4 last:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
              {index}
            </div>
            <h3 className="font-medium text-blue-900">Step {index}</h3>
          </div>
          <div className="pl-8">
            <Latex>{step.trim()}</Latex>
          </div>
          {index < parts.length - 1 && (
            <div className="pl-8 mt-4">
              <Separator className="bg-blue-100" />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        "p-6 rounded-2xl max-w-[85%] mb-4 transition-all duration-200 hover:shadow-lg",
        isBot 
          ? "bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 mr-auto border-l-4 border-blue-400" 
          : "bg-gradient-to-r from-indigo-50 to-purple-50 ml-auto"
      )}
    >
      <div className={cn(
        "prose prose-sm max-w-none",
        isBot ? "prose-headings:text-blue-900 prose-p:text-gray-700" : "prose-p:text-gray-600"
      )}>
        {isBot ? formatSteps(content) : <Latex>{content}</Latex>}
      </div>
    </div>
  );
};

export default ChatMessage;
