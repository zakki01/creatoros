import React, { useState } from 'react';
import {
  X,
  Send,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  ShieldCheck,
  Film,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { NotificationItem, OutreachItem } from '../../types';

interface PitchToBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandData: {
    id: string;
    name: string;
    handle: string;
    logo: string;
    category?: string;
  };
  initialCampaignTitle?: string;
  onPitchSuccess?: () => void;
}

export const PitchToBrandModal: React.FC<PitchToBrandModalProps> = ({
  isOpen,
  onClose,
  brandData,
  initialCampaignTitle,
  onPitchSuccess,
}) => {
  const { userProfile, creators, addOutreachItem, addNotification, triggerCelebration } =
    useAppState();

  const currentCreator = creators.find((c) => c.id === userProfile.id) || creators[0];

  const [campaignTitle, setCampaignTitle] = useState(
    initialCampaignTitle || 'Summer Drop 2026 Ambassador & Editorial Reels'
  );
  const [pitchMessage, setPitchMessage] = useState('');
  const [proposedRate, setProposedRate] = useState<number>(currentCreator.estimatedRate || 35000);
  const [availability, setAvailability] = useState('Available Now (Within 48h)');
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    'Sponsored Reel (4K 60fps)',
    '2x High-Engagement Stories',
  ]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string[]>([
    currentCreator.portfolio[0]?.title || 'Streetwear Macro Lookbook',
  ]);

  // File upload state & validation
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    sizeMB: string;
    type: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['.pdf', '.docx', '.doc', '.pptx'];
    const lowerName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValidExt) {
      setFileError('Invalid file type. Please upload a PDF, DOCX, or PPTX pitch deck.');
      return;
    }

    // Validate size <= 25MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `File exceeds maximum limit of 25MB (selected file: ${(file.size / (1024 * 1024)).toFixed(
          1
        )} MB).`
      );
      return;
    }

    setUploadedFile({
      name: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'application/pdf',
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileError(null);
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

  const togglePortfolio = (itemTitle: string) => {
    if (selectedPortfolio.includes(itemTitle)) {
      if (selectedPortfolio.length > 1) {
        setSelectedPortfolio(selectedPortfolio.filter((t) => t !== itemTitle));
      }
    } else {
      setSelectedPortfolio([...selectedPortfolio, itemTitle]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (pitchMessage.trim().length < 20) {
      setErrorNotice('Please write a pitch of at least 20 characters introducing your vision.');
      return;
    }

    if (!proposedRate || proposedRate <= 0) {
      setErrorNotice('Please specify a valid proposed rate.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Create structured OutreachItem
      const newOutreach: OutreachItem = {
        id: `out-pitch-${Date.now()}`,
        campaignId: `camp-pitch-${brandData.id}`,
        campaignName: campaignTitle,
        creatorId: currentCreator.id,
        creator: currentCreator,
        stage: 'Interested', // Under brand review
        lastContactDate: new Date().toISOString().split('T')[0],
        nextAction: `Pitch delivered to ${brandData.name}. Awaiting brand review.`,
        proposedFee: proposedRate,
        messages: [
          {
            id: `msg-pitch-${Date.now()}`,
            sender: 'creator',
            message: `**Creative Pitch: ${campaignTitle}**\n\n${pitchMessage}\n\n**Proposed Fee:** ₹${proposedRate.toLocaleString()}\n**Availability:** ${availability}\n**Deliverables:** ${selectedDeliverables.join(
              ', '
            )}${
              uploadedFile
                ? `\n**Attached Deck:** ${uploadedFile.name} (${uploadedFile.sizeMB})`
                : ''
            }`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        aiDraftProposal: `Pitch sent by ${currentCreator.name} to ${brandData.name}. Verified alignment score 92%.`,
        pitchDetails: {
          brandId: brandData.id,
          brandName: brandData.name,
          portfolioItems: selectedPortfolio.map((t) => ({ title: t })),
          pitchDeckFileName: uploadedFile?.name,
          pitchDeckFileSize: uploadedFile ? 1024 * 1024 : undefined,
          availability,
          deliverableTypes: selectedDeliverables,
        },
      };

      addOutreachItem(newOutreach);

      // 2. Notification for creator and brand
      const brandNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'New Creator Pitch Received',
        description: `${currentCreator.name} submitted a pitch for "${campaignTitle}" (₹${proposedRate.toLocaleString()}).`,
        time: 'Just now',
        read: false,
        type: 'campaign',
        targetRole: 'business',
        actionLink: 'campaigns',
      };
      addNotification(brandNotif);

      setIsSubmitting(false);
      triggerCelebration();
      if (onPitchSuccess) onPitchSuccess();
      onClose();
    }, 600);
  };

  const deliverableOptions = [
    'Sponsored Reel (4K 60fps)',
    '2x High-Engagement Stories',
    'High-Res In-Feed Carousel (5 Slides)',
    'Dedicated YouTube Integration (60-90s)',
    'UGC Ad Creative Whitelisting (30 Days)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white text-zinc-900 border border-black/[0.08] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-black/[0.08] flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <img
              src={brandData.logo}
              alt={brandData.name}
              className="w-10 h-10 rounded-2xl object-cover ring-1 ring-black/10 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-zinc-900 font-display">
                  Pitch to {brandData.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-[#007E93]" />
              </div>
              <p className="text-xs text-zinc-500 font-mono">Direct Creator Pitch Pipeline</p>
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

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorNotice && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Attached Creator Profile Summary */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.06] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentCreator.avatar}
                alt={currentCreator.name}
                className="w-11 h-11 rounded-2xl object-cover ring-1 ring-[#007E93]/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900">{currentCreator.name}</span>
                  <span className="text-[11px] font-mono text-zinc-500">@{currentCreator.handle}</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  {currentCreator.category} • {(currentCreator.totalFollowers / 1000).toFixed(0)}k Followers •{' '}
                  <span className="text-emerald-700 font-semibold">{currentCreator.avgEngagement}% Eng.</span>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              Profile Attached ✓
            </span>
          </div>

          {/* Campaign Brief Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">Target Brief / Opportunity</label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
              placeholder="e.g. Summer Drop 2026 Ambassador & Editorial Reels"
            />
          </div>

          {/* Personalized Pitch Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-800">
                Personalized Creative Pitch <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                {pitchMessage.length} chars (min 20)
              </span>
            </div>
            <textarea
              rows={4}
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              required
              placeholder={`Hi ${brandData.name} team, I love your latest collection aesthetic! Here is how I plan to create a high-conversion 4K transition reel styling your core pieces with authentic storytelling...`}
              className="w-full p-3.5 text-xs rounded-2xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93] resize-none leading-relaxed"
            />
          </div>

          {/* Pitch Deck Upload with validation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 flex items-center justify-between">
              <span>Attach Pitch Deck or Rate Card (PDF, DOCX)</span>
              <span className="text-[10px] text-zinc-500">Max size 25MB</span>
            </label>

            {uploadedFile ? (
              <div className="p-3 rounded-2xl bg-[#007E93]/5 border border-[#007E93]/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#007E93]/15 flex items-center justify-center text-[#007E93]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">{uploadedFile.name}</p>
                    <p className="text-[10px] text-zinc-500">{uploadedFile.sizeMB}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded-lg hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-zinc-300 hover:border-[#007E93] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-zinc-50">
                <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                <span className="text-xs font-medium text-zinc-800">
                  Click to upload media kit / pitch deck
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5">PDF or DOCX up to 25MB</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {fileError && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fileError}</span>
              </p>
            )}
          </div>

          {/* Portfolio Item Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-800 block">
              Highlight Past Content / Portfolio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentCreator.portfolio.slice(0, 4).map((p) => {
                const isSelected = selectedPortfolio.includes(p.title);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePortfolio(p.title)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#007E93]/10 border-[#007E93] text-zinc-900'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{p.title}</p>
                      <p className="text-[10px] text-zinc-500">
                        {p.platform} • {(p.views / 1000).toFixed(0)}k views
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#007E93] text-white' : 'border border-zinc-400'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rate & Availability Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 block">Proposed Starting Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-zinc-500">₹</span>
                <input
                  type="number"
                  step="500"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(Number(e.target.value))}
                  required
                  className="w-full pl-7 pr-3.5 py-2.5 text-xs font-mono font-semibold rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 block">Your Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007E93]"
              >
                <option value="Available Now (Within 48h)">Available Now (Within 48h)</option>
                <option value="Next 1-2 Weeks">Next 1-2 Weeks</option>
                <option value="Next Month (Q4 Reserve)">Next Month (Q4 Reserve)</option>
                <option value="Custom Schedule">Custom Schedule (Discuss in Chat)</option>
              </select>
            </div>
          </div>

          {/* Proposed Deliverables */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">
              Deliverables Included in Proposal
            </label>
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
        </form>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 px-6 border-t border-black/[0.08] bg-zinc-50 flex items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-500 hidden sm:block">
            Track real-time pitch status under <strong className="text-zinc-800">Opportunities</strong>
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
              <span>{isSubmitting ? 'Delivering Pitch...' : 'Send Pitch to Brand'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
