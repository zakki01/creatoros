import React from 'react';
import { Sparkles, Square, Circle, Mic, MicOff, RefreshCw } from 'lucide-react';
import { AspectRatio, LiveConnectionState } from '../../../types';

interface LiveControlsProps {
  connectionState: LiveConnectionState;
  hasCamera: boolean;
  isRecording: boolean;
  recordingSeconds: number;
  aspectRatio: AspectRatio;
  isAudioEnabled: boolean;
  onToggleLive: () => void;
  onToggleRecording: () => void;
  onSelectAspectRatio: (aspect: AspectRatio) => void;
  onToggleAudio: () => void;
}

export const LiveControls: React.FC<LiveControlsProps> = ({
  connectionState,
  hasCamera,
  isRecording,
  recordingSeconds,
  aspectRatio,
  isAudioEnabled,
  onToggleLive,
  onToggleRecording,
  onSelectAspectRatio,
  onToggleAudio,
}) => {
  const isLive = connectionState === 'live';
  const isConnecting = connectionState === 'connecting';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 shadow-xl backdrop-blur-md">
      {/* Aspect Ratio Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800">
        {(['9:16', '16:9', '1:1'] as AspectRatio[]).map((aspect) => (
          <button
            key={aspect}
            type="button"
            onClick={() => onSelectAspectRatio(aspect)}
            disabled={isLive || isRecording}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              aspectRatio === aspect
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            } ${isLive || isRecording ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            {aspect}
          </button>
        ))}
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
        {/* Toggle Live AI Transformation */}
        <button
          type="button"
          onClick={onToggleLive}
          disabled={!hasCamera || isConnecting}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-md ${
            isLive
              ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          } ${!hasCamera || isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Connecting AI...</span>
            </>
          ) : isLive ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Stop Live AI</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Start Live AI</span>
            </>
          )}
        </button>

        {/* Record Clip Button */}
        <button
          type="button"
          onClick={onToggleRecording}
          disabled={!hasCamera}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-md ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80'
          } ${!hasCamera ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span className="font-mono">Stop ({recordingSeconds}s)</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Record Clip</span>
            </>
          )}
        </button>

        {/* Mic Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          className={`p-2.5 rounded-xl border transition-colors ${
            isAudioEnabled
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
          title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isAudioEnabled ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
