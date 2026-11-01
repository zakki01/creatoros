import React, { useState, useRef } from 'react';
import { X, Upload, User, Globe, MapPin, Sparkles, Check, AlertCircle, Loader2, Camera, DollarSign } from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { uploadDirectToStorage } from '../../services/mediaUploadService';
import { supabase } from '../../services/supabaseClient';
import { useToast } from '../ui/Toast';

interface EditCreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name?: string;
    handle?: string;
    category?: string;
    bio?: string;
    location?: string;
    ratePerReel?: number;
    ratePerShot?: number;
    ratePerBlog?: number;
    avatarUrl?: string;
    coverUrl?: string;
  };
}

export const EditCreatorProfileModal: React.FC<EditCreatorProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { userProfile, updateUserProfile, triggerCelebration } = useAppState();
  const toast = useToast();

  const [name, setName] = useState(
    initialData?.name || userProfile?.name || ''
  );
  const [handle, setHandle] = useState(
    (initialData?.handle || userProfile?.handle || '').replace(/^@/, '')
  );
  const [category, setCategory] = useState(
    initialData?.category || userProfile?.category || 'Fashion & Style'
  );
  const [location, setLocation] = useState(
    initialData?.location || userProfile?.location || ''
  );
  const [bio, setBio] = useState(
    initialData?.bio || userProfile?.bio || ''
  );
  const [ratePerReel, setRatePerReel] = useState<number | string>(
    initialData?.ratePerReel || 35000
  );
  const [ratePerShot, setRatePerShot] = useState<number | string>(
    initialData?.ratePerShot || 15000
  );
  const [ratePerBlog, setRatePerBlog] = useState<number | string>(
    initialData?.ratePerBlog || 20000
  );
  const [avatarUrl, setAvatarUrl] = useState(
    initialData?.avatarUrl || userProfile?.avatarUrl || ''
  );
  const [coverUrl, setCoverUrl] = useState(
    initialData?.coverUrl || userProfile?.coverUrl || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    setError(null);
    try {
      const url = await uploadDirectToStorage(file, 'creatoros-media', undefined, userProfile?.id);
      setAvatarUrl(url);
      toast.success('Profile avatar uploaded successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    setError(null);
    try {
      const url = await uploadDirectToStorage(file, 'creatoros-media', undefined, userProfile?.id);
      setCoverUrl(url);
      toast.success('Cover banner uploaded successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to upload cover banner.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formattedHandle = handle.trim()
        ? handle.startsWith('@')
          ? handle.trim()
          : `@${handle.trim()}`
        : `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      await updateUserProfile({
        name: name.trim(),
        handle: formattedHandle,
        category,
        location: location.trim(),
        bio: bio.trim(),
        avatarUrl,
        coverUrl,
      });

      // Also persist rates to creator_profiles
      if (userProfile?.id && supabase) {
        await supabase
          .from('creator_profiles')
          .update({
            rate_per_reel: Number(ratePerReel) || 0,
            rate_per_shot: Number(ratePerShot) || 0,
            rate_per_blog: Number(ratePerBlog) || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userProfile.id);
      }

      triggerCelebration();
      toast.success('Creator profile updated successfully.');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update creator profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Edit Creator Profile</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Update your portfolio, niche, rates, and media</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Cover & Avatar Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Profile Media</label>
            <div className="relative w-full h-28 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] text-[var(--text-muted)]">No cover banner set</span>
              )}

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="absolute right-2.5 top-2.5 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isUploadingCover ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                <span>{coverUrl ? 'Change Cover' : 'Upload Cover'}</span>
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />

              {/* Avatar Overlay */}
              <div className="absolute left-4 bottom-2 w-14 h-14 rounded-full bg-[var(--surface-elevated)] border-2 border-[var(--border)] overflow-hidden shadow-md flex items-center justify-center group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[var(--text-muted)]" />
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  {isUploadingAvatar ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Display Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Patel"
                className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Handle</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[var(--text-muted)]">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="mayacreates"
                  className="w-full pl-7 pr-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Primary Category / Niche</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="Fashion & Style">Fashion &amp; Style</option>
                <option value="Sneakers & Streetwear">Sneakers &amp; Streetwear</option>
                <option value="Tech & Gaming">Tech &amp; Gaming</option>
                <option value="Fitness & Wellness">Fitness &amp; Wellness</option>
                <option value="Travel & Lifestyle">Travel &amp; Lifestyle</option>
                <option value="Photography & Cinema">Photography &amp; Cinema</option>
                <option value="Beauty & Grooming">Beauty &amp; Grooming</option>
                <option value="Food & Culinary">Food &amp; Culinary</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Location</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Rates Grid */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Standard Collaboration Rates (₹ INR)</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-[var(--text-muted)]">Per 4K Reel</span>
                <input
                  type="number"
                  value={ratePerReel}
                  onChange={(e) => setRatePerReel(e.target.value)}
                  placeholder="35000"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[var(--text-muted)]">Per Shot</span>
                <input
                  type="number"
                  value={ratePerShot}
                  onChange={(e) => setRatePerShot(e.target.value)}
                  placeholder="15000"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[var(--text-muted)]">Per Blog / Post</span>
                <input
                  type="number"
                  value={ratePerBlog}
                  onChange={(e) => setRatePerBlog(e.target.value)}
                  placeholder="20000"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Bio / Creator Statement</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands about your creative style, equipment, audience demographics, and past collaborations..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingAvatar || isUploadingCover}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
