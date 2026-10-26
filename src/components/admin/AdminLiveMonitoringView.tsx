import React, { useState } from 'react';
import {
  Video,
  Radio,
  Coins,
  ShieldAlert,
  Users,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GiftLedgerService, VIRTUAL_GIFTS_CATALOG } from '../../services/giftLedgerService';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export const AdminLiveMonitoringView: React.FC = () => {
  const toast = useToast();
  const [activeStreams, setActiveStreams] = useState([
    {
      id: 'room-studio-live-01',
      hostName: 'Rohan Sharma',
      hostHandle: '@rohansharma',
      title: 'Cinematic 3D Lookbook BTS & Lighting Session',
      viewerCount: 142,
      startedAt: '24m ago',
      provider: 'WebRTC / SFU',
      health: 'Excellent (60 FPS)',
      giftsReceivedCoins: 1250,
      activeEffect: 'Studio Luxe Glow',
      status: 'live',
    },
    {
      id: 'room-studio-live-02',
      hostName: 'Maya Patel',
      hostHandle: '@mayapatel',
      title: 'Live Editing: 4K Commercial Grade Color Workflow',
      viewerCount: 88,
      startedAt: '1h 12m ago',
      provider: 'LiveKit SFU',
      health: 'Good (30 FPS)',
      giftsReceivedCoins: 4800,
      activeEffect: '35mm Kodak Portra Grade',
      status: 'live',
    },
  ]);

  const ledgerEntries = GiftLedgerService.getAllLedgerEntries();
  const giftTransactions = GiftLedgerService.getGiftTransactions();

  const handleEmergencyKillStream = (roomId: string, hostName: string) => {
    setActiveStreams((prev) => prev.filter((s) => s.id !== roomId));
    toast.error(`Emergency shutdown executed for stream ${roomId} (${hostName}).`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Live Stream Supervision &amp; Gift Ledgers
          </h1>
          <p className="text-xs text-zinc-500">
            Real-time broadcast monitoring, WebRTC/LiveKit health telemetry, and coin audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeStreams.length} Active Broadcasts
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">Total Live Viewers</span>
            <Users className="w-4 h-4 text-[#00869B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900">
            {activeStreams.reduce((sum, s) => sum + s.viewerCount, 0)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Across global CDN edge nodes</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">Gifts Exchanged Today</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900">
            6,050 <span className="text-xs font-sans text-zinc-500">Coins</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Platform 30% Fee: <span className="font-semibold text-emerald-600">$18.15 USD</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">Stream Health Index</span>
            <Radio className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900">99.8%</div>
          <div className="text-[11px] text-zinc-400 mt-1">0 reported packet losses</div>
        </div>
      </div>

      {/* Live Stream Table */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>Active Broadcast Rooms</span>
        </h2>

        {activeStreams.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500">
            No broadcasts are currently live.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {activeStreams.map((stream) => (
              <div
                key={stream.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-zinc-900">{stream.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-3 text-xs text-zinc-500">
                    <span>Host: <strong className="text-zinc-800">{stream.hostName}</strong> ({stream.hostHandle})</span>
                    <span>•</span>
                    <span>Provider: {stream.provider}</span>
                    <span>•</span>
                    <span>AR: {stream.activeEffect}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{stream.health}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{stream.viewerCount}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => handleEmergencyKillStream(stream.id, stream.hostName)}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    <span>Kill Broadcast</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Virtual Gifts Double-Entry Ledger */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-500" />
          <span>Virtual Gifts Financial Ledger</span>
        </h2>

        {giftTransactions.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500">
            No gift transactions recorded yet. Transactions are logged immutably upon broadcast gift transfer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-2">Transaction ID</th>
                  <th className="pb-2">Sender</th>
                  <th className="pb-2">Recipient</th>
                  <th className="pb-2">Gift Item</th>
                  <th className="pb-2">Coins</th>
                  <th className="pb-2">Creator Share</th>
                  <th className="pb-2">Platform Fee</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {giftTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50">
                    <td className="py-2.5 font-mono text-zinc-600">{tx.id}</td>
                    <td className="py-2.5 font-semibold text-zinc-900">{tx.senderName}</td>
                    <td className="py-2.5 text-zinc-800">{tx.recipientName}</td>
                    <td className="py-2.5">
                      <span className="mr-1">{tx.giftIcon}</span> {tx.giftName}
                    </td>
                    <td className="py-2.5 font-bold font-mono text-amber-600">{tx.coinAmount}</td>
                    <td className="py-2.5 font-mono text-emerald-700 font-semibold">
                      ${tx.creatorEarningUsd.toFixed(2)}
                    </td>
                    <td className="py-2.5 font-mono text-zinc-500">${tx.platformFeeUsd.toFixed(2)}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
