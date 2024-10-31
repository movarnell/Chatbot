import { Message } from '../types/chat';
import LoadingDots from './LoadingDots';

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLastMessage, isLoading }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const formatContent = (content: string) => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Handle code blocks
        const code = part.slice(3, -3).trim();
        const [language, ...codeLines] = code.split('\n');
        const codeContent = codeLines.join('\n');

        return (
          <pre key={index} className="my-2 overflow-x-auto rounded bg-gray-800 p-3">
            <code className="text-sm text-gray-100">{codeContent}</code>
          </pre>
        );
      } else {
        // Handle regular text with preserved whitespace
        return (
          <div key={index} className="whitespace-pre-wrap">
            {part}
          </div>
        );
      }
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          relative max-w-[70%] rounded-2xl px-4 py-2
          ${isUser
            ? 'bg-blue-500 shadow-lg text-white after:absolute after:right-0 after:top-[50%] after:border-8 after:border-transparent after:border-l-blue-500 after:translate-x-[100%] after:-translate-y-[50%]'
            : 'bg-gray-100 shadow-lg text-gray-800 after:absolute after:left-0 after:top-[50%] after:border-8 after:border-transparent after:border-r-gray-100 after:translate-x-[-100%] after:-translate-y-[50%]'
          }
        `}
      >
        {formatContent(message.content)}
        {isLastMessage && isLoading && !isUser && <LoadingDots />}
      </div>
    </div>
  );
}