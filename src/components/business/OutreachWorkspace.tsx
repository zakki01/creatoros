import React, { useState } from 'react';
import {
  Users,
  Send,
  Sparkles,
  Calendar,
  MessageSquare,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { OutreachStage, OutreachItem } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { AiCampaignEngine } from '../../services/aiService';

export const OutreachWorkspace: React.FC = () => {
  const {
    outreachItems,
    updateOutreachStage,
    sendOutreachMessage,
    campaigns,
    activeCampaignId,
  } = useAppState();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedItem, setSelectedItem] = useState<OutreachItem | null>(null);
  const [composerMessage, setComposerMessage] = useState('');
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);

  const stages: OutreachStage[] = [
    'Selected',
    'Contacted',
    'Replied',
    'Interested',
    'Negotiating',
    'Confirmed',
    'Declined',
  ];

  const handleOpenItem = (item: OutreachItem) => {
    setSelectedItem(item);
    setComposerMessage(item.aiDraftProposal || '');
  };

  const handleSendMessage = () => {
    if (!selectedItem || !composerMessage.trim()) return;
    sendOutreachMessage(selectedItem.id, 'brand', composerMessage);
    // If it was in Contacted or Replied, advance appropriately if user confirms
    setComposerMessage('');
    setSelectedItem((prev) =>
      prev
        ? {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: `msg-${Date.now()}`,
                sender: 'brand',
                message: composerMessage,
                timestamp: 'Just now',
              },
            ],
          }
        : null
    );
  };

  const handleGenerateAiMessage = () => {
    if (!selectedItem) return;
    const campaign = campaigns.find((c) => c.id === selectedItem.campaignId) || campaigns[0];
    const generated = AiCampaignEngine.generateOutreachMessage(selectedItem.creator, campaign);
    setComposerMessage(generated);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Outreach Workspace
            </h1>
            <Badge variant="brand" size="sm">
              Pipeline Management
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage conversations, contract negotiations, and creator onboarding milestones.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 bg-[var(--surface-subtle)] rounded-2xl border border-[var(--border)]">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              viewMode === 'kanban'
                ? 'bg-[var(--surface-elevated)] text-[var(--primary)] border border-[var(--border)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-[var(--surface-elevated)] text-[var(--primary)] border border-[var(--border)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List Table</span>
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
          {stages.map((stage) => {
            const itemsInStage = outreachItems.filter((i) => i.stage === stage);
            return (
              <div
                key={stage}
                className="w-72 shrink-0 flex flex-col rounded-3xl bg-[var(--surface)] shadow-xs border border-[var(--border)] p-3 space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{stage}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-mono">
                      {itemsInStage.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 flex-1 min-h-[300px]">
                  {itemsInStage.length === 0 ? (
                    <div className="h-24 rounded-2xl border border-dashed border-[var(--border)] flex items-center justify-center text-[11px] text-[var(--text-muted)]">
                      Empty stage
                    </div>
                  ) : (
                    itemsInStage.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenItem(item)}
                        className="p-3.5 rounded-2xl bg-[var(--surface-elevated)] shadow-xs border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] cursor-pointer transition-all space-y-2.5 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={item.creator.avatar}
                              alt={item.creator.name}
                              className="w-7 h-7 rounded-xl object-cover ring-1 ring-[var(--border)] shrink-0"
                            />
                            <div>
                              <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                {item.creator.name}
                              </p>
                              <p className="text-[10px] text-[var(--text-muted)] font-mono">
                                @{item.creator.handle}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[var(--text-primary)]">
                            ₹{(item.proposedFee / 1000).toFixed(0)}k
                          </span>
                        </div>

                        <div className="text-[11px] text-[var(--text-secondary)] bg-[var(--surface-subtle)] p-2 rounded-xl border border-[var(--border)] line-clamp-2">
                          Next: <span className="text-[var(--text-primary)]">{item.nextAction}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
                          <span>Last: {item.lastContactDate}</span>
                          <span className="text-[var(--primary)] flex items-center gap-0.5">
                            <MessageSquare className="w-3 h-3" />
                            <span>{item.messages.length}</span>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {viewMode === 'list' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-b border-[var(--border)] uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4">Proposed Fee</th>
                  <th className="py-3 px-4">Next Action</th>
                  <th className="py-3 px-4">Last Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {outreachItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    className="hover:bg-zinc-200 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.creator.avatar}
                          alt={item.creator.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-zinc-800">{item.creator.name}</p>
                          <p className="text-[10px] text-zinc-500">@{item.creator.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-700 font-medium">{item.campaignName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="brand" size="sm">
                        {item.stage}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-800">
                      ₹{item.proposedFee.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 max-w-xs truncate">{item.nextAction}</td>
                    <td className="py-3 px-4 text-zinc-500 font-mono">{item.lastContactDate}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-[var(--primary)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenItem(item);
                        }}
                      >
                        Open Workspace
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* OUTREACH DETAIL & AI COMPOSER MODAL */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        maxWidth="3xl"
        title={
          selectedItem && (
            <div className="flex items-center gap-3">
              <img
                src={selectedItem.creator.avatar}
                alt={selectedItem.creator.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-[var(--border)]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--text-primary)] font-display">
                    {selectedItem.creator.name}
                  </h2>
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    @{selectedItem.creator.handle}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Campaign: <span className="text-[var(--text-primary)]">{selectedItem.campaignName}</span> • Fee: ₹{selectedItem.proposedFee.toLocaleString()}
                </p>
              </div>
            </div>
          )
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Stage Selector */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-secondary)]">Current Pipeline Stage:</span>
              <select
                value={selectedItem.stage}
                onChange={(e) => {
                  const newStage = e.target.value as OutreachStage;
                  updateOutreachStage(selectedItem.id, newStage);
                  setSelectedItem({ ...selectedItem, stage: newStage });
                }}
                className="bg-[var(--input)] text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-xl border border-[var(--border)] font-medium focus:outline-none"
              >
                {stages.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Conversation History */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[var(--text-primary)]">Message Thread</h4>
              <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] shadow-xs border border-[var(--border)] space-y-3 max-h-60 overflow-y-auto">
                {selectedItem.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === 'brand' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'brand'
                          ? 'bg-[var(--primary)] text-white rounded-br-none'
                          : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.message}</p>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Generator & Composer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">Compose Message</h4>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />}
                  onClick={handleGenerateAiMessage}
                  className="text-xs"
                >
                  Generate AI Personalized Pitch
                </Button>
              </div>

              <textarea
                rows={4}
                value={composerMessage}
                onChange={(e) => setComposerMessage(e.target.value)}
                placeholder="Type your message or generate an AI draft tailored to this creator..."
                className="w-full bg-[var(--input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] p-3.5 text-xs rounded-2xl border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Note: Messages are never sent automatically without user approval.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSendMessage}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                    disabled={!composerMessage.trim()}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
