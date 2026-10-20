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
    <div className="space-y-5 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
            Opportunities
          </h1>
          <Badge variant="brand" size="sm">
            {opportunities.length}
          </Badge>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.length === 0 ? (
          <div className="p-10 text-center rounded-3xl surface-2 space-y-1.5">
            <p className="text-sm font-medium text-zinc-200">No pending opportunities</p>
            <p className="text-xs text-zinc-400">New brand invitations appear here.</p>
          </div>
        ) : (
          opportunities.map((opp) => {
            const isConfirmed = opp.stage === 'Confirmed';
            const isDeclined = opp.stage === 'Declined';

            return (
              <Card
                key={opp.id}
                className={`p-5 space-y-4 transition-all ${
                  isConfirmed ? 'border-emerald-500/40' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white font-display">
                        {opp.campaignName}
                      </h3>
                      {isConfirmed ? (
                        <Badge variant="success" size="sm" dot>
                          Accepted
                        </Badge>
                      ) : isDeclined ? (
                        <Badge variant="danger" size="sm">
                          Declined
                        </Badge>
                      ) : (
                        <Badge variant="brand" size="sm">
                          Invite
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Aura Streetwear Co. · Mumbai · 1x Reel + 2x Stories · Due Oct 12
                    </p>
                  </div>

                  {/* Compensation + Match */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                      ₹{opp.proposedFee.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      94% Match
                    </span>
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
                    View
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
                        Accept
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
