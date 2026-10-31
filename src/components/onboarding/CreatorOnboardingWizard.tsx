import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  MapPin,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Film,
  Video,
  FileText,
  DollarSign,
  Briefcase,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { UserProfile } from '../../types';

interface CreatorOnboardingProps {
  initialName?: string;
  initialEmail?: string;
  initialHandle?: string;
  onComplete: (data: CreatorProfileSetupData) => void;
}

export interface CreatorProfileSetupData {
  roles: string[];
  displayName: string;
  handle: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location: string;
  languages: string[];
  primaryCategory: string;
  skills: string[];
  experienceLevel: string;
  portfolio: { title: string; type: string; url: string }[];
  availabilityStatus: 'Available' | 'Limited Availability' | 'Booked';
  availableFrom: string;
  startingRate: number;
  rateType: string;
  negotiable: boolean;
  rateCard: Record<string, number>;
  socialLinks: Record<string, string>;
}

const CREATOR_ROLE_OPTIONS = [
  'Video Creator',
  'Photographer',
  'Designer',
  'Editor',
  'Musician',
  'Influencer',
  'UGC Creator',
  'Gamer',
  'Artist',
  'Podcast Host',
  'Fashion Stylist',
  'Tech Reviewer',
];

const SKILL_SUGGESTIONS = [
  '4K Video',
  'Color Grading',
  'Motion Graphics',
  'Shorts & Reels',
  'Product Styling',
  'Voiceover',
  'Scriptwriting',
  'Lighting Design',
  'Drone Cinematography',
  'UGC Unboxing',
];

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Tamil', 'Bengali'];

