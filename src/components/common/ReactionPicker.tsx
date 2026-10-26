import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';

export interface ReactionPickerProps {
  onSelectReaction: (reaction: string) => void;
  onClose: () => void;
  currentReaction?: string;
  className?: string;
  position?: 'top' | 'bottom';
}

export const QUICK_REACTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '😍', label: 'Heart Eyes' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Surprised' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '👏', label: 'Clap' },
];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onSelectReaction,
  onClose,
  currentReaction,
  className = '',
  position = 'top',
}) => {
  const [showFullPicker, setShowFullPicker] = useState(false);

  return (
    <div
      className={`relative z-50 select-none animate-scale-in ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Compact Reaction Tray */}
      <div
        className={`flex items-center gap-1 p-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-xl shadow-slate-900/15 transition-all ${
          position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
      >
        {QUICK_REACTIONS.map((item) => {
          const isSelected = currentReaction === item.emoji;
          return (
            <button
              key={item.emoji}
              onClick={() => {
                onSelectReaction(item.emoji);
                onClose();
              }}
              title={item.label}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xl hover:scale-130 active:scale-95 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-sky-50 ring-1 ring-sky-200 scale-110'
                  : 'hover:bg-zinc-100'
              }`}
            >
              <span className="transform transition-transform">{item.emoji}</span>
            </button>
          );
        })}

        {/* '+' button to open full emoji picker */}
        <button
          onClick={() => setShowFullPicker(!showFullPicker)}
          title="More reactions"
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer border-l border-zinc-200 pl-1"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Full Emoji Picker Popover */}
      {showFullPicker && (
        <div className="absolute bottom-full left-0 mb-3 z-50">
          <EmojiPicker
            onSelect={(emoji) => {
              onSelectReaction(emoji);
              setShowFullPicker(false);
              onClose();
            }}
            onClose={() => setShowFullPicker(false)}
            position="top"
          />
        </div>
      )}
    </div>
  );
};
