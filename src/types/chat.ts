
export interface Message {
  content: string;
  isBot: boolean;
}

export interface ChatProps {
  messages: Message[];
  onSend: (message: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}
