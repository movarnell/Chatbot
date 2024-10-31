import { useState } from 'react';
import { botOptions, BotOption } from './botOptions';
import {ChevronDown} from 'lucide-react';

interface BotSelectorProps {
  selectedBot: BotOption;
  onBotChange: (bot: BotOption) => void;
}

export default function BotSelector({ selectedBot = botOptions[0], onBotChange }: BotSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative me-32">
      {selectedBot && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          <selectedBot.icon size={24} />
          <span>{selectedBot.name}</span>
          <ChevronDown size={16} />
        </button>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
          {botOptions.map((bot) => (
            <button
              key={bot.id}
              onClick={() => {
                onBotChange(bot);
                setIsOpen(false);
              }}
              className={`flex w-full items-start gap-3 p-3 text-left hover:bg-gray-50
                ${selectedBot?.id === bot.id ? 'bg-blue-50' : ''}
              `}
            >
              <bot.icon size={24} className="mt-1 text-gray-500 shrink-0" />
              <div>
                <div className="font-medium text-gray-500">{bot.name}</div>
                <div className="text-sm text-gray-500">{bot.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}