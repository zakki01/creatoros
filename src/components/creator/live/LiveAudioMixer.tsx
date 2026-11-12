import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sliders,
  Settings,
  Radio,
  Music,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

export interface LiveAudioMixerProps {
  inputStream: MediaStream | null;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  audioDevices: MediaDeviceInfo[];
  selectedAudioDeviceId: string;
  onSelectAudioDevice: (deviceId: string) => void;
  onOpenDeviceSettings?: () => void;
}

export const LiveAudioMixer: React.FC<LiveAudioMixerProps> = ({
  inputStream,
  isAudioEnabled,
  onToggleAudio,
  audioDevices,
  selectedAudioDeviceId,
  onSelectAudioDevice,
  onOpenDeviceSettings,
}) => {
  const [micVolume, setMicVolume] = useState<number>(100);
  const [desktopVolume, setDesktopVolume] = useState<number>(85);
  const [isDesktopMuted, setIsDesktopMuted] = useState<boolean>(false);
  const [micLevelDb, setMicLevelDb] = useState<number>(-60);
  const [peakLevelDb, setPeakLevelDb] = useState<number>(-60);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const monitorNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const peakDecayRef = useRef<number>(-60);

  // Initialize Web Audio API Analyser for real-time VU decibel metering
  useEffect(() => {
    if (!inputStream || !isAudioEnabled) {
      setMicLevelDb(-60);
      setPeakLevelDb(-60);
      return;
    }

    const audioTracks = inputStream.getAudioTracks();
    if (audioTracks.length === 0 || !audioTracks[0].enabled) {
      setMicLevelDb(-60);
      setPeakLevelDb(-60);
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const audioCtx = new AudioCtxClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(inputStream);
      sourceRef.current = source;
      source.connect(analyser);

      // Audio monitor (loopback to headphones) if enabled
      const monitorGain = audioCtx.createGain();
      monitorGain.gain.value = isMonitoring ? 1 : 0;
      monitorNodeRef.current = monitorGain;
      analyser.connect(monitorGain);
      monitorGain.connect(audioCtx.destination);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute RMS
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i] / 255;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / bufferLength);

        // Convert to dB scale (-60dB to 0dB)
        // Apply micVolume gain multiplier
        const gainFactor = micVolume / 100;
        const adjustedRms = rms * gainFactor;
        const db = adjustedRms > 0.0001 ? 20 * Math.log10(adjustedRms) : -60;
        const clampedDb = Math.max(-60, Math.min(0, db));

        setMicLevelDb(clampedDb);

        // Peak Hold logic
        if (clampedDb > peakDecayRef.current) {
          peakDecayRef.current = clampedDb;
        } else {
          peakDecayRef.current = Math.max(-60, peakDecayRef.current - 0.5);
        }
        setPeakLevelDb(peakDecayRef.current);

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      animFrameRef.current = requestAnimationFrame(updateMeter);
    } catch (err) {
      console.warn('[LiveAudioMixer] Web Audio API init error:', err);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch (_) {}
      }
      if (monitorNodeRef.current) {
        try { monitorNodeRef.current.disconnect(); } catch (_) {}
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch (_) {}
      }
    };
  }, [inputStream, isAudioEnabled, micVolume, isMonitoring]);

  // Sync monitor gain
  useEffect(() => {
    if (monitorNodeRef.current && audioCtxRef.current) {
      monitorNodeRef.current.gain.setValueAtTime(
        isMonitoring ? 1 : 0,
        audioCtxRef.current.currentTime
      );
    }
  }, [isMonitoring]);

  // Convert dB to percentage (0% to 100%)
  const dbToPercent = (db: number) => {
    if (db <= -60) return 0;
    if (db >= 0) return 100;
    // -60 to 0 maps linearly from 0 to 100%
    return ((db + 60) / 60) * 100;
  };

  const micPercent = dbToPercent(micLevelDb);
  const peakPercent = dbToPercent(peakLevelDb);

  // Meter status helper
  const getAudioHealth = () => {
    if (!isAudioEnabled) return { text: 'Muted', color: 'text-zinc-500' };
    if (micLevelDb > -3) return { text: 'Clipping', color: 'text-rose-500' };
    if (micLevelDb > -18) return { text: 'Optimal Level', color: 'text-emerald-400' };
    if (micLevelDb > -40) return { text: 'Good Signal', color: 'text-sky-400' };
    return { text: 'Silent / Low', color: 'text-zinc-400' };
  };

  const health = getAudioHealth();

  return (
    <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 shadow-xl text-zinc-100 space-y-4">
      {/* Header with Title & Monitor toggle */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide uppercase font-mono text-zinc-200">
              Streamlabs Audio Mixer
            </h4>
            <span className={`text-[10px] font-mono ${health.color}`}>
              ● {health.text} ({micLevelDb.toFixed(1)} dBFS)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Headphone Monitor Toggle */}
          <button
            type="button"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 border transition-all cursor-pointer ${
              isMonitoring
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            title="Toggle headphone audio monitoring (hear yourself)"
          >
            <Headphones className="w-3 h-3" />
            <span>{isMonitoring ? 'Monitor On' : 'Monitor Off'}</span>
          </button>

          {onOpenDeviceSettings && (
            <button
              type="button"
              onClick={onOpenDeviceSettings}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer"
              title="Open Hardware Device Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Channel 1: Primary Mic / Aux with Live Multi-segment LED VU Meter */}
      <div className="space-y-2 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleAudio}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isAudioEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
              }`}
              title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isAudioEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>
            <span className="font-semibold text-zinc-200 font-mono text-[11px]">Mic / Aux 1</span>
          </div>

          {/* Quick Mic Selector dropdown if multiple devices */}
          {audioDevices.length > 0 && (
            <select
              value={selectedAudioDeviceId}
              onChange={(e) => onSelectAudioDevice(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-md text-[10px] text-zinc-300 px-2 py-0.5 focus:outline-none focus:border-sky-500 max-w-[150px] truncate"
            >
              {audioDevices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Microphone ${i + 1}`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Real-time Multi-Segment VU Meter Bar */}
        <div className="space-y-1">
          <div className="relative h-3 w-full bg-zinc-950 rounded-md overflow-hidden border border-zinc-800/80 p-0.5 flex items-center">
            {/* Smooth Dynamic VU Level Fill */}
            <div
              className="h-full rounded-sm transition-all duration-75 relative"
              style={{
                width: `${micPercent}%`,
                background:
                  'linear-gradient(to right, #10b981 0%, #10b981 65%, #f59e0b 80%, #ef4444 100%)',
              }}
            />

            {/* Peak Hold Tick Indicator */}
            {peakPercent > 0 && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-sm z-10 transition-all duration-100"
                style={{ left: `calc(${peakPercent}% - 2px)` }}
              />
            )}
          </div>

          {/* Decibel Reference Scale */}
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 px-0.5">
            <span>-60 dB</span>
            <span>-40</span>
            <span>-20</span>
            <span className="text-amber-500/80">-6</span>
            <span className="text-rose-500 font-bold">0 dB</span>
          </div>
        </div>

        {/* Volume Fader Slider */}
        <div className="flex items-center gap-2 pt-1">
          <Volume2 className="w-3 h-3 text-zinc-500" />
          <input
            type="range"
            min="0"
            max="150"
            value={micVolume}
            onChange={(e) => setMicVolume(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
          <span className="text-[10px] font-mono text-zinc-400 w-10 text-right">
            {micVolume}%
          </span>
        </div>
      </div>

      {/* Channel 2: Desktop Audio / Soundbed */}
      <div className="space-y-2 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDesktopMuted(!isDesktopMuted)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                !isDesktopMuted
                  ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                  : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
              }`}
              title={!isDesktopMuted ? 'Mute Desktop Audio' : 'Unmute Desktop Audio'}
            >
              {!isDesktopMuted ? <Music className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <span className="font-semibold text-zinc-200 font-mono text-[11px]">Desktop / SFX</span>
          </div>

          <span className="text-[10px] font-mono text-zinc-500">
            {isDesktopMuted ? 'Muted' : 'Standby Track'}
          </span>
        </div>

        {/* Simulated Desktop Audio Bar */}
        <div className="h-2 w-full bg-zinc-950 rounded-md overflow-hidden border border-zinc-800/80">
          <div
            className="h-full bg-purple-500/70 rounded-sm transition-all duration-300"
            style={{ width: isDesktopMuted ? '0%' : `${desktopVolume * 0.4}%` }}
          />
        </div>

        {/* Desktop Volume Slider */}
        <div className="flex items-center gap-2 pt-1">
          <Volume2 className="w-3 h-3 text-zinc-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={isDesktopMuted ? 0 : desktopVolume}
            onChange={(e) => {
              setDesktopVolume(Number(e.target.value));
              if (isDesktopMuted) setIsDesktopMuted(false);
            }}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <span className="text-[10px] font-mono text-zinc-400 w-10 text-right">
            {isDesktopMuted ? '0%' : `${desktopVolume}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
