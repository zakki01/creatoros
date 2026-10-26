import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Clock,
  Send,
  Eye,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Filter,
  X,
} from 'lucide-react';

import { useAppState } from '../../context/StateContext';
import { Creator, Platform } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CreatorProfileModal } from './CreatorProfileModal';

export const CreatorDiscovery: React.FC = () => {
  const { creators, campaigns, activeCampaignId, inviteCreator, outreachItems } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedReliability, setSelectedReliability] = useState('All');
  const [activeModalCreator, setActiveModalCreator] = useState<Creator | null>(null);
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

  const categories = [
    'All',
    'Streetwear & Sneaker Culture',
    'High Fashion & Aesthetic UGC',
    'Fitness & Athleisure',
    'Tech, Design & Everyday Carry',
    'Youth Culture & Street Humour',
    'Clean Beauty & Aesthetic Lifestyle',
  ];

  const locations = ['All', 'Mumbai', 'Bangalore', 'Delhi', 'Pune'];

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || creator.category === selectedCategory;

    const matchesLocation =
      selectedLocation === 'All' || creator.location.includes(selectedLocation);

    const matchesPlatform =
      selectedPlatform === 'All' ||
      creator.platforms.some((p) => p.platform === selectedPlatform);

    const matchesReliability =
      selectedReliability === 'All' ||
      (selectedReliability === '95+' && creator.reliabilityMetrics.onTimeDelivery >= 95) ||
      (selectedReliability === '90+' && creator.reliabilityMetrics.onTimeDelivery >= 90);

    return matchesSearch && matchesCategory && matchesLocation && matchesPlatform && matchesReliability;
  });

  const isCreatorInvited = (creatorId: string) => {
    return outreachItems.some(
      (item) => item.creatorId === creatorId && item.campaignId === activeCampaign.id
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              Creator Discovery
            </h1>
            <Badge variant="brand" size="sm">
              AI Matched
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Evaluating creators against active campaign <strong className="text-zinc-800">"{activeCampaign.name}"</strong>
          </p>
        </div>

        <div className="text-xs text-zinc-500 bg-zinc-100 border border-zinc-200 px-3.5 py-2 text-zinc-700 rounded-xl">
          Active target: <span className="font-semibold text-zinc-800">{activeCampaign.targetAudience.location.join(', ')}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search creators by name, handle, category, location, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-zinc-900 pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-zinc-200 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Filters:</span>
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white text-zinc-800 text-xs px-3 py-2 rounded-xl border border-zinc-300 shadow-[inset_0_1px_2px_rgba(23,37,54,0.05)] focus:outline-none focus:ring-2 focus:ring-[#007E93]/20 focus:border-[#007E93]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Location */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-white text-zinc-800 text-xs px-3 py-2 rounded-xl border border-zinc-300 shadow-[inset_0_1px_2px_rgba(23,37,54,0.05)] focus:outline-none focus:ring-2 focus:ring-[#007E93]/20 focus:border-[#007E93]"
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l === 'All' ? 'All Cities' : l}
              </option>
            ))}
          </select>

          {/* Reliability */}
          <select
            value={selectedReliability}
            onChange={(e) => setSelectedReliability(e.target.value)}
            className="bg-white text-zinc-800 text-xs px-3 py-2 rounded-xl border border-zinc-300 shadow-[inset_0_1px_2px_rgba(23,37,54,0.05)] focus:outline-none focus:ring-2 focus:ring-[#007E93]/20 focus:border-[#007E93]"
          >
            <option value="All">All Reliability Scores</option>
            <option value="95+">Top Tier (&gt;95% On-Time)</option>
            <option value="90+">High (&gt;90% On-Time)</option>
          </select>
        </div>
      </div>

      {/* Creator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => {
          const isInvited = isCreatorInvited(creator.id);
          const isWhyExpanded = expandedWhyId === creator.id;

          return (
            <Card
              key={creator.id}
              className="p-5 flex flex-col justify-between hover:border-zinc-300 transition-all space-y-4"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-zinc-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-zinc-900 font-display">
                          {creator.name}
                        </h3>
                        {creator.verified && (
                          <ShieldCheck className="w-4 h-4 text-[#007E93] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 font-mono">@{creator.handle}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                        {creator.category}
                      </p>
                    </div>
                  </div>

                  {/* AI Match Fit Badge (Clickable to show WHY) */}
                  <button
                    onClick={() => setExpandedWhyId(isWhyExpanded ? null : creator.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#E9FAFC] hover:bg-[#D7F3F6] border border-[#00B4D8]/40 text-[#007E93] text-xs font-semibold shrink-0 transition-colors"
                    title="Click to view AI Match explanation"
                  >
                    <Sparkles className="w-3 h-3 text-[#007E93] animate-pulse-subtle" />
                    <span>{creator.aiMatchScore || 92}% Fit</span>
                  </button>
                </div>

                {/* AI Match Explanation Drawer if expanded */}
                {isWhyExpanded && creator.aiMatchFactors && (
                  <div className="p-3.5 rounded-2xl bg-[#00B4D8]/10 border border-[#00B4D8]/30 text-xs space-y-2 animate-slide-up">
                    <div className="flex items-center justify-between text-[#007E93] font-semibold text-[11px] uppercase tracking-wider">
                      <span>Why this creator matches:</span>
                      <button
                        onClick={() => setExpandedWhyId(null)}
                        className="text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-zinc-700">
                      <li>• <strong>Audience:</strong> {creator.aiMatchFactors.audienceMatch}</li>
                      <li>• <strong>Content:</strong> {creator.aiMatchFactors.contentRelevance}</li>
                      <li>• <strong>Performance:</strong> {creator.aiMatchFactors.historicalPerformance}</li>
                      <li>• <strong>Budget:</strong> {creator.aiMatchFactors.budgetCompatibility}</li>
                    </ul>
                  </div>
                )}

                {/* Bio snippet */}
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {creator.bio}
                </p>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium">Followers</p>
                    <p className="text-xs font-bold text-zinc-800 font-mono mt-0.5">
                      {(creator.totalFollowers / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="border-x border-zinc-200">
                    <p className="text-[10px] text-zinc-500 font-medium">Engagement</p>
                    <p className="text-xs font-bold text-[#007E93] font-mono mt-0.5">
                      {creator.avgEngagement}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium">Est. Rate</p>
                    <p className="text-xs font-bold text-zinc-800 font-mono mt-0.5">
                      ₹{(creator.estimatedRate / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                {/* Reliability & Location Strip */}
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{creator.location.split(',')[0]}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{creator.reliabilityMetrics.onTimeDelivery}% On-Time</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Section 67: [ View ] [ Invite ] */}
              <div className="pt-3 border-t border-zinc-200 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModalCreator(creator)}
                  className="w-24 text-xs"
                >
                  View
                </Button>
                <Button
                  variant={isInvited ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={isInvited}
                  onClick={() => inviteCreator(creator.id, activeCampaign.id, creator.estimatedRate)}
                  leftIcon={isInvited ? <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> : <Send className="w-3.5 h-3.5" />}
                  className="flex-1 text-xs"
                >
                  {isInvited ? 'Invited ✓' : 'Invite'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Profile Modal */}
      <CreatorProfileModal
        creator={activeModalCreator}
        isOpen={!!activeModalCreator}
        onClose={() => setActiveModalCreator(null)}
      />
    </div>
  );
};
