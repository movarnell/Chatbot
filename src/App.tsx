import { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import BotSelector from "./components/BotSelector";
import { Message } from "./types/chat";
import { sendMessage } from "./services/api";
import { botOptions } from "./components/botOptions";
import type { BotOption } from "./components/botOptions";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotOption>(botOptions[0]); // Default to the first bot

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reader = await sendMessage([
        { role: "system", content: "Do not answer any questions not about you or coding." + selectedBot.personality },
        ...messages,
        userMessage,
      ]);
      const decoder = new TextDecoder();
      let currentMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.includes("[DONE]")) continue;
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices[0]?.delta?.content) {
                currentMessage += data.choices[0].delta.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = currentMessage;
                  return newMessages;
                });
              }
            } catch (error) {
              console.error("Error parsing chunk:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-fit flex-col">
      <header className="flex items-center justify-between bg-blue-500 p-4 text-white">
        <h1 className="text-xl font-bold">AI Chat</h1>
        <BotSelector selectedBot={selectedBot} onBotChange={setSelectedBot} />
      </header>
      <main className="flex flex-1 flex-col">
        <ChatContainer messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
