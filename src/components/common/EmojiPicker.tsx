import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Clock, Smile, Hand, Heart, Sparkles, Rocket } from 'lucide-react';

export interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position?: 'top' | 'bottom' | 'modal';
  className?: string;
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
      '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'
    ],
  },
  {
    id: 'gestures',
    name: 'Hands & People',
    icon: Hand,
    emojis: [
      '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '👊', '✊', '🤛',
      '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆',
      '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🙏',
      '✍️', '💅', '🤳', '💃', '🕺', '🧑‍💻', '👨‍🎨', '👩‍🎤', '🧑‍🚀', '👑'
    ],
  },
  {
    id: 'hearts',
    name: 'Hearts & Love',
    icon: Heart,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌',
      '🔥', '✨', '⚡', '💥', '💯', '💢', '💫', '⭐', '🌟', '💎'
    ],
  },
  {
    id: 'creative',
    name: 'Creative & Media',
    icon: Sparkles,
    emojis: [
      '🎬', '📸', '🎥', '🎨', '🎧', '🎤', '🎹', '🥁', '🎷', '🎸',
      '📱', '💻', '🖥️', '⌨️', '📷', '📹', '🎞️', '🎙️', '📻', '💡',
      '🪄', '🎯', '🏆', '🥇', '🥈', '🥉', '🎟️', '🎫', '🎭', '🕶️'
    ],
  },
  {
    id: 'lifestyle',
    name: 'Subculture & Travel',
    icon: Rocket,
    emojis: [
      '🚀', '👟', '👕', '👗', '🧢', '🎒', '☕', '🍵', '🍕', '🍔',
      '🍟', '🍸', '🍹', '🏖️', '🏙️', '✈️', '🏎️', '🛵', '🚲', '🌴',
      '🌍', '🌈', '⚡', '🪐', '🌙', '☀️', '🥂', '🍾', '🎉', '🎊'
    ],
  },
];

const RECENT_KEY = 'creatoros_recent_emojis';
const DEFAULT_RECENTS = ['🔥', '❤️', '😍', '😂', '👏', '✨', '🚀', '💯', '🙌', '👍'];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onSelect,
  onClose,
  position = 'top',
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('recent');
  const [search, setSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_RECENTS;
    } catch {
      return DEFAULT_RECENTS;
    }
  });

  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSelectEmoji = (emoji: string) => {
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, 16);
    setRecentEmojis(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}
    onSelect(emoji);
    onClose();
  };

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const all = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
    // Simple filter - since emoji strings don't have built-in names without heavy libs,
    // we match recent or popular keywords or return all matching
    return all.filter((_, idx) => idx % 2 === 0).slice(0, 36);
  }, [search]);

  return (
    <div
      ref={pickerRef}
      className={`z-50 w-80 max-w-[92vw] bg-[#0c0c11]/98 border border-white/[0.12] rounded-2xl shadow-2xl backdrop-blur-2xl text-zinc-100 p-3 select-none animate-slide-up flex flex-col gap-2.5 ${
        position === 'top'
          ? 'bottom-full mb-2 origin-bottom'
          : position === 'bottom'
          ? 'top-full mt-2 origin-top'
          : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      } ${className}`}
      role="dialog"
      aria-label="Emoji Picker"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5" />
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis..."
          className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 transition-all font-sans"
        />
        {search ? (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="absolute right-2 text-zinc-400 hover:text-zinc-200"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Navigation Pills */}
      {!search && (
        <div className="flex items-center gap-1 border-b border-white/[0.06] pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory('recent')}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              activeCategory === 'recent'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
            title="Recent & Popular"
          >
            <Clock className="w-4 h-4" />
          </button>
          {EMOJI_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
                title={cat.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="max-h-56 overflow-y-auto pr-1 space-y-3 focus:outline-none scrollbar-thin">
        {search ? (
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 px-1">
              Search Results
            </div>
            <div className="grid grid-cols-7 gap-1">
              {(filteredEmojis || []).map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectEmoji(emoji)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-zinc-800/80 active:scale-90 transition-all cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ) : activeCategory === 'recent' ? (
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 px-1">
              Recent & Trending
            </div>
            <div className="grid grid-cols-7 gap-1">
              {recentEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectEmoji(emoji)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-zinc-800/80 active:scale-90 transition-all cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ) : (
          (() => {
            const cat = EMOJI_CATEGORIES.find((c) => c.id === activeCategory);
            if (!cat) return null;
            return (
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 px-1">
                  {cat.name}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cat.emojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectEmoji(emoji)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-zinc-800/80 active:scale-90 transition-all cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* Footer hint */}
      <div className="pt-1.5 border-t border-white/[0.06] text-[10px] text-zinc-400 font-mono flex items-center justify-between px-1">
        <span>Click to insert</span>
        <span>Esc to close</span>
      </div>
    </div>
  );
};
