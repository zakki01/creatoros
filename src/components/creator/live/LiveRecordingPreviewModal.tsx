import React, { useState } from 'react';
import {
  X,
  Download,
  Send,
  Sparkles,
  CheckCircle2,
  Film,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { LiveRecordedClip } from '../../../types';
import { useAppState } from '../../../context/StateContext';
import { getSafeCurrentCreator } from '../../../data/demoFixtures';

interface LiveRecordingPreviewModalProps {
  clip: LiveRecordedClip | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmittedSuccess?: () => void;
}

export const LiveRecordingPreviewModal: React.FC<LiveRecordingPreviewModalProps> = ({
  clip,
  isOpen,
  onClose,
  onSubmittedSuccess,
}) => {
  const { campaigns, submitContent, triggerCelebration, creators, userProfile, authUser } = useAppState();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );
  const [title, setTitle] = useState(
    clip ? `${clip.sceneName} Reel Cut` : 'Live Studio Reel'
  );
  const [caption, setCaption] = useState(
    clip
      ? `Realtime styled with CreatorOS Live Studio (${clip.sceneName} scene). Styled with Decart.`
      : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  if (!isOpen || !clip) return null;

  const currentCreator = getSafeCurrentCreator(creators, userProfile, authUser);
  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = clip.url;
    a.download = `creatoros-${clip.sceneId}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmitToCampaign = () => {
    if (!selectedCampaign) return;
    setIsSubmitting(true);

    try {
      submitContent({
        campaignId: selectedCampaign.id,
        campaignName: selectedCampaign.name,
        creatorId: currentCreator.id,
        creatorName: currentCreator.name,
        creatorHandle: currentCreator.handle,
        creatorAvatar: currentCreator.avatar,
        deliverableType: 'Reel',
        title: title || `${clip.sceneName} Live Studio Reel`,
        mediaUrl: clip.url,
        mediaType: 'video',
        caption: caption,
        hashtags: [`#${clip.sceneId}`, '#CreatorOS', '#LiveStudio'],
        cta: 'Check out the link in bio for exclusive drop details.',
      });

      triggerCelebration();
      setSubmittedNotice(true);

      setTimeout(() => {
        setSubmittedNotice(false);
        setIsSubmitting(false);
        if (onSubmittedSuccess) onSubmittedSuccess();
        onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Recorded Live Clip Preview
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                {clip.sceneName} • {clip.durationSec}s duration • {clip.aspectRatio} format
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Video Player */}
          <div className="flex flex-col items-center justify-center bg-black/60 rounded-xl p-3 border border-zinc-200">
            <div
              className={`relative rounded-lg overflow-hidden bg-black flex items-center justify-center ${
                clip.aspectRatio === '9:16'
                  ? 'w-[200px] h-[355px]'
                  : clip.aspectRatio === '16:9'
                  ? 'w-full aspect-video'
                  : 'w-[260px] h-[260px]'
              }`}
            >
              <video
                src={clip.url}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Download Button */}
            <div className="mt-4 w-full">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-semibold text-zinc-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Video File (.webm)</span>
              </button>
            </div>
          </div>

          {/* Right: Submit to Campaign Workflow */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-200/60">
                <Layers className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                  Submit Directly to Campaign
                </h3>
              </div>

              {/* Select Campaign */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                  Target Campaign
                </label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                >
                  {campaigns.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.name} ({camp.brandName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Launch Reel - Cut 1"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                  Caption & Description
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Include hashtags, mentions, and call-to-action"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>

              {/* AI Pre-check Reminder */}
              <div className="p-2.5 rounded-lg bg-[#00B4D8]/10 border border-[#007E93]/20 text-[11px] text-[#007E93] flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#007E93] shrink-0 mt-0.5" />
                <span>
                  Automatic AI Pre-check will run compliance against the brand guidelines upon submission.
                </span>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-3">
              {submittedNotice ? (
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-500/40 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Submitted Successfully! Added to review queue.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitToCampaign}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit to Brand for Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
