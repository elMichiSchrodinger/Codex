import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnreadMessages?: boolean;
}

export function ChatbotButton({ isOpen, onClick, hasUnreadMessages = false }: ChatbotButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-40 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-110'
      }`}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      )}
    </button>
  );
}