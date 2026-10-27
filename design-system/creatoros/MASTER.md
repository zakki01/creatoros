# CreatorOS — Design System Master File

> **LOGIC:** When building a specific page or feature, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** CreatorOS  
**Platform Category:** Creator + Brand Partnership OS & Marketplace  
**Core Features:** Reels, Shots, Blogs, Realtime AR Live Studio, Discovery Engine, Campaigns, Contracts, Escrow, Creator Passport  
**Theme System:** Dual-Theme (Light Studio Default + Dark Studio Low-Light / OLED) with Semantic CSS Variables

---

## 1. Core Platform Roles & Relationship Matrix

CreatorOS operates on three primary user roles:
1. **Creator** — Content creators, influencers, artists, vloggers
2. **Brand** — Businesses, agencies, direct-to-consumer sponsors
3. **Admin** — Platform moderators, dispute resolution officers

### Definitive Relationship Action Matrix (Source of Truth)

All buttons, cards, profiles, search cards, and discovery results MUST calculate primary and secondary actions via the centralized relationship resolver (`resolveProfileActions`):

| Viewer Role | Viewed Profile Role | Primary Action | Secondary Actions | Disallowed Actions |
| :--- | :--- | :--- | :--- | :--- |
| **Creator** | **Creator** | `Connect` (or `Connected`) | `Share Profile`, `Message` | `Pitch to Brand` |
| **Creator** | **Brand** | `Pitch to Brand` | `Share Profile`, `Message` | `Connect` |
| **Brand** | **Creator** | `Approach Creator` / `Invite to Campaign` | `Share Profile`, `Message` | `Connect` |
| **Brand** | **Brand** | `Connect` | `Share Profile`, `Message` | `Pitch to Brand` |
| **Any** | **Own Profile** | `Edit Profile` | `Share Profile` | `Connect`, `Pitch`, `Invite` |
| **Admin** | **Any** | `Moderate / Manage` | `View Audit Logs` | Generic consumer actions |

> [!IMPORTANT]
> A Creator should **never** see a generic "Connect" button on a Brand profile. The primary relationship mechanism between a Creator and a Brand is **Pitch to Brand**.
> A Brand should **never** see a generic "Connect" button on a Creator profile. The primary relationship mechanism is **Approach Creator** or **Invite to Campaign**.

---

## 2. Color Palette & Semantic Tokens

CreatorOS supports dual-theme styling via `data-theme="light"` and `data-theme="dark"`. All components MUST use semantic tokens rather than hardcoded colors (`bg-white`, `text-black`).

### Semantic Color Variables

| Token | Light Studio | Dark Studio | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `#EDF0F4` | `#0B0E14` | Application root viewport canvas |
| `--surface` | `#FFFFFF` | `#151921` | Base content containers and page sections |
| `--surface-elevated` | `#FFFFFF` | `#1A1F2C` | Modals, flyout menus, floating action bars |
| `--surface-muted` | `#F1F4F8` | `#222938` | Recessed containers, input wells, inactive tabs |
| `--text-primary` | `#0F172A` | `#F8FAFC` | Primary headings, prominent body text |
| `--text-secondary` | `#475569` | `#CBD5E1` | Subtitles, supporting copy, labels |
| `--text-muted` | `#64748B` | `#94A3B8` | Timestamps, metadata, hints |
| `--border` | `#D5DDE6` | `rgba(255, 255, 255, 0.08)` | Divider lines, card boundaries, input borders |
| `--input` | `#FFFFFF` | `#151921` | Text fields, select dropdowns, search inputs |
| `--accent` | `#00869B` (Teal) | `#00B4D8` (Cyan) | Primary call-to-action buttons, active states |
| `--accent-foreground` | `#FFFFFF` | `#0B0E14` | Contrast text on accent backgrounds |
| `--success` | `#047857` | `#10B981` | Completed contracts, live connection active |
| `--warning` | `#92400E` | `#F59E0B` | Unconfigured services, pending escrow |
| `--danger` | `#B4233C` | `#EF4444` | Live streaming end, disconnect, errors |

### Spacing & Layout Tokens

| Token | Value | Application |
| :--- | :--- | :--- |
| `--space-xs` | `4px` | Fine badge margins, inline icon padding |
| `--space-sm` | `8px` | Gap between button icons and labels |
| `--space-md` | `16px` | Standard card internal padding |
| `--space-lg` | `24px` | Section margins, grid gaps |
| `--space-xl` | `32px` | Drawer and modal padding |
| `--radius-card` | `28px` | Default corner radius for cards and panels |
| `--radius-modal` | `32px` | Default corner radius for overlays and dialogs |

---

## 3. Media Ingestion & Upload Standards

All user-submitted media (Reels, Shots, Blogs, Deliverables, Profile Attachments) must pass through `src/services/mediaUploadService.ts`.

### Strict Validation Requirements
1. **Magic Bytes Inspection**: Inspect initial binary chunks of files to verify authentic MIME signatures before upload:
   - MP4/MOV: `ftyp` box marker (`0x66 0x74 0x79 0x70`)
   - WebM: EBML header (`0x1A 0x45 0xDF 0xA3`)
   - JPEG: `0xFF 0xD8 0xFF`
   - PNG: `0x89 0x50 0x4E 0x47`
   - WebP: `RIFF....WEBP`
   - Strict rejection of executable headers (`MZ` DOS/PE headers).
