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
import { getSafeCurrentCreator } from '../../data/demoFixtures';
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
  const { userProfile, authUser, creators, addOutreachItem, addNotification, triggerCelebration } =
    useAppState();

  const currentCreator = getSafeCurrentCreator(creators, userProfile, authUser);

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
        className="relative w-full max-w-2xl rounded-3xl bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-muted)]">
          <div className="flex items-center gap-3">
            <img
              src={brandData.logo}
              alt={brandData.name}
              className="w-10 h-10 rounded-2xl object-cover ring-1 ring-[var(--border)] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
                  Pitch to {brandData.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono">Direct Creator Pitch Pipeline</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorNotice && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Attached Creator Profile Summary */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentCreator.avatar}
                alt={currentCreator.name}
                className="w-11 h-11 rounded-2xl object-cover ring-1 ring-[var(--primary)]/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{currentCreator.name}</span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">@{currentCreator.handle}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {currentCreator.category} • {(currentCreator.totalFollowers / 1000).toFixed(0)}k Followers •{' '}
                  <span className="text-emerald-700 font-semibold">{currentCreator.avgEngagement}% Eng.</span>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              Profile Attached ✓
            </span>
          </div>

          {/* Campaign Brief Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)] block">Target Brief / Opportunity</label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="e.g. Summer Drop 2026 Ambassador & Editorial Reels"
            />
          </div>

          {/* Personalized Pitch Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Personalized Creative Pitch <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                {pitchMessage.length} chars (min 20)
              </span>
            </div>
            <textarea
              rows={4}
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              required
              placeholder={`Hi ${brandData.name} team, I love your latest collection aesthetic! Here is how I plan to create a high-conversion 4K transition reel styling your core pieces with authentic storytelling...`}
              className="w-full p-3.5 text-xs rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none leading-relaxed"
            />
          </div>

          {/* Pitch Deck Upload with validation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Attach Pitch Deck or Rate Card (PDF, DOCX)</span>
              <span className="text-[10px] text-[var(--text-muted)]">Max size 25MB</span>
            </label>

            {uploadedFile ? (
              <div className="p-3 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center text-[var(--primary)]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{uploadedFile.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{uploadedFile.sizeMB}</p>
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
              <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)]">
                <Upload className="w-5 h-5 text-[var(--text-muted)] mb-1" />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  Click to upload media kit / pitch deck
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5">PDF or DOCX up to 25MB</span>
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
            <label className="text-xs font-semibold text-[var(--text-primary)] block">
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
                        ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--text-primary)]'
                        : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border)]'
                    }`}
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{p.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {p.platform} • {(p.views / 1000).toFixed(0)}k views
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[var(--primary)] text-white' : 'border border-zinc-400'
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
              <label className="text-xs font-semibold text-[var(--text-primary)] block">Proposed Starting Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  step="500"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(Number(e.target.value))}
                  required
                  className="w-full pl-7 pr-3.5 py-2.5 text-xs font-mono font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] block">Your Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
            <label className="text-xs font-semibold text-[var(--text-primary)] block">
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
                        ? 'bg-[var(--primary)] text-white shadow-xs'
                        : 'bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)] text-[var(--text-secondary)] border border-[var(--border)]'
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
        <div className="p-4 px-6 border-t border-[var(--border)] bg-[var(--surface-muted)] flex items-center justify-between gap-3">
          <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">
            Track real-time pitch status under <strong className="text-[var(--text-primary)]">Opportunities</strong>
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
