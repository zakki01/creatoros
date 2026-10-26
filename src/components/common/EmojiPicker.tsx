import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Clock,
  Smile,
  Hand,
  Heart,
  Sparkles,
  Rocket,
  Upload,
  Flame,
  AlertCircle,
  Check,
  Loader2,
  Film,
} from 'lucide-react';
import {
  gifProvider,
  GifItem,
  getRecentGifs,
  saveRecentGif,
} from '../../services/gifProvider';
import {
  validateGifFile,
  formatGifFileSize,
} from '../../services/gifValidationService';

export interface SelectedGifPayload {
  url: string;
  title?: string;
  file?: File;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  id?: string;
}

export interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onSelectGif?: (gif: SelectedGifPayload) => void;
  onClose: () => void;
  position?: 'top' | 'bottom' | 'modal';
  className?: string;
  initialTab?: 'emoji' | 'gif';
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
    name: 'Smileys',
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
    name: 'Hands',
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
    name: 'Reactions',
    icon: Heart,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌',
      '🔥', '✨', '⚡', '💥', '💯', '💢', '💫', '⭐', '🌟', '💎'
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: Sparkles,
    emojis: [
      '🎬', '📸', '🎥', '🎨', '🎧', '🎤', '🎹', '🥁', '🎷', '🎸',
      '📱', '💻', '🖥️', '⌨️', '📷', '📹', '🎞️', '🎙️', '📻', '💡',
      '🪄', '🎯', '🏆', '🥇', '🥈', '🥉', '🎟️', '🎫', '🎭', '🕶️'
    ],
  },
  {
    id: 'lifestyle',
    name: 'Culture',
    icon: Rocket,
    emojis: [
      '🚀', '👟', '👕', '👗', '🧢', '🎒', '☕', '🍵', '🍕', '🍔',
      '🍟', '🍸', '🍹', '🏖️', '🏙️', '✈️', '🏎️', '🛵', '🚲', '🌴',
      '🌍', '🌈', '⚡', '🪐', '🌙', '☀️', '🥂', '🍾', '🎉', '🎊'
    ],
  },
];

const RECENT_KEY = 'creatoros_recent_emojis';
const DEFAULT_RECENTS = ['🔥', '❤️', '😍', '😂', '👏', '✨', '🚀', '💯', '🙌', '👍', '🥳', '🤝', '⚡', '💎'];

