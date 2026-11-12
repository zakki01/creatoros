import React from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Camera,
  Monitor,
  MessageSquare,
  Trophy,
  Image as ImageIcon,
  Plus,
} from 'lucide-react';

export interface StudioLayer {
  id: string;
  name: string;
  type: 'camera' | 'screen' | 'chat' | 'goal' | 'watermark';
  visible: boolean;
  locked: boolean;
}

export interface LiveSourcesDockProps {
  layers: StudioLayer[];
  onToggleLayerVisible: (id: string) => void;
  onToggleLayerLocked: (id: string) => void;
  onStartScreenShare: () => void;
  isScreenSharing: boolean;
  isVirtualFeed: boolean;
}

export const LiveSourcesDock: React.FC<LiveSourcesDockProps> = ({
  layers,
  onToggleLayerVisible,
  onToggleLayerLocked,
  onStartScreenShare,
  isScreenSharing,
  isVirtualFeed,
}) => {
  const getLayerIcon = (type: StudioLayer['type']) => {
    switch (type) {
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-sky-400" />;
      case 'screen':
        return <Monitor className="w-3.5 h-3.5 text-emerald-400" />;
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      case 'goal':
        return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case 'watermark':
        return <ImageIcon className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 shadow-xl text-zinc-100 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide uppercase font-mono text-zinc-200">
              Sources & Layers
            </h4>
            <span className="text-[10px] font-mono text-zinc-400">
              {layers.filter((l) => l.visible).length} / {layers.length} Active on Canvas
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartScreenShare}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
            isScreenSharing
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
          }`}
          title="Share screen or desktop window"
        >
          <Monitor className="w-3 h-3" />
          <span>{isScreenSharing ? 'Sharing Screen' : '+ Share Screen'}</span>
        </button>
      </div>

      {/* Layers List */}
      <div className="space-y-1.5">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-xs ${
              layer.visible
                ? 'bg-zinc-900/70 border-zinc-800 text-zinc-200'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-zinc-800/80 flex items-center justify-center">
                {getLayerIcon(layer.type)}
              </div>
              <div>
                <span className="font-semibold block font-mono text-[11px]">{layer.name}</span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {layer.type === 'camera' && (isVirtualFeed ? 'Virtual Avatar Stream' : 'Live Physical Cam')}
                  {layer.type === 'screen' && (isScreenSharing ? 'Display Captured' : 'Standby')}
                  {layer.type === 'chat' && 'Transparent Overlay'}
                  {layer.type === 'goal' && 'Progress Bar'}
                  {layer.type === 'watermark' && 'CreatorOS Certified'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Lock Toggle */}
              <button
                type="button"
                onClick={() => onToggleLayerLocked(layer.id)}
                className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title={layer.locked ? 'Unlock layer' : 'Lock layer'}
              >
                {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>

              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => onToggleLayerVisible(layer.id)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  layer.visible ? 'text-zinc-200 hover:text-white' : 'text-zinc-600 hover:text-zinc-400'
                }`}
                title={layer.visible ? 'Hide source from broadcast' : 'Show source on broadcast'}
              >
                {layer.visible ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
