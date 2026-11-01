import React, { useState, useRef } from 'react';
import { X, Upload, Building2, Globe, MapPin, Sparkles, Check, AlertCircle, Loader2, Camera } from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { uploadDirectToStorage } from '../../services/mediaUploadService';
import { useToast } from '../ui/Toast';

interface EditBrandProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name?: string;
    handle?: string;
    industry?: string;
    bio?: string;
    website?: string;
    location?: string;
    companySize?: string;
    avatarUrl?: string;
    coverUrl?: string;
  };
}

export const EditBrandProfileModal: React.FC<EditBrandProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { userProfile, updateUserProfile, triggerCelebration } = useAppState();
  const toast = useToast();

  const [companyName, setCompanyName] = useState(
    initialData?.name || userProfile?.name || ''
  );
  const [handle, setHandle] = useState(
    (initialData?.handle || userProfile?.handle || '').replace(/^@/, '')
  );
  const [industry, setIndustry] = useState(
    initialData?.industry || userProfile?.industry || 'Retail & Lifestyle'
  );
  const [companySize, setCompanySize] = useState(
    initialData?.companySize || '11-50 Employees'
  );
  const [website, setWebsite] = useState(
    initialData?.website || userProfile?.website || ''
  );
  const [location, setLocation] = useState(
    initialData?.location || userProfile?.location || ''
  );
  const [bio, setBio] = useState(
    initialData?.bio || userProfile?.bio || ''
  );
  const [avatarUrl, setAvatarUrl] = useState(
    initialData?.avatarUrl || userProfile?.avatarUrl || ''
  );
  const [coverUrl, setCoverUrl] = useState(
    initialData?.coverUrl || userProfile?.coverUrl || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    setError(null);
    try {
      const url = await uploadDirectToStorage(file, 'creatoros-media', undefined, userProfile?.id);
      setAvatarUrl(url);
      toast.success('Brand logo uploaded successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to upload brand logo.');
    } finally {
      setIsUploadingLogo(false);
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
    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formattedHandle = handle.trim() ? (handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`) : `@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      await updateUserProfile({
        name: companyName.trim(),
        handle: formattedHandle,
        industry,
        website: website.trim(),
        location: location.trim(),
        bio: bio.trim(),
        avatarUrl,
        coverUrl,
      });

      triggerCelebration();
      toast.success('Brand profile updated successfully.');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update brand profile.');
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
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Edit Brand Profile</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Update your brand identity, contact, and overview</p>
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
          {/* Cover & Logo Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Brand Media</label>
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

              {/* Logo Overlay */}
              <div className="absolute left-4 bottom-2 w-14 h-14 rounded-xl bg-[var(--surface-elevated)] border-2 border-[var(--border)] overflow-hidden shadow-md flex items-center justify-center group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6 text-[var(--text-muted)]" />
                )}
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  {isUploadingLogo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Company Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Global"
                className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Handle / Username</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[var(--text-muted)]">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="apex_global"
                  className="w-full pl-7 pr-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Industry & Company Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="Retail & Lifestyle">Retail &amp; Lifestyle</option>
                <option value="Streetwear & Fashion">Streetwear &amp; Fashion</option>
                <option value="Tech & Electronics">Tech &amp; Electronics</option>
                <option value="Beauty & Skincare">Beauty &amp; Skincare</option>
                <option value="Food & Beverage">Food &amp; Beverage</option>
                <option value="Gaming & Entertainment">Gaming &amp; Entertainment</option>
                <option value="Fitness & Health">Fitness &amp; Health</option>
                <option value="Software & SaaS">Software &amp; SaaS</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="1-10 Employees">1-10 Employees</option>
                <option value="11-50 Employees">11-50 Employees</option>
                <option value="51-200 Employees">51-200 Employees</option>
                <option value="201-500 Employees">201-500 Employees</option>
                <option value="500+ Employees">500+ Employees</option>
              </select>
            </div>
          </div>

          {/* Website & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Website</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Location</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, India"
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bio / Overview */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">About Company / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your brand values, campaign objectives, and creator collaboration vision..."
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
              disabled={isSaving || isUploadingLogo || isUploadingCover}
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
