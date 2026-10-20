import React, { useState } from 'react';
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
  Image as ImageIcon,
  Check,
  Eye,
  Sliders,
  Play,
  Clock,
  Send,
  Smile,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { PostContentType, SocialPost } from '../../types/socialFeed';
import { EmojiPicker } from './EmojiPicker';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: PostContentType;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialType = 'reel',
}) => {
  const {
    createSocialPost,
    userProfile,
    role,
    campaigns,
    featureFlags,
  } = useAppState();

  const [contentType, setContentType] = useState<PostContentType>(initialType);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Common Form Fields
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('for_you');
  const [mention, setMention] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  // Reel-Specific Fields
  const [videoUrl, setVideoUrl] = useState(
    'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-sneakers-42867-large.mp4'
  );
  const [reelThumbnail, setReelThumbnail] = useState(
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80'
  );
  const [duration, setDuration] = useState('0:30');
  const [reelCategoryType, setReelCategoryType] = useState('Campaign Reel');

  // Shot-Specific Fields
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80'
  );
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '16:9' | '1:1'>('4:5');
  const [shotStyle, setShotStyle] = useState('Product Photography');

  // Blog-Specific Fields
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCoverImage, setBlogCoverImage] = useState(
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80'
  );
  const [blogContent, setBlogContent] = useState('');
  const [readingTime, setReadingTime] = useState('4 min read');

  if (!isOpen) return null;

  // Preset media templates for quick testing
  const sampleReelPresets = [
    {
      label: '4K Sneaker Macro Lookbook',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-sneakers-42867-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      duration: '0:42',
    },
    {
      label: 'Urban Streetwear Walk Cut',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-walking-down-the-street-smiling-41164-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
      duration: '0:35',
    },
    {
      label: 'Fitness Pacing Studio Reel',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-getting-ready-to-run-41551-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
      duration: '0:28',
    },
  ];

  const sampleShotPresets = [
    {
      label: 'Minimalist Editorial',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80',
      ratio: '4:5',
    },
    {
      label: 'Summer Streetwear Product Shot',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
      ratio: '16:9',
    },
    {
      label: 'Macro Footwear Texture',
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=80',
      ratio: '1:1',
    },
  ];

  const handlePublish = (status: 'published' | 'draft' = 'published') => {
    const parsedTags = tags
      .split(/[\s,]+/)
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const campaignObj = campaigns.find((c) => c.id === selectedCampaignId);

    const generatedBlogContent =
      blogContent ||
      `## Creative Direction & Workflow

Every production begins with intentional craft. In this article, we break down lighting frameworks, sound design architecture, and collaborating on high-impact creator campaigns.

### Key Milestones
- **Authentic Framing:** Organic cinematography beats overly polished commercial scripts.
- **Color Timing:** Crafting custom LUTs for 4K delivery.
- **Escrow Contracts:** Guaranteed milestone execution.`;

    const postPayload: Partial<SocialPost> = {
      contentType,
      content: caption || (contentType === 'blog' ? blogTitle : 'New creative drop.'),
      shortExcerpt:
        contentType === 'blog'
          ? (caption || blogTitle || 'New creative editorial.')
          : (caption ? (caption.length > 120 ? caption.slice(0, 117) + '...' : caption) : 'New creative drop.'),
      fullContent: contentType === 'blog' ? generatedBlogContent : (caption || 'New creative drop.'),
      tags: parsedTags.length > 0 ? parsedTags : ['#CreatorOS', '#NewDrop'],
      category: contentType === 'reel' ? 'reels' : contentType === 'blog' ? 'blogs' : 'shots',
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
      postPayload.videoUrl = videoUrl;
      postPayload.mediaUrl = reelThumbnail;
      postPayload.mediaType = 'video';
      postPayload.duration = duration;
      postPayload.aspectRatio = '9:16';
      postPayload.discoveryBadge = '🔥 Trending';
    } else if (contentType === 'shot') {
      postPayload.isReel = false;
      postPayload.mediaUrl = imageUrl;
      postPayload.mediaType = 'image';
      postPayload.aspectRatio = aspectRatio;
      postPayload.discoveryBadge = '✨ Recommended';
    } else if (contentType === 'blog') {
      postPayload.isReel = false;
      postPayload.blogTitle = blogTitle || 'Behind The Visual Workflow';
      postPayload.blogCoverImage = blogCoverImage;
      postPayload.mediaUrl = blogCoverImage;
      postPayload.mediaType = 'image';
      postPayload.blogReadingTime = readingTime;
      postPayload.blogContent =
        blogContent ||
        `## Creative Direction & Workflow

Every production begins with intentional craft. In this article, we break down lighting frameworks, sound design architecture, and collaborating on high-impact creator campaigns.

### Key Milestones
- **Authentic Framing:** Organic cinematography beats overly polished commercial scripts.
- **Color Timing:** Crafting custom LUTs for 4K delivery.
- **Escrow Contracts:** Guaranteed milestone execution.`;
      postPayload.blogArticleImages = [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      ];
      postPayload.discoveryBadge = 'New Article';
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
        className="relative w-full max-w-2xl rounded-3xl surface-4 text-zinc-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Specular Edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/35 text-indigo-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Create</h2>
              <p className="text-[11px] text-zinc-400">
                {userProfile.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Selection Cards for Format (Reel / Shot / Blog) */}
        <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-black/25">
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: 'reel',
                label: 'Reel',
                sub: '9:16 Video',
                preview: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&auto=format&fit=crop&q=80',
                icon: Film,
              },
              {
                id: 'shot',
                label: 'Shot',
                sub: 'Visual Frame',
                preview: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop&q=80',
                icon: Camera,
              },
              {
                id: 'blog',
                label: 'Blog',
                sub: 'Editorial',
                preview: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80',
                icon: PenTool,
              },
            ].map((type) => {
              const Icon = type.icon;
              const isSelected = contentType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setContentType(type.id as PostContentType)}
                  className={`group relative overflow-hidden rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'surface-3 border-indigo-500/70 ring-1 ring-indigo-500/40 shadow-[0_12px_24px_-6px_rgba(99,102,241,0.35)] -translate-y-0.5'
                      : 'surface-2 hover:border-white/20 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="relative h-14 w-full overflow-hidden">
                    <img
                      src={type.preview}
                      alt={type.label}
                      className="w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121B] via-black/30 to-transparent" />
                    <div className="absolute top-2 left-2.5 p-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-indigo-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <span className="text-xs font-bold text-white block">{type.label}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{type.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Format Fields Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[58vh] overflow-y-auto">
          {/* A. REEL FORM */}
          {contentType === 'reel' && (
            <div className="space-y-4 animate-fade-in">
              {/* Preset Selector */}
              <div>
                <span className="text-[11px] font-medium text-zinc-300 block mb-1.5">
                  Select Video Template or Custom URL:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleReelPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setVideoUrl(preset.videoUrl);
                        setReelThumbnail(preset.thumbnail);
                        setDuration(preset.duration);
                      }}
                      className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        videoUrl === preset.videoUrl
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-white/[0.06] bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-semibold block truncate">{preset.label}</span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                        9:16 Vertical • {preset.duration}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video URL + Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    MP4 Video Stream URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="0:30"
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Reel Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Reel Style
                  </label>
                  <select
                    value={reelCategoryType}
                    onChange={(e) => setReelCategoryType(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-200"
                  >
                    <option value="Short Video">Short Video</option>
                    <option value="Vertical 9:16">Vertical 9:16 Cinema</option>
                    <option value="Campaign Reel">Campaign Reel</option>
                    <option value="Behind The Scenes">Behind-the-Scenes</option>
                    <option value="UGC Video">UGC Video</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Poster Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={reelThumbnail}
                    onChange={(e) => setReelThumbnail(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* B. SHOT FORM */}
          {contentType === 'shot' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-[11px] font-medium text-zinc-300 block mb-1.5">
                  Select Photography Sample or Custom URL:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleShotPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setAspectRatio(preset.ratio as any);
                      }}
                      className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        imageUrl === preset.url
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-white/[0.06] bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-semibold block truncate">{preset.label}</span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                        Aspect: {preset.ratio}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Image Asset URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-200"
                  >
                    <option value="4:5">4:5 (Portrait Feed)</option>
                    <option value="16:9">16:9 (Landscape Banner)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* C. BLOG FORM */}
          {contentType === 'blog' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g. How We Built Our Latest Streetwear Collection"
                  className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-semibold placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Cover Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={blogCoverImage}
                    onChange={(e) => setBlogCoverImage(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="4 min read"
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1 flex items-center justify-between">
                  <span>Article Markdown Content</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Supports ## Headings, &gt; Quotes, Lists</span>
                </label>
                <textarea
                  rows={5}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder={`## Introduction\n\nShare deep insights about design, video technique, or campaign results...\n\n### Key Takeaways\n- Focus on authentic storytelling\n- Escrow milestone clarity`}
                  className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* COMMON FIELDS: Caption, Tags, Mention, Optional Campaign */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-zinc-300">
                  {contentType === 'blog' ? 'Article Summary / Excerpt' : 'Caption'}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-zinc-400 hover:text-amber-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
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
                    ? 'Short preview paragraph appearing on the discover card...'
                    : 'Share your vision, creative technique, or milestone...'
                }
                className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Optional Fields Collapsible (Section 59 Postel's Law) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer py-1"
              >
                <span>{showOptionalDetails ? '− Hide Optional Details' : '+ Add Optional Details (Tags, Mention, Campaign)'}</span>
              </button>

              {showOptionalDetails && (
                <div className="pt-3 space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-400 block mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-indigo-400" />
                        <span>Tags</span>
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="#Streetwear, #Lookbook"
                        className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-zinc-400 block mb-1 flex items-center gap-1">
                        <AtSign className="w-3 h-3 text-emerald-400" />
                        <span>Mention Creator or Brand</span>
                      </label>
                      <input
                        type="text"
                        value={mention}
                        onChange={(e) => setMention(e.target.value)}
                        placeholder="@rohan.kicks or @aurastreetwear"
                        className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-400 block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-amber-400" />
                      <span>Link Campaign Brief</span>
                    </label>
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => setSelectedCampaignId(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-200"
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
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-zinc-950/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePublish('draft')}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-semibold text-zinc-300 transition-all cursor-pointer"
            >
              Save Draft
            </button>

            {publishedSuccess ? (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fade-in">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Published ✓</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handlePublish('published')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-indigo-600/30"
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
