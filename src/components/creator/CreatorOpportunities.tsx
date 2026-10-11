import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  Film,
  Building2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { OutreachItem } from '../../types';

export const CreatorOpportunities: React.FC = () => {
  const {
    outreachItems,
    acceptOpportunity,
    declineOpportunity,
    creators,
  } = useAppState();

  const currentCreator = creators[0];
  const [selectedBrief, setSelectedBrief] = useState<OutreachItem | null>(null);

  // Incoming opportunities: Contacted or Interested or Selected
  const opportunities = outreachItems.filter(
    (i) => i.creatorId === currentCreator.id
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display">
              Campaign Opportunities
            </h1>
            <Badge variant="brand" size="sm">
              AI Tailored
            </Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Personalized campaign invitations from premium brands matched to your content style and audience.
          </p>
        </div>

        <div className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl">
          Profile: <strong className="text-zinc-200">@{currentCreator.handle}</strong> ({currentCreator.category})
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-5">
        {opportunities.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <p className="text-sm font-medium text-zinc-300">No pending opportunities right now.</p>
            <p className="text-xs text-zinc-500">Brands discover your profile automatically via Creator Passport.</p>
          </div>
        ) : (
          opportunities.map((opp) => {
            const isConfirmed = opp.stage === 'Confirmed';
            const isDeclined = opp.stage === 'Declined';

            return (
              <Card
                key={opp.id}
                className={`p-6 space-y-5 transition-all ${
                  isConfirmed ? 'border-emerald-500/40 bg-zinc-900/90' : 'hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-zinc-100 font-display">
                        {opp.campaignName}
                      </h3>
                      {isConfirmed ? (
                        <Badge variant="success" size="sm" dot>
                          Accepted & Confirmed
                        </Badge>
                      ) : isDeclined ? (
                        <Badge variant="danger" size="sm">
                          Declined
                        </Badge>
                      ) : (
                        <Badge variant="brand" size="sm">
                          Active Invitation
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Brand: <strong className="text-zinc-200">Aura Streetwear Co.</strong> • Location: <strong className="text-zinc-200">Mumbai</strong>
                    </p>
                  </div>

                  {/* AI Match Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse-subtle" />
                    <span>AI MATCH: 94%</span>
                  </div>
                </div>

                {/* Compensation & Deliverables Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Compensation</span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      ₹{opp.proposedFee.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Scope</span>
                    <span className="font-semibold text-zinc-200">1x Reel + 2x Stories</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Deadline</span>
                    <span className="font-semibold text-zinc-200">October 12, 2026</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Sampling</span>
                    <span className="font-semibold text-zinc-200">Sneaker Physical Drop</span>
                  </div>
                </div>

                {/* Why You Match (As specified in prompt) */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why you match this campaign:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 text-[11px]">
                    <p>• <strong>Fashion niche:</strong> Sneaker styling authority with verified high engagement</p>
                    <p>• <strong>Mumbai audience:</strong> 44% of your followers are located in the launch target city</p>
                    <p>• <strong>Previous sneaker drop:</strong> 4.2x ROAS achieved on your past footwear campaign</p>
                    <p>• <strong>Audience age match:</strong> 88% aged 18-34, matching Aura buyer persona</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBrief(opp)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    View Campaign Brief
                  </Button>

                  {!isConfirmed && !isDeclined ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => declineOpportunity(opp.id)}
                        className="text-xs text-zinc-400 hover:text-rose-400 hover:border-rose-500/30"
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => acceptOpportunity(opp.id)}
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                      >
                        Accept Campaign & Lock ₹{opp.proposedFee.toLocaleString()}
                      </Button>
                    </div>
                  ) : isConfirmed ? (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Campaign Accepted • Contract Generated</span>
                    </span>
                  ) : null}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Brief Modal */}
      {selectedBrief && (
        <Modal
          isOpen={!!selectedBrief}
          onClose={() => setSelectedBrief(null)}
          title={`Campaign Brief: ${selectedBrief.campaignName}`}
          maxWidth="2xl"
          footer={
            selectedBrief.stage !== 'Confirmed' ? (
              <div className="flex items-center justify-end gap-2 w-full">
                <Button variant="ghost" size="sm" onClick={() => setSelectedBrief(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    acceptOpportunity(selectedBrief.id);
                    setSelectedBrief(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  Accept Campaign Offer
                </Button>
              </div>
            ) : undefined
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h4 className="font-semibold text-zinc-200">Creative Scope & Requirements</h4>
              <p className="text-zinc-300 leading-relaxed">
                Create 1x cinematic 4K Reel showcasing the reflective 3M details and comfort grip of the new Aura sneaker silhouette in an authentic urban setting.
              </p>
              <ul className="space-y-1 text-zinc-400 pl-4 list-disc">
                <li>Video length: 30 to 45 seconds</li>
                <li>Tag @aurastreetwear in first two lines of caption</li>
                <li>Include custom discount link in Instagram story highlight</li>
                <li>Submit draft before Oct 12 for automated AI Pre-Check</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <h4 className="font-semibold text-zinc-200">Payment Escrow Terms</h4>
              <p className="text-zinc-400">
                50% advance (₹17,500) released into your bank account upon digital contract signature; remaining 50% released immediately upon content approval.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
