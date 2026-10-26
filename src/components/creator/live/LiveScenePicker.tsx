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
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Scenes</span>
        </label>
        <span className="text-[11px] text-zinc-500 font-mono">
          {LIVE_SCENES.length} presets
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
              className={`group relative overflow-hidden rounded-2xl text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'surface-3 border-indigo-500/70 ring-1 ring-indigo-500/40 shadow-[0_12px_28px_-6px_rgba(99,102,241,0.35)] -translate-y-0.5'
                  : 'surface-2 hover:border-white/20 hover:-translate-y-0.5'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Visual Preview Thumbnail */}
              <div className="relative h-20 w-full overflow-hidden bg-[#DFE3E8]">
                {scene.thumbnailUrl && (
                  <img
                    src={scene.thumbnailUrl}
                    alt={scene.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-black/25 to-transparent" />

                {/* Accent Orb / Selected Check */}
                <div className="absolute top-2 right-2">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.8)]">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <span
                      className="block w-2.5 h-2.5 rounded-full ring-2 ring-black/60 shadow-sm"
                      style={{ backgroundColor: scene.accentColor }}
                    />
                  )}
                </div>
              </div>

              {/* Concise Preset Metadata */}
              <div className="p-2.5">
                <p className="text-xs font-semibold text-white truncate">
                  {scene.name}
                </p>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {scene.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

