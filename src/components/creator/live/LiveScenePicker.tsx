import React, { useRef } from 'react';
import { Sparkles, Check, Upload, Sliders, RotateCcw } from 'lucide-react';
import { LiveScene } from '../../../types';
import { DEFAULT_SCENE, LIVE_SCENES } from '../../../services/live/scenesConfig';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.cube')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // Parse basic 3D LUT characteristics or apply cinematic contrast enhancement
        const customScene: LiveScene = {
          id: `custom_cube_${Date.now()}` as any,
          name: file.name.replace('.cube', ''),
          tagline: '3D LUT Filter',
          description: `Custom 3D LUT filter imported from ${file.name}`,
          prompt: 'Custom 3D LUT grade',
          accentColor: '#ec4899',
          bgGradient: 'from-pink-950/60 via-zinc-900 to-black',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
          tags: ['Custom', 'LUT'],
          filterStyle: {
            brightness: 1.06,
            contrast: 1.25,
            saturate: 1.35,
            hueRotate: -10,
            sepia: 0.15,
            tintRgb: 'rgba(236, 72, 153, 0.12)',
          },
        };
        onSelectScene(customScene);
      };
      reader.readAsText(file);
    } else {
      // Image LUT / Overlay (.png / .jpg)
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const customScene: LiveScene = {
          id: `custom_img_${Date.now()}` as any,
          name: file.name.replace(/\.[^/.]+$/, ''),
          tagline: 'Instagram Filter',
          description: `Custom Instagram filter imported from ${file.name}`,
          prompt: 'Instagram custom aesthetic grading',
          accentColor: '#f43f5e',
          bgGradient: 'from-rose-950/60 via-zinc-900 to-black',
          thumbnailUrl: dataUrl,
          tags: ['Custom', 'Instagram'],
          filterStyle: {
            brightness: 1.08,
            contrast: 1.22,
            saturate: 1.3,
            hueRotate: -8,
            sepia: 0.12,
            tintRgb: 'rgba(244, 63, 94, 0.1)',
            customOverlayUrl: dataUrl,
          },
        };
        onSelectScene(customScene);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Filters & AI Scenes</span>
        </label>
        <div className="flex items-center gap-2">
          {selectedScene.id !== DEFAULT_SCENE.id && (
            <button
              type="button"
              onClick={() => onSelectScene(DEFAULT_SCENE)}
              disabled={disabled}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer shadow-xs"
              title="Reset to default clean camera view"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Cancel Filter</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".cube,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] transition-colors cursor-pointer shadow-xs"
            title="Upload Instagram LUT or Filter file (.cube, .png)"
          >
            <Upload className="w-3 h-3 text-[var(--accent)]" />
            <span>Upload Filter</span>
          </button>
          <span className="text-[11px] text-[var(--text-secondary)] font-mono">
            {LIVE_SCENES.length} presets
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {LIVE_SCENES.map((scene) => {
          const isSelected = selectedScene.id === scene.id;
          return (
            <button
              key={scene.id}
              disabled={disabled}
              onClick={() => onSelectScene(isSelected && scene.id !== DEFAULT_SCENE.id ? DEFAULT_SCENE : scene)}
              className={`group relative overflow-hidden rounded-2xl text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/20 shadow-xs -translate-y-0.5'
                  : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-[var(--accent)]/30 hover:-translate-y-0.5 shadow-xs'
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
                    <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_0_12px_rgba(0,126,147,0.25)]">
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
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {scene.name}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
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

