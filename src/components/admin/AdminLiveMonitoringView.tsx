import React, { useState } from 'react';
import {
  Radio,
  Eye,
  AlertTriangle,
  Gift,
  Coins,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles,
  Users,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface LiveRoom {
  id: string;
  hostName: string;
  hostHandle: string;
  title: string;
  viewerCount: number;
  provider: 'livekit' | 'webrtc-p2p';
  activeEffect: string;
  health: 'optimal' | 'degraded' | 'critical';
  durationSeconds: number;
}

interface GiftAuditItem {
  id: string;
  streamId: string;
  senderHandle: string;
  recipientHandle: string;
  giftType: string;
  coinValue: number;
  timestamp: string;
}

export const AdminLiveMonitoringView: React.FC = () => {
  const [activeStreams, setActiveStreams] = useState<LiveRoom[]>([
    {
      id: 'stream-01',
      hostName: 'Rohan Sharma',
      hostHandle: '@rohansharma',
      title: 'Neon Tokyo Studio Live Drop #2',
      viewerCount: 142,
      provider: 'livekit',
      activeEffect: 'Cyber Visor (Face Tracking)',
      health: 'optimal',
      durationSeconds: 1420,
    },
    {
      id: 'stream-02',
      hostName: 'Aanya Deshmukh',
      hostHandle: '@aanya_fashion',
      title: 'Streetwear Styling Session & Brand Collab QA',
      viewerCount: 88,
      provider: 'livekit',
      activeEffect: 'Studio Glow',
      health: 'optimal',
      durationSeconds: 780,
    },
  ]);

  const [giftTransactions] = useState<GiftAuditItem[]>([
    {
      id: 'gift-01',
      streamId: 'stream-01',
      senderHandle: '@superfan99',
      recipientHandle: '@rohansharma',
      giftType: 'Diamond Cyber Mask',
      coinValue: 5000,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'gift-02',
      streamId: 'stream-01',
      senderHandle: '@kartik_c',
      recipientHandle: '@rohansharma',
      giftType: 'Coffee Cup',
      coinValue: 50,
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: 'gift-03',
      streamId: 'stream-02',
      senderHandle: '@priya_m',
      recipientHandle: '@aanya_fashion',
      giftType: 'Rocket Launcher',
      coinValue: 1000,
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    },
  ]);

  const handleEmergencyKillStream = (streamId: string, hostName: string) => {
    if (
      window.confirm(
        `Are you sure you want to terminate live stream ${streamId} hosted by ${hostName}? This disconnects all LiveKit participants immediately.`
      )
    ) {
      setActiveStreams((prev) => prev.filter((s) => s.id !== streamId));
    }
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Live Stream Supervision &amp; Gift Ledgers
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Real-time broadcast monitoring, WebRTC/LiveKit health telemetry, and coin audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeStreams.length} Active Broadcasts
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Total Live Viewers</span>
            <Users className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {activeStreams.reduce((sum, s) => sum + s.viewerCount, 0)}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Across global CDN edge nodes</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Gifts Exchanged Today</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            6,050 <span className="text-xs font-sans text-[var(--text-muted)]">Coins</span>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            Platform 30% Fee: <span className="font-semibold text-emerald-500 dark:text-emerald-400">$18.15 USD</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Stream Health Index</span>
            <Radio className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">99.8%</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">0 reported packet losses</div>
        </div>
      </div>

      {/* Live Stream Table */}
      <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>Active Broadcast Rooms</span>
        </h2>

        {activeStreams.length === 0 ? (
          <div className="py-10 text-center text-xs text-[var(--text-muted)]">
            No broadcasts are currently live.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {activeStreams.map((stream) => (
              <div
                key={stream.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[var(--text-primary)]">{stream.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                    <span>Host: <strong className="text-[var(--text-primary)]">{stream.hostName}</strong> ({stream.hostHandle})</span>
                    <span>•</span>
                    <span>Provider: {stream.provider}</span>
                    <span>•</span>
                    <span>AR: {stream.activeEffect}</span>
                    <span>•</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-medium">{stream.health}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--surface-muted)] text-[var(--text-secondary)] text-xs font-bold font-mono border border-[var(--border)]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{stream.viewerCount}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
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
      <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-500" />
          <span>Virtual Gifts Financial Ledger</span>
        </h2>

        {giftTransactions.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--text-muted)]">
            No gift transactions recorded yet. Transactions are logged immutably upon broadcast gift transfer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-muted)] text-[var(--text-secondary)] uppercase text-[10px] font-mono tracking-wider border-b border-[var(--border)]">
                <tr>
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Sender</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Virtual Gift</th>
                  <th className="py-2.5 px-3">Coins Transferred</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-sans">
                {giftTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                    <td className="py-3 px-3 font-mono text-[var(--text-muted)]">{tx.id}</td>
                    <td className="py-3 px-3 font-medium text-[var(--text-primary)]">{tx.senderHandle}</td>
                    <td className="py-3 px-3 font-medium text-[var(--text-primary)]">{tx.recipientHandle}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)] text-[11px]">
                        <Gift className="w-3 h-3 text-amber-500" />
                        {tx.giftType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-500">
                      {tx.coinValue.toLocaleString()} Coins
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)] font-mono text-[11px]">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Settled
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
