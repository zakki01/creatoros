import React from 'react';
import {
  Film,
  Camera,
  Monitor,
  MessageSquare,
  Clock,
  Check,
} from 'lucide-react';

export type StudioSceneMode = 'main_cam' | 'screen_pip' | 'just_chatting' | 'intermission';

export interface StudioScenePreset {
  id: StudioSceneMode;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export const STUDIO_SCENE_PRESETS: StudioScenePreset[] = [
  {
    id: 'main_cam',
    name: 'Main Camera',
    description: 'Full-frame live webcam with active AR filters & grading',
    icon: Camera,
  },
  {
    id: 'screen_pip',
    name: 'Screen Share + PiP',
    description: 'Full screen capture with floating camera corner preview',
    icon: Monitor,
  },
  {
    id: 'just_chatting',
    name: 'Just Chatting',
    description: 'Balanced wide camera and audience interaction view',
    icon: MessageSquare,
  },
  {
    id: 'intermission',
    name: 'Starting Soon / BRB',
    description: 'Clean branded intermission overlay with standby timer',
    icon: Clock,
  },
];

export interface LiveScenesDockProps {
  currentScene: StudioSceneMode;
  onSelectScene: (scene: StudioSceneMode) => void;
}

export const LiveScenesDock: React.FC<LiveScenesDockProps> = ({
  currentScene,
  onSelectScene,
}) => {
  return (
    <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 shadow-xl text-zinc-100 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide uppercase font-mono text-zinc-200">
              Scenes
            </h4>
            <span className="text-[10px] font-mono text-purple-400">
              Instant Stream Transition
            </span>
          </div>
        </div>
      </div>

      {/* Preset List */}
      <div className="grid grid-cols-2 gap-2">
        {STUDIO_SCENE_PRESETS.map((sc) => {
          const Icon = sc.icon;
          const isActive = currentScene === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScene(sc.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                isActive
                  ? 'bg-purple-600/20 border-purple-500/60 text-white shadow-sm'
                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">{sc.name}</span>
                <span className="text-[9px] text-zinc-500 line-clamp-1 mt-0.5">
                  {sc.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
