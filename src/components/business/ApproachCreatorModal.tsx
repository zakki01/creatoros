import React, { useState } from 'react';
import {
  X,
  Send,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Creator, NotificationItem, OutreachItem } from '../../types';

interface ApproachCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  onSuccess?: () => void;
}

export const ApproachCreatorModal: React.FC<ApproachCreatorModalProps> = ({
  isOpen,
  onClose,
  creator,
  onSuccess,
}) => {
  const { campaigns, addOutreachItem, addNotification, triggerCelebration } = useAppState();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || 'custom'
  );
  const [briefTitle, setBriefTitle] = useState(
    campaigns[0]?.name || 'Autumn Sneaker Capsule — Lookbook & Transitions'
  );
  const [proposedBudget, setProposedBudget] = useState<number>(creator.estimatedRate || 35000);
  const [targetDeadline, setTargetDeadline] = useState('2026-11-15');
  const [usageRights, setUsageRights] = useState('30-Day Organic + Paid Whitelisting');
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    '1x 4K Sponsored Reel (60s)',
    '2x High-Retention Stories',
  ]);
  const [briefMessage, setBriefMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    if (campaignId === 'custom') {
      setBriefTitle('Custom Bespoke Creator Brief');
    } else {
      const match = campaigns.find((c) => c.id === campaignId);
      if (match) setBriefTitle(match.name);
    }
  };

  const toggleDeliverable = (item: string) => {
    if (selectedDeliverables.includes(item)) {
      if (selectedDeliverables.length > 1) {
        setSelectedDeliverables(selectedDeliverables.filter((d) => d !== item));
      }
    } else {
      setSelectedDeliverables([...selectedDeliverables, item]);
    }
  };

  const deliverableOptions = [
    '1x 4K Sponsored Reel (60s)',
    '2x High-Retention Stories',
    'Dedicated YouTube Video (60-90s)',
    'High-Res Editorial Carousel (5 Slides)',
    'Whitelisted Spark Ads Usage (30 Days)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (briefMessage.trim().length < 15) {
      setErrorMessage('Please include a brief message or creative direction (min 15 chars).');
      return;
    }

    if (!proposedBudget || proposedBudget <= 0) {
      setErrorMessage('Please enter a valid budget.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOutreach: OutreachItem = {
        id: `out-invite-${Date.now()}`,
        campaignId: selectedCampaignId,
        campaignName: briefTitle,
        creatorId: creator.id,
        creator,
        stage: 'Contacted',
        lastContactDate: new Date().toISOString().split('T')[0],
        nextAction: `Awaiting ${creator.name}'s acceptance of campaign brief.`,
        proposedFee: proposedBudget,
        messages: [
          {
            id: `msg-brief-${Date.now()}`,
            sender: 'brand',
            message: `**Campaign Invitation: ${briefTitle}**\n\n${briefMessage}\n\n**Proposed Fee:** ₹${proposedBudget.toLocaleString()}\n**Usage Terms:** ${usageRights}\n**Target Delivery:** ${targetDeadline}\n**Deliverables:** ${selectedDeliverables.join(
              ', '
            )}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        aiDraftProposal: `Direct brief invitation sent to ${creator.name}. 88% estimated acceptance probability.`,
        pitchDetails: {
          brandName: 'Aura Streetwear Co.',
          availability: targetDeadline,
          deliverableTypes: selectedDeliverables,
          usageRights,
          targetDeadline,
        },
      };

      addOutreachItem(newOutreach);

      // Notification for Creator
      const creatorNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'New Campaign Invitation',
        description: `Aura Streetwear Co. invited you to "${briefTitle}" (₹${proposedBudget.toLocaleString()} offer).`,
        time: 'Just now',
        read: false,
        type: 'campaign',
        targetRole: 'creator',
        actionLink: 'opportunities',
      };
      addNotification(creatorNotif);

      setIsSubmitting(false);
      triggerCelebration();
      if (onSuccess) onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white text-zinc-900 border border-black/[0.08] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-black/[0.08] flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-10 h-10 rounded-2xl object-cover ring-1 ring-black/10 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-zinc-900 font-display">
                  Approach {creator.name}
                </h3>
                {creator.verified && <ShieldCheck className="w-4 h-4 text-[#007E93]" />}
              </div>
              <p className="text-xs text-zinc-500 font-mono">
                @{creator.handle} • {creator.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Creator Stats & Availability Pill */}
          <div className="p-3 rounded-2xl bg-zinc-50 border border-black/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Followers</span>
                <span className="font-bold text-zinc-900">
                  {(creator.totalFollowers / 1000).toFixed(0)}k
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Engagement</span>
                <span className="font-bold text-emerald-700">{creator.avgEngagement}%</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Est. Rate</span>
                <span className="font-bold text-zinc-900">₹{creator.estimatedRate.toLocaleString()}</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              {creator.availabilityStatus || 'Available Now'}
            </span>
          </div>

          {/* Campaign Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 block">Select Active Campaign</label>
              <select
                value={selectedCampaignId}
                onChange={(e) => handleCampaignChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
              >
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name}
                  </option>
                ))}
                <option value="custom">+ Custom Project Brief</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 block">Brief Title</label>
              <input
                type="text"
                value={briefTitle}
                onChange={(e) => setBriefTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
              />
            </div>
          </div>

          {/* Budget & Target Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 block">
                Proposed Compensation (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-zinc-500">₹</span>
                <input
                  type="number"
                  step="500"
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(Number(e.target.value))}
                  required
                  className="w-full pl-7 pr-3.5 py-2.5 text-xs font-mono font-semibold rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 block">
                Target Delivery Deadline
              </label>
              <input
                type="date"
                value={targetDeadline}
                onChange={(e) => setTargetDeadline(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
              />
            </div>
          </div>

          {/* Usage Rights Terms */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">Usage Rights & Licensing</label>
            <select
              value={usageRights}
              onChange={(e) => setUsageRights(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
            >
              <option value="30-Day Organic + Paid Whitelisting">
                30-Day Organic + Paid Whitelisting (Recommended)
              </option>
              <option value="Organic In-Feed Only (Perpetual)">
                Organic In-Feed Only (Perpetual)
              </option>
              <option value="90-Day Full Paid Advertising Buyout">
                90-Day Full Paid Advertising Buyout
              </option>
              <option value="Perpetual Global Commercial Buyout">
                Perpetual Global Commercial Buyout
              </option>
            </select>
          </div>

          {/* Deliverables Checklist */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">Required Deliverables</label>
            <div className="flex flex-wrap gap-1.5">
              {deliverableOptions.map((del) => {
                const isSelected = selectedDeliverables.includes(del);
                return (
                  <button
                    key={del}
                    type="button"
                    onClick={() => toggleDeliverable(del)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#007E93] text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {del}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Creative Direction & Personalized Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-800">
                Creative Direction &amp; Brief Notes <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                {briefMessage.length} chars (min 15)
              </span>
            </div>
            <textarea
              rows={4}
              value={briefMessage}
              onChange={(e) => setBriefMessage(e.target.value)}
              required
              placeholder={`Hi ${creator.name}, we would love to collaborate on our upcoming collection! We envision an energetic transition reel showcasing how you style the drop with your signature urban flair. Moodboard and samples ready to dispatch...`}
              className="w-full p-3.5 text-xs rounded-2xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93] resize-none leading-relaxed"
            />
          </div>
        </form>

        {/* Sticky Action Footer */}
        <div className="p-4 px-6 border-t border-black/[0.08] bg-zinc-50 flex items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-500 hidden sm:block">
            Protected escrow contract will generate automatically once accepted.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#007E93] hover:bg-[#006779] text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending Invitation...' : 'Send Campaign Brief'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
