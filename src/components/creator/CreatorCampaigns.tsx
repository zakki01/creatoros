import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Calendar,
  Clock,
  Upload,
  FileText,
  ShieldCheck,
  Eye,
  MessageSquare,
  ArrowRight,
  Video,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Modal } from '../ui/Modal';

export const CreatorCampaigns: React.FC<{
  onOpenSubmissionModal: () => void;
  onNavigate?: (tab: string) => void;
}> = ({
  onOpenSubmissionModal,
  onNavigate,
}) => {
  const { outreachItems, creators, submissions } = useAppState();
  const currentCreator = creators[0];

  const confirmedCampaigns = outreachItems.filter(
    (i) => i.creatorId === currentCreator.id && i.stage === 'Confirmed'
  );

  const [selectedCampaign, setSelectedCampaign] = useState<typeof confirmedCampaigns[0] | null>(null);

  return (
    <div className="space-y-5 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
            Campaigns
          </h1>
          <Badge variant="success" size="sm" dot>
            {confirmedCampaigns.length} Active
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('live')}
              leftIcon={<Video className="w-3.5 h-3.5 text-indigo-400" />}
              className="border-indigo-500/30 hover:border-indigo-500/60 text-zinc-200"
            >
              Live Studio
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenSubmissionModal}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        {confirmedCampaigns.length === 0 ? (
          <Card className="p-10 text-center text-zinc-400 text-xs">
            No active campaigns.
          </Card>
        ) : (
          confirmedCampaigns.map((camp) => (
            <Card key={camp.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white font-display">
                      {camp.campaignName}
                    </h2>
                    <Badge variant="success" size="sm" dot>
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Aura Streetwear Co. · <strong className="text-emerald-400 font-mono">₹{camp.proposedFee.toLocaleString()}</strong>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCampaign(camp)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  View
                </Button>

              </div>

              {/* Progress Milestones Tracker (As specified in prompt) */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">Campaign Milestone Tracker</span>
                  <span className="font-mono text-emerald-400 font-semibold">Stage 2 of 4 Active</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {/* Step 1 */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1. Contract Signed</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Advance 50% released</p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      <span>2. Content Submission</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Draft uploaded for AI pre-check</p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1 opacity-70">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-semibold">
                      <span>3. Brand Approval</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Sign-off on creative cut</p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1 opacity-70">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-semibold">
                      <span>4. Publishing & Final Payout</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Scheduled drop date</p>
                  </div>
                </div>
              </div>

              {/* Deliverable Action Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1 border-t border-zinc-800">
                <div className="flex items-center gap-4 text-zinc-400">
                  <span>Scope: <strong className="text-zinc-200">1x 4K Reel + 2x Stories</strong></span>
                  <span>Due: <strong className="text-zinc-200">Oct 12, 2026</strong></span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenSubmissionModal}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  className="bg-emerald-600 hover:bg-emerald-500 text-xs"
                >
                  Upload Reel Video Draft
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Contract & Brief Modal */}
      {selectedCampaign && (
        <Modal
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          title={`Campaign Brief: ${selectedCampaign.campaignName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h4 className="font-semibold text-zinc-200">Deliverable Instructions</h4>
              <p className="text-zinc-300 leading-relaxed">
                Highlight the reflective 3M details and cushioning comfort of the Aura High-Top 01. Must tag @aurastreetwear in opening caption and include promo link in story highlights.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <h4 className="font-semibold text-zinc-200">Agreed Compensation Schedule</h4>
              <p className="text-zinc-300">
                Total: <strong>₹{selectedCampaign.proposedFee.toLocaleString()}</strong> (₹17,500 upon contract execution; ₹17,500 upon content approval).
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
