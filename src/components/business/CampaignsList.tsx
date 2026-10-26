import React from 'react';
import {
  Layers,
  Plus,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

interface CampaignsListProps {
  onOpenCampaign: (campaignId: string) => void;
  onOpenCreateModal: () => void;
}

export const CampaignsList: React.FC<CampaignsListProps> = ({
  onOpenCampaign,
  onOpenCreateModal,
}) => {
  const { campaigns } = useAppState();

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 font-display">
            Campaigns
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            All active, planned, and archived influencer marketing programs.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onOpenCreateModal}
          className="text-xs"
        >
          Create Campaign
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            onClick={() => onOpenCampaign(camp.id)}
            className="p-5 rounded-2xl bg-white shadow-xs border border-zinc-200 hover:border-zinc-300 cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#007E93] transition-colors">
                  {camp.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">{camp.objective}</p>
              </div>
              <Badge
                variant={camp.health === 'Healthy' ? 'success' : 'warning'}
                size="sm"
                dot
              >
                {camp.health === 'Healthy' ? 'On track' : 'Attention'}
              </Badge>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Progress</span>
                <span className="font-mono text-zinc-800">{camp.progress}%</span>
              </div>
              <Progress value={camp.progress} size="sm" color="brand" />
            </div>

            {/* Quotas & Budget */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-zinc-200/60 text-zinc-500">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Creators</span>
                <span className="font-mono text-zinc-800">
                  {camp.creators.confirmed} / {camp.creators.target}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Content</span>
                <span className="font-mono text-zinc-800">
                  {camp.content.submitted} / {camp.content.target}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Spend</span>
                <span className="font-mono text-zinc-800">
                  ₹{(camp.budgetSpent / 100000).toFixed(1)}L
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200/60 text-zinc-500">
              <span>Deadline: {camp.timeline.endDate}</span>
              <span className="text-[#007E93] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Open Campaign</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
