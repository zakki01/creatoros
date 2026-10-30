import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Film,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  Clock,
  HardDrive,
  FileVideo,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  ShowcaseVideoItem,
  ShowcaseProject,
  MAX_SHOWCASE_VIDEOS,
  validateVideoFile,
  processVideoFile,
} from '../../services/showcaseMediaService';
import { useToast } from '../ui/Toast';

interface ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ShowcaseProject) => void;
  initialProject?: ShowcaseProject | null;
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialProject?.title || '');
  const [client, setClient] = useState(initialProject?.client || '');
  const [category, setCategory] = useState(
    initialProject?.category || 'Streetwear & Lifestyle'
  );
  const [deliverableFormat, setDeliverableFormat] = useState(
    initialProject?.deliverableFormat || '9:16 Vertical Reel'
  );
  const [description, setDescription] = useState(initialProject?.description || '');
  const [creatorRole, setCreatorRole] = useState(
    initialProject?.creatorRole || 'Director & Lead Editor'
  );
  const [reportedViews, setReportedViews] = useState(
    initialProject?.views ? initialProject.views.toString() : ''
  );
  const [reportedEngagement, setReportedEngagement] = useState(
    initialProject?.engagement ? initialProject.engagement.toString() : ''
  );

  const [videos, setVideos] = useState<ShowcaseVideoItem[]>(
    initialProject?.videos || []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const remainingSlots = MAX_SHOWCASE_VIDEOS - videos.length;
    if (remainingSlots <= 0) {
      setErrorMessage(
        'Maximum 4 videos reached. You cannot attach more than 4 videos to a single Showcase project.'
      );
      toast.error('Maximum 4 videos reached');
      return;
    }

    const filesToProcess = Array.from(fileList);
    if (filesToProcess.length > remainingSlots) {
      setErrorMessage(
        `You selected ${filesToProcess.length} videos, but only ${remainingSlots} slot(s) remain. Only the first ${remainingSlots} will be added.`
      );
      toast.error(`Maximum 4 videos limit: only ${remainingSlots} accepted`);
    }

    const acceptedFiles = filesToProcess.slice(0, remainingSlots);
    setIsProcessing(true);

    try {
      const newVideoItems: ShowcaseVideoItem[] = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setProcessingStatus(`Inspecting & validating (${i + 1}/${acceptedFiles.length}): ${file.name}...`);

        const validation = await validateVideoFile(file);
        if (!validation.valid) {
          toast.error(validation.error || 'Video validation failed');
          setErrorMessage(validation.error || 'File validation failed');
          continue;
        }

        setProcessingStatus(`Generating preview frame (${i + 1}/${acceptedFiles.length})...`);
        const processed = await processVideoFile(file);
        newVideoItems.push(processed);
      }

      setVideos((prev) => [...prev, ...newVideoItems].slice(0, MAX_SHOWCASE_VIDEOS));
      toast.success(`Added ${newVideoItems.length} video(s) to Showcase`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing video files');
      toast.error('Video upload error');
    } finally {
      setIsProcessing(false);
      setProcessingStatus(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    setErrorMessage(null);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setVideos((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= videos.length - 1) return;
    setVideos((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a project title.');
      return;
    }

    if (videos.length === 0) {
      setErrorMessage('Please add at least one video to your Showcase project.');
      return;
    }

    if (videos.length > MAX_SHOWCASE_VIDEOS) {
      setErrorMessage('A Showcase project cannot exceed 4 videos.');
      return;
    }

    const project: ShowcaseProject = {
      id: initialProject?.id || `proj-${Date.now()}`,
      title: title.trim(),
      client: client.trim() || 'Independent Production',
      category,
      deliverableFormat,
      description: description.trim(),
      creatorRole: creatorRole.trim(),
      videos,
      views: reportedViews ? parseInt(reportedViews, 10) : undefined,
      engagement: reportedEngagement ? parseInt(reportedEngagement, 10) : undefined,
      isMetricsVerified: false, // Self-reported by default
      createdAt: initialProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(project);
    toast.success('Showcase project published!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] p-5 sm:p-7 shadow-2xl overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-display">
                {initialProject ? 'Edit Showcase Project' : 'New Showcase Project'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                1 project · Up to 4 high-definition video assets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Video Upload & Slots Indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <span>Showcase Media</span>
                <span className="text-rose-500">*</span>
              </label>

              <span
                className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                  videos.length >= MAX_SHOWCASE_VIDEOS
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                }`}
              >
                {videos.length >= MAX_SHOWCASE_VIDEOS
                  ? 'Maximum 4 videos'
                  : `${videos.length} / ${MAX_SHOWCASE_VIDEOS} videos`}
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            {videos.length < MAX_SHOWCASE_VIDEOS && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5 scale-[0.99]'
                    : 'border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface-muted)]/50 hover:bg-[var(--surface-muted)]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  multiple
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex items-center justify-center text-[var(--accent)]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      Drag &amp; drop videos or{' '}
                      <span className="text-[var(--accent)] underline underline-offset-2">
                        browse files
                      </span>
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      MP4, WebM, or MOV · Max 100MB per file · Up to 4 videos
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs flex items-center gap-2 animate-pulse font-mono">
                <Sparkles className="w-4 h-4 text-[var(--accent)] animate-spin" />
                <span>{processingStatus || 'Inspecting and processing media...'}</span>
              </div>
            )}

            {/* Attached Videos List */}
            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((vid, idx) => (
                  <div
                    key={vid.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] shadow-sm hover:border-[var(--accent)]/40 transition-colors"
                  >
                    {/* Thumbnail & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--border)]">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white bg-black/75 px-1 rounded">
                          {vid.formattedDuration}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[var(--accent)]">
                            #{idx + 1}
                          </span>
                          <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                            {vid.name}
                          </p>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                          {vid.formattedSize} · {vid.width}×{vid.height} · {vid.mimeType.split('/')[1]?.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Reorder & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === videos.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(vid.id)}
                        title="Remove Video"
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Project Metadata */}
          <div className="space-y-3.5 pt-2 border-t border-[var(--border)]">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1 font-mono">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autumn Streetwear Lookbook Campaign"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1 font-mono">
                  Client / Brand
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Aura Streetwear Co."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1 font-mono">
                  Creator Role
                </label>
                <input
                  type="text"
                  value={creatorRole}
                  onChange={(e) => setCreatorRole(e.target.value)}
                  placeholder="e.g. Director & Cinematographer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1 font-mono">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent cursor-pointer"
                >
                  <option value="Streetwear & Lifestyle">Streetwear &amp; Lifestyle</option>
                  <option value="Footwear & Sneakers">Footwear &amp; Sneakers</option>
                  <option value="Tech & Hardware">Tech &amp; Hardware</option>
                  <option value="Beauty & Grooming">Beauty &amp; Grooming</option>
                  <option value="Fitness & Health">Fitness &amp; Health</option>
                  <option value="Cinematic & Visual Arts">Cinematic &amp; Visual Arts</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1 font-mono">
                  Deliverable Format
                </label>
                <select
                  value={deliverableFormat}
                  onChange={(e) => setDeliverableFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent cursor-pointer"
                >
                  <option value="9:16 Vertical Reel">9:16 Vertical Reel</option>
                  <option value="16:9 Hero Video">16:9 Hero Video</option>
                  <option value="1:1 Square Feed">1:1 Square Feed</option>
                  <option value="4:5 Social Portrait">4:5 Social Portrait</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1 font-mono">
                Description / Creative Direction
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Briefly describe the campaign goals, visual style, cinematography approach, and results..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
              />
            </div>

            {/* Optional Metrics */}
            <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Self-Reported Performance Metrics
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Optional · Unverified unless linked to API
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={reportedViews}
                  onChange={(e) => setReportedViews(e.target.value)}
                  placeholder="Estimated Views (e.g. 500000)"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] placeholder:text-[var(--text-muted)]"
                />
                <input
                  type="number"
                  value={reportedEngagement}
                  onChange={(e) => setReportedEngagement(e.target.value)}
                  placeholder="Estimated Engagements (e.g. 32000)"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text-primary)] bg-[var(--input)] placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || videos.length === 0}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Publish to Showcase</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
