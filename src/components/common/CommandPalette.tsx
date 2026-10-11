import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Layers,
  Users,
  CheckCircle,
  BarChart3,
  Sliders,
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
  const { role, setRole, campaigns, creators } = useAppState();
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
    { id: 'home', title: 'Go to Business Overview & AI Attention Center', icon: Sparkles, category: 'Navigation' },
    { id: 'campaigns', title: 'View All Campaigns', icon: Layers, category: 'Navigation' },
    { id: 'creators', title: 'Creator Discovery with AI Match Scoring', icon: Users, category: 'Navigation' },
    { id: 'discover', title: 'Open Social Discovery & Live Feed', icon: Compass, category: 'Navigation' },
    { id: 'content', title: 'Review Pending Content Approvals', icon: CheckCircle, category: 'Action' },
    { id: 'analytics', title: 'View Campaign Analytics & ROAS', icon: BarChart3, category: 'Analytics' },
    { id: 'payments', title: 'Payments & Escrow Disbursal', icon: CreditCard, category: 'Financials' },
  ];

  const creatorActions = [
    { id: 'home', title: 'Creator Dashboard & Today\'s Focus', icon: Sparkles, category: 'Navigation' },
    { id: 'opportunities', title: 'View Incoming Brand Opportunities', icon: Compass, category: 'Opportunities' },
    { id: 'campaigns', title: 'Active Campaigns & Deliverables', icon: Layers, category: 'Campaigns' },
    { id: 'discover', title: 'Discover Brands, Casting Briefs & Reels', icon: Compass, category: 'Navigation' },
    { id: 'content', title: 'Submit or Check Deliverables', icon: CheckCircle, category: 'Content' },
    { id: 'profile', title: 'View Professional Creator Profile & Showcase', icon: ShieldCheck, category: 'Identity' },
    { id: 'earnings', title: 'View Milestone Payments & Invoices', icon: CreditCard, category: 'Financials' },
  ];

  const actionPool = role === 'business' ? businessActions : creatorActions;

  const filtered = actionPool.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onSelectAction(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-up">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/40">
          <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search (e.g. 'Approvals', 'Simulator', 'Discover')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono shrink-0">
            ESC
          </kbd>
        </div>

        {/* Options */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              No actions found for "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/80 text-left transition-colors text-zinc-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Tip: Switch between Brand and Creator anytime.</span>
          <span>Role: <strong className="text-zinc-300 capitalize">{role}</strong></span>
        </div>
      </div>
    </div>
  );
};
