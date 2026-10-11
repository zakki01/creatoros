import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Download,
  ShieldCheck,
  Eye,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const ContractsWorkspace: React.FC = () => {
  const { outreachItems, campaigns, activeCampaignId } = useAppState();

  const [selectedContract, setSelectedContract] = useState<typeof outreachItems[0] | null>(null);

  const confirmedPartners = outreachItems.filter((i) => i.stage === 'Confirmed');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display">
              Creator Contracts & Rights
            </h1>
            <Badge variant="brand" size="sm">
              Smart Agreements
            </Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Legally binding digital collaboration agreements, commercial usage licenses, and deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>{confirmedPartners.length} Active Executed Contracts</span>
        </div>
      </div>

      {/* Contracts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Contract ID</th>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Compensation</th>
                <th className="py-3 px-4">Commercial Rights</th>
                <th className="py-3 px-4">Signature Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {confirmedPartners.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-850/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    AGR-2026-{item.id.slice(-4)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.creator.avatar}
                        alt={item.creator.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-700"
                      />
                      <div>
                        <p className="font-semibold text-zinc-200">{item.creator.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">@{item.creator.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300 font-medium">{item.campaignName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-100">
                    ₹{item.proposedFee.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    12 Months Digital Whitelisting + UGC Re-use
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm" dot>
                      Signed Digitally
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContract(item)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="text-xs"
                    >
                      View Agreement
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <Modal
          isOpen={!!selectedContract}
          onClose={() => setSelectedContract(null)}
          title={`Influencer Agreement: ${selectedContract.creator.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Agreement Reference:</span>
                <span className="font-mono text-zinc-200">AGR-2026-{selectedContract.id.slice(-4)}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Governing Brand:</span>
                <span className="text-zinc-200 font-semibold">{selectedContract.campaignName}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Total Compensation:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{selectedContract.proposedFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Escrow Schedule:</span>
                <span className="text-zinc-200">50% Advance Upon Signing, 50% Upon Content Approval</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800">
              <h4 className="font-semibold text-zinc-200">Deliverable Clauses & Exclusivity</h4>
              <p className="text-zinc-400 leading-relaxed">
                1. Creator will deliver 1x 4K Cinematic Reel (30-45 seconds) and 2x Instagram Stories containing verified UTM affiliate tracking links.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                2. Brand receives 12 months non-exclusive global digital distribution and Meta Ads whitelisting rights.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                3. Creator agrees to 30 days category exclusivity against competing footwear manufacturers.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Verified Cryptographic Signature Timestamped</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400/80">SHA-256 SECURED</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
