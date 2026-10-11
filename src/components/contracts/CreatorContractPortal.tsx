import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Check,
  X,
  Upload,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { BrandContract, ContractFile } from '../../types/contract';
import { ContractService } from '../../services/contractService';
import { ContractStatusBadge } from './ContractStatusBadge';

interface CreatorContractPortalProps {
  creatorId?: string;
  onOpenMessages?: (brandId: string) => void;
}

export const CreatorContractPortal: React.FC<CreatorContractPortalProps> = ({
  creatorId = 'cr-01',
  onOpenMessages,
}) => {
  const [contracts, setContracts] = useState<BrandContract[]>(() =>
    ContractService.getAllContracts({ creatorId })
  );

  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Deliverable upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [targetDeliverableId, setTargetDeliverableId] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [simulatedFiles, setSimulatedFiles] = useState<string[]>([
    'AlexMorgan_LookbookCut_4K.mp4',
    'ColorGrade_LUT_export.cube',
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const reloadContracts = () => {
    const list = ContractService.getAllContracts({ creatorId });
    setContracts(list);
  };

  const selectedContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const handleAccept = (contractId: string) => {
    const res = ContractService.acceptContract(contractId);
    if (res.success) {
      setFeedback('Contract accepted! Brand notified to fund project protection.');
      reloadContracts();
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDecline = (contractId: string) => {
    const res = ContractService.declineContract(contractId);
    if (res.success) {
      setFeedback('Contract declined.');
      reloadContracts();
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleSubmitDelivery = () => {
    if (!selectedContract || !targetDeliverableId) return;

    const uploadedFiles: ContractFile[] = simulatedFiles.map((fn, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: fn,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      sizeBytes: 24500000,
      mimeType: 'video/mp4',
      uploadedAt: new Date().toISOString(),
      category: 'deliverable',
    }));

    const res = ContractService.submitDeliverable(
      selectedContract.id,
      targetDeliverableId,
      deliveryNotes || 'Final deliverables exported in 4K ProRes.',
      uploadedFiles
    );

    if (res.success) {
      setFeedback('Deliverable submitted successfully! Brand review window active.');
      setIsUploadModalOpen(false);
      setDeliveryNotes('');
      reloadContracts();
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              Creator Contracts & Partnerships
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Protected Agreements
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Review incoming offers, accept terms, upload media deliverables, and monitor guaranteed payouts.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Contracts List + Active Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Contracts List (5 columns) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            All Partnerships ({contracts.length})
          </h3>

          <div className="space-y-2.5">
            {contracts.map((c) => {
              const isSelected = selectedContract?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContractId(c.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-850 border-indigo-500 shadow-md'
                      : 'bg-zinc-900/60 border-white/[0.08] hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.brandLogo}
                        alt={c.brandName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-700 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">{c.brandName}</h4>
                        <p className="text-[10px] text-zinc-400 font-mono">{c.contractNumber}</p>
                      </div>
                    </div>

                    <ContractStatusBadge status={c.status} size="sm" />
                  </div>

                  <p className="text-xs font-medium text-zinc-200 mt-2 line-clamp-1">
                    {c.projectName}
                  </p>

                  <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400">
                      ${c.payment.creatorPayment.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-zinc-400">Due {c.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Contract Workspace (7 columns) */}
        {selectedContract && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] space-y-6 text-xs text-zinc-300">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                  {selectedContract.contractNumber}
                </span>
                <h3 className="text-base font-bold text-white font-display mt-0.5">
                  {selectedContract.projectName}
                </h3>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  Brand: <strong className="text-zinc-200">{selectedContract.brandName}</strong>
                </p>
              </div>

              <ContractStatusBadge status={selectedContract.status} />
            </div>

            {/* Awaiting Acceptance Callout */}
            {selectedContract.status === 'awaiting_creator' && (
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-indigo-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-xs text-white">Action Required: Review & Sign Agreement</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Review the deliverables, licensing scope, and guaranteed compensation below. Accepting binds this contract digitally.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleAccept(selectedContract.id)}
                    className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept & Begin Project</span>
                  </button>

                  <button
                    onClick={() => handleDecline(selectedContract.id)}
                    className="min-h-[44px] px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Decline Offer
                  </button>
                </div>
              </div>
            )}

            {/* Compensation & Protection Card */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block">Your Payout</span>
                <span className="text-base font-bold text-emerald-400">
                  ${selectedContract.payment.creatorPayment.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block">Protection Status</span>
                <span className="text-zinc-200 font-semibold">
                  {selectedContract.payment.paymentStatus === 'escrow_funded'
                    ? '✓ Held in Protection'
                    : selectedContract.payment.paymentStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block">Revisions Included</span>
                <span className="text-zinc-200 font-semibold">
                  {selectedContract.terms.includedRevisions} rounds max
                </span>
              </div>
            </div>

            {/* Deliverables List & Upload Action */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Deliverables & Submissions
              </h4>

              <div className="space-y-2.5">
                {selectedContract.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100">
                          {del.type} × {del.quantity}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {del.format}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">Due {del.dueDate}</span>
                    </div>

                    <p className="text-[11px] text-zinc-400">{del.specifications}</p>

                    {/* Submit Deliverable Button (if active or revision) */}
                    {(selectedContract.status === 'active' ||
                      selectedContract.status === 'revision_requested' ||
                      del.status === 'revision') && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setTargetDeliverableId(del.id);
                            setIsUploadModalOpen(true);
                          }}
                          className="min-h-[44px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Work ({del.type})</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Commercial Rights Summary */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Licensed Rights & Exclusivity
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Channels: <strong className="text-zinc-200">{selectedContract.usageRights.usageTypes.join(', ')}</strong> •
                Duration: <strong className="text-zinc-200">{selectedContract.usageRights.duration}</strong> •
                Territory: <strong className="text-zinc-200">{selectedContract.usageRights.territory}</strong> •
                Exclusivity: <strong className="text-zinc-200">{selectedContract.usageRights.exclusivity}</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* UPLOAD DELIVERABLE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-white">Upload Deliverable Assets</h3>
            <p className="text-zinc-400">
              Attach finished video cuts, raw stills, or deliverables. Once submitted, the brand review window starts.
            </p>

            <div className="p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 text-center space-y-2">
              <Upload className="w-6 h-6 text-indigo-400 mx-auto" />
              <p className="text-xs font-semibold text-zinc-200">Attached Deliverables (2 files)</p>
              <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                {simulatedFiles.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-300 block mb-1">
                Creator Delivery Notes
              </label>
              <textarea
                rows={3}
                placeholder="Describe your edits, music licenses, or framing..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-800 text-zinc-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitDelivery}
                className="min-h-[44px] px-5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
              >
                Submit Work
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
