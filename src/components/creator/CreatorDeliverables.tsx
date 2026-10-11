import React from 'react';
import {
  Film,
  Calendar,
  Clock,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Video,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const CreatorDeliverables: React.FC<{
  onOpenSubmissionModal: () => void;
  onNavigate?: (tab: string) => void;
}> = ({
  onOpenSubmissionModal,
  onNavigate,
}) => {
  const { submissions, creators } = useAppState();
  const currentCreator = creators[0];

  const mySubmissions = submissions.filter((s) => s.creatorId === currentCreator.id);

  const deliverablesQueue = [
    {
      id: 'del-01',
      campaignName: 'Summer Collection',
      title: 'Hero 4K Reel: Colaba Streetwear Walkthrough',
      type: 'Instagram Reel',
      deadline: 'Oct 10, 2026',
      status: 'Ready to submit',
      urgent: true,
      compensation: '₹35,000',
    },
    {
      id: 'del-02',
      campaignName: 'Summer Collection',
      title: '2x Story Highlights with Custom UTM Bio Link',
      type: 'Instagram Story',
      deadline: 'Oct 14, 2026',
      status: 'Upcoming',
      urgent: false,
      compensation: 'Included in scope',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 font-display">
              Deliverables & Submission Queue
            </h1>
            <Badge variant="brand" size="sm">
              Creative Tracker
            </Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Review creative briefs, manage production deadlines, and upload video drafts for brand sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('live')}
              leftIcon={<Video className="w-4 h-4 text-indigo-400" />}
              className="border-indigo-500/30 hover:border-indigo-500/60 text-zinc-200"
            >
              Record with Live Studio
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={onOpenSubmissionModal}
            leftIcon={<Upload className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
          >
            Submit Content Draft
          </Button>
        </div>
      </div>

      {/* Upcoming Deliverable Deadlines */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
          Action Required Deliverables ({deliverablesQueue.length})
        </h3>

        <div className="space-y-3">
          {deliverablesQueue.map((del) => (
            <Card key={del.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-100">{del.title}</h4>
                  {del.urgent && (
                    <Badge variant="warning" size="sm" dot>
                      Due Soon
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-zinc-400">
                  Campaign: <strong className="text-zinc-200">{del.campaignName}</strong> • Format: {del.type}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1 font-mono">
                  <span>Deadline: {del.deadline}</span>
                  <span>•</span>
                  <span>Comp: {del.compensation}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenSubmissionModal}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500"
                >
                  Upload Draft
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Submitted Drafts Review Queue */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
          My Submitted Drafts ({mySubmissions.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mySubmissions.map((sub) => (
            <Card key={sub.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">{sub.title}</h4>
                  <p className="text-xs text-zinc-400">{sub.campaignName}</p>
                </div>
                <Badge
                  variant={sub.status === 'approved' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {sub.status === 'approved' ? 'Approved' : 'In Review'}
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300">
                <p className="line-clamp-2 italic">"{sub.caption}"</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-800">
                <span>Submitted: {sub.submittedAt.split(' ')[0]}</span>
                {sub.status === 'approved' ? (
                  <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready for scheduled drop
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">Brand evaluating cut</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
