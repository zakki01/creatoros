import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  DollarSign,
  Target,
  Calendar,
  Layers,
  FileText,
  Users,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  CampaignObjective,
  Platform,
  DeliverableType,
  Campaign,
  CampaignDeliverableRequirement,
} from '../../types';
import { useAppState } from '../../context/StateContext';

interface CampaignCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated?: (campaign: Campaign) => void;
}

export const CampaignCreationModal: React.FC<CampaignCreationModalProps> = ({
  isOpen,
  onClose,
  onCampaignCreated,
}) => {
  const { createCampaign, workspace } = useAppState();

  // 5 Progressive Steps
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1: What are you promoting?
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState<CampaignObjective>('Product Launch');
  const [category, setCategory] = useState('Streetwear & Fashion');

  // Step 2: What do you need?
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['Instagram']);
  const [deliverables, setDeliverables] = useState<CampaignDeliverableRequirement[]>([
    { type: 'Reel', count: 4, ratePerUnit: 25000 },
    { type: 'Story', count: 8, ratePerUnit: 8000 },
  ]);
  const [guidelines, setGuidelines] = useState('');

  // Step 3: Budget & deadline
  const [budget, setBudget] = useState<number>(200000);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [submissionDeadline, setSubmissionDeadline] = useState('2026-11-20');

  // Step 4: Find creators
  const [targetLocations, setTargetLocations] = useState('Mumbai, Bangalore, Delhi NCR');
  const [targetTier, setTargetTier] = useState<'Micro' | 'Mid-Tier' | 'Macro' | 'Mixed'>('Mixed');
  const [targetCreatorsCount, setTargetCreatorsCount] = useState<number>(4);

  // Step 5: Review & Publish
  const [isSubmitting, setIsSubmitting] = useState(false);

  const objectivesList: CampaignObjective[] = [
    'Product Launch',
    'Increase Sales',
    'Brand Awareness',
    'UGC',
    'Drive App Installs',
    'Event Promotion',
  ];

  const platformsList: Platform[] = ['Instagram', 'YouTube', 'TikTok', 'X'];

  const deliverableTypesList: DeliverableType[] = [
    'Reel',
    'Story',
    'Post',
    'Short',
    'YouTube Video',
    'UGC',
    'Live',
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const addDeliverable = () => {
    setDeliverables((prev) => [...prev, { type: 'Reel', count: 2, ratePerUnit: 20000 }]);
  };

  const removeDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      setDeliverables((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handlePublish = () => {
    setIsSubmitting(true);

    const effectiveName = campaignName.trim() || `${workspace.name} Creator Campaign`;

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: effectiveName,
      brandName: workspace.name,
      brandLogo: workspace.avatarUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80',
      objective,
      budgetTotal: Number(budget) || 200000,
      budget: Number(budget) || 200000,
      budgetSpent: 0,
      revenueGenerated: 0,
      status: 'Active',
      health: 'Healthy',
      progress: 0,
      creators: {
        confirmed: 0,
        target: targetCreatorsCount,
      },
      content: {
        submitted: 0,
        target: deliverables.reduce((sum, d) => sum + d.count, 0),
      },
      published: {
        published: 0,
        target: deliverables.reduce((sum, d) => sum + d.count, 0),
      },
      aiInsight: 'AI tracking initialized for launch metrics and creator attribution.',
      platforms: selectedPlatforms,
      deliverables,
      brandGuidelines: guidelines || 'Highlight genuine product experience and creator authenticity.',
      timeline: {
        startDate,
        endDate,
        submissionDeadline,
      },
      targetAudience: {
        location: targetLocations.split(',').map((s) => s.trim()),
        ageRange: '18-35',
        gender: 'All',
        interests: [category, 'Lifestyle'],
        language: 'English',
      },
    };

    setTimeout(() => {
      createCampaign(newCampaign);
      setIsSubmitting(false);
      if (onCampaignCreated) onCampaignCreated(newCampaign);
      onClose();
      // Reset
      setStep(1);
      setCampaignName('');
    }, 400);
  };

  const stepTitles = [
    { num: 1, title: 'What are you promoting?' },
    { num: 2, title: 'What do you need?' },
    { num: 3, title: 'Budget & deadline' },
    { num: 4, title: 'Find creators' },
    { num: 5, title: 'Review & publish' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Campaign"
      description="Launch a creator campaign with structured deliverables, budget protection & milestone tracking."
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={step === 1 ? onClose : handleBack}
            disabled={isSubmitting}
            leftIcon={step > 1 ? <ChevronLeft className="w-4 h-4" /> : undefined}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex items-center gap-2">
            {step < totalSteps ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="text-xs"
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handlePublish}
                disabled={isSubmitting}
                rightIcon={<Check className="w-4 h-4" />}
                className="text-xs font-semibold"
              >
                {isSubmitting ? 'Launching...' : 'Publish Campaign'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-[var(--text-primary)]">
        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-medium text-[var(--text-primary)]">
              Step {step} of {totalSteps}: {stepTitles[step - 1].title}
            </span>
            <span className="font-mono">{Math.round((step / totalSteps) * 100)}%</span>
          </div>

          <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--accent)] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STEP 1: WHAT ARE YOU PROMOTING?
           ───────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Summer Capsule Collection or Product Launch 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Primary Goal / Objective
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {objectivesList.map((obj) => (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => setObjective(obj)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      objective === obj
                        ? 'bg-[var(--surface-elevated)] border-[var(--accent)] text-[var(--text-primary)] shadow-xs ring-1 ring-[var(--accent)]'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{obj}</span>
                      {objective === obj && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Category & Industry
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Streetwear, Beauty, Tech, Fitness"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STEP 2: WHAT DO YOU NEED? (DELIVERABLES & PLATFORMS)
           ───────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Target Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {platformsList.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--accent)] shadow-xs'
                          : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Required Deliverables
                </label>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add deliverable</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {deliverables.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center gap-3"
                  >
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const updated = [...deliverables];
                        updated[index].type = e.target.value as DeliverableType;
                        setDeliverables(updated);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none"
                    >
                      {deliverableTypesList.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <span>Qty:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={item.count}
                        onChange={(e) => {
                          const updated = [...deliverables];
                          updated[index].count = Math.max(1, parseInt(e.target.value) || 1);
                          setDeliverables(updated);
                        }}
                        className="w-16 px-2 py-1 rounded-lg bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-center text-xs"
                      />
                    </div>

                    <div className="flex-1 text-right text-xs text-[var(--text-muted)] font-mono">
                      Target Rate: ₹{item.ratePerUnit.toLocaleString()}
                    </div>

                    {deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeliverable(index)}
                        className="text-[var(--text-muted)] hover:text-rose-500 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Creative Guidelines / Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                placeholder="Highlight key product features, aesthetic mood, authentic voice, avoid competitor mentions..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STEP 3: BUDGET & DEADLINE
           ───────────────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Total Campaign Budget (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                  ₹
                </span>
                <input
                  type="number"
                  min={10000}
                  step={5000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs font-mono focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Budget remains safely in escrow and releases upon milestone delivery & approval.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Campaign Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Final Completion Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Content Draft Submission Deadline
              </label>
              <input
                type="date"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                Creators must submit draft video uploads by this date for pre-check and brand review.
              </p>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STEP 4: FIND CREATORS
           ───────────────────────────────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Creator Cohort Strategy
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Micro', 'Mid-Tier', 'Macro', 'Mixed'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setTargetTier(tier)}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      targetTier === tier
                        ? 'bg-[var(--surface-elevated)] border-[var(--accent)] text-[var(--text-primary)] shadow-xs ring-1 ring-[var(--accent)]'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <span>{tier}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Target Locations / Cities
              </label>
              <input
                type="text"
                value={targetLocations}
                onChange={(e) => setTargetLocations(e.target.value)}
                placeholder="e.g. Mumbai, Bangalore, Delhi, All India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Target Number of Creator Collaborators
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={targetCreatorsCount}
                onChange={(e) => setTargetCreatorsCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input)] text-[var(--text-primary)] border border-[var(--border)] text-xs font-mono focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STEP 5: REVIEW & PUBLISH
           ───────────────────────────────────────────────────────────── */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
                    {objective}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                    {campaignName.trim() || `${workspace.name} Creator Campaign`}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    {category} • {targetLocations}
                  </p>
                </div>
                <Badge variant="brand" size="sm">
                  Ready to Launch
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--border)] text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Budget</span>
                  <span className="font-bold font-mono text-[var(--text-primary)]">
                    ₹{Number(budget).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Creators</span>
                  <span className="font-bold font-mono text-[var(--text-primary)]">
                    {targetCreatorsCount} ({targetTier})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Deliverables</span>
                  <span className="font-bold font-mono text-[var(--text-primary)]">
                    {deliverables.reduce((sum, d) => sum + d.count, 0)} items
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Deadline</span>
                  <span className="font-bold font-mono text-[var(--text-primary)]">
                    {submissionDeadline}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-muted)]/60 border border-[var(--border)] text-xs space-y-1">
              <span className="font-semibold text-[var(--text-primary)]">What happens next?</span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Publishing creates your campaign workspace. You will immediately be able to discover and invite verified creators with automatic contract and deliverable milestones.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
