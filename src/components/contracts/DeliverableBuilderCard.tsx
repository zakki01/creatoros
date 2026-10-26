import React, { useState } from 'react';
import {
  Film,
  Camera,
  Layers,
  Sparkles,
  Trash2,
  Copy,
  Edit2,
  Check,
  Calendar,
  Clock,
  Paperclip,
  AlertCircle,
} from 'lucide-react';
import { ContractDeliverable, DeliverableItemType, DeliverableFormat } from '../../types/contract';

interface DeliverableBuilderCardProps {
  deliverable: ContractDeliverable;
  index: number;
  onUpdate: (updated: ContractDeliverable) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const DeliverableBuilderCard: React.FC<DeliverableBuilderCardProps> = ({
  deliverable,
  index,
  onUpdate,
  onDuplicate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(
    !deliverable.quantity || !deliverable.dueDate || deliverable.specifications === ''
  );

  const deliverableTypes: DeliverableItemType[] = [
    'Reel',
    'Video',
    'Photo',
    'Carousel',
    'Shot',
    'Blog',
    'UGC',
    'Design',
    'Story',
    'Other',
  ];

  const formatOptions: DeliverableFormat[] = ['9:16', '16:9', '1:1', '4:5', 'Custom'];

  // Inline Validation
  const errors: Record<string, string> = {};
  if (!deliverable.quantity || deliverable.quantity <= 0) {
    errors.quantity = 'Quantity must be at least 1';
  }
  if (!deliverable.dueDate || deliverable.dueDate.trim() === '') {
    errors.dueDate = 'Due date is required';
  }
  if (!deliverable.specifications || deliverable.specifications.trim() === '') {
    errors.specifications = 'Brief specifications required';
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        hasErrors
          ? 'bg-amber-50/50 border-amber-300'
          : 'bg-white border-black/[0.08] hover:border-black/15 shadow-xs'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#0096C7] font-mono text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              {deliverable.type}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              × {deliverable.quantity || 1}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono border border-zinc-200">
              {deliverable.format}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
            title={isEditing ? 'Done editing' : 'Edit deliverable'}
            aria-label={isEditing ? 'Done editing' : 'Edit deliverable'}
          >
            {isEditing ? <Check className="w-4 h-4 text-emerald-600" /> : <Edit2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Duplicate deliverable"
            aria-label="Duplicate deliverable"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-rose-50 text-zinc-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete deliverable"
            aria-label="Delete deliverable"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content: Compact view or Form view */}
      {isEditing ? (
        <div className="pt-3.5 space-y-3.5 text-xs">
          {/* Type Selector */}
          <div>
            <label className="text-[11px] font-medium text-zinc-700 block mb-1.5">
              Deliverable Format & Type
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {deliverableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onUpdate({ ...deliverable, type })}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    deliverable.type === type
                      ? 'bg-[#00B4D8] text-white font-semibold shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border border-zinc-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Grid: Quantity, Aspect Ratio, Duration, Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-700 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max="50"
                value={deliverable.quantity || 1}
                onChange={(e) =>
                  onUpdate({ ...deliverable, quantity: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] font-mono shadow-xs"
              />
              {errors.quantity && (
                <span className="text-[10px] text-rose-600 mt-1 block flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.quantity}
                </span>
              )}
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-700 block mb-1">Aspect Ratio</label>
              <select
                value={deliverable.format}
                onChange={(e) => onUpdate({ ...deliverable, format: e.target.value as DeliverableFormat })}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] shadow-xs"
              >
                {formatOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-700 block mb-1">
                Duration / Res (Opt)
              </label>
              <input
                type="text"
                placeholder="e.g. 30–60s, 4K"
                value={deliverable.duration || ''}
                onChange={(e) => onUpdate({ ...deliverable, duration: e.target.value })}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] shadow-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-700 block mb-1">Milestone Deadline</label>
              <input
                type="date"
                value={deliverable.dueDate || ''}
                onChange={(e) => onUpdate({ ...deliverable, dueDate: e.target.value })}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] shadow-xs"
              />
              {errors.dueDate && (
                <span className="text-[10px] text-rose-600 mt-1 block flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.dueDate}
                </span>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="text-[11px] font-medium text-zinc-700 block mb-1">
              Creative Specifications & Requirements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Product must appear in first 5 seconds. Must clearly show logo and include swipe-up promo link."
              value={deliverable.specifications}
              onChange={(e) => onUpdate({ ...deliverable, specifications: e.target.value })}
              className="w-full p-3 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] leading-relaxed resize-none shadow-xs"
            />
            {errors.specifications && (
              <span className="text-[10px] text-rose-600 mt-0.5 block flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.specifications}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Compact Readout View */
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="space-y-1">
            <p className="text-zinc-800 font-medium leading-relaxed">
              {deliverable.specifications || 'No specific creative guidelines provided.'}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-zinc-500 flex-wrap">
              {deliverable.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  {deliverable.duration}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-400" />
                Due {deliverable.dueDate || 'Unset'}
              </span>
            </div>
          </div>

          {hasErrors && (
            <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-medium shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Needs specifications</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