2. **Metadata Extraction**:
   - Videos: Client-side canvas video frame capture for poster thumbnails; real duration and dimensions calculation.
   - Images: Immediate high-fidelity data URL thumbnail preview.
3. **Progressive Upload Machine**:
   - `validating` → `uploading` (0-100%) → `processing` → `ready` or `error`.
   - Error states must display human-readable guidance with a dedicated `Retry` trigger.
4. **Category Selection & Custom Categories**:
   - Reel Categories: Fashion & Styling, Tech & Unboxing, Comedy & Sketches, Dance & Trends, Fitness, Travel, Custom.
   - Shot Categories: Portrait Photography, Editorial, Street Style, Product Showcase, Architecture, Custom.
   - Custom category selections must show an active text field, validate input (min 2 chars), and persist cleanly into post badges and tags.

---

## 4. Live Studio & Computer Vision AR Pipeline

CreatorOS Live Studio provides a professional broadcasting environment on both mobile (100dvh full bleed 9:16) and desktop (multi-panel monitoring).

### Subsystem Separation
The Live Studio separates concerns into four distinct subsystems:
1. **Camera Subsystem**: `idle` | `requesting` | `ready` | `error`
   - Requests real `navigator.mediaDevices.getUserMedia`.
   - Handles front/rear camera flipping, permission denial recovery, and microphone muting.
2. **AR Processing Subsystem**: `ready` | `unavailable`
   - Computer-vision face landmark tracking with real computed confidence (0.0 to 1.0).
   - Dual-eye gradient symmetry detection, eye distance scaling, and head roll angle calculation (`atan2`).
   - Procedural vector rendering (Cyber Visor, Gilded Crown, Prismatic Decals, Neon Mask) and bilateral beauty filter.
3. **Live Transport Subsystem**: `unconfigured` | `connecting` | `live` | `error`
   - **Truthful Status Rule**: NEVER display `LIVE` or run a broadcast timer when transport credentials (LiveKit / Decart) are missing or connection fails.
   - When unconfigured: displays `BLOCKED — LiveKit configuration required`.
   - When connection fails: displays `Live service unavailable` with a `Retry` action.
   - Local camera preview and AR tracking remain fully operational offline.
4. **Recording Subsystem**: `idle` | `recording` | `ready`
   - **Augmented Stream Recording**: MediaRecorder records the processed canvas stream (`augmentedStream`) so that all active AR accessories and beauty filters are permanently captured in the saved video clip.

---

## 5. Component Specifications

### Buttons
```css
/* Primary Action Button (Teal / Cyan depth) */
.depth-btn-primary {
  background: var(--accent);
  color: var(--accent-foreground);
  font-weight: 600;
  border-radius: 14px;
  min-height: 44px;
  padding: 10px 20px;
  transition: all 180ms ease;
  cursor: pointer;
  box-shadow: 0 4px 14px -3px rgba(0, 134, 155, 0.35);
}

.depth-btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.depth-btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button (Surface with subtle border) */
.depth-btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  font-weight: 600;
  border-radius: 14px;
  min-height: 44px;
  padding: 10px 20px;
  transition: all 180ms ease;
  cursor: pointer;
}
```

### Cards & Panels
```css
.surface-2 {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
}

.surface-3 {
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 20px;
}
```

---

## 6. Anti-Patterns (Strictly Forbidden)

- ❌ **Faking Live Streaming**: Never show `LIVE` or decrement viewer timers when streaming transport is not connected.
- ❌ **URL-Only Media Uploads**: Never force creators to supply third-party video/image URLs instead of uploading real media files.
- ❌ **Generic Connect for Brands**: Never show a Creator-to-Creator "Connect" button on a Brand profile.
- ❌ **Hardcoded Hex Colors**: Never use hardcoded `#FFFFFF` or `bg-white` in core components without matching dark mode tokens.
- ❌ **Touch Targets Below 44px**: All interactive mobile buttons, overlays, and drawer triggers must be at least 44x44px per Fitts's Law.
- ❌ **Broken 3D Asset URLs**: Never reference non-existent `.glb` / `.obj` files; utilize procedural vector geometry and shaders.
- ❌ **Missing Back Navigation in Passport**: The Creator Passport must always provide an accessible `← Back to Profile` header.

---

## 7. Pre-Delivery Quality Checklist

Before shipping any release:
- [ ] `npm run build` succeeds cleanly with 0 TypeScript errors.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm test` passes 100% of automated browser end-to-end verification suites.
- [ ] Magic bytes file signature verification active on media uploads.
- [ ] Custom category entry persisted correctly into post metadata.
- [ ] LiveKit / Decart status truthfully displays `BLOCKED` or `Live service unavailable` when credentials are not supplied.
- [ ] Recorded clips contain active AR facial accessories and beauty filters.
- [ ] Light Studio and Dark Studio themes both render with 4.5:1 minimum WCAG text contrast.