export const CreatorOnboardingWizard: React.FC<CreatorOnboardingProps> = ({
  initialName = '',
  initialEmail = '',
  initialHandle = '',
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Video Creator', 'UGC Creator']);
  const [displayName, setDisplayName] = useState(initialName || 'Creative Director');
  const [handle, setHandle] = useState(initialHandle || `@${initialName.toLowerCase().replace(/\s+/g, '') || 'creator'}`);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bio, setBio] = useState('Creating high-impact visual stories and authentic brand partnerships.');
  const [location, setLocation] = useState('Mumbai, India');
  const [languages, setLanguages] = useState<string[]>(['English', 'Hindi']);
  const [primaryCategory, setPrimaryCategory] = useState('Streetwear & Lifestyle');
  const [skills, setSkills] = useState<string[]>(['4K Video', 'Shorts & Reels', 'Color Grading']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Pro (3-5 years)');

  // Step 3: Showcase
  const [portfolio, setPortfolio] = useState<{ title: string; type: string; url: string }[]>([
    { title: 'Signature Commercial UGC Drop', type: 'Reel', url: 'https://example.com/showcase-1' },
  ]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectType, setNewProjectType] = useState('Reel');
  const [newProjectUrl, setNewProjectUrl] = useState('');

  // Step 4: Availability
  const [availabilityStatus, setAvailabilityStatus] = useState<'Available' | 'Limited Availability' | 'Booked'>('Available');
  const [availableFrom, setAvailableFrom] = useState('Available Now');

  // Step 5: Rates
  const [startingRate, setStartingRate] = useState<number>(25000);
  const [rateType, setRateType] = useState('Per Deliverable');
  const [negotiable, setNegotiable] = useState(true);
  const [rateCard, setRateCard] = useState<Record<string, number>>({
    Reel: 30000,
    Story: 10000,
    Post: 20000,
    UGC: 25000,
  });

  const toggleRole = (r: string) => {
    if (selectedRoles.includes(r)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((item) => item !== r));
      }
    } else {
      setSelectedRoles([...selectedRoles, r]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !skills.includes(customSkillInput.trim())) {
      setSkills([...skills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const addPortfolioItem = () => {
    if (newProjectTitle.trim()) {
      setPortfolio([
        ...portfolio,
        {
          title: newProjectTitle.trim(),
          type: newProjectType,
          url: newProjectUrl.trim() || '#',
        },
      ]);
      setNewProjectTitle('');
      setNewProjectUrl('');
    }
  };

  const removePortfolioItem = (idx: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== idx));
  };

  const handleFinish = () => {
    onComplete({
      roles: selectedRoles,
      displayName,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatarUrl,
      coverUrl,
      bio,
      location,
      languages,
      primaryCategory,
      skills,
      experienceLevel,
      portfolio,
      availabilityStatus,
      availableFrom,
      startingRate,
      rateType,
      negotiable,
      rateCard,
      socialLinks: {},
    });
  };

  const totalSteps = 6;
  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 font-semibold text-[var(--primary)]">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <span>CREATOR ONBOARDING</span>
          </span>
          <span>
            Step {step} of {totalSteps} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STEP 1: CHOOSE WHAT YOU DO
         ───────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              What creative work do you do?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Select all roles that match your craft. Brands search creators using these filters.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {CREATOR_ROLE_OPTIONS.map((roleOpt) => {
              const isSelected = selectedRoles.includes(roleOpt);
              return (
                <button
                  key={roleOpt}
                  type="button"
                  onClick={() => toggleRole(roleOpt)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] font-semibold shadow-xs'
                      : 'bg-[var(--surface-muted)]/40 border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="truncate">{roleOpt}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-[var(--primary)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: PROFESSIONAL IDENTITY
         ───────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Your Professional Identity
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              This is the official public face brands see when discovering your work.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Display Name *
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Username (@handle) *
                </label>
                <Input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@alexrivera"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Professional Bio (What sets your content apart?)
              </label>
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell brands about your aesthetic, audience, and creative style..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Location (City, Country)
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, India"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Primary Niche / Category
                </label>
                <Input
                  value={primaryCategory}
                  onChange={(e) => setPrimaryCategory(e.target.value)}
                  placeholder="e.g. Streetwear & Fashion"
                />
              </div>
            </div>

            {/* Profile Avatar URL */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Profile Photo URL (or leave blank to use initial avatar)
              </label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or paste image link"
              />
            </div>

            {/* Languages */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Languages You Speak
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isSel = languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer min-h-[36px] ${
                        isSel
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                          : 'bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills Tags */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Key Skills & Creative Capabilities
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {SKILL_SUGGESTIONS.map((skill) => {
                  const hasSkill = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer min-h-[32px] ${
                        hasSkill
                          ? 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/40 font-semibold'
                          : 'bg-[var(--surface-muted)]/50 text-[var(--text-muted)] border-[var(--border)]/70 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {hasSkill ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Input
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. Unreal Engine 5)..."
                  className="text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomSkill}
                  className="shrink-0 text-xs min-h-[44px]"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: SHOWCASE YOUR WORK
         ───────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Showcase Your Best Work
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Add links to featured Reels, Shots, UGC samples, or videos that showcase your production caliber.
            </p>
          </div>

          {/* Existing items */}
          <div className="space-y-2.5">
            {portfolio.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)] text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] truncate">{item.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate font-mono">
                      {item.type} • {item.url}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removePortfolioItem(idx)}
                  className="text-[var(--text-muted)] hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new project */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)]/30 border border-dashed border-[var(--border)] space-y-3">
            <span className="text-xs font-semibold text-[var(--text-primary)] block">
              + Add a Portfolio / UGC Link
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <Input
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Project title (e.g. Fall Lookbook Reel)"
                  className="text-xs"
                />
              </div>

              <div>
                <select
                  value={newProjectType}
                  onChange={(e) => setNewProjectType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="Reel">Reel (Short Video)</option>
                  <option value="Shot">Shot (Photo Still)</option>
                  <option value="Blog">Blog (Article)</option>
                  <option value="YouTube Video">YouTube Video</option>
                  <option value="UGC Sample">UGC Sample</option>
                </select>
              </div>
            </div>

            <div>
              <Input
                value={newProjectUrl}
                onChange={(e) => setNewProjectUrl(e.target.value)}
                placeholder="Direct URL (Instagram, YouTube, portfolio link, or media file)"
                className="text-xs"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPortfolioItem}
              disabled={!newProjectTitle.trim()}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs min-h-[40px]"
            >
              Add to Showcase
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: WORK PREFERENCES & AVAILABILITY
         ───────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Availability & Work Preferences
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Let brands know when and how you are open to collaborating.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
                Current Availability Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'Available', label: 'Available Now', desc: 'Accepting briefs & fast turnaround' },
                  { id: 'Limited Availability', label: 'Limited Spots', desc: 'Selective on active campaigns' },
                  { id: 'Booked', label: 'Currently Booked', desc: 'Open for advance scheduling only' },
                ].map((statusOpt) => {
                  const isSel = availabilityStatus === statusOpt.id;
                  return (
                    <button
                      key={statusOpt.id}
                      type="button"
                      onClick={() => setAvailabilityStatus(statusOpt.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                        isSel
                          ? 'bg-[var(--primary)]/10 border-[var(--primary)] shadow-xs'
                          : 'bg-[var(--surface-muted)]/40 border-[var(--border)] hover:bg-[var(--surface-muted)]'
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold block ${
                          isSel ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {statusOpt.label}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-0.5 leading-snug">
                        {statusOpt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Availability Timeline Note
              </label>
              <Input
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                placeholder="e.g. Available Now (Q4 Drops) or From Nov 15"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 5: RATES & RATE CARD
         ───────────────────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Your Rates & Deliverables
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Set clear baseline expectations so brands know your pricing tier for milestone contracts.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Starting Rate (₹) *
                </label>
                <Input
                  type="number"
                  min={1000}
                  step={1000}
                  value={startingRate}
                  onChange={(e) => setStartingRate(Number(e.target.value) || 0)}
                  placeholder="25000"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Pricing Structure
                </label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="Per Deliverable">Per Deliverable / Asset</option>
                  <option value="Package / Campaign">Package / Multi-Asset</option>
                  <option value="Monthly Retainer">Monthly Brand Retainer</option>
                </select>
              </div>
            </div>

            {/* Standard Rate Card Breakdown */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
                Deliverable-Specific Rate Card
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(rateCard).map(([service, rate]) => (
                  <div
                    key={service}
                    className="p-3 rounded-xl bg-[var(--surface-muted)]/40 border border-[var(--border)]"
                  >
                    <span className="text-[11px] font-medium text-[var(--text-secondary)] block">
                      {service}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">₹</span>
                      <input
                        type="number"
                        step={1000}
                        value={rate}
                        onChange={(e) =>
                          setRateCard({ ...rateCard, [service]: Number(e.target.value) || 0 })
                        }
                        className="w-full bg-transparent text-xs font-mono font-bold text-[var(--text-primary)] outline-none border-b border-[var(--border)] focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Negotiable Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)] text-xs">
              <div>
                <span className="font-semibold text-[var(--text-primary)] block">Open to negotiation</span>
                <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                  Allows brands to propose custom milestone packages for multi-video series.
                </span>
              </div>
              <input
                type="checkbox"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 6: LIVE INTERACTIVE PREVIEW
         ───────────────────────────────────────────────────────────── */}
      {step === 6 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Review Your Public Profile
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Here is exactly how brands and fellow creators will see your profile.
            </p>
          </div>

          {/* Social Card Preview Component */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-md overflow-hidden">
            {/* Banner */}
            <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 to-[var(--surface-muted)] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent opacity-80" />
            </div>

            {/* Avatar & Header */}
            <div className="px-5 pb-5 -mt-10 relative z-10 space-y-3">
              <div className="flex items-end justify-between">
                <Avatar
                  src={avatarUrl}
                  name={displayName}
                  size="xl"
                  verified
                  className="ring-4 ring-[var(--surface)] shadow-lg"
                />
                <Badge variant="brand" size="sm" className="font-mono text-[10px]">
                  {availabilityStatus}
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">
                    {displayName}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <p className="text-xs font-mono text-[var(--text-muted)]">{handle}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{bio}</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] flex-wrap pt-1 border-t border-[var(--border)]/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                </span>
                <span>•</span>
                <span>{primaryCategory}</span>
                <span>•</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  From ₹{startingRate.toLocaleString()}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setStep(step - 1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="text-xs min-h-[44px]"
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setStep(step + 1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="text-xs min-h-[44px] px-6"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleFinish}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="text-xs min-h-[44px] px-8 font-semibold shadow-md"
          >
            Complete Profile & Launch
          </Button>
        )}
      </div>
    </div>
  );
};
