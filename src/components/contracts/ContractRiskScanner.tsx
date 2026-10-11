import React from 'react';
import { AlertTriangle, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ContractRiskWarning } from '../../types/contract';

interface ContractRiskScannerProps {
  risks: ContractRiskWarning[];
  onFixRisk: (stepIndex: number) => void;
  onDismissRisk?: (riskId: string) => void;
}

export const ContractRiskScanner: React.FC<ContractRiskScannerProps> = ({
  risks,
  onFixRisk,
  onDismissRisk,
}) => {
  const activeRisks = risks.filter((r) => !r.dismissed);

  if (activeRisks.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-emerald-300">Contract Integrity Verified</h4>
            <p className="text-[11px] text-emerald-400/80">
              Zero predatory clauses detected. Terms are balanced, compliant, and ready for execution.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 font-semibold">
          100% HEALTH
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono">
            ⚠ {activeRisks.length} Item{activeRisks.length > 1 ? 's' : ''} Need Attention
          </h4>
        </div>
        <span className="text-[11px] text-zinc-400">Automated Risk Scanner</span>
      </div>

      <div className="space-y-2.5">
        {activeRisks.map((risk) => (
          <div
            key={risk.id}
            className={`p-3.5 rounded-2xl border transition-all ${
              risk.severity === 'critical'
                ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {risk.severity === 'critical' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                    {risk.title}
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                        risk.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </h5>
                  <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                    <strong className="text-zinc-200 font-semibold">Why: </strong>
                    {risk.reason}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                    <strong className="text-zinc-300 font-semibold">Recommended: </strong>
                    {risk.recommendation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-center">
                <button
                  type="button"
                  onClick={() => onFixRisk(risk.stepIndex)}
                  className="min-h-[44px] px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-indigo-600/30 active:scale-95"
                >
                  <span>Fix</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {onDismissRisk && (
                  <button
                    type="button"
                    onClick={() => onDismissRisk(risk.id)}
                    className="min-h-[44px] px-2.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Keep
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
