import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { LiveReferenceImage } from '../../../types';

interface LiveReferencePanelProps {
  referenceImage: LiveReferenceImage | null;
  onReferenceImageChange: (image: LiveReferenceImage | null) => void;
  disabled?: boolean;
}

export const LiveReferencePanel: React.FC<LiveReferencePanelProps> = ({
  referenceImage,
  onReferenceImageChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onReferenceImageChange({
        id: `ref-${Date.now()}`,
        name: file.name,
        dataUrl,
        uploadedAt: new Date().toLocaleTimeString(),
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onReferenceImageChange(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#007E93]" />
          <span>Reference Look</span>
        </label>
        <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled}
      />

      {referenceImage ? (
        <div className="flex items-center gap-3 p-2.5 rounded-2xl surface-3">
          <img
            src={referenceImage.dataUrl}
            alt="Reference preview"
            className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-900 truncate">
              {referenceImage.name}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Style active
            </p>
          </div>
          <button
            onClick={handleRemove}
            disabled={disabled}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            title="Remove reference"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={`w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#007E93]" />
          <span>Add reference</span>
        </button>
      )}
    </div>
  );
};