const GIF_CATEGORIES = [
  { id: 'trending', label: 'Trending' },
  { id: 'recent', label: 'Recent' },
  { id: 'Reaction', label: 'Reactions' },
  { id: 'Celebration', label: 'Celebrate' },
  { id: 'Deal', label: 'Collab' },
  { id: 'Creative', label: 'Studio' },
  { id: 'Hype', label: 'Hype' },
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onSelect,
  onSelectGif,
  onClose,
  position = 'top',
  className = '',
  initialTab = 'emoji',
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'gif'>(initialTab);
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

  // GIF state
  const [gifCategory, setGifCategory] = useState<string>('trending');
  const [gifSearch, setGifSearch] = useState('');
  const [gifItems, setGifItems] = useState<GifItem[]>([]);
  const [recentGifs, setRecentGifs] = useState<GifItem[]>(() => getRecentGifs());
  const [gifLoading, setGifLoading] = useState(false);
  const [gifSuggestions, setGifSuggestions] = useState<string[]>([]);

  // Local GIF upload state
  const [uploadingGif, setUploadingGif] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stagedUploadGif, setStagedUploadGif] = useState<SelectedGifPayload | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const gifFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [activeTab]);

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

  // Load GIFs when tab, category, or search changes
  useEffect(() => {
    if (activeTab !== 'gif') return;
    let cancelled = false;
    const loadGifs = async () => {
      setGifLoading(true);
      try {
        if (gifSearch.trim()) {
          const [results, suggestions] = await Promise.all([
            gifProvider.search(gifSearch.trim(), 24),
            gifProvider.autocomplete(gifSearch.trim()),
          ]);
          if (!cancelled) {
            setGifItems(results);
            setGifSuggestions(suggestions);
          }
        } else if (gifCategory === 'recent') {
          const recents = getRecentGifs();
          if (!cancelled) {
            setRecentGifs(recents);
            setGifItems(recents.length > 0 ? recents : await gifProvider.trending(16));
            setGifSuggestions([]);
          }
        } else if (gifCategory === 'trending') {
          const results = await gifProvider.trending(24);
          if (!cancelled) {
            setGifItems(results);
            setGifSuggestions([]);
          }
        } else {
          const results = await gifProvider.search(gifCategory, 20);
          if (!cancelled) {
            setGifItems(results);
            setGifSuggestions([]);
          }
        }
      } finally {
        if (!cancelled) setGifLoading(false);
      }
    };
    loadGifs();
    return () => {
      cancelled = true;
    };
  }, [activeTab, gifCategory, gifSearch]);

  const handleSelectEmoji = (emoji: string) => {
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, 16);
    setRecentEmojis(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}
    onSelect(emoji);
    onClose();
  };

  const handlePickGifItem = (gif: GifItem) => {
    saveRecentGif(gif);
    gifProvider.registerShare(gif.id);
    if (onSelectGif) {
      onSelectGif({
        id: gif.id,
        url: gif.url,
        title: gif.title,
        width: gif.width,
        height: gif.height,
      });
      onClose();
    } else {
      // Fallback if parent didn't pass onSelectGif
      onSelect(gif.title ? `[GIF: ${gif.title}]` : '🎬');
      onClose();
    }
  };

  const handleLocalGifFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(null);
    setUploadingGif(true);
    setUploadProgress(20);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 20 : prev));
    }, 80);

    try {
      const validation = await validateGifFile(file);
      clearInterval(progressTimer);

      if (!validation.isValid) {
        setUploadingGif(false);
        setUploadProgress(0);
        setUploadError(validation.error || 'Only valid .gif files are supported.');
        return;
      }

      setUploadProgress(100);
      const previewUrl = URL.createObjectURL(file);
      const payload: SelectedGifPayload = {
        url: previewUrl,
        title: file.name.replace(/\.gif$/i, ''),
        file,
        width: validation.width || 320,
        height: validation.height || 240,
        fileSizeBytes: validation.fileSizeBytes || file.size,
      };

      setTimeout(() => {
        setUploadingGif(false);
        setStagedUploadGif(payload);
      }, 150);
    } catch {
      clearInterval(progressTimer);
      setUploadingGif(false);
      setUploadProgress(0);
      setUploadError('Could not process GIF file.');
    }
  };

  const handleConfirmStagedGif = () => {
    if (!stagedUploadGif) return;
    saveRecentGif({
      id: `upload-${Date.now()}`,
      title: stagedUploadGif.title || 'Uploaded GIF',
      url: stagedUploadGif.url,
      previewUrl: stagedUploadGif.url,
      width: stagedUploadGif.width || 320,
      height: stagedUploadGif.height || 240,
      category: 'Recent',
    });
    if (onSelectGif) {
      onSelectGif(stagedUploadGif);
    }
    setStagedUploadGif(null);
    onClose();
  };

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return null;
    const all = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
    return all.filter((_, idx) => idx % 2 === 0).slice(0, 35);
  }, [search]);

  return (
    <div
      ref={pickerRef}
      className={`z-50 w-[330px] sm:w-[350px] max-w-[94vw] bg-white/98 border border-zinc-200 rounded-2xl shadow-[0_18px_42px_rgba(23,37,54,0.18),0_0_0_1px_rgba(255,255,255,0.85)] backdrop-blur-2xl text-zinc-900 p-3 select-none animate-slide-up flex flex-col gap-2.5 ${
        position === 'top'
          ? 'bottom-full mb-2 origin-bottom'
          : position === 'bottom'
          ? 'top-full mt-2 origin-top'
          : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      } ${className}`}
      role="dialog"
      aria-label="Emoji & GIF Picker"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden Native .gif File Input */}
      <input
        ref={gifFileInputRef}
        type="file"
        accept=".gif,image/gif"
        onChange={handleLocalGifFileSelect}
        className="hidden"
        data-testid="picker-gif-upload-input"
      />

      {/* Top Switcher Tabs: [😀 Emoji | GIF] + Close */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-black/[0.08]">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 flex-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('emoji');
              setUploadError(null);
            }}
            data-testid="picker-tab-emoji"
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'emoji'
                ? 'bg-gradient-to-b from-[#078FA5] to-[#006C80] text-white shadow-[0_4px_12px_rgba(0,108,128,0.22)]'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span>😀</span>
            <span>Emoji</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('gif');
              setUploadError(null);
            }}
            data-testid="picker-tab-gif"
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'gif'
                ? 'bg-gradient-to-b from-[#078FA5] to-[#006C80] text-white shadow-[0_4px_12px_rgba(0,108,128,0.22)]'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>GIF</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {activeTab === 'emoji' ? (
        <>
          {/* Emoji Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emojis..."
              className="w-full bg-white shadow-sm border border-black/[0.08] rounded-xl pl-8 pr-7 py-1.5 text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 text-zinc-500 hover:text-zinc-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Emoji Category Pills */}
          {!search && (
            <div className="flex items-center gap-1 border-b border-black/[0.06] pb-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveCategory('recent')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeCategory === 'recent'
                    ? 'bg-[#00B4D8]/20 text-[#007E93] border border-[#00B4D8]/30'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                }`}
                title="Recent"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>
              {EMOJI_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#00B4D8]/20 text-[#007E93] border border-[#00B4D8]/30'
                        : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                    }`}
                    title={cat.name}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Emoji Grid */}
          <div className="max-h-56 overflow-y-auto pr-0.5 space-y-2 focus:outline-none scrollbar-thin">
            {search ? (
              <div className="grid grid-cols-7 gap-1">
                {(filteredEmojis || []).map((emoji, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectEmoji(emoji)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-zinc-100/80 active:scale-90 transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : activeCategory === 'recent' ? (
              <div>
                <div className="text-[10px] font-medium text-zinc-500 mb-1 px-1">Recent</div>
                <div className="grid grid-cols-7 gap-1">
                  {recentEmojis.map((emoji, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectEmoji(emoji)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-zinc-100/80 active:scale-90 transition-all cursor-pointer"
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
                    <div className="text-[10px] font-medium text-zinc-500 mb-1 px-1">{cat.name}</div>
                    <div className="grid grid-cols-7 gap-1">
                      {cat.emojis.map((emoji, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleSelectEmoji(emoji)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-zinc-100/80 active:scale-90 transition-all cursor-pointer"
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
        </>
      ) : (
        /* GIF TAB */
        <div className="flex flex-col gap-2">
          {/* Search + Upload GIF Action Bar */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1 flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={gifSearch}
                onChange={(e) => setGifSearch(e.target.value)}
                placeholder="Search GIFs..."
                data-testid="picker-gif-search"
                className="w-full bg-white/90 border border-black/[0.08] rounded-xl pl-8 pr-6 py-1.5 text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]/60 transition-all"
              />
              {gifSearch && (
                <button
                  type="button"
                  onClick={() => setGifSearch('')}
                  className="absolute right-2 text-zinc-500 hover:text-zinc-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => gifFileInputRef.current?.click()}
              data-testid="picker-upload-gif-btn"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#00B4D8]/10 hover:bg-[#007E93]/25 border border-[#00B4D8]/30 text-[#007E93] text-[11px] font-semibold transition-all cursor-pointer shrink-0"
              title="Upload a .gif from your device"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload GIF</span>
            </button>
          </div>

          {/* Upload Progress or Error Banner */}
          {uploadingGif && (
            <div className="p-2.5 rounded-xl bg-white shadow-sm/90 border border-[#00B4D8]/30 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#007E93] font-medium">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Validating & preparing GIF...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {uploadError && (
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-2 text-[11px] text-rose-300">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{uploadError}</span>
              </span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-rose-700 hover:text-rose-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Staged Local GIF Preview before sending */}
          {stagedUploadGif ? (
            <div className="p-2.5 rounded-xl bg-white shadow-sm/95 border border-[#00B4D8]/35 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-800 truncate max-w-[180px]">
                  {stagedUploadGif.title}.gif
                </span>
                <span className="text-[10px] text-zinc-500">
                  {stagedUploadGif.width}×{stagedUploadGif.height}
                  {stagedUploadGif.fileSizeBytes
                    ? ` · ${formatGifFileSize(stagedUploadGif.fileSizeBytes)}`
                    : ''}
                </span>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-black/60 max-h-36 flex items-center justify-center border border-black/[0.06]">
                <img
                  src={stagedUploadGif.url}
                  alt={stagedUploadGif.title || 'GIF Preview'}
                  className="max-h-36 w-auto object-contain"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-bold text-[#007E93] border border-black/[0.08]">
                  GIF PREVIEW
                </span>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setStagedUploadGif(null)}
                  className="px-2.5 py-1 rounded-lg text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStagedGif}
                  data-testid="picker-confirm-uploaded-gif"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#007E93] hover:bg-[#006779] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Use GIF</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Autocomplete Chips or Category Pills */}
              {gifSearch.trim() && gifSuggestions.length > 0 ? (
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                  {gifSuggestions.map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => setGifSearch(sug)}
                      className="px-2 py-0.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[10px] text-zinc-700 whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-black/[0.06]">
                  {GIF_CATEGORIES.map((cat) => {
                    const active = !gifSearch.trim() && gifCategory === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => {
                          setGifSearch('');
                          setGifCategory(cat.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-[#007E93]/10 text-[#007E93] border border-[#00B4D8]/35'
                            : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                        }`}
                      >
                        {cat.id === 'trending' && <Flame className="w-3 h-3 text-amber-800" />}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2-Column Animated GIF Grid */}
              <div className="max-h-56 overflow-y-auto pr-0.5 grid grid-cols-2 gap-1.5 scrollbar-thin">
                {gifLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-24 rounded-xl bg-white shadow-sm/90 border border-white/[0.05] animate-pulse"
                    />
                  ))
                ) : gifItems.length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-xs text-zinc-500 flex flex-col items-center gap-2">
                    <span>No GIFs found</span>
                    <button
                      type="button"
                      onClick={() => gifFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-colors"
                    >
                      Upload your own .gif
                    </button>
                  </div>
                ) : (
                  gifItems.map((gif) => (
                    <button
                      type="button"
                      key={gif.id}
                      onClick={() => handlePickGifItem(gif)}
                      data-testid={`picker-gif-item-${gif.id}`}
                      className="group relative h-24 rounded-xl overflow-hidden bg-white border border-zinc-200 hover:border-[#00B4D8]/60 transition-all cursor-pointer focus:outline-none"
                    >
                      <img
                        src={gif.previewUrl || gif.url}
                        alt={gif.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1.5 flex items-end justify-between">
                        <span className="text-[10px] font-medium text-white truncate">
                          {gif.title}
                        </span>
                        <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-black/70 text-[#007E93] border border-black/[0.08] shrink-0">
                          GIF
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
