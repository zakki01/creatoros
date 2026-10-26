import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Lock,
  Globe,
  Users,
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Copy,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppState } from '../../context/StateContext';

interface ReportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultReportType?: 'campaign' | 'financial' | 'creator' | 'governance';
}

export const ReportCenterModal: React.FC<ReportCenterModalProps> = ({
  isOpen,
  onClose,
  defaultReportType = 'campaign',
}) => {
  const { userProfile, role } = useAppState();

  const [reportType, setReportType] = useState<string>(defaultReportType);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('team');
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const shareableUrl = `https://creatoros.io/reports/verified/${role}-${Math.random().toString(36).substring(2, 9)}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      // Trigger browser mock download
      const element = document.createElement('a');
      const file = new Blob(
        [
          `CreatorOS Official Report: ${reportType.toUpperCase()}\nGenerated For: ${userProfile.name} (${role})\nDate Range: ${dateRange}\nTimestamp: ${new Date().toISOString()}\nVerified: True`,
        ],
        { type: 'text/plain' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `creatoros-${reportType}-report-${dateRange}.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Executive Report Center" maxWidth="lg">
      <div className="space-y-6">
        {/* Header subtitle */}
        <p className="text-xs text-zinc-500">
          Generate tamper-proof executive PDF briefings, raw CSV performance attribution, and secured shareable stakeholder links.
        </p>

        {/* Report Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'campaign', label: 'Campaign ROAS', icon: Sparkles },
            { id: 'financial', label: 'Financial Ledger', icon: FileSpreadsheet },
            { id: 'creator', label: 'Creator Attribution', icon: Users },
            { id: 'governance', label: 'Compliance Audit', icon: ShieldCheck },
          ].map((type) => {
            const Icon = type.icon;
            const isSelected = reportType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setReportType(type.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800/90 border-[#00B4D8]/80 text-white shadow-md'
                    : 'bg-white shadow-sm border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#0096C7]' : 'text-zinc-500'}`} />
                <span className="text-xs font-semibold block">{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration Row: Date Range & Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Date Range Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Reporting Horizon</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-white shadow-sm rounded-xl border border-zinc-200">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: 'Quarter' },
                { id: 'all', label: 'All-Time' },
              ].map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setDateRange(range.id as any)}
                  className={`py-1.5 text-[11px] font-mono rounded-lg transition-colors cursor-pointer ${
                    dateRange === range.id
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Link Access & Governance</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white shadow-sm rounded-xl border border-zinc-200">
              {[
                { id: 'private', label: 'Private', icon: Lock },
                { id: 'team', label: 'Workspace', icon: Users },
                { id: 'public', label: 'Public Link', icon: Globe },
              ].map((vis) => {
                const Icon = vis.icon;
                return (
                  <button
                    key={vis.id}
                    type="button"
                    onClick={() => setVisibility(vis.id as any)}
                    className={`py-1.5 text-[11px] flex items-center justify-center gap-1.5 rounded-lg transition-colors cursor-pointer ${
                      visibility === vis.id
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{vis.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Executive Preview Card */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-black/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-zinc-800 uppercase font-mono tracking-wider">
                Summary Manifest Preview
              </span>
            </div>
            <Badge variant="success" size="sm" dot>
              Tamper Proof
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-black/[0.06]">
              <span className="text-[10px] text-zinc-500 block font-mono">Total Tracked Reach</span>
              <span className="text-sm font-bold font-mono text-zinc-900">2.42M Views</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-black/[0.06]">
              <span className="text-[10px] text-zinc-500 block font-mono">Conversion ROAS</span>
              <span className="text-sm font-bold font-mono text-emerald-400">3.82x Lift</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-black/[0.06]">
              <span className="text-[10px] text-zinc-500 block font-mono">Disbursed Escrow</span>
              <span className="text-sm font-bold font-mono text-zinc-900">₹8,70,000</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-black/[0.06]">
              <span className="text-[10px] text-zinc-500 block font-mono">Verified Sign-off</span>
              <span className="text-sm font-bold font-mono text-[#0096C7]">100% Attributed</span>
            </div>
          </div>
        </div>

        {/* Public Share Link Bar if Public or Workspace */}
        {visibility !== 'private' && (
          <div className="p-3 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/30 flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2 text-xs text-indigo-200 truncate">
              <Share2 className="w-4 h-4 shrink-0 text-[#0096C7]" />
              <span className="truncate font-mono text-[11px]">{shareableUrl}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#00B4D8] hover:bg-[#0096C7] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        )}

        {/* Download Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-200">
          <Button variant="ghost" size="md" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="outline"
            size="md"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
            onClick={() => handleExport('csv')}
            disabled={isExporting !== null}
            className="cursor-pointer border-zinc-300 text-zinc-800"
          >
            {isExporting === 'csv' ? 'Compiling CSV...' : 'Export Raw CSV'}
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => handleExport('pdf')}
            disabled={isExporting !== null}
            className="bg-[#00B4D8] hover:bg-[#0096C7] text-white shadow-indigo-600/20 cursor-pointer"
          >
            {isExporting === 'pdf' ? 'Generating PDF...' : 'Download Executive PDF'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
