import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sliders,
  DollarSign,
  Target,
  Calendar,
  Layers,
  FileText,
  Users,
  Check,
  Edit2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  CampaignObjective,
  Platform,
  DeliverableType,
  AiPlanRecommendation,
  Campaign,
} from '../../types';
import { AiCampaignEngine } from '../../services/aiService';
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
  const { createCampaign } = useAppState();

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Form states
  const [campaignName, setCampaignName] = useState('Festive Footwear Drop');
  const [objective, setObjective] = useState<CampaignObjective>('Increase Sales');
  const [locations, setLocations] = useState('Mumbai, Delhi NCR, Bangalore');
  const [ageRange, setAgeRange] = useState('18-32');
  const [gender, setGender] = useState('All');
  const [interests, setInterests] = useState('Streetwear, Sneakers, Urban Lifestyle, Hip Hop');
  const [language, setLanguage] = useState('English & Hinglish');
  const [budget, setBudget] = useState(500000);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['Instagram', 'YouTube']);
  const [deliverables, setDeliverables] = useState<{ type: DeliverableType; count: number; rate: number }[]>([
    { type: 'Reel', count: 12, rate: 32000 },
    { type: 'Story', count: 24, rate: 8000 },
  ]);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [submissionDeadline, setSubmissionDeadline] = useState('2026-10-20');
  const [guidelines, setGuidelines] = useState(
    'Highlight the reflective 3M details and cushioning comfort. Authentic urban setting. No cheesy voiceovers.'
  );

  // Step 8 AI Plan state
  const [aiPlan, setAiPlan] = useState<AiPlanRecommendation | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [editableMix, setEditableMix] = useState<{ tier: string; count: number; percentage: number; description: string }[]>([]);

  const objectivesList: CampaignObjective[] = [
    'Increase Sales',
    'Brand Awareness',
    'Product Launch',
    'Generate Leads',
    'Drive App Installs',
    'UGC',
    'Event Promotion',
  ];

  const platformsList: Platform[] = ['Instagram', 'YouTube', 'TikTok', 'X', 'Snapchat'];

  const deliverableTypesList: DeliverableType[] = [
    'Reel',
    'Post',
    'Story',
    'YouTube Video',
    'Short',
    'UGC',
    'Live',
  ];

  const handleNext = () => {
    if (step === 7) {
      // Transitioning to Step 8: generate AI Plan
      setIsGeneratingPlan(true);
      setStep(8);
      setTimeout(() => {
        const generated = AiCampaignEngine.generatePlan({
          objective,
          budget,
          location: locations.split(',')[0].trim(),
          targetNiche: interests,
        });
        setAiPlan(generated);
        setEditableMix(generated.creatorMix);
        setIsGeneratingPlan(false);
      }, 700);
    } else if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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

  const handleFinalize = () => {
    const newCamp = createCampaign({
      name: campaignName,
      objective,
      budgetTotal: budget,
      targetAudience: {
        location: locations.split(',').map((s) => s.trim()),
        ageRange,
        gender,
        interests: interests.split(',').map((s) => s.trim()),
        language,
      },
      platforms: selectedPlatforms,
      deliverables: deliverables.map((d) => ({
        type: d.type,
        count: d.count,
        ratePerUnit: d.rate,
      })),
      timeline: {
        startDate,
        endDate,
        submissionDeadline,
      },
      brandGuidelines: guidelines,
      aiRecommendations: aiPlan
        ? {
            ...aiPlan,
            creatorMix: editableMix,
          }
        : undefined,
    });

    if (onCampaignCreated) onCampaignCreated(newCamp);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#00B4D8]/20 text-[#007E93] border border-[#00B4D8]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 font-display">
              Create New Campaign
            </h2>
            <p className="text-xs text-zinc-500">
              Step {step} of {totalSteps}:{' '}
              {step === 1 && 'Campaign Objective'}
              {step === 2 && 'Target Audience'}
              {step === 3 && 'Budget Setup'}
              {step === 4 && 'Target Platforms'}
              {step === 5 && 'Deliverables Scope'}
              {step === 6 && 'Timeline & Deadlines'}
              {step === 7 && 'Brand Guidelines'}
              {step === 8 && 'AI Campaign Architecture'}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {step < totalSteps ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                {step === 7 ? 'Generate AI Plan' : 'Continue'}
              </Button>
            ) : (
              <Button
                variant="ai"
                size="md"
                onClick={handleFinalize}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Launch Campaign
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-between gap-1.5 px-1 py-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50'
                  : i + 1 < step
                  ? 'bg-zinc-600'
                  : 'bg-zinc-100'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: OBJECTIVE */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Mumbai Sneaker Capsule Launch"
            />
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Primary Campaign Objective
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {objectivesList.map((obj) => (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => setObjective(obj)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      objective === obj
                        ? 'bg-[#E9FAFC] border-[#007E93] text-zinc-900 shadow-sm'
                        : 'bg-white shadow-xs border-zinc-200 hover:border-zinc-300 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{obj}</span>
                      {objective === obj && <Check className="w-3.5 h-3.5 text-[#007E93]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AUDIENCE */}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              label="Target Locations (Comma-separated cities)"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="e.g. Mumbai, Delhi NCR, Bangalore"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Target Age Bracket"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                placeholder="e.g. 18-30"
              />
              <Input
                label="Gender Focus"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="e.g. All, Female, Male"
              />
            </div>
            <Input
              label="Audience Affinity / Interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Sneakers, Street Fashion, Hip-Hop Culture"
            />
            <Input
              label="Primary Content Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English, Hinglish, Hindi"
            />
          </div>
        )}

        {/* STEP 3: BUDGET */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Total Campaign Budget (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-zinc-500 font-semibold">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  step={50000}
                  className="w-full bg-white text-zinc-900 pl-8 pr-4 py-3 text-lg font-mono font-semibold rounded-2xl border border-zinc-300 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Equivalent to ₹{(budget / 100000).toFixed(2)} Lakhs. CreatorOS AI will calculate optimal tier allocation across micro, mid-tier, and flagship creators.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[250000, 500000, 1000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBudget(preset)}
                  className={`p-3 rounded-xl border text-center text-xs font-mono font-medium transition-colors ${
                    budget === preset
                      ? 'bg-indigo-900/30 border-[#00B4D8] text-[#007E93]'
                      : 'bg-white shadow-xs border-zinc-200 text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  ₹{(preset / 100000).toFixed(1)}L Preset
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PLATFORMS */}
        {step === 4 && (
          <div className="space-y-4">
            <label className="block text-xs font-medium text-zinc-700">
              Select Platforms for Campaign Rollout
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {platformsList.map((plat) => {
                const isSelected = selectedPlatforms.includes(plat);
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => togglePlatform(plat)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#E9FAFC] border-[#007E93] text-zinc-900'
                        : 'bg-white shadow-xs border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{plat}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#007E93]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: DELIVERABLES */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-700">
                Deliverable Types & Volume
              </label>
              <span className="text-xs text-zinc-500">Add key formats requested in brief</span>
            </div>

            <div className="space-y-3">
              {deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white shadow-xs border border-zinc-200"
                >
                  <select
                    value={item.type}
                    onChange={(e) => {
                      const updated = [...deliverables];
                      updated[idx].type = e.target.value as DeliverableType;
                      setDeliverables(updated);
                    }}
                    className="bg-zinc-100 text-zinc-900 text-xs px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none"
                  >
                    {deliverableTypesList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Qty:</span>
                    <input
                      type="number"
                      value={item.count}
                      onChange={(e) => {
                        const updated = [...deliverables];
                        updated[idx].count = Number(e.target.value);
                        setDeliverables(updated);
                      }}
                      className="w-16 bg-zinc-100 text-zinc-900 text-xs font-mono px-2.5 py-1.5 rounded-xl border border-zinc-300 text-center"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-xs text-zinc-500">Avg Unit Rate: ₹</span>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const updated = [...deliverables];
                        updated[idx].rate = Number(e.target.value);
                        setDeliverables(updated);
                      }}
                      className="w-24 bg-zinc-100 text-zinc-900 text-xs font-mono px-2.5 py-1.5 rounded-xl border border-zinc-300 text-right"
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setDeliverables([...deliverables, { type: 'Story', count: 10, rate: 8000 }])
                }
                className="text-xs w-full"
              >
                + Add Another Deliverable Format
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: TIMELINE */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Campaign Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="Campaign End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Input
              type="date"
              label="Content Draft Submission Deadline"
              value={submissionDeadline}
              onChange={(e) => setSubmissionDeadline(e.target.value)}
              helperText="Creators must submit drafts to CreatorOS before this date for AI Pre-Check and review."
            />
          </div>
        )}

        {/* STEP 7: BRAND GUIDELINES */}
        {step === 7 && (
          <div className="space-y-3">
            <label className="block text-xs font-medium text-zinc-700">
              Brand Guidelines & Creative Do's and Don'ts
            </label>
            <textarea
              rows={5}
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              placeholder="e.g. Focus on product silhouettes. Film in natural sunlight. Avoid competitor brands in shot."
              className="w-full bg-white text-zinc-900 p-4 text-xs rounded-2xl border border-zinc-300 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none leading-relaxed"
            />
            <p className="text-xs text-zinc-500">
              These guidelines are ingested by the AI Pre-Check Engine to automatically evaluate creator video drafts upon upload.
            </p>
          </div>
        )}

        {/* STEP 8: AI CAMPAIGN ARCHITECTURE (Editable Recommendations) */}
        {step === 8 && (
          <div className="space-y-6">
            {isGeneratingPlan || !aiPlan ? (
              <div className="py-16 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#007E93] animate-spin mx-auto" />
                <p className="text-sm font-semibold text-zinc-800">
                  AI Campaign Architect Synthesizing Optimal Strategy...
                </p>
                <p className="text-xs text-zinc-500">
                  Evaluating creator rosters in {locations}, past conversion ROAS, and budget efficiency.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Strategic summary */}
                <div className="p-4 rounded-2xl bg-[#00B4D8]/10 border border-[#00B4D8]/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#007E93]" />
                    <h4 className="text-xs font-semibold text-[#007E93] uppercase tracking-wider">
                      Strategic AI Blueprint
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {aiPlan.strategicNote}
                  </p>
                </div>

                {/* Creator Mix (Editable) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <span>Recommended Creator Mix (Editable)</span>
                    </h4>
                    <span className="text-[11px] text-zinc-500">Click quantities to adjust</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {editableMix.map((mix, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white shadow-xs border border-zinc-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-800">{mix.tier}</span>
                          <span className="text-[10px] text-[#007E93] font-mono font-medium">
                            {mix.percentage}% budget
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-zinc-500">Target:</label>
                          <input
                            type="number"
                            value={mix.count}
                            onChange={(e) => {
                              const updated = [...editableMix];
                              updated[idx].count = Math.max(1, Number(e.target.value));
                              setEditableMix(updated);
                            }}
                            className="w-16 bg-zinc-100 text-zinc-900 text-xs font-mono px-2 py-1 rounded-lg border border-zinc-300 text-center"
                          />
                          <span className="text-xs text-zinc-500">creators</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-tight">
                          {mix.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projected KPIs */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-zinc-500" />
                    <span>Projected Algorithmic KPIs</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {aiPlan.kpis.map((kpi, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white shadow-xs border border-zinc-200 text-center"
                      >
                        <p className="text-[10px] text-zinc-500 uppercase">{kpi.metric}</p>
                        <p className="text-sm font-bold text-zinc-900 font-mono mt-0.5">
                          {kpi.target}
                        </p>
                        <p className="text-[10px] text-[#007E93]/80 mt-0.5">{kpi.benchmark}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking & Attribution */}
                <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-zinc-200 text-xs">
                  <span className="font-semibold text-zinc-700">Attribution Strategy: </span>
                  <span className="text-zinc-500">{aiPlan.trackingStrategy}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
