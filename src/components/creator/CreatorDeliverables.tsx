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
    <div className="space-y-5 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display tracking-tight">
            Content
          </h1>
          <Badge variant="brand" size="sm">
            {deliverablesQueue.length} Due
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('live')}
              leftIcon={<Video className="w-3.5 h-3.5 text-[#007E93]" />}
              className="border-[#00B4D8]/30 hover:border-[#007E93]/40 text-zinc-800"
            >
              Live Studio
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenSubmissionModal}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Upcoming Deliverable Deadlines */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Due Soon ({deliverablesQueue.length})
        </h3>

        <div className="space-y-3">
          {deliverablesQueue.map((del) => (
            <Card key={del.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900">{del.title}</h4>
                  {del.urgent && (
                    <Badge variant="warning" size="sm" dot>
                      Due Soon
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  {del.campaignName} · {del.type} · Due {del.deadline} · {del.compensation}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenSubmissionModal}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500"
                >
                  Upload
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Submitted Drafts Review Queue */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
          My Submitted Drafts ({mySubmissions.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mySubmissions.map((sub) => (
            <Card key={sub.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">{sub.title}</h4>
                  <p className="text-xs text-zinc-500">{sub.campaignName}</p>
                </div>
                <Badge
                  variant={sub.status === 'approved' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {sub.status === 'approved' ? 'Approved' : 'In Review'}
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
                <p className="line-clamp-2 italic">"{sub.caption}"</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-200">
                <span>Submitted: {sub.submittedAt.split(' ')[0]}</span>
                {sub.status === 'approved' ? (
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready for scheduled drop
                  </span>
                ) : (
                  <span className="text-amber-800 font-medium">Brand evaluating cut</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
