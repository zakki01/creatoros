import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Save,
  Search,
  Filter,
  Users,
  Film,
  DollarSign,
  Calendar,
  FileText,
  Send,
  Plus,
  Lock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import {
  BrandContract,
  ContractDeliverable,
  ContractUsageRights,
  ContractTerms,
  ContractPayment,
  UsageRightType,
  UsageDuration,
  UsageTerritory,
  UsageExclusivity,
  UsageOwnership,
  PaymentProviderType,
} from '../../types/contract';
import { ContractService, CONTRACT_TEMPLATES } from '../../services/contractService';
import { DeliverableBuilderCard } from './DeliverableBuilderCard';
import { ContractRiskScanner } from './ContractRiskScanner';
import { ContractStatusBadge } from './ContractStatusBadge';

interface ContractBuilderPageProps {
  initialContractId?: string | null;
  initialCreatorId?: string | null;
  initialCampaignId?: string | null;
  onBack: () => void;
  onContractCreated: (contractId: string) => void;
}

export const ContractBuilderPage: React.FC<ContractBuilderPageProps> = ({
  initialContractId,
  initialCreatorId,
  initialCampaignId,
  onBack,
  onContractCreated,
}) => {
  const { creators, campaigns } = useAppState();

  // Active step (0 to 7 -> 8 steps)
  const [currentStep, setCurrentStep] = useState(0);

  // Autosave timing feedback
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isSaving, setIsSaving] = useState(false);
  const [showSendConfirmation, setShowSendConfirmation] = useState(false);

  // Filter state for Step 01 Creator Selection
  const [creatorSearch, setCreatorSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Draft contract state
  const [contractDraft, setContractDraft] = useState<Partial<BrandContract>>(() => {
    // If an existing contract was passed, load it
    if (initialContractId) {
      const existing = ContractService.getContractById(initialContractId);
      if (existing) return existing;
    }

    // Default pre-fill
    const selectedCreator = initialCreatorId
      ? creators.find((c) => c.id === initialCreatorId)
      : null;

    const selectedCampaign = initialCampaignId
      ? campaigns.find((c) => c.id === initialCampaignId)
      : null;

    return {
      id: `draft-${Date.now()}`,
      contractNumber: `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      brandId: 'brand-01',
      brandName: 'Aura Streetwear Co.',
      brandLogo:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
      creatorId: selectedCreator?.id || '',
      creatorName: selectedCreator?.name || '',
      creatorHandle: selectedCreator?.handle || '',
      creatorAvatar: selectedCreator?.avatar || '',
      creatorCategory: selectedCreator?.category || 'Fashion & Sneakers',
      creatorVerified: selectedCreator?.verified ?? true,
      campaignId: selectedCampaign?.id || '',
      campaignName: selectedCampaign?.name || '',
      projectName: selectedCampaign ? `${selectedCampaign.name} Creator Agreement` : '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      deliverables: [
        {
          id: `del-${Date.now()}`,
          type: 'Reel',
          quantity: 2,
          format: '9:16',
          duration: '30–60s',
          resolution: '1080x1920',
          specifications: 'Brand product visible in the first 5 seconds. Macro detail shot.',
          referenceFiles: [],
          dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
          status: 'pending',
        },
      ],
      payment: ContractService.calculatePaymentBreakdown(1000, 'USD', 'stripe'),
      usageRights: {
        usageTypes: ['Organic Social', 'Paid Ads'],
        duration: '90 Days',
        territory: 'Worldwide',
        exclusivity: 'None',
        ownership: 'creator_retains',
      },
      terms: {
        includedRevisions: 2,
        reviewPeriodDays: 3,
        creatorResponseDeadlineDays: 3,
        cancellationTerms: '50% compensation for verified work if cancelled post-submission.',
        lateDeliveryTerms: '5% deduction per unapproved late day.',
        additionalWorkTerms: 'Formal contract amendment required for scope additions.',
        confidentiality: true,
        communicationGuidelines: 'Official communications via CreatorOS messages.',
      },
      status: 'draft',
      risks: [],
      files: [],
      deliveries: [],
      amendments: [],
      version: 1,
    };
  });

  // Track autosave changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      ContractService.saveDraft(contractDraft);
      setLastSavedTime('A few seconds ago');
      setIsSaving(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [contractDraft]);

  const stepLabels = [
    'Creator',
    'Project',
    'Deliverables',
    'Payment',
    'Rights',
    'Terms',
    'Review',
    'Send',
  ];

  // Template pre-fill handler
  const handleApplyTemplate = (templateId: string) => {
    const tpl = CONTRACT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;

    setContractDraft((prev) => ({
      ...prev,
      projectName: prev.projectName || `${tpl.title}`,
      deliverables: tpl.suggestedDeliverables.map((d, i) => ({
        id: `del-${Date.now()}-${i}`,
        type: d.type || 'Reel',
        quantity: d.quantity || 1,
        format: d.format || '9:16',
        duration: d.duration || '',
        resolution: d.resolution || '',
        specifications: d.specifications || '',
        referenceFiles: [],
        dueDate: prev.deadline || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        status: 'pending',
      })),
      usageRights: {
        ...prev.usageRights!,
        ...tpl.suggestedRights,
      },
      terms: {
        ...prev.terms!,
        ...tpl.suggestedTerms,
      },
    }));
  };

  // Filtered creators for Step 01
  const filteredCreators = creators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(creatorSearch.toLowerCase()) ||
      c.handle.toLowerCase().includes(creatorSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(creatorSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Fashion & Sneakers', 'Tech & Lifestyle', 'Visual Design', 'Fitness'];

  // Deliverable modifiers
  const handleAddDeliverable = () => {
    const newDel: ContractDeliverable = {
      id: `del-${Date.now()}`,
      type: 'Photo',
      quantity: 1,
      format: '4:5',
      duration: '',
      resolution: '4K',
      specifications: '',
      referenceFiles: [],
      dueDate: contractDraft.deadline || '',
      status: 'pending',
    };
    setContractDraft((prev) => ({
      ...prev,
      deliverables: [...(prev.deliverables || []), newDel],
    }));
  };

  const handleUpdateDeliverable = (index: number, updated: ContractDeliverable) => {
    setContractDraft((prev) => {
      const list = [...(prev.deliverables || [])];
      list[index] = updated;
      return { ...prev, deliverables: list };
    });
  };

  const handleDuplicateDeliverable = (index: number) => {
    setContractDraft((prev) => {
      const list = [...(prev.deliverables || [])];
      const target = list[index];
      list.splice(index + 1, 0, {
        ...target,
        id: `del-${Date.now()}`,
      });
      return { ...prev, deliverables: list };
    });
  };

  const handleDeleteDeliverable = (index: number) => {
    setContractDraft((prev) => {
      const list = [...(prev.deliverables || [])];
      list.splice(index, 1);
      return { ...prev, deliverables: list };
    });
  };

  // Payment calculator
  const handlePaymentChange = (amount: number, provider: PaymentProviderType) => {
    const payment = ContractService.calculatePaymentBreakdown(amount, 'USD', provider);
    setContractDraft((prev) => ({ ...prev, payment }));
  };

  // Final Send Handler
  const handleFinalSend = () => {
    const saved = ContractService.saveDraft(contractDraft);
    const res = ContractService.sendContract(saved.id);
    if (res.success && res.contract) {
      onContractCreated(res.contract.id);
    }
  };

  // Evaluate risk warnings dynamically
  const currentRisks = ContractService.scanContractRisks(contractDraft);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 md:pb-12 animate-fade-in font-sans">
      {/* 1. Header Bar: Back, Title, Autosave indicator, Save Draft */}
      <div className="p-4 rounded-2xl bg-[var(--surface)]/90 border border-[var(--border)] shadow-sm flex items-center justify-between gap-4 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
            title="Back to contracts"
            aria-label="Back to contracts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-display">
                Create Contract
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)]">
                {contractDraft.contractNumber}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              {isSaving ? 'Saving draft...' : `Draft saved ${lastSavedTime}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              ContractService.saveDraft(contractDraft);
              setLastSavedTime('Just now');
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[var(--text-secondary)] border border-[var(--border)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {currentStep === 7 ? (
            <button
              onClick={() => setShowSendConfirmation(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-[var(--primary)]/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Contract</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-[var(--primary)]/20 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Step Progress Navigation Bar (Fitts's Law 44px hit-box pills) */}
      <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {stepLabels.map((label, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={label}
                onClick={() => setCurrentStep(idx)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--primary)] text-white font-bold border border-black/[0.08] shadow-sm'
                    : isCompleted
                    ? 'bg-zinc-50/60 text-emerald-700 hover:bg-zinc-100 border border-transparent'
                    : 'bg-zinc-50/30 text-zinc-500 hover:bg-zinc-200 hover:text-[var(--text-secondary)] border border-transparent'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[var(--primary)] text-white'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-zinc-100 text-[var(--text-secondary)]'
                  }`}
                >
                  {isCompleted ? '✓' : `0${idx + 1}`}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Builder Canvas + Sticky Live Summary Rail (Desktop Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Step Content (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Template Selector Strip (Shown on early steps) */}
          {currentStep <= 1 && (
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>Start from Verified Contract Template</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTRACT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl.id)}
                    className="p-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--primary)]/30 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[9px] font-mono text-[var(--primary)] font-semibold block uppercase">
                      {tpl.category}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                      {tpl.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 01: CREATOR SELECTION */}
          {currentStep === 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">01 Select Creator</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Choose the creator for this commercial partnership. All terms will be digitally bound to their verified identity.
                </p>
              </div>

              {/* Already Selected Creator Banner */}
              {contractDraft.creatorId ? (
                <div className="p-4 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={contractDraft.creatorAvatar}
                      alt={contractDraft.creatorName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[var(--primary)]/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">{contractDraft.creatorName}</h4>
                        {contractDraft.creatorVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono">
                          Verified Creator
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono">
                        {contractDraft.creatorHandle} • {contractDraft.creatorCategory}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setContractDraft((prev) => ({ ...prev, creatorId: '', creatorName: '' }))}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[var(--text-secondary)] border border-[var(--border)] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Change Creator
                  </button>
                </div>
              ) : (
                /* Creator Search & Selector Grid */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search creator by name, handle, or category..."
                        value={creatorSearch}
                        onChange={(e) => setCreatorSearch(e.target.value)}
                        className="w-full min-h-[44px] pl-9 pr-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`min-h-[40px] px-3 rounded-xl text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                            categoryFilter === cat
                              ? 'bg-[var(--primary)] text-white font-semibold'
                              : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {filteredCreators.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--primary)]/50 shadow-xs flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">{c.name}</h5>
                              {c.verified && (
                                <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-500 font-mono truncate">{c.handle}</p>
                            <span className="text-[10px] text-zinc-500 block truncate">
                              {c.category} • {c.pastCampaignsCount} projects
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setContractDraft((prev) => ({
                              ...prev,
                              creatorId: c.id,
                              creatorName: c.name,
                              creatorHandle: c.handle,
                              creatorAvatar: c.avatar,
                              creatorCategory: c.category,
                              creatorVerified: c.verified,
                            }));
                          }}
                          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 02: PROJECT INFORMATION */}
          {currentStep === 1 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">02 Project Information</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Define project title, campaign context, and core operational schedule.
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                    Project / Agreement Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Summer 2026 Sneaker Capsule Launch"
                    value={contractDraft.projectName || ''}
                    onChange={(e) =>
                      setContractDraft((prev) => ({ ...prev, projectName: e.target.value }))
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                    Parent Campaign (Optional)
                  </label>
                  <select
                    value={contractDraft.campaignId || ''}
                    onChange={(e) => {
                      const camp = campaigns.find((c) => c.id === e.target.value);
                      setContractDraft((prev) => ({
                        ...prev,
                        campaignId: e.target.value,
                        campaignName: camp?.name || '',
                      }));
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="">Standalone Contract (No Campaign)</option>
                    {campaigns.map((camp) => (
                      <option key={camp.id} value={camp.id}>
                        {camp.name} ({camp.brandName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={contractDraft.startDate || ''}
                      onChange={(e) =>
                        setContractDraft((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                      Final Completion Deadline *
                    </label>
                    <input
                      type="date"
                      value={contractDraft.deadline || ''}
                      onChange={(e) =>
                        setContractDraft((prev) => ({ ...prev, deadline: e.target.value }))
                      }
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                    Project Overview & Brief
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide a clear description of the goals, brand positioning, and required tone for this collaboration..."
                    value={contractDraft.description || ''}
                    onChange={(e) =>
                      setContractDraft((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full p-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)] leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 03: DELIVERABLES */}
          {currentStep === 2 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] font-display">03 Deliverables</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Add individual structured deliverables with formats, aspect ratios, and milestone dates.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-[var(--primary)]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deliverable</span>
                </button>
              </div>

              {/* Deliverable list cards */}
              <div className="space-y-3">
                {contractDraft.deliverables && contractDraft.deliverables.length > 0 ? (
                  contractDraft.deliverables.map((del, index) => (
                    <DeliverableBuilderCard
                      key={del.id}
                      deliverable={del}
                      index={index}
                      onUpdate={(updated) => handleUpdateDeliverable(index, updated)}
                      onDuplicate={() => handleDuplicateDeliverable(index)}
                      onDelete={() => handleDeleteDeliverable(index)}
                    />
                  ))
                ) : (
                  <div className="p-8 rounded-2xl bg-zinc-50/50 border border-dashed border-zinc-300 text-center space-y-3">
                    <Film className="w-8 h-8 text-[var(--text-secondary)] mx-auto" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-secondary)]">No deliverables defined</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Add at least one reel, photo pack, or UGC video deliverable.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddDeliverable}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold cursor-pointer"
                    >
                      + Add Deliverable Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 04: PAYMENT & PROTECTION */}
          {currentStep === 3 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">04 Protected Payment</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  CreatorOS uses compliant payment partner architecture (Stripe / PayPal) to hold funds in protected status until brand approval.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Creator Compensation Input */}
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                    Creator Compensation ($ USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-zinc-500 font-mono text-sm">$</span>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={contractDraft.payment?.creatorPayment || 0}
                      onChange={(e) =>
                        handlePaymentChange(
                          parseFloat(e.target.value) || 0,
                          contractDraft.payment?.provider || 'stripe'
                        )
                      }
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm font-bold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                {/* Payment Provider Selection */}
                <div>
                  <label className="text-[11px] font-medium text-zinc-500 block mb-1.5">
                    Select Payment Gateway Provider
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handlePaymentChange(
                          contractDraft.payment?.creatorPayment || 0,
                          'stripe'
                        )
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        contractDraft.payment?.provider === 'stripe'
                          ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--text-primary)] shadow-xs'
                          : 'bg-zinc-50 border-[var(--border)] text-[var(--text-secondary)] hover:border-zinc-300'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[var(--text-primary)]">Stripe Connect Protected Hold</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">
                        Credit card, Apple Pay, SEPA, and Direct Bank Transfer.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handlePaymentChange(
                          contractDraft.payment?.creatorPayment || 0,
                          'paypal'
                        )
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        contractDraft.payment?.provider === 'paypal'
                          ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--text-primary)] shadow-xs'
                          : 'bg-zinc-50 border-[var(--border)] text-[var(--text-secondary)] hover:border-zinc-300'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[var(--text-primary)]">PayPal Commerce Platform</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">
                        PayPal Balance, Pay Later, and international accounts.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Calculation Breakdown Card */}
                <div className="p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Creator Payment</span>
                    <span className="text-zinc-800 font-bold">
                      ${contractDraft.payment?.creatorPayment.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="flex items-center gap-1">
                      CreatorOS Platform Fee ({((contractDraft.payment?.platformFeeRate || 0.1) * 100).toFixed(0)}%)
                    </span>
                    <span className="text-zinc-800">
                      ${contractDraft.payment?.platformFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="flex items-center gap-1">
                      Project Protection Amount ({((contractDraft.payment?.protectionAmountRate || 0.2) * 100).toFixed(0)}%)
                    </span>
                    <span className="text-zinc-800">
                      ${contractDraft.payment?.protectionAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-px bg-zinc-100 my-1" />

                  <div className="flex justify-between items-center text-sm font-bold text-[var(--text-primary)]">
                    <span>Total Deposit Required</span>
                    <span className="text-emerald-700">
                      ${contractDraft.payment?.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 05: COMMERCIAL RIGHTS & EXCLUSIVITY */}
          {currentStep === 4 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">05 Usage Rights & Licensing</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Specify licensed media channels, territorial scope, duration, and exclusivity conditions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Media Channels */}
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1.5">
                    Permitted Distribution Channels
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        'Organic Social',
                        'Paid Ads',
                        'Website',
                        'Email',
                        'Commercial',
                        'Print',
                        'Other',
                      ] as UsageRightType[]
                    ).map((type) => {
                      const isSelected =
                        contractDraft.usageRights?.usageTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const current = contractDraft.usageRights?.usageTypes || [];
                            const updated = isSelected
                              ? current.filter((t) => t !== type)
                              : [...current, type];
                            setContractDraft((prev) => ({
                              ...prev,
                              usageRights: { ...prev.usageRights!, usageTypes: updated },
                            }));
                          }}
                          className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--primary)] text-white font-semibold shadow-sm'
                              : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration & Territory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1.5">
                      Licensing Duration
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['30 Days', '90 Days', '6 Months', '1 Year', 'Custom'] as UsageDuration[]).map(
                        (dur) => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() =>
                              setContractDraft((prev) => ({
                                ...prev,
                                usageRights: { ...prev.usageRights!, duration: dur },
                              }))
                            }
                            className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              contractDraft.usageRights?.duration === dur
                                ? 'bg-[var(--primary)] text-white font-semibold'
                                : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                            }`}
                          >
                            {dur}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1.5">
                      Territory Scope
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['Local', 'National', 'Worldwide', 'Custom'] as UsageTerritory[]).map((ter) => (
                        <button
                          key={ter}
                          type="button"
                          onClick={() =>
                            setContractDraft((prev) => ({
                              ...prev,
                              usageRights: { ...prev.usageRights!, territory: ter },
                            }))
                          }
                          className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            contractDraft.usageRights?.territory === ter
                              ? 'bg-[var(--primary)] text-white font-semibold'
                              : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                          }`}
                        >
                          {ter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exclusivity & Ownership */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1.5">
                      Exclusivity Level
                    </label>
                    <select
                      value={contractDraft.usageRights?.exclusivity || 'None'}
                      onChange={(e) =>
                        setContractDraft((prev) => ({
                          ...prev,
                          usageRights: {
                            ...prev.usageRights!,
                            exclusivity: e.target.value as UsageExclusivity,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                    >
                      <option value="None">None (Creator can sponsor any brand)</option>
                      <option value="Category">Category Exclusivity (e.g. Footwear only)</option>
                      <option value="Full">Full Exclusivity (No competing sponsors)</option>
                      <option value="Custom">Custom Terms</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1.5">
                      IP Ownership Model
                    </label>
                    <select
                      value={contractDraft.usageRights?.ownership || 'creator_retains'}
                      onChange={(e) =>
                        setContractDraft((prev) => ({
                          ...prev,
                          usageRights: {
                            ...prev.usageRights!,
                            ownership: e.target.value as UsageOwnership,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                    >
                      <option value="creator_retains">
                        Creator Retains IP (Brand gets Commercial License)
                      </option>
                      <option value="brand_license">Exclusive Perpetual Brand License</option>
                      <option value="full_transfer">Full Copyright Assignment / Transfer</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 06: TERMS & REVISIONS */}
          {currentStep === 5 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">06 Terms & Revision Caps</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Enforce strict revision counts, brand review windows, and cancellation rules to prevent scope creep.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                      Included Revisions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={contractDraft.terms?.includedRevisions || 2}
                      onChange={(e) =>
                        setContractDraft((prev) => ({
                          ...prev,
                          terms: {
                            ...prev.terms!,
                            includedRevisions: parseInt(e.target.value) || 2,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)] font-mono"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Extra changes require amendment
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                      Brand Review Window
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={contractDraft.terms?.reviewPeriodDays || 3}
                      onChange={(e) =>
                        setContractDraft((prev) => ({
                          ...prev,
                          terms: {
                            ...prev.terms!,
                            reviewPeriodDays: parseInt(e.target.value) || 3,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)] font-mono"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Business days to review drafts
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                      Creator Response Window
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={contractDraft.terms?.creatorResponseDeadlineDays || 3}
                      onChange={(e) =>
                        setContractDraft((prev) => ({
                          ...prev,
                          terms: {
                            ...prev.terms!,
                            creatorResponseDeadlineDays: parseInt(e.target.value) || 3,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)] font-mono"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Days before contract expires
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">
                    Cancellation Terms & Pro-Rata Rules
                  </label>
                  <input
                    type="text"
                    value={contractDraft.terms?.cancellationTerms || ''}
                    onChange={(e) =>
                      setContractDraft((prev) => ({
                        ...prev,
                        terms: { ...prev.terms!, cancellationTerms: e.target.value },
                      }))
                    }
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-primary)] block">
                      Strict Mutual Confidentiality
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Unpublished products, pricing, and campaign assets cannot be shared publicly.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={contractDraft.terms?.confidentiality ?? true}
                    onChange={(e) =>
                      setContractDraft((prev) => ({
                        ...prev,
                        terms: { ...prev.terms!, confidentiality: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 07: REVIEW & RISK AUDIT */}
          {currentStep === 6 && (
            <div className="space-y-6">
              {/* Risk Scanner Component */}
              <ContractRiskScanner
                risks={currentRisks}
                onFixRisk={(stepIdx) => setCurrentStep(stepIdx)}
              />

              {/* Digital Contract Document Preview */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 text-xs text-[var(--text-secondary)] shadow-sm font-sans shadow-xl">
                <div className="border-b border-black/[0.08] pb-6 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] block font-semibold">
                      CreatorOS Verified Commercial Agreement
                    </span>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] font-display mt-1">
                      {contractDraft.projectName || 'Untitled Commercial Agreement'}
                    </h2>
                    <p className="text-[11px] text-zinc-500 font-mono mt-1">
                      Agreement Reference: {contractDraft.contractNumber} • Created{' '}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <ContractStatusBadge status="draft" />
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Brand (Principal)</span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{contractDraft.brandName}</h4>
                    <p className="text-[11px] text-zinc-500">Authorized Brand Representative</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Creator (Contractor)</span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      {contractDraft.creatorName || 'Pending Creator'}
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {contractDraft.creatorHandle || '@unassigned'}
                    </p>
                  </div>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Deliverables</span>
                    <p className="text-xs font-semibold text-zinc-800 mt-1">
                      {contractDraft.deliverables?.map((d) => `${d.quantity}× ${d.type}`).join(', ') ||
                        'None defined'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Protected Compensation</span>
                    <p className="text-xs font-bold text-emerald-700 font-mono mt-1">
                      ${contractDraft.payment?.creatorPayment.toLocaleString()} USD
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Final Due Date</span>
                    <p className="text-xs font-semibold text-zinc-800 mt-1">{contractDraft.deadline}</p>
                  </div>
                </div>

                {/* Commercial Rights Summary */}
                <div className="space-y-1.5 border-t border-[var(--border)]/80 pt-4">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Usage Rights & Territory</span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Channels: <strong className="text-[var(--text-primary)]">{contractDraft.usageRights?.usageTypes.join(', ')}</strong> •
                    Duration: <strong className="text-[var(--text-primary)]">{contractDraft.usageRights?.duration}</strong> •
                    Territory: <strong className="text-[var(--text-primary)]">{contractDraft.usageRights?.territory}</strong> •
                    Exclusivity: <strong className="text-[var(--text-primary)]">{contractDraft.usageRights?.exclusivity}</strong>.
                  </p>
                </div>

                {/* Revision & Approval Terms */}
                <div className="space-y-1.5 border-t border-[var(--border)]/80 pt-4">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Governance Terms</span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Includes {contractDraft.terms?.includedRevisions} revision rounds. Brand has {contractDraft.terms?.reviewPeriodDays} business days to approve submitted assets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 08: SEND & DISPATCH */}
          {currentStep === 7 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto ring-1 ring-[var(--primary)]/30">
                <Send className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">Ready to Send Official Contract</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                  Sending will notify {contractDraft.creatorName || 'the creator'} with the digital agreement terms. They will have {contractDraft.terms?.creatorResponseDeadlineDays || 3} days to accept.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-left space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Creator:</span>
                  <span className="font-semibold text-[var(--text-primary)]">{contractDraft.creatorName}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Creator Compensation:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ${contractDraft.payment?.creatorPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Project Protection:</span>
                  <span className="font-mono text-zinc-800">
                    ${contractDraft.payment?.protectionAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Completion Deadline:</span>
                  <span className="text-zinc-800">{contractDraft.deadline}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    ContractService.saveDraft(contractDraft);
                    onBack();
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[var(--text-secondary)] border border-[var(--border)] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handleFinalSend}
                  className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Contract</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Rail: Compact Live Contract Summary (4 columns on desktop) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-4">
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">
                Live Agreement Summary
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-[var(--text-secondary)] border border-[var(--border)]">
                Step {currentStep + 1} of 8
              </span>
            </div>

            {/* Contracting Parties */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Contracting With</span>
              {contractDraft.creatorName ? (
                <div className="flex items-center gap-2.5">
                  <img
                    src={contractDraft.creatorAvatar}
                    alt={contractDraft.creatorName}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-700"
                  />
                  <div>
                    <h5 className="font-semibold text-zinc-800">{contractDraft.creatorName}</h5>
                    <p className="text-[10px] text-zinc-500 font-mono">{contractDraft.creatorHandle}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-amber-800/80 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Select creator in Step 01
                </p>
              )}
            </div>

            {/* Deliverables summary */}
            <div className="space-y-1.5 pt-2 border-t border-black/[0.04]">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Deliverables ({contractDraft.deliverables?.length || 0})</span>
              <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                {contractDraft.deliverables?.map((d, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>
                      {d.quantity}× {d.type} ({d.format})
                    </span>
                    <span className="text-zinc-500 font-mono text-[10px]">Due {d.dueDate}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Summary */}
            <div className="space-y-1.5 pt-2 border-t border-black/[0.04]">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Financial Breakdown</span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-zinc-500">
                  <span>Compensation:</span>
                  <span className="text-zinc-800">
                    ${contractDraft.payment?.creatorPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Platform Fee (10%):</span>
                  <span className="text-zinc-800">${contractDraft.payment?.platformFee}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Protection (20%):</span>
                  <span className="text-zinc-800">${contractDraft.payment?.protectionAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-[var(--border)]">
                  <span>Total Protected:</span>
                  <span>${contractDraft.payment?.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Risk Warnings count if any */}
            {currentRisks.length > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-500/20 text-amber-800 text-[11px] flex items-center justify-between">
                <span>⚠ {currentRisks.length} issue(s) flagged</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="font-bold underline hover:text-zinc-950"
                >
                  Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSendConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
              Send contract to {contractDraft.creatorName}?
            </h3>
            <p className="text-zinc-500 leading-relaxed">
              This will issue an official CreatorOS agreement for <strong>{contractDraft.projectName}</strong> with <strong>${contractDraft.payment?.creatorPayment.toLocaleString()} USD</strong> in protected creator compensation.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowSendConfirmation(false)}
                className="min-h-[44px] px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[var(--text-secondary)] border border-[var(--border)] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSendConfirmation(false);
                  handleFinalSend();
                }}
                className="min-h-[44px] px-5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 cursor-pointer"
              >
                Send Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
