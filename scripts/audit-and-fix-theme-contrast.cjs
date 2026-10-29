const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const filesToAudit = [
  'src/components/common/PitchToBrandModal.tsx',
  'src/components/common/BrandProfileModal.tsx',
  'src/components/business/CreatorProfileModal.tsx',
  'src/components/common/DirectMessagesView.tsx',
  'src/components/common/ShareProfileModal.tsx',
  'src/components/common/ConnectModal.tsx',
  'src/components/common/BlogPostModal.tsx',
  'src/components/business/ApproachCreatorModal.tsx',
  'src/components/creator/CreatorPassport.tsx',
];

for (const rel of filesToAudit) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, 'utf8');
  let orig = s;

  // Replace background whites & hardcoded lights with semantic surface
  s = s.replace(/bg-white\/95/g, 'bg-[var(--surface-elevated)]/95');
  s = s.replace(/bg-white\/90/g, 'bg-[var(--surface-elevated)]/90');
  s = s.replace(/bg-white\/80/g, 'bg-[var(--surface-elevated)]/80');
  s = s.replace(/bg-white\/70/g, 'bg-[var(--surface-elevated)]/70');
  
  // Specific occurrences of bg-white in modal containers, cards, chips
  s = s.replace(/bg-white shadow-sm hover:bg-zinc-100/g, 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]');
  s = s.replace(/bg-white shadow-sm/g, 'bg-[var(--surface)] shadow-xs');
  s = s.replace(/bg-white shadow-xs/g, 'bg-[var(--surface)] shadow-xs');
  s = s.replace(/bg-white shadow-xl/g, 'bg-[var(--surface-elevated)] shadow-2xl');
  s = s.replace(/bg-white border/g, 'bg-[var(--surface)] border');
  s = s.replace(/bg-white text-zinc-900/g, 'bg-[var(--surface-elevated)] text-[var(--text-primary)]');
  s = s.replace(/bg-white text-zinc-800/g, 'bg-[var(--surface-elevated)] text-[var(--text-primary)]');
  s = s.replace(/bg-white rounded/g, 'bg-[var(--surface)] rounded');
  s = s.replace(/bg-white p-/g, 'bg-[var(--surface)] p-');

  // Hardcoded hex backgrounds
  s = s.replace(/bg-\[#F8FAFC\]/g, 'bg-[var(--surface-elevated)]');
  s = s.replace(/bg-\[#DFE3E8\]\/60/g, 'bg-[var(--surface-muted)]');

  // Zinc backgrounds
  s = s.replace(/bg-zinc-50\/70/g, 'bg-[var(--surface-muted)]');
  s = s.replace(/bg-zinc-50\/50/g, 'bg-[var(--surface-muted)]');
  s = s.replace(/bg-zinc-50/g, 'bg-[var(--surface-muted)]');
  s = s.replace(/bg-zinc-100/g, 'bg-[var(--surface-muted)]');
  s = s.replace(/hover:bg-zinc-50/g, 'hover:bg-[var(--surface-muted)]');
  s = s.replace(/hover:bg-zinc-100/g, 'hover:bg-[var(--surface-muted)]');
  s = s.replace(/hover:bg-zinc-200/g, 'hover:bg-black/5 dark:hover:bg-white/10');
  s = s.replace(/hover:bg-zinc-300/g, 'hover:bg-black/10 dark:hover:bg-white/15');

  // Borders
  s = s.replace(/border-black\/\[0\.08\]/g, 'border-[var(--border)]');
  s = s.replace(/border-black\/\[0\.06\]/g, 'border-[var(--border)]');
  s = s.replace(/border-black\/\[0\.04\]/g, 'border-[var(--border)]');
  s = s.replace(/border-black\/15/g, 'border-[var(--border-strong)]');
  s = s.replace(/border-zinc-200\/80/g, 'border-[var(--border)]');
  s = s.replace(/border-zinc-200\/90/g, 'border-[var(--border)]');
  s = s.replace(/border-zinc-200/g, 'border-[var(--border)]');
  s = s.replace(/border-zinc-300/g, 'border-[var(--border)]');

  // Text
  s = s.replace(/text-zinc-900/g, 'text-[var(--text-primary)]');
  s = s.replace(/text-zinc-800/g, 'text-[var(--text-primary)]');
  s = s.replace(/text-zinc-700/g, 'text-[var(--text-secondary)]');
  s = s.replace(/text-zinc-600/g, 'text-[var(--text-secondary)]');
  s = s.replace(/text-zinc-500/g, 'text-[var(--text-muted)]');

  if (s !== orig) {
    fs.writeFileSync(p, s, 'utf8');
    console.log(`[REMEDIATED] ${rel}`);
  } else {
    console.log(`[CLEAN] ${rel}`);
  }
}
