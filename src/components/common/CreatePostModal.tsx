import React, { useState, useRef } from 'react';
import {
  X,
  Film,
  Camera,
  PenTool,
  Upload,
  Sparkles,
  Tag,
  AtSign,
  Briefcase,
  Check,
  RotateCcw,
  AlertCircle,
  Clock,
  Send,
  Smile,
  FileVideo,
  FileImage,
  Layers,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { PostContentType, SocialPost } from '../../types/socialFeed';
import { EmojiPicker } from './EmojiPicker';
import {
  processMediaUpload,
  UploadProgress,
  MediaMetadata,
  formatBytes,
} from '../../services/mediaUploadService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: PostContentType;
}

// Category lists per specification
export const REEL_CATEGORIES = [
  'Campaign Reel',
  'UGC',
  'Product',
  'Fashion',
  'Lifestyle',
  'Behind the Scenes',
  'Tutorial',
  'Storytelling',
  'Interview',
  'Music',
  'Gaming',
  'Custom',
] as const;

export const SHOT_CATEGORIES = [
  'Product Photography',
  'Editorial',
  'Fashion',
  'Lifestyle',
  'Portrait',
  'Architecture',
  'Food',
  'Art',
  'Custom',
] as const;

export const BLOG_CATEGORIES = [
  'Creative',
  'Industry',
  'Tutorial',
  'Case Study',
  'Opinion',
  'Behind the Scenes',
  'Custom',
] as const;

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialType = 'reel',
}) => {
  const { createSocialPost, userProfile, campaigns } = useAppState();

  const [contentType, setContentType] = useState<PostContentType>(initialType);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSamplePresets, setShowSamplePresets] = useState(false);

  // Common Fields
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [mention, setMention] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  // Category Selection
  const [selectedCategory, setSelectedCategory] = useState<string>('Campaign Reel');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [customCategoryError, setCustomCategoryError] = useState<string>('');

  // Upload Engine State
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: 'idle',
    progressPercent: 0,
    statusMessage: '',
  });
  const [uploadedMedia, setUploadedMedia] = useState<MediaMetadata | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null);

  // Shot Specific
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '16:9' | '1:1'>('4:5');

  // Blog Specific
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [readingTime, setReadingTime] = useState('4 min read');
  const [blogCoverMedia, setBlogCoverMedia] = useState<MediaMetadata | null>(null);

  // File Input References
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const blogCoverInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle Category list per content type
  const availableCategories =
    contentType === 'reel'
      ? REEL_CATEGORIES
      : contentType === 'shot'
      ? SHOT_CATEGORIES
      : BLOG_CATEGORIES;

  // Sync default category when switching tabs
  const handleTypeChange = (newType: PostContentType) => {
    setContentType(newType);
    if (newType === 'reel') setSelectedCategory('Campaign Reel');
    else if (newType === 'shot') setSelectedCategory('Product Photography');
    else setSelectedCategory('Creative');
    setCustomCategory('');
    setCustomCategoryError('');
  };

  // Real File Upload Execution
  const handleFileSelect = async (file: File, expectedType: 'video' | 'image', isBlogCover = false) => {
    setUploadError(null);
    setLastUploadedFile(file);

    try {
      const meta = await processMediaUpload(file, expectedType, (progress) => {
        setUploadProgress(progress);
      });

      if (isBlogCover) {
        setBlogCoverMedia(meta);
      } else {
        setUploadedMedia(meta);
        if (meta.aspectRatio && (meta.aspectRatio === '4:5' || meta.aspectRatio === '16:9' || meta.aspectRatio === '1:1')) {
          setAspectRatio(meta.aspectRatio);
        }
      }
    } catch (err: any) {
      setUploadError(err.message || 'Media upload failed. Please verify format.');
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, expectedType: 'video' | 'image', isBlogCover = false) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file, expectedType, isBlogCover);
    }
  };

  // Quick fallback samples for automated test suites / demo convenience
  const applySamplePreset = (type: 'reel' | 'shot') => {
    if (type === 'reel') {
      const sampleMeta: MediaMetadata = {
        fileName: 'Autumn_Sneaker_Macro_4K.mp4',
        sanitizedFileName: 'Autumn_Sneaker_Macro_4K.mp4',
        fileSizeBytes: 14200000,
        formattedSize: '14.2 MB',
        mimeType: 'video/mp4',
        mediaType: 'video',
        width: 1080,
        height: 1920,
        aspectRatio: '9:16',
        durationSeconds: 32,
        formattedDuration: '0:32',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
        mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-sneakers-42867-large.mp4',
      };
      setUploadedMedia(sampleMeta);
      setUploadProgress({ stage: 'ready', progressPercent: 100, statusMessage: 'Preset loaded' });
    } else {
      const sampleMeta: MediaMetadata = {
        fileName: 'Minimalist_Editorial_Lookbook.jpg',
        sanitizedFileName: 'Minimalist_Editorial_Lookbook.jpg',
        fileSizeBytes: 2800000,
        formattedSize: '2.8 MB',
        mimeType: 'image/jpeg',
        mediaType: 'image',
        width: 1200,
        height: 1500,
        aspectRatio: '4:5',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80',
        mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80',
      };
      setUploadedMedia(sampleMeta);
      setUploadProgress({ stage: 'ready', progressPercent: 100, statusMessage: 'Preset loaded' });
    }
  };

  const handlePublish = (status: 'published' | 'draft' = 'published') => {
    // 1. Validate Category (Custom Category must actually work)
    let finalCategory = selectedCategory;
    if (selectedCategory === 'Custom') {
      const trimmed = customCategory.trim();
      if (!trimmed) {
        setCustomCategoryError('Please enter a custom category name (e.g. Sneaker Tech, Micro-Documentary).');
        return;
      }
      if (trimmed.length < 2) {
        setCustomCategoryError('Custom category must be at least 2 characters.');
        return;
      }
      finalCategory = trimmed;
    }

    // 2. Validate Media
    if (contentType === 'reel' && !uploadedMedia?.mediaUrl) {
      setUploadError('Please upload a video file for your Reel.');
      return;
    }
    if (contentType === 'shot' && !uploadedMedia?.mediaUrl) {
      setUploadError('Please upload an image file for your Shot.');
      return;
    }
    if (contentType === 'blog' && !blogTitle.trim()) {
      setUploadError('Please enter a title for your article.');
      return;
    }

    setIsPublishing(true);

    const parsedTags = tags
      .split(/[\s,]+/)
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    // If a custom category was used, prepend it as a tag
    if (selectedCategory === 'Custom' && !parsedTags.includes(`#${finalCategory.replace(/\s+/g, '')}`)) {
      parsedTags.unshift(`#${finalCategory.replace(/\s+/g, '')}`);
    }

    const campaignObj = campaigns.find((c) => c.id === selectedCampaignId);

    const generatedBlogContent =
      blogContent ||
      `## Creative Direction & Workflow\n\nEvery production begins with intentional craft. In this article, we break down lighting frameworks, sound design architecture, and collaborating on high-impact creator campaigns.\n\n### Key Milestones\n- **Authentic Framing:** Organic cinematography beats overly polished commercial scripts.\n- **Color Timing:** Crafting custom LUTs for 4K delivery.\n- **Escrow Contracts:** Guaranteed milestone execution.`;

    const postPayload: Partial<SocialPost> = {
      contentType,
      content: caption || (contentType === 'blog' ? blogTitle : `${finalCategory} drop.`),
      shortExcerpt:
        contentType === 'blog'
          ? caption || blogTitle
          : caption
          ? caption.length > 120
            ? caption.slice(0, 117) + '...'
            : caption
          : `${finalCategory} drop.`,
      fullContent: contentType === 'blog' ? generatedBlogContent : caption || `${finalCategory} drop.`,
      tags: parsedTags.length > 0 ? parsedTags : ['#CreatorOS', `#${finalCategory.replace(/\s+/g, '')}`],
      category: finalCategory,
      discoveryBadge: finalCategory,
      postStatus: status,
      campaignOpportunity: campaignObj
        ? {
            campaignId: campaignObj.id,
            title: campaignObj.name,
            brandName: campaignObj.brandName,
            budgetFormatted: `₹${(campaignObj.budgetTotal / 1000).toFixed(0)}K Total`,
            deliverablesSummary: 'Verified Campaign Partnership',
            deadline: campaignObj.timeline.endDate,
            location: 'India',
            publicUrl: `https://creatoros.io/campaigns/${campaignObj.id}`,
            requiredNiche: campaignObj.objective,
          }
        : undefined,
    };

    if (contentType === 'reel') {
      postPayload.isReel = true;
      postPayload.videoUrl = uploadedMedia?.mediaUrl;
      postPayload.mediaUrl = uploadedMedia?.thumbnailUrl || uploadedMedia?.mediaUrl;
      postPayload.mediaType = 'video';
      postPayload.duration = uploadedMedia?.formattedDuration || '0:30';
      postPayload.aspectRatio = '9:16';
    } else if (contentType === 'shot') {
      postPayload.isReel = false;
      postPayload.mediaUrl = uploadedMedia?.mediaUrl;
      postPayload.mediaType = 'image';
      postPayload.aspectRatio = aspectRatio;
    } else if (contentType === 'blog') {
      postPayload.isReel = false;
      postPayload.blogTitle = blogTitle;
      postPayload.blogCoverImage =
        blogCoverMedia?.mediaUrl ||
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80';
      postPayload.mediaUrl = postPayload.blogCoverImage;
      postPayload.mediaType = 'image';
      postPayload.blogReadingTime = readingTime || '4 min read';
      postPayload.blogContent = generatedBlogContent;
    }

    createSocialPost(postPayload);
    setIsPublishing(false);
    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular Edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007E93]/10 border border-[#00B4D8]/35 text-[#007E93] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] font-display">Create</h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                {userProfile.name} • Publish Real Media
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Create Modal"
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector: Reel / Shot / Blog */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--surface-muted)]">
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: 'reel',
                label: 'Reel',
                sub: '9:16 Video',
                icon: Film,
              },
              {
                id: 'shot',
                label: 'Shot',
                sub: 'Photo Frame',
                icon: Camera,
              },
              {
                id: 'blog',
                label: 'Blog',
                sub: 'Editorial Article',
                icon: PenTool,
              },
            ].map((type) => {
              const Icon = type.icon;
              const isSelected = contentType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id as PostContentType)}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-[#007E93]/10 border-[#00B4D8] text-[var(--text-primary)] shadow-sm'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[#00B4D8]/40 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected
                          ? 'bg-[#007E93] text-white shadow-xs'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#007E93]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block">{type.label}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block truncate">{type.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[58vh] overflow-y-auto">
          {/* 1. MEDIA UPLOAD SECTION (FRONT-AND-CENTER PRIMARY WORKFLOW) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
              <span>{contentType === 'reel' ? 'Upload Video (Reel)' : contentType === 'shot' ? 'Upload Image (Shot)' : 'Cover Image (Article)'}</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {contentType === 'reel' ? 'MP4, WebM, MOV (Max 100MB)' : 'JPG, PNG, WebP (Max 20MB)'}
              </span>
            </label>

            {/* Hidden native file inputs */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0], 'video');
                }
              }}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0], 'image');
                }
              }}
            />
            <input
              ref={blogCoverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0], 'image', true);
                }
              }}
            />

            {/* Upload Zone / Media Preview */}
            {contentType === 'reel' ? (
              uploadedMedia?.mediaType === 'video' ? (
                /* Ready State: Real Video Preview with controls */
                <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-black shadow-inner animate-fade-in">
                  <video
                    src={uploadedMedia.mediaUrl}
                    controls
                    playsInline
                    className="w-full max-h-60 object-contain mx-auto bg-black"
                  />
                  <div className="p-3 bg-[var(--surface-elevated)] border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4 text-[#007E93]" />
                      <span className="font-semibold text-[var(--text-primary)] truncate max-w-[200px]">
                        {uploadedMedia.fileName}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {uploadedMedia.formattedDuration} • {uploadedMedia.formattedSize}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 text-[11px] font-medium cursor-pointer"
                    >
                      Change Video
                    </button>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'video')}
                  onClick={() => videoInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    uploadProgress.stage === 'uploading' || uploadProgress.stage === 'processing'
                      ? 'border-[#00B4D8] bg-[#007E93]/5'
                      : uploadError
                      ? 'border-rose-500 bg-rose-500/5'
                      : 'border-[var(--border)] hover:border-[#00B4D8] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {uploadProgress.stage === 'uploading' || uploadProgress.stage === 'processing' ? (
                    <div className="w-full max-w-xs space-y-2.5 animate-pulse">
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                        <span>{uploadProgress.statusMessage}</span>
                        <span>{uploadProgress.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-[#00B4D8] transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : uploadError ? (
                    <div className="space-y-2">
                      <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                      <p className="text-xs font-semibold text-rose-500">{uploadError}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (lastUploadedFile) handleFileSelect(lastUploadedFile, 'video');
                          else videoInputRef.current?.click();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Upload</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#007E93]/10 text-[#007E93] flex items-center justify-center mx-auto shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        Drag &amp; drop video file, or{' '}
                        <span className="text-[#00B4D8] hover:underline">Choose Video</span>
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        On mobile: Choose from device (MP4, WebM, MOV)
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : contentType === 'shot' ? (
              uploadedMedia?.mediaType === 'image' ? (
                /* Ready State: Image Preview */
                <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-black shadow-inner animate-fade-in">
                  <img
                    src={uploadedMedia.mediaUrl}
                    alt="Shot preview"
                    className="w-full max-h-60 object-contain mx-auto"
                  />
                  <div className="p-3 bg-[var(--surface-elevated)] border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileImage className="w-4 h-4 text-[#007E93]" />
                      <span className="font-semibold text-[var(--text-primary)] truncate max-w-[200px]">
                        {uploadedMedia.fileName}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {uploadedMedia.formattedSize}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 text-[11px] font-medium cursor-pointer"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                /* Image Drag & Drop Upload Zone */
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'image')}
                  onClick={() => imageInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    uploadError
                      ? 'border-rose-500 bg-rose-500/5'
                      : 'border-[var(--border)] hover:border-[#00B4D8] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {uploadError ? (
                    <div className="space-y-2">
                      <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                      <p className="text-xs font-semibold text-rose-500">{uploadError}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          imageInputRef.current?.click();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#007E93]/10 text-[#007E93] flex items-center justify-center mx-auto shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        Drag &amp; drop image file, or{' '}
                        <span className="text-[#00B4D8] hover:underline">Choose Image</span>
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        JPG, PNG, WebP (Max 20MB)
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* Blog Cover Image Upload */
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'image', true)}
                onClick={() => blogCoverInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[#00B4D8] flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  {blogCoverMedia?.mediaUrl ? (
                    <img
                      src={blogCoverMedia.mediaUrl}
                      alt="Cover"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#007E93]/10 text-[#007E93] flex items-center justify-center">
                      <FileImage className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">
                      {blogCoverMedia?.fileName || 'Upload Cover Banner Image'}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {blogCoverMedia?.formattedSize || 'JPG, PNG, WebP'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-[11px] font-medium"
                >
                  {blogCoverMedia ? 'Change' : 'Browse'}
                </button>
              </div>
            )}

            {/* Optional Dev/Demo Preset Accordion (Never primary) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSamplePresets(!showSamplePresets)}
                className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[#00B4D8] cursor-pointer"
              >
                {showSamplePresets ? '− Hide Demo Sample Presets' : '+ Quick Demo Presets (for automated testing)'}
              </button>
              {showSamplePresets && (
                <div className="pt-2 flex items-center gap-2 animate-fade-in">
                  {contentType === 'reel' ? (
                    <button
                      type="button"
                      onClick={() => applySamplePreset('reel')}
                      className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border)] text-[11px] text-[var(--text-primary)] hover:border-[#00B4D8]"
                    >
                      Load Sample 4K Sneaker Reel
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => applySamplePreset('shot')}
                      className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border)] text-[11px] text-[var(--text-primary)] hover:border-[#00B4D8]"
                    >
                      Load Sample Editorial Photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2. BLOG TITLE & CONTENT (If Article) */}
          {contentType === 'blog' && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g. Architectural Sneaker Design in 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-muted)] block mb-1">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="4 min read"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1 flex items-center justify-between">
                  <span>Article Markdown Content</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Supports ## Headings, Lists</span>
                </label>
                <textarea
                  rows={4}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder={`## Creative Milestones\n\nExplain your design architecture, materials, and execution...`}
                  className="w-full p-3 rounded-xl text-xs font-mono bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8]"
                />
              </div>
            </div>
          )}

          {/* 3. CATEGORIES & CUSTOM CATEGORY (Section 8 & 9) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-primary)] block">
              Content Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (cat !== 'Custom') {
                        setCustomCategoryError('');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#007E93] text-white border-[#007E93] shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[#00B4D8]/50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Custom Category Field (Visible only when 'Custom' selected) */}
            {selectedCategory === 'Custom' && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border)] animate-fade-in mt-2">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
                  <span>Custom Category Name</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{customCategory.length}/30</span>
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    if (customCategoryError) setCustomCategoryError('');
                  }}
                  placeholder="e.g. Sneaker Tech, 3D Macro, Micro-Doc..."
                  maxLength={30}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8]"
                />
                {customCategoryError && (
                  <p className="text-[11px] text-rose-500 font-medium">{customCategoryError}</p>
                )}
              </div>
            )}
          </div>

          {/* 4. CAPTION & EMOJI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                {contentType === 'blog' ? 'Article Summary / Excerpt' : 'Caption'}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-[var(--text-muted)] hover:text-amber-500 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Insert emoji"
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">Emoji</span>
                </button>
                {showEmojiPicker && (
                  <div className="absolute right-0 bottom-full mb-1 z-50">
                    <EmojiPicker
                      onSelect={(emoji) => {
                        setCaption((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      onClose={() => setShowEmojiPicker(false)}
                      position="top"
                    />
                  </div>
                )}
              </div>
            </div>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={
                contentType === 'blog'
                  ? 'Short preview appearing on discovery cards...'
                  : 'Share your vision, creative technique, or milestone...'
              }
              className="w-full p-3 rounded-xl text-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8] resize-none"
            />
          </div>

          {/* 5. OPTIONAL DETAILS COLLAPSIBLE */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptionalDetails(!showOptionalDetails)}
              className="text-xs font-semibold text-[#007E93] hover:underline flex items-center gap-1.5 cursor-pointer py-1"
            >
              <span>{showOptionalDetails ? '− Hide Optional Details' : '+ Add Optional Details (Tags, Mention, Campaign)'}</span>
            </button>

            {showOptionalDetails && (
              <div className="pt-3 space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-muted)] block mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#007E93]" />
                      <span>Tags</span>
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="#Streetwear, #Lookbook"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[var(--text-muted)] block mb-1 flex items-center gap-1">
                      <AtSign className="w-3 h-3 text-emerald-500" />
                      <span>Mention Creator or Brand</span>
                    </label>
                    <input
                      type="text"
                      value={mention}
                      onChange={(e) => setMention(e.target.value)}
                      placeholder="@rohan.kicks or @aurastreetwear"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[var(--text-muted)] block mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-amber-500" />
                    <span>Link Campaign Partnership</span>
                  </label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#00B4D8]"
                  >
                    <option value="">None (Independent Creative Drop)</option>
                    {campaigns.map((camp) => (
                      <option key={camp.id} value={camp.id}>
                        {camp.name} ({camp.brandName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePublish('draft')}
              className="px-3.5 py-2 rounded-xl bg-[var(--surface)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] transition-all cursor-pointer"
            >
              Save Draft
            </button>

            {publishedSuccess ? (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 text-xs font-semibold animate-fade-in">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Published ✓</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handlePublish('published')}
                disabled={isPublishing}
                className="px-4 py-2 rounded-xl bg-[#007E93] hover:bg-[#006779] active:scale-95 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
