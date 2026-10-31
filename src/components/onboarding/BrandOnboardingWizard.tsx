import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Building2,
  MapPin,
  Globe,
  Mail,
  ShieldCheck,
  Briefcase,
  Layers,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';

interface BrandOnboardingProps {
  initialName?: string;
  initialEmail?: string;
  initialHandle?: string;
  onComplete: (data: BrandProfileSetupData) => void;
}

export interface BrandProfileSetupData {
  brandName: string;
  handle: string;
  logo: string;
  coverUrl: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  businessEmail: string;
  bio: string;
  mission: string;
  creatorCategories: string[];
  campaignTypes: string[];
  preferredPlatforms: string[];
  typicalBudget: string;
  workMode: string;
  contentGuidelinesSummary: string;
  socialLinks: Record<string, string>;
}

const INDUSTRY_OPTIONS = [
  'Streetwear & Fashion',
  'Tech & Hardware',
  'Beauty & Cosmetics',
  'Gaming & Esports',
  'Fitness & Wellness',
  'Food & Beverage',
  'Finance & Fintech',
  'Travel & Hospitality',
  'Consumer Goods',
  'Media & Entertainment',
];

const TARGET_CREATOR_CATEGORIES = [
  'Video Creators',
  'Fashion Stylists',
  'UGC Specialists',
  'Tech Reviewers',
  'Fitness Athletes',
  'Beauty Influencers',
  'Gamers & Streamers',
  'Photographers',
  'Designers',
];

const CAMPAIGN_TYPE_OPTIONS = [
  'Dedicated Reel',
  'In-Feed Carousel',
  'UGC Ad Creative',
  'Brand Ambassador',
  'Product Seeding',
  'Event / Store Coverage',
];

