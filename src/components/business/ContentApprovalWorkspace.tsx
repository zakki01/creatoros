import React, { useState } from 'react';
import {
  Film,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Eye,
  MessageSquare,
  ThumbsUp,
  RotateCcw,
  Check,
  X,
  History,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ContentSubmission, ContentStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const ContentApprovalWorkspace: React.FC = () => {
  const {
    submissions,
    approveContent,
    requestChanges,
    rejectContent,
  } = useAppState();

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(
    submissions[0]?.id || ''
  );
  const [feedbackNote, setFeedbackNote] = useState('');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  const selectedSub = submissions.find((s) => s.id === selectedSubmissionId) || submissions[0];

  const handleApprove = () => {
    if (!selectedSub) return;
    approveContent(selectedSub.id, feedbackNote || 'Approved for rollout.');
    setFeedbackNote('');
  };

  const handleRequestChanges = () => {
    if (!selectedSub || !feedbackNote.trim()) {
      alert('Please provide feedback notes explaining the changes needed.');
      return;
    }
    requestChanges(selectedSub.id, feedbackNote);
    setFeedbackNote('');
  };

  const handleReject = () => {
    if (!selectedSub) return;
    rejectContent(selectedSub.id, feedbackNote || 'Creative mismatch with guidelines.');
    setFeedbackNote('');
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" size="sm" dot>Approved</Badge>;
      case 'submitted':
        return <Badge variant="warning" size="sm" dot>Needs Review</Badge>;
      case 'changes_requested':
        return <Badge variant="danger" size="sm" dot>Changes Requested</Badge>;
      case 'published':
        return <Badge variant="brand" size="sm" dot>Published</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display">
              Content Approvals
            </h1>
            <Badge variant="purple" size="sm">
              AI Verification Engine
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Automated brand compliance checks, revision histories, and sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning" size="md">
            {submissions.filter((s) => s.status === 'submitted').length} Awaiting Approval
          </Badge>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Submissions Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-1">
            Submission Queue ({submissions.length})
          </h3>

          <div className="space-y-2.5">
            {submissions.map((sub) => {
              const isSelected = sub.id === selectedSub?.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmissionId(sub.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[var(--surface-elevated)] border-[var(--primary)] shadow-lg ring-1 ring-[var(--primary)]'
                      : 'bg-[var(--surface)] shadow-xs border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={sub.creatorAvatar}
                        alt={sub.creatorName}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-[var(--border)]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">{sub.creatorName}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">{sub.creatorHandle}</p>
                      </div>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] font-medium line-clamp-1">
                    {sub.title}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
                    <span className="font-mono">{sub.deliverableType}</span>
                    <span>{sub.submittedAt.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Inspector & AI Pre-Check (8 cols) */}
        {selectedSub && (
          <div className="lg:col-span-8 space-y-6">
            {/* Creative Preview Container */}
            <Card className="p-6 space-y-6">
              {/* Submission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] font-display">
                      {selectedSub.title}
                    </h2>
                    {getStatusBadge(selectedSub.status)}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Submitted by <strong className="text-[var(--text-primary)]">{selectedSub.creatorName}</strong> for{' '}
                    <strong className="text-[var(--text-primary)]">"{selectedSub.campaignName}"</strong>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<History className="w-4 h-4" />}
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="text-xs shrink-0"
                >
                  Revision History ({selectedSub.revisionHistory.length})
                </Button>
              </div>

              {/* Visual Media Viewer (Simulated 9:16 / 16:9 Showcase) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Media Preview Box */}
                <div className="md:col-span-5 rounded-2xl overflow-hidden bg-black border border-[var(--border)] relative group aspect-[9/16] max-h-[460px] mx-auto shadow-2xl">
                  <img
                    src={selectedSub.mediaUrl}
                    alt={selectedSub.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Bar on Media */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge variant="brand" size="sm">
                      {selectedSub.deliverableType}
                    </Badge>
                    <span className="text-[10px] text-white/80 font-mono bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      0:38 / 0:45
                    </span>
                  </div>

                  {/* Bottom Bar on Media */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-1 text-white">
                    <p className="text-xs font-semibold">{selectedSub.creatorName}</p>
                    <p className="text-[11px] text-zinc-300 line-clamp-2">{selectedSub.caption}</p>
                  </div>
                </div>

                {/* Content Details & AI Pre-Check */}
                <div className="md:col-span-7 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* AI PRE-CHECK REPORT (Specified in requirements) */}
                    <div className="p-4 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                          <h4 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
                            AI Pre-Check Verification
                          </h4>
                        </div>
                        <Badge
                          variant={
                            selectedSub.aiPreCheck.overallStatus === 'passed'
                              ? 'success'
                              : selectedSub.aiPreCheck.overallStatus === 'warning'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {selectedSub.aiPreCheck.overallStatus.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs">
                        {/* Product Visible */}
                        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
                          {selectedSub.aiPreCheck.productVisible ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-[var(--text-primary)]">Product Visibility:</span>
                            <span className="text-[var(--text-secondary)] text-[11px] ml-1">
                              {selectedSub.aiPreCheck.productNotes}
                            </span>
                          </div>
                        </div>

                        {/* Brand Mention */}
                        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
                          {selectedSub.aiPreCheck.brandMention ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-[var(--text-primary)]">Brand Tagging:</span>
                            <span className="text-[var(--text-secondary)] text-[11px] ml-1">
                              {selectedSub.aiPreCheck.brandNotes}
                            </span>
                          </div>
                        </div>

                        {/* Required CTA */}
                        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
                          {selectedSub.aiPreCheck.requiredCta ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-[var(--text-primary)]">Required CTA:</span>
                            <span className="text-[var(--text-secondary)] text-[11px] ml-1">
                              {selectedSub.aiPreCheck.ctaNotes}
                            </span>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
                          {selectedSub.aiPreCheck.durationCompliant ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-[var(--text-primary)]">Duration Compliance:</span>
                            <span className="text-[var(--text-secondary)] text-[11px] ml-1">
                              {selectedSub.aiPreCheck.durationNotes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Caption & Hashtags */}
                    <div className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] shadow-xs border border-[var(--border)] space-y-2 text-xs">
                      <span className="font-semibold text-[var(--text-primary)] block">Creator Caption & CTA:</span>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{selectedSub.caption}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedSub.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decision Actions Bar */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-3">
                    <input
                      type="text"
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                      placeholder="Add feedback or revision notes for creator..."
                      className="w-full bg-[var(--input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleReject}
                        leftIcon={<X className="w-3.5 h-3.5" />}
                        className="text-xs flex-1"
                      >
                        Reject
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRequestChanges}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        className="text-xs flex-1"
                      >
                        Request Changes
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleApprove}
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                        className="text-xs flex-1"
                      >
                        Approve Content
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Revision History Modal */}
      {selectedSub && (
        <Modal
          isOpen={isRevisionModalOpen}
          onClose={() => setIsRevisionModalOpen(false)}
          title={`Revision History — ${selectedSub.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {selectedSub.revisionHistory.map((rev) => (
              <div
                key={rev.version}
                className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" size="sm">
                      Version {rev.version}
                    </Badge>
                    <span className="text-[var(--text-muted)]">{rev.submittedAt}</span>
                  </div>
                  {rev.feedbackStatus && (
                    <Badge
                      variant={
                        rev.feedbackStatus === 'approved'
                          ? 'success'
                          : rev.feedbackStatus === 'changes_requested'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {rev.feedbackStatus.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                <p className="text-[var(--text-secondary)]">{rev.notes}</p>
                {rev.feedbackFromBrand && (
                  <div className="p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                    <strong className="text-[var(--text-primary)]">Brand Feedback: </strong>
                    {rev.feedbackFromBrand}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};
