import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Sliders,
  CheckCircle2,
  Calendar,
  Target,
  DollarSign,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AiCampaignEngine } from '../../services/aiService';
import { AiPlanRecommendation } from '../../types';

interface AiCampaignArchitectProps {
  onOpenSimulator: (budget?: number) => void;
  onApplyPlanToCampaign?: (plan: AiPlanRecommendation) => void;
}

export const AiCampaignArchitect: React.FC<AiCampaignArchitectProps> = ({
  onOpenSimulator,
  onApplyPlanToCampaign,
}) => {
  const [prompt, setPrompt] = useState(
    'I have ₹5 lakh and want to launch a premium sneaker collection in Mumbai.'
  );
  const [budget, setBudget] = useState(500000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<AiPlanRecommendation>(() =>
    AiCampaignEngine.generatePlan({
      prompt: 'I have ₹5 lakh and want to launch a premium sneaker collection in Mumbai.',
      objective: 'Product Launch',
      budget: 500000,
      location: 'Mumbai',
    })
  );

  const samplePrompts = [
    'I have ₹5 lakh and want to launch a premium sneaker collection in Mumbai.',
    'I have ₹8 lakh for an all-India viral Reels challenge targeting college students.',
    'I have ₹3.5 lakh to drive direct app installs for a fitness tech app in Bangalore.',
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = AiCampaignEngine.generatePlan({
        prompt,
        objective: 'Product Launch',
        budget,
        location: prompt.toLowerCase().includes('bangalore') ? 'Bangalore' : 'Mumbai',
      });
      setPlan(generated);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              AI Campaign Architect
            </h1>
            <Badge variant="purple" size="sm">
              Generative Planner
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Synthesize full-funnel creator strategies from natural business goals.
          </p>
        </div>

        <Button
          variant="ai"
          size="md"
          leftIcon={<Sliders className="w-4 h-4" />}
          onClick={() => onOpenSimulator(budget)}
        >
          Simulate Campaign Scenarios
        </Button>
      </div>

      {/* Input Prompt Terminal */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-300 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#007E93] mb-3 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Strategic Intent Input</span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your campaign goal, budget, location, and target audience..."
            className="w-full bg-white shadow-xs text-zinc-900 text-sm p-4 rounded-2xl border border-zinc-200 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none leading-relaxed"
          />

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-zinc-500">Quick prompts:</span>
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(sp);
                    if (sp.includes('8 lakh')) setBudget(800000);
                    else if (sp.includes('3.5 lakh')) setBudget(350000);
                    else setBudget(500000);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-200 transition-colors truncate max-w-xs"
                >
                  {sp.slice(0, 38)}...
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              isLoading={isGenerating}
              onClick={handleGenerate}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="shrink-0"
            >
              Generate Architecture
            </Button>
          </div>
        </div>
      </div>

      {/* Generated Structured Architecture */}
      {plan && (
        <div className="space-y-6">
          {/* Executive Strategy Banner */}
          <div className="p-5 rounded-2xl bg-[#00B4D8]/10 border border-[#00B4D8]/30 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#007E93]">
                Executive Strategy & Market Resonance
              </h3>
              <p className="text-xs text-zinc-700 leading-relaxed max-w-3xl">
                {plan.strategicNote}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Sliders className="w-3.5 h-3.5 text-[#007E93]" />}
              onClick={() => onOpenSimulator(budget)}
              className="shrink-0 text-xs"
            >
              Simulate Campaign
            </Button>
          </div>

          {/* Section 1: Creator Mix & Budget Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Creator Mix */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#007E93]" />
                  <span>Creator Portfolio Mix</span>
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  Total {plan.creatorMix.reduce((acc, m) => acc + m.count, 0)} Creators
                </span>
              </div>

              <div className="space-y-3">
                {plan.creatorMix.map((mix, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800">{mix.tier}</span>
                      <span className="font-mono text-[#007E93] font-semibold">
                        {mix.count} creators ({mix.percentage}% allocation)
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      {mix.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Budget Allocation */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span>Suggested Budget Allocation</span>
                </h3>
                <span className="text-xs font-mono text-emerald-700 font-semibold">
                  ₹{(budget / 100000).toFixed(1)}L Total
                </span>
              </div>

              <div className="space-y-3">
                {plan.suggestedBudgetAllocation.map((alloc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800">{alloc.category}</span>
                      <span className="font-mono text-zinc-800 font-bold">
                        ₹{(alloc.amount / 1000).toLocaleString()}k ({alloc.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${alloc.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Section 2: Deliverables & Timeline Phases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deliverables Strategy */}
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Required Deliverable Formats</span>
              </h3>
              <div className="space-y-2">
                {plan.suggestedDeliverables.map((del, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-50/50 border border-zinc-200 text-xs text-zinc-700 flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#007E93] shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#007E93]" />
                <span>Campaign Timeline Phases</span>
              </h3>
              <div className="space-y-2">
                {plan.campaignTimeline.map((time, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-50/50 border border-zinc-200 text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-semibold text-zinc-800">{time.phase}</span>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{time.focus}</p>
                    </div>
                    <span className="text-[11px] text-[#007E93] font-mono font-medium shrink-0 bg-[#E9FAFC] px-2 py-0.5 rounded border border-[#00B4D8]/20">
                      {time.duration}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Section 3: Algorithmic KPIs & Tracking */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#007E93]" />
                <span>Algorithmic Projected KPIs</span>
              </h3>
              <Badge variant="brand" size="sm">
                Confidence 92%
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {plan.kpis.map((k, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center"
                >
                  <p className="text-[10px] text-zinc-500 uppercase">{k.metric}</p>
                  <p className="text-sm font-bold text-zinc-900 font-mono mt-0.5">{k.target}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{k.benchmark}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-white shadow-xs border border-zinc-200 text-xs">
              <span className="font-semibold text-zinc-700">Attribution Mechanism: </span>
              <span className="text-zinc-500">{plan.trackingStrategy}</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
