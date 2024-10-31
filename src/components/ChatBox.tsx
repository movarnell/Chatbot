import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import './ChatBox.css'; // Import the CSS file
import { Send } from 'lucide-react'; // Import the paper airplane icon

interface ChatBoxProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, setMessages }) => {
    const [input, setInput] = useState<string>('');

    const handleSend = async () => {
        if (input.trim() === '') return;

        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');

        const responseStream = await fetchGPTResponseStream(input);
        for await (const chunk of responseStream) {
            setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: chunk }]);
        }
    };

    const fetchGPTResponseStream = async (input: string) => {
        // Replace with actual API call to fetch streamed GPT responses
        const response = await fetch('/api/gpt-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input }),
        });

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        const chunks = [];

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunk = decoder.decode(value, { stream: true });
            chunks.push(chunk);
        }

        return chunks;
    };

    return (
        <div className="chatbox">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>
                    <Send size={16} className='me-3'/>Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