export const BrandOnboardingWizard: React.FC<BrandOnboardingProps> = ({
  initialName = '',
  initialEmail = '',
  initialHandle = '',
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Identity
  const [brandName, setBrandName] = useState(initialName || 'Apex Urban Gear');
  const [handle, setHandle] = useState(initialHandle || `@${initialName.toLowerCase().replace(/\s+/g, '') || 'apexgear'}`);
  const [logo, setLogo] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [industry, setIndustry] = useState('Streetwear & Fashion');
  const [companySize, setCompanySize] = useState('11-50 employees');
  const [location, setLocation] = useState('Bengaluru & Mumbai, India');

  // Step 2: About & Business Details
  const [website, setWebsite] = useState('https://examplebrand.com');
  const [businessEmail, setBusinessEmail] = useState(initialEmail || 'partnerships@examplebrand.com');
  const [bio, setBio] = useState('Crafting modern lifestyle apparel for contemporary youth subcultures and street fashion enthusiasts.');
  const [mission, setMission] = useState('Empower community expression through authentic creator partnerships and direct storytelling.');

  // Step 3: Collaboration Preferences
  const [creatorCategories, setCreatorCategories] = useState<string[]>([
    'Video Creators',
    'Fashion Stylists',
    'UGC Specialists',
  ]);
  const [campaignTypes, setCampaignTypes] = useState<string[]>([
    'Dedicated Reel',
    'UGC Ad Creative',
  ]);
  const [preferredPlatforms, setPreferredPlatforms] = useState<string[]>(['Instagram', 'YouTube']);
  const [typicalBudget, setTypicalBudget] = useState('₹35,000 – ₹75,000');
  const [workMode, setWorkMode] = useState('Remote / Product Shipping');
  const [contentGuidelinesSummary, setContentGuidelinesSummary] = useState(
    'Natural product integration, 4K 60fps vertical format, clear hook within the first 3 seconds.'
  );

  const toggleCategory = (cat: string) => {
    if (creatorCategories.includes(cat)) {
      if (creatorCategories.length > 1) {
        setCreatorCategories(creatorCategories.filter((c) => c !== cat));
      }
    } else {
      setCreatorCategories([...creatorCategories, cat]);
    }
  };

  const toggleCampaignType = (type: string) => {
    if (campaignTypes.includes(type)) {
      if (campaignTypes.length > 1) {
        setCampaignTypes(campaignTypes.filter((t) => t !== type));
      }
    } else {
      setCampaignTypes([...campaignTypes, type]);
    }
  };

  const togglePlatform = (plat: string) => {
    if (preferredPlatforms.includes(plat)) {
      if (preferredPlatforms.length > 1) {
        setPreferredPlatforms(preferredPlatforms.filter((p) => p !== plat));
      }
    } else {
      setPreferredPlatforms([...preferredPlatforms, plat]);
    }
  };

  const handleFinish = () => {
    onComplete({
      brandName,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      logo,
      coverUrl,
      industry,
      companySize,
      location,
      website,
      businessEmail,
      bio,
      mission,
      creatorCategories,
      campaignTypes,
      preferredPlatforms,
      typicalBudget,
      workMode,
      contentGuidelinesSummary,
      socialLinks: {},
    });
  };

  const totalSteps = 4;
  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 font-semibold text-[var(--primary)]">
            <Building2 className="w-4 h-4 text-[var(--primary)]" />
            <span>BRAND WORKSPACE SETUP</span>
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
          STEP 1: BRAND IDENTITY
         ───────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Brand & Organization Identity
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Establish your verified brand credentials so creators can trust campaign briefs and escrow milestones.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Brand / Company Name *
                </label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Apex Streetwear"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Brand Handle (@handle) *
                </label>
                <Input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@apexstreetwear"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Industry / Sector
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Company Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="1-10 employees">1 - 10 employees (Startup)</option>
                  <option value="11-50 employees">11 - 50 employees (Growth)</option>
                  <option value="51-200 employees">51 - 200 employees (Scale)</option>
                  <option value="200+ employees">200+ employees (Enterprise)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Headquarters / Operating Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru & Mumbai, India"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Brand Logo URL (Optional link to high-res PNG / SVG)
              </label>
              <Input
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://... or leave blank for auto-generated avatar"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: ABOUT & BUSINESS DETAILS
         ───────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              About & Business Details
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Give creators clear context on what your brand stands for and what products you sell.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Company Description & Story
              </label>
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your brand, products, and target audience..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Mission Statement / Creative Philosophy
              </label>
              <Input
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="e.g. Redefining modern athletic apparel through sustainable fabrics"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Official Website
                </label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbrand.com"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Partnerships Email
                </label>
                <Input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="creators@yourbrand.com"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: COLLABORATION PREFERENCES
         ───────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="p-5 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Collaboration Preferences
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Configure creator matching parameters for your campaign briefs and inbound pitches.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
                Target Creator Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TARGET_CREATOR_CATEGORIES.map((cat) => {
                  const isSel = creatorCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer min-h-[40px] ${
                        isSel
                          ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] font-semibold'
                          : 'bg-[var(--surface-muted)]/40 border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
                Preferred Content Formats
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CAMPAIGN_TYPE_OPTIONS.map((type) => {
                  const isSel = campaignTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleCampaignType(type)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer min-h-[40px] ${
                        isSel
                          ? 'bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)] font-semibold'
                          : 'bg-[var(--surface-muted)]/40 border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="truncate">{type}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Typical Budget / Creator Tier
                </label>
                <select
                  value={typicalBudget}
                  onChange={(e) => setTypicalBudget(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="₹10,000 – ₹25,000">₹10,000 – ₹25,000 (Micro UGC)</option>
                  <option value="₹35,000 – ₹75,000">₹35,000 – ₹75,000 (Mid-Tier Pro)</option>
                  <option value="₹75,000 – ₹1,50,000">₹75,000 – ₹1,50,000 (Flagship)</option>
                  <option value="₹2,00,000+">₹2,00,000+ (High Reach Syndicate)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Collaboration Mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="Remote / Product Shipping">Remote / Product Shipping</option>
                  <option value="On-Site Production">On-Site Studio / Event</option>
                  <option value="Hybrid">Hybrid Deliverable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                Brief & Creative Guidelines Summary
              </label>
              <Textarea
                rows={2}
                value={contentGuidelinesSummary}
                onChange={(e) => setContentGuidelinesSummary(e.target.value)}
                placeholder="High-level rules for creators (e.g. 4K 60fps, no competitor logos)..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: BRAND PREVIEW & COMPLETION
         ───────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)]">
              Review Your Brand Profile
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Here is how creators will see your brand workspace and collaboration criteria.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-md overflow-hidden">
            <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-[var(--primary)]/20 via-[var(--surface-muted)] to-[var(--accent)]/20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent opacity-80" />
            </div>

            <div className="px-5 pb-5 -mt-10 relative z-10 space-y-3">
              <div className="flex items-end justify-between">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--surface-elevated)] border-2 border-[var(--border)] shadow-lg flex items-center justify-center font-bold text-lg text-[var(--primary)] font-display overflow-hidden">
                  {logo ? (
                    <img src={logo} alt={brandName} className="w-full h-full object-cover" />
                  ) : (
                    brandName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <Badge variant="brand" size="sm" className="font-mono text-[10px]">
                  {industry}
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">
                    {brandName}
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
                <span>{companySize}</span>
                <span>•</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {typicalBudget}
                </span>
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
            Complete Brand Setup & Launch
          </Button>
        )}
      </div>
    </div>
  );
};
