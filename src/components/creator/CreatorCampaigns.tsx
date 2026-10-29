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
import { getSafeCurrentCreator } from '../../data/demoFixtures';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Modal } from '../ui/Modal';
import { SpatialEmptyState } from '../ui/SpatialEmptyState';

export const CreatorCampaigns: React.FC<{
  onOpenSubmissionModal: () => void;
  onNavigate?: (tab: string) => void;
}> = ({
  onOpenSubmissionModal,
  onNavigate,
}) => {
  const { outreachItems, creators, submissions, userProfile, authUser } = useAppState();
  const currentCreator = getSafeCurrentCreator(creators, userProfile, authUser);

  const confirmedCampaigns = outreachItems.filter(
    (i) => (i.creatorId === currentCreator.id || i.creatorId === 'demo-creator-01') && i.stage === 'Confirmed'
  );

  const [selectedCampaign, setSelectedCampaign] = useState<typeof confirmedCampaigns[0] | null>(null);

  return (
    <div className="space-y-5 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display tracking-tight">
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
              leftIcon={<Video className="w-3.5 h-3.5 text-[#007E93]" />}
              className="border-[#00B4D8]/30 hover:border-[#007E93]/40 text-zinc-800"
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
          <SpatialEmptyState
            title="No Active Brand Campaigns"
            description="You do not have any confirmed brand campaigns yet. Discover brands or accept inbound briefs to begin."
            icon={Layers}
            actionLabel="Discover Brands"
            onAction={() => onNavigate?.('discover')}
          />
        ) : (
          confirmedCampaigns.map((camp) => (
            <Card key={camp.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 font-display">
                      {camp.campaignName}
                    </h2>
                    <Badge variant="success" size="sm" dot>
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Aura Streetwear Co. · <strong className="text-emerald-700 font-mono">₹{camp.proposedFee.toLocaleString()}</strong>
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
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">Campaign Milestone Tracker</span>
                  <span className="font-mono text-emerald-700 font-semibold">Stage 2 of 4 Active</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {/* Step 1 */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-500/30 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1. Contract Signed</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Advance 50% released</p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#007E93] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#007E93] animate-pulse" />
                      <span>2. Content Submission</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Draft uploaded for AI pre-check</p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
                      <span>3. Brand Approval</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Sign-off on creative cut</p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
                      <span>4. Publishing & Final Payout</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Scheduled drop date</p>
                  </div>
                </div>
              </div>

              {/* Deliverable Action Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1 border-t border-zinc-200">
                <div className="flex items-center gap-4 text-zinc-500">
                  <span>Scope: <strong className="text-zinc-800">1x 4K Reel + 2x Stories</strong></span>
                  <span>Due: <strong className="text-zinc-800">Oct 12, 2026</strong></span>
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
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="font-semibold text-zinc-800">Deliverable Instructions</h4>
              <p className="text-zinc-700 leading-relaxed">
                Highlight the reflective 3M details and cushioning comfort of the Aura High-Top 01. Must tag @aurastreetwear in opening caption and include promo link in story highlights.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="font-semibold text-zinc-800">Agreed Compensation Schedule</h4>
              <p className="text-zinc-700">
                Total: <strong>₹{selectedCampaign.proposedFee.toLocaleString()}</strong> (₹17,500 upon contract execution; ₹17,500 upon content approval).
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
