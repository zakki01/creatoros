import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  DollarSign,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AiCampaignEngine } from '../../services/aiService';
import { useAppState } from '../../context/StateContext';

interface CampaignSimulatorProps {
  initialBudget?: number;
  onAdoptScenario?: (scenarioName: string) => void;
}

export const CampaignSimulator: React.FC<CampaignSimulatorProps> = ({
  initialBudget = 500000,
  onAdoptScenario,
}) => {
  const { triggerCelebration } = useAppState();
  const [budget, setBudget] = useState(initialBudget);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-c');
  const [adoptedMessage, setAdoptedMessage] = useState<string | null>(null);

  const scenarios = AiCampaignEngine.generateScenarios(budget);

  const handleAdopt = (scenarioTitle: string) => {
    setAdoptedMessage(`Adopted "${scenarioTitle}" for campaign modeling.`);
    triggerCelebration();
    if (onAdoptScenario) onAdoptScenario(scenarioTitle);
    setTimeout(() => setAdoptedMessage(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              Campaign Simulator
            </h1>
            <Badge variant="brand" size="sm">
              Predictive Modeling
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Compare hypothetical campaign structures to evaluate reach, content volume, engagement, and estimated CPA.
          </p>
        </div>

        {adoptedMessage && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{adoptedMessage}</span>
          </div>
        )}
      </div>

      {/* Simulator Control Bar */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-300 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0096C7]" />
              <span>Simulated Budget Variable</span>
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Drag slider to re-calculate projected reach, volume, and CPAs across scenarios.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              ₹{(budget / 100000).toFixed(1)} Lakhs
            </span>
            <span className="text-xs text-zinc-500 ml-2">(₹{budget.toLocaleString()})</span>
          </div>
        </div>

        <input
          type="range"
          min={200000}
          max={2000000}
          step={50000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        <div className="flex justify-between text-[11px] font-mono text-zinc-500">
          <span>₹2.0L (Micro Pilot)</span>
          <span>₹5.0L (Standard Rollout)</span>
          <span>₹10.0L (Growth Phase)</span>
          <span>₹20.0L (Scale Blitz)</span>
        </div>
      </div>

      {/* Mandatory Disclaimer as per Specification */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-zinc-800">Algorithmic Simulation Notice:</strong> Projected ranges for reach, engagement, clicks, and CPA are calculated using platform performance averages, audience saturation modeling, and verified historical creator metrics. They are modeled estimates and not guaranteed business returns.
        </p>
      </div>

      {/* Comparison Scenarios Grid (Scenario A, Scenario B, Scenario C) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scen) => {
          const isSelected = selectedScenarioId === scen.id;
          return (
            <div
              key={scen.id}
              onClick={() => setSelectedScenarioId(scen.id)}
              className={`rounded-3xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#00B4D8] shadow-2xl shadow-xs ring-1 ring-indigo-500'
                  : 'bg-white shadow-xs border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/90'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-[#0096C7] font-semibold uppercase tracking-wider">
                      {scen.name.split(':')[0]}
                    </span>
                    <Badge
                      variant={scen.riskFactor === 'Low' ? 'success' : 'neutral'}
                      size="sm"
                    >
                      {scen.riskFactor} Risk
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 font-display">
                    {scen.strategyTitle}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {scen.description}
                  </p>
                </div>

                {/* Creator Breakdown Tag */}
                <div className="p-3 rounded-2xl bg-white shadow-xs border border-zinc-200 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Creator Mix:</span>
                  <span className="font-semibold text-zinc-800 font-mono">
                    {scen.creatorBreakdown}
                  </span>
                </div>

                {/* Metrics Table */}
                <div className="space-y-3 pt-2">
                  {/* Projected Reach */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-200/60">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Projected Reach</span>
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      {scen.projectedReach.min} – {scen.projectedReach.max}
                    </span>
                  </div>

                  {/* Content Volume */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-200/60">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Content Volume</span>
                    </span>
                    <span className="font-mono text-zinc-800">
                      {scen.contentVolume}
                    </span>
                  </div>

                  {/* Projected Engagement */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-200/60">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Engagement Rate</span>
                    </span>
                    <span className="font-mono text-[#0096C7] font-semibold">
                      {scen.projectedEngagement}
                    </span>
                  </div>

                  {/* Projected Clicks */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-200/60">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <MousePointer className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Projected Clicks</span>
                    </span>
                    <span className="font-mono text-zinc-800">
                      {scen.projectedClicks.min} – {scen.projectedClicks.max}
                    </span>
                  </div>

                  {/* Conversion Potential */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-200/60">
                    <span className="text-zinc-500">Conversion Potential</span>
                    <span className="text-zinc-800 font-medium">{scen.conversionPotential}</span>
                  </div>

                  {/* Estimated CPA */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-medium text-emerald-400">Estimated CPA</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {scen.estimatedCpa}
                    </span>
                  </div>
                </div>

                {/* Strategy Tag */}
                <div className="p-2.5 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[11px] text-[#0096C7] text-center font-medium">
                  {scen.recommendationTag}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-zinc-200">
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdopt(scen.strategyTitle);
                  }}
                  leftIcon={isSelected ? <Check className="w-3.5 h-3.5" /> : undefined}
                >
                  {isSelected ? 'Apply This Scenario' : 'Select Scenario'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
