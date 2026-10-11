import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  Film,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { DeliverableType, AiPreCheckResult } from '../../types';
import { AiCampaignEngine } from '../../services/aiService';

interface CreatorSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorSubmissionModal: React.FC<CreatorSubmissionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitContent, campaigns, creators, triggerCelebration } = useAppState();

  const currentCreator = creators[0];
  const activeCampaign = campaigns[0];

  const [title, setTitle] = useState('Aura High-Top 01 Street Styling & Grip Test in Colaba');
  const [deliverableType, setDeliverableType] = useState<DeliverableType>('Reel');
  const [caption, setCaption] = useState(
    'Taking the new @aurastreetwear High-Tops through Mumbai streets. Notice the 3M piping when flash hits! Code ROHANKICKS for 15% off link in bio 👟🔥'
  );
  const [cta, setCta] = useState('Tap link in bio and use code ROHANKICKS for 15% off');
  const [hashtags, setHashtags] = useState('#AuraStreetwear, #SneakerAddict, #MumbaiKicks');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80'
  );

  const [aiPreCheck, setAiPreCheck] = useState<AiPreCheckResult | null>(null);
  const [isPreChecking, setIsPreChecking] = useState(false);

  const handleRunPreCheck = () => {
    setIsPreChecking(true);
    setTimeout(() => {
      const result = AiCampaignEngine.runPreCheck({
        caption,
        cta,
        hashtags: hashtags.split(',').map((h) => h.trim()),
        videoDurationSec: 38,
        requiredBrandTag: '@aurastreetwear',
      });
      setAiPreCheck(result);
      setIsPreChecking(false);
    }, 500);
  };

  const handleSubmit = () => {
    submitContent({
      campaignId: activeCampaign.id,
      campaignName: activeCampaign.name,
      creatorId: currentCreator.id,
      creatorName: currentCreator.name,
      creatorHandle: currentCreator.handle,
      creatorAvatar: currentCreator.avatar,
      deliverableType,
      title,
      mediaUrl,
      caption,
      hashtags: hashtags.split(',').map((h) => h.trim()),
      cta,
    });
    triggerCelebration();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 font-display">
              Submit Content Draft
            </h2>
            <p className="text-xs text-zinc-400">
              Upload creative asset for <strong className="text-zinc-200">"{activeCampaign.name}"</strong>
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunPreCheck}
            isLoading={isPreChecking}
            leftIcon={<Sparkles className="w-4 h-4 text-indigo-400" />}
            className="text-xs"
          >
            Run Live AI Pre-Check
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              leftIcon={<Upload className="w-4 h-4" />}
              className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
            >
              Submit for Brand Approval
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Deliverable Type & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Deliverable Draft Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Aura High-Top Colaba Styling Showcase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Deliverable Format
            </label>
            <select
              value={deliverableType}
              onChange={(e) => setDeliverableType(e.target.value as DeliverableType)}
              className="w-full bg-zinc-900 text-zinc-100 text-xs py-2.5 px-3 rounded-xl border border-zinc-700/80 focus:outline-none"
            >
              <option value="Reel">Instagram Reel</option>
              <option value="Story">Instagram Story</option>
              <option value="YouTube Video">YouTube Video</option>
              <option value="Short">YouTube Short</option>
              <option value="UGC">Raw UGC Asset</option>
            </select>
          </div>
        </div>

        {/* Media Preview / Upload Area */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          <div className="sm:col-span-4 rounded-2xl bg-black border border-zinc-800 overflow-hidden relative aspect-[9/16] max-h-56 mx-auto shadow-xl">
            <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-[10px] text-zinc-400 font-mono">Simulated 4K 9:16 Video</span>
            </div>
          </div>

          <div className="sm:col-span-8 space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Post Caption & Hook
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Include mandatory brand mentions and description..."
                className="w-full bg-zinc-900 text-zinc-100 text-xs p-3 rounded-xl border border-zinc-700/80 focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            <Input
              label="Call to Action (CTA)"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="e.g. Tap link in bio and use code ROHAN15"
            />

            <Input
              label="Hashtags (Comma-separated)"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#AuraStreetwear, #Sneakers"
            />
          </div>
        </div>

        {/* LIVE AI PRE-CHECK PANEL */}
        {aiPreCheck && (
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Live AI Pre-Check Verification
                </h4>
              </div>
              <Badge
                variant={
                  aiPreCheck.overallStatus === 'passed'
                    ? 'success'
                    : aiPreCheck.overallStatus === 'warning'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {aiPreCheck.overallStatus.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-2">
                {aiPreCheck.productVisible ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="text-zinc-300">Product in center frame</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-2">
                {aiPreCheck.brandMention ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="text-zinc-300">Brand tagged (@aurastreetwear)</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-2">
                {aiPreCheck.requiredCta ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="text-zinc-300">CTA includes bio link/code</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-2">
                {aiPreCheck.durationCompliant ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="text-zinc-300">Duration (38s) compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
