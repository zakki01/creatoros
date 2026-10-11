import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { LiveScene } from '../../../types';
import { LIVE_SCENES } from '../../../services/live/scenesConfig';

interface LiveScenePickerProps {
  selectedScene: LiveScene;
  onSelectScene: (scene: LiveScene) => void;
  disabled?: boolean;
}

export const LiveScenePicker: React.FC<LiveScenePickerProps> = ({
  selectedScene,
  onSelectScene,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Select AI Scene</span>
        </label>
        <span className="text-[11px] text-zinc-500 font-mono">
          {LIVE_SCENES.length} styles available
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {LIVE_SCENES.map((scene) => {
          const isSelected = selectedScene.id === scene.id;
          return (
            <button
              key={scene.id}
              disabled={disabled}
              onClick={() => onSelectScene(scene)}
              className={`group relative p-3 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500/70 bg-zinc-900/90 shadow-lg ring-1 ring-indigo-500/30'
                  : 'border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700/80'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: scene.accentColor }}
                    />
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {scene.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-tight">
                  {scene.tagline}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {scene.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/70 text-zinc-400 border border-zinc-700/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
