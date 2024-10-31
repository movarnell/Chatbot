import { useEffect, useRef } from 'react';
import { Message } from '../types/chat';
import ChatMessage from './ChatMessage';
import { MessageCircleQuestion } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-gray-500">
        <MessageCircleQuestion size={48} className="mb-4" />
        <h2 className="mb-2 text-xl font-semibold">Welcome to AI Chat!</h2>
        <p className="text-center">
          Start a conversation by typing your message below.
          <br />
          Ask me anything - I'm here to help!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isLastMessage={index === messages.length - 1}
          isLoading={isLoading}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}