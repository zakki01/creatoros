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
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Style Reference Image</span>
          <span className="text-[10px] lowercase text-zinc-500 font-normal">
            (optional)
          </span>
        </label>
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
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
          <img
            src={referenceImage.dataUrl}
            alt="Reference preview"
            className="w-12 h-12 rounded-lg object-cover border border-zinc-700/80 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">
              {referenceImage.name}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Live AI style guiding active
            </p>
          </div>
          <button
            onClick={handleRemove}
            disabled={disabled}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
            title="Remove reference image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 text-xs transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-zinc-500" />
          <span>Upload mood board or look reference</span>
        </button>
      )}
    </div>
  );
};
