import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Layers,
  Users,
  CheckCircle,
  BarChart3,
  Compass,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (target: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const { role, campaigns, creators } = useAppState();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const businessActions = [
    { id: 'home', title: 'Overview', icon: Sparkles, category: 'Workspace' },
    { id: 'campaigns', title: 'Campaigns', icon: Layers, category: 'Workspace' },
    { id: 'contracts', title: 'Contracts', icon: ShieldCheck, category: 'Workspace' },
    { id: 'creators', title: 'Creators', icon: Users, category: 'Discover' },
    { id: 'discover', title: 'Discover', icon: Compass, category: 'Social' },
    { id: 'content', title: 'Content Reviews', icon: CheckCircle, category: 'Action' },
    { id: 'analytics', title: 'Analytics', icon: BarChart3, category: 'Insights' },
    { id: 'payments', title: 'Payments', icon: CreditCard, category: 'Finance' },
  ];

  const creatorActions = [
    { id: 'home', title: 'Home', icon: Sparkles, category: 'Studio' },
    { id: 'live', title: 'Live Studio', icon: Sparkles, category: '3D Studio' },
    { id: 'contracts', title: 'Contracts', icon: ShieldCheck, category: 'Business' },
    { id: 'opportunities', title: 'Opportunities', icon: Compass, category: 'Deals' },
    { id: 'campaigns', title: 'Campaigns', icon: Layers, category: 'Projects' },
    { id: 'discover', title: 'Discover', icon: Compass, category: 'Social' },
    { id: 'content', title: 'Content', icon: CheckCircle, category: 'Deliverables' },
    { id: 'profile', title: 'Profile', icon: ShieldCheck, category: 'Portfolio' },
    { id: 'earnings', title: 'Earnings', icon: CreditCard, category: 'Finance' },
  ];

  const actionPool = role === 'business' ? businessActions : creatorActions;

  const filtered = actionPool.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchingCreators = query.trim()
    ? creators
        .filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            (c.niche || '').toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const matchingCampaigns = query.trim()
    ? campaigns
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
    : [];

  const handleSelect = (id: string) => {
    onSelectAction(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/45 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white text-zinc-900 border border-black/[0.08] shadow-2xl rounded-3xl overflow-hidden z-10 animate-slide-up">
        {/* Top specular highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />

        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 bg-zinc-50/70">
          <Search className="w-4 h-4 text-[#0096C7] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Jump to workspace, creator, or campaign..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none font-sans"
          />
          <kbd className="text-[10px] bg-white border border-zinc-300 text-zinc-600 px-2 py-0.5 rounded-md font-mono shrink-0 shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Options */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 && matchingCreators.length === 0 && matchingCampaigns.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              No results for "{query}"
            </div>
          ) : (
            <>
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 text-left transition-all text-zinc-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-600 group-hover:text-[#0096C7] group-hover:border-[#00B4D8]/40 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-zinc-900">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </button>
                );
              })}

              {matchingCreators.length > 0 && (
                <div className="pt-2">
                  <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Creators
                  </p>
                  {matchingCreators.map((creator) => (
                    <button
                      key={creator.id}
                      onClick={() => handleSelect(role === 'business' ? 'creators' : 'discover')}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-7 h-7 rounded-full object-cover border border-black/10"
                        />
                        <div>
                          <p className="text-xs font-medium text-zinc-900">{creator.name}</p>
                          <p className="text-[10px] text-zinc-500">{creator.niche}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  ))}
                </div>
              )}

              {matchingCampaigns.length > 0 && (
                <div className="pt-2">
                  <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Campaigns
                  </p>
                  {matchingCampaigns.map((camp) => (
                    <button
                      key={camp.id}
                      onClick={() => handleSelect(role === 'business' ? camp.id : 'campaigns')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 text-left transition-all cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-medium text-zinc-900">{camp.name}</p>
                        <p className="text-[10px] text-zinc-500">{camp.status}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
