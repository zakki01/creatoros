import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Plus,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Users,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const AiCampaignBrain: React.FC<{ onNavigate: (tab: string) => void }> = ({
  onNavigate,
}) => {
  const {
    campaigns,
    attentionItems,
    resolveAttentionItem,
    outreachItems,
    submissions,
    payments,
    automationLevel,
  } = useAppState();

  const [customTask, setCustomTask] = useState('');
  const [createdTasks, setCreatedTasks] = useState<string[]>([
    'Schedule courier dispatch for Aanya Deshmukh replacement sample',
    'Export mid-campaign ROAS PDF report for executive review',
  ]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const activeAttention = attentionItems.filter((i) => !i.resolved);

  const handleCreateTask = () => {
    if (!customTask.trim()) return;
    setCreatedTasks([customTask, ...createdTasks]);
    setCustomTask('');
    setActionFeedback('Task created and added to campaign checklist.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleTriggerAction = (item: typeof attentionItems[0]) => {
    if (item.actionType === 'review') {
      onNavigate('approvals');
    } else if (item.actionType === 'send_reminder') {
      onNavigate('outreach');
    } else {
      resolveAttentionItem(item.id);
      setActionFeedback(`Resolved: ${item.title}`);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              AI Campaign Brain
            </h1>
            <Badge variant="purple" size="sm">
              Continuous Intelligence
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Autonomous state detection engine monitoring deadlines, creator latencies, and conversion drift.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white border border-zinc-200 px-3.5 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#0096C7]" />
          <span>Active Guardrail: <strong className="text-[#0096C7] uppercase">{automationLevel}</strong></span>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-[#00B4D8]/40 text-xs text-indigo-200 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proactive Detection Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#0096C7]" />
                <h3 className="text-base font-bold text-zinc-900 font-display">
                  Autonomous Risk & Opportunity Detection
                </h3>
              </div>
              <Badge variant={activeAttention.length > 0 ? 'warning' : 'success'} size="sm">
                {activeAttention.length} Flagged States
              </Badge>
            </div>

            <div className="space-y-3 pt-2">
              {activeAttention.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white shadow-xs border border-zinc-200 hover:border-zinc-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-900">{item.title}</span>
                        <Badge
                          variant={item.severity === 'urgent' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500">{item.description}</p>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                      {item.campaignName}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-xs text-indigo-200/90 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#0096C7] shrink-0" />
                      <span>{item.recommendedAction}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => resolveAttentionItem(item.id)}
                        className="text-xs"
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleTriggerAction(item)}
                        className="text-xs"
                      >
                        {item.actionType === 'review'
                          ? 'Review Now'
                          : item.actionType === 'send_reminder'
                          ? 'Send Reminder'
                          : 'Resolve'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Task Dispatcher */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 font-display">
              AI Task Orchestrator
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                placeholder="Instruct AI Brain to generate reminder, dispatch sample, or flag creator..."
                className="flex-1 bg-white text-zinc-900 text-xs px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateTask}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Task
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              {createdTasks.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs text-zinc-700"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                    <span>{t}</span>
                  </div>
                  <button
                    onClick={() => setCreatedTasks(createdTasks.filter((_, i) => i !== idx))}
                    className="text-zinc-500 hover:text-zinc-700 text-xs"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Platform State Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Real-Time State Telemetry
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                <span className="text-zinc-500">Tracked Campaigns</span>
                <span className="font-mono font-bold text-zinc-900">{campaigns.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                <span className="text-zinc-500">Creators in Pipeline</span>
                <span className="font-mono font-bold text-zinc-900">{outreachItems.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                <span className="text-zinc-500">Drafts in AI Pre-Check</span>
                <span className="font-mono font-bold text-[#0096C7]">
                  {submissions.filter((s) => s.status === 'submitted').length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                <span className="text-zinc-500">Upcoming Payments</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{payments.filter((p) => p.status === 'pending').reduce((a, b) => a + b.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3 bg-gradient-to-b from-indigo-950/30 to-zinc-900 border-[#00B4D8]/20">
            <div className="flex items-center gap-2 text-[#0096C7] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Safe Autopilot Rules</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              When Autopilot is active, CreatorOS automatically triggers reminder notifications to creators after 48h of inactivity and auto-syncs Shopify checkout attribution tokens.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
