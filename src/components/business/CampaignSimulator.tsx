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
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Campaign Simulator
            </h1>
            <Badge variant="brand" size="sm">
              Predictive Modeling
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Compare hypothetical campaign structures to evaluate reach, content volume, engagement, and estimated CPA.
          </p>
        </div>

        {adoptedMessage && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{adoptedMessage}</span>
          </div>
        )}
      </div>

      {/* Simulator Control Bar */}
      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--primary)]" />
              <span>Simulated Budget Variable</span>
            </label>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Drag slider to re-calculate projected reach, volume, and CPAs across scenarios.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">
              ₹{(budget / 100000).toFixed(1)} Lakhs
            </span>
            <span className="text-xs text-[var(--text-muted)] ml-2">(₹{budget.toLocaleString()})</span>
          </div>
        </div>

        <input
          type="range"
          min={200000}
          max={2000000}
          step={50000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full h-2 bg-[var(--surface-subtle)] rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span>₹2.0L (Micro Pilot)</span>
          <span>₹5.0L (Standard Rollout)</span>
          <span>₹10.0L (Growth Phase)</span>
          <span>₹20.0L (Scale Blitz)</span>
        </div>
      </div>

      {/* Mandatory Disclaimer as per Specification */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-[var(--text-primary)]">Algorithmic Simulation Notice:</strong> Projected ranges for reach, engagement, clicks, and CPA are calculated using platform performance averages, audience saturation modeling, and verified historical creator metrics. They are modeled estimates and not guaranteed business returns.
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
                  ? 'bg-[var(--surface-elevated)] border-[var(--primary)] shadow-2xl ring-1 ring-[var(--primary)]'
                  : 'bg-[var(--surface)] shadow-xs border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-[var(--primary)] font-semibold uppercase tracking-wider">
                      {scen.name.split(':')[0]}
                    </span>
                    <Badge
                      variant={scen.riskFactor === 'Low' ? 'success' : 'neutral'}
                      size="sm"
                    >
                      {scen.riskFactor} Risk
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">
                    {scen.strategyTitle}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {scen.description}
                  </p>
                </div>

                {/* Creator Breakdown Tag */}
                <div className="p-3 rounded-2xl bg-[var(--surface-subtle)] shadow-xs border border-[var(--border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Creator Mix:</span>
                  <span className="font-semibold text-[var(--text-primary)] font-mono">
                    {scen.creatorBreakdown}
                  </span>
                </div>

                {/* Metrics Table */}
                <div className="space-y-3 pt-2">
                  {/* Projected Reach */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)]">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Projected Reach</span>
                    </span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {scen.projectedReach.min} – {scen.projectedReach.max}
                    </span>
                  </div>

                  {/* Content Volume */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)]">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Content Volume</span>
                    </span>
                    <span className="font-mono text-[var(--text-primary)]">
                      {scen.contentVolume}
                    </span>
                  </div>

                  {/* Projected Engagement */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)]">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Engagement Rate</span>
                    </span>
                    <span className="font-mono text-[var(--primary)] font-semibold">
                      {scen.projectedEngagement}
                    </span>
                  </div>

                  {/* Projected Clicks */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)]">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <MousePointer className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Projected Clicks</span>
                    </span>
                    <span className="font-mono text-[var(--text-primary)]">
                      {scen.projectedClicks.min} – {scen.projectedClicks.max}
                    </span>
                  </div>

                  {/* Conversion Potential */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Conversion Potential</span>
                    <span className="text-[var(--text-primary)] font-medium">{scen.conversionPotential}</span>
                  </div>

                  {/* Estimated CPA */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-medium text-emerald-500">Estimated CPA</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-500">
                      {scen.estimatedCpa}
                    </span>
                  </div>
                </div>

                {/* Strategy Tag */}
                <div className="p-2.5 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[11px] text-[var(--primary)] text-center font-medium">
                  {scen.recommendationTag}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
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
