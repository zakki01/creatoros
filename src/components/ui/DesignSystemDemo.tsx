import React, { useState } from 'react';
import {
  IconButton,
  Avatar,
  BottomSheet,
  Popover,
  Dropdown,
  Skeleton,
  Textarea,
  useToast,
  Button,
  Card,
  Badge,
  Input,
} from './index';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Bell,
  Search,
  Sparkles,
  CheckCircle,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { tokens } from '../../styles/tokens';

export const DesignSystemDemo: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toast = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 p-4 sm:p-6 lg:p-10 font-sans pb-safe">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <IconButton aria-label="Go back" variant="subtle" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </IconButton>
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  CreatorOS Design System
                </h1>
                <Badge variant="brand" size="sm">Phase 2 Gate</Badge>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Fitts's Law 44px Hitboxes • Jakob's Law Standards • Mobile-First Safe Areas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.success('Design tokens loaded successfully!')}
            >
              Test Toast
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => setIsSheetOpen(true)}
            >
              Open BottomSheet
            </Button>
          </div>
        </div>

        {/* SECTION 1: Design Tokens Matrix */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-wide text-zinc-300 uppercase text-xs">
            1. Core Design Tokens & Surface Hierarchy
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#070709] space-y-1">
              <span className="text-[11px] text-zinc-500 font-mono">bgBase</span>
              <p className="text-xs font-semibold text-zinc-300">#070709</p>
            </div>
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#0c0c11] space-y-1">
              <span className="text-[11px] text-zinc-500 font-mono">bgSurface</span>
              <p className="text-xs font-semibold text-zinc-300">#0c0c11</p>
            </div>
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#14141b] space-y-1">
              <span className="text-[11px] text-zinc-500 font-mono">bgElevated</span>
              <p className="text-xs font-semibold text-zinc-300">#14141b</p>
            </div>
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#181822] space-y-1">
              <span className="text-[11px] text-zinc-500 font-mono">bgSubtle</span>
              <p className="text-xs font-semibold text-zinc-300">#181822</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: 44px Hit-Box IconButtons (Fitts's Law) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-wide text-zinc-300 uppercase text-xs">
              2. Accessible IconButtons (Strict 44px Minimum Touch Targets)
            </h2>
            <span className="text-xs text-indigo-400 font-mono">Fitts's Law ✓</span>
          </div>

          <Card variant="glass" className="p-4 sm:p-6 space-y-4">
            <p className="text-xs text-zinc-400">
              Each icon button renders an outer 44px x 44px tap target bounding area with clear keyboard focus rings (<code className="text-zinc-300">:focus-visible</code>) and descriptive <code className="text-zinc-300">aria-label</code>.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <IconButton
                aria-label="Like post"
                variant={liked ? 'primary' : 'ghost'}
                size="md"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current text-white' : ''}`} />
              </IconButton>

              <IconButton
                aria-label="Open comments"
                variant="ghost"
                size="md"
                badge={14}
                onClick={() => setIsSheetOpen(true)}
              >
                <MessageCircle className="w-5 h-5" />
              </IconButton>

              <IconButton
                aria-label="Share post"
                variant="ghost"
                size="md"
                onClick={() => toast.info('Share sheet triggered')}
              >
                <Share2 className="w-5 h-5" />
              </IconButton>

              <IconButton
                aria-label="Save to bookmarks"
                variant={saved ? 'subtle' : 'ghost'}
                size="md"
                onClick={() => {
                  setSaved(!saved);
                  toast.success(saved ? 'Removed from saved' : 'Saved to collection!');
                }}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current text-indigo-400' : ''}`} />
              </IconButton>

              <IconButton
                aria-label="Notifications"
                variant="subtle"
                size="md"
                badge={true}
                badgeColor="primary"
              >
                <Bell className="w-5 h-5" />
              </IconButton>

              <IconButton
                aria-label="Danger action"
                variant="danger"
                size="md"
                onClick={() => toast.error('Action blocked')}
              >
                <ShieldAlert className="w-5 h-5" />
              </IconButton>

              <Dropdown
                trigger={
                  <IconButton aria-label="More options" variant="ghost" size="md">
                    <MoreVertical className="w-5 h-5" />
                  </IconButton>
                }
                items={[
                  {
                    label: 'Copy link',
                    onClick: () => toast.success('Link copied!'),
                  },
                  {
                    label: 'Report post',
                    danger: true,
                    onClick: () => toast.warning('Report submitted for review'),
                  },
                ]}
              />
            </div>
          </Card>
        </div>

        {/* SECTION 3: Avatar Hierarchy & Statuses */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-wide text-zinc-300 uppercase text-xs">
            3. Avatars with Verified Badges & Online Statuses
          </h2>
          <Card variant="glass" className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Avatar
                size="2xl"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                name="Rohan Sharma"
                verified
                status="online"
              />
              <Avatar
                size="xl"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                name="Maya Patel"
                verified
                status="busy"
              />
              <Avatar
                size="lg"
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
                name="Dev Mehta"
                status="online"
              />
              <Avatar size="md" name="Aura Streetwear" ring="primary" verified />
              <Avatar size="sm" name="Cult Sport" status="offline" />
              <Avatar size="xs" name="Alex Vance" verified />
            </div>
          </Card>
        </div>

        {/* SECTION 4: Skeleton Loading States */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-wide text-zinc-300 uppercase text-xs">
            4. Shimmer Skeleton Loading Primitives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="glass" className="p-4 space-y-3">
              <p className="text-xs text-zinc-400 font-medium">Text & Element Skeletons</p>
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={90} />
            </Card>

            <Card variant="glass" className="p-4">
              <p className="text-xs text-zinc-400 font-medium mb-3">Feed Post Shimmer</p>
              <Skeleton variant="post" />
            </Card>
          </div>
        </div>

        {/* SECTION 5: Forms & Textarea */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-wide text-zinc-300 uppercase text-xs">
            5. Accessible Form Controls (Input & Textarea)
          </h2>
          <Card variant="glass" className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Search Creators & Brands"
                placeholder="Type name, handle or tag..."
                leftIcon={<Search className="w-4 h-4" />}
              />
              <Textarea
                label="Compose Comment / Direct Message"
                placeholder="Share your thoughts..."
                autoResize
                showCharCount
                maxLength={200}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Bottom Sheet Verification */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Threaded Comments (Preview)"
        subtitle="32 comments • Real-time synchronization"
        footer={
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a comment..."
              className="flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('Comment posted successfully');
                setCommentText('');
              }}
            >
              Post
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3">
            <Avatar
              size="sm"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
              name="Maya Patel"
              verified
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200">Maya Patel</span>
                <span className="text-[11px] text-zinc-500">1h ago</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                This looks 🔥 The lighting transitions are next level!
              </p>
            </div>
          </div>

          <div className="pl-8 border-l border-white/10 flex items-start gap-3">
            <Avatar
              size="sm"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              name="Rohan Sharma"
              verified
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200">Rohan Sharma</span>
                <span className="text-[11px] text-zinc-500">45m ago</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Thanks Maya! Shot with 35mm anamorphic.
              </p>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
