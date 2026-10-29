const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function replaceInFile(relativePath, replacements) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [from, to] of replacements) {
    if (typeof from === 'string') {
      if (!content.includes(from)) {
        console.warn(`[WARN] Pattern not found in ${relativePath}: "${from.slice(0, 40)}..."`);
      }
      content = content.split(from).join(to);
    } else if (from instanceof RegExp) {
      content = content.replace(from, to);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${relativePath}`);
    return true;
  } else {
    console.log(`[NO CHANGE] ${relativePath}`);
    return false;
  }
}

console.log('=== Remedying Modals and DirectMessages Dark Mode Tokens ===');

// 1. PitchToBrandModal.tsx
replaceInFile('src/components/common/PitchToBrandModal.tsx', [
  ['bg-white text-zinc-900 border border-black/[0.08]', 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)]'],
  ['bg-zinc-50/70', 'bg-[var(--surface-muted)]'],
  ['border-black/[0.08]', 'border-[var(--border)]'],
  ['border-black/[0.06]', 'border-[var(--border)]'],
  ['bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700', 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'],
  ['bg-zinc-50 border border-black/[0.06]', 'bg-[var(--surface-muted)] border border-[var(--border)]'],
  ['border border-zinc-300 bg-white text-zinc-900', 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]'],
  ['border border-zinc-300 bg-white text-zinc-900 focus:outline-none', 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none'],
  ['bg-zinc-50/50 hover:bg-zinc-50', 'bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)]'],
  ['border-2 border-dashed border-zinc-300', 'border-2 border-dashed border-[var(--border)]'],
  ['bg-zinc-50 border-zinc-200 text-zinc-600', 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)]'],
  ['bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200', 'bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)] text-[var(--text-secondary)] border border-[var(--border)]'],
  ['bg-zinc-50 flex items-center justify-between', 'bg-[var(--surface-muted)] flex items-center justify-between'],
  ['hover:bg-zinc-200 rounded-xl', 'hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] rounded-xl'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
  ['ring-black/10', 'ring-[var(--border)]'],
  ['bg-rose-50 border border-rose-200 text-rose-700', 'bg-rose-500/10 border border-rose-500/30 text-rose-500'],
  ['bg-emerald-50 text-emerald-800 border border-emerald-300', 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'],
  ['bg-[#007E93]/5 border border-[#007E93]/20', 'bg-[#007E93]/15 border border-[#007E93]/30'],
]);

// 2. BrandProfileModal.tsx
replaceInFile('src/components/common/BrandProfileModal.tsx', [
  ['bg-white text-zinc-900 border-0 sm:border border-black/[0.08]', 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border-0 sm:border border-[var(--border)]'],
  ['bg-white shadow-sm border border-black/[0.06]', 'bg-[var(--surface-muted)] border border-[var(--border)]'],
  ['bg-white shadow-sm hover:bg-zinc-100 border border-black/[0.08] text-zinc-800', 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-muted)]'],
  ['border-black/[0.08]', 'border-[var(--border)]'],
  ['border-black/[0.06]', 'border-[var(--border)]'],
  ['border-black/[0.04]', 'border-[var(--border)]'],
  ['border-black/15', 'border-[var(--border-strong)]'],
  ['bg-zinc-50 border border-black/[0.06]', 'bg-[var(--surface-muted)] border border-[var(--border)]'],
  ['bg-zinc-50 border border-zinc-200', 'bg-[var(--surface-muted)] border border-[var(--border)]'],
  ['bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800', 'bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)] border border-[var(--border)] text-[var(--text-primary)]'],
  ['bg-white shadow-sm border border-black/[0.06]', 'bg-[var(--surface)] border border-[var(--border)]'],
  ['bg-white border border-black/[0.06]', 'bg-[var(--surface)] border border-[var(--border)]'],
  ['bg-white border border-black/[0.08]', 'bg-[var(--surface)] border border-[var(--border)]'],
  ['hover:border-zinc-300', 'hover:border-[var(--border-strong)]'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
]);

// 3. CreatorProfileModal.tsx
replaceInFile('src/components/business/CreatorProfileModal.tsx', [
  ['bg-zinc-50 border border-zinc-200/80', 'bg-[var(--surface-muted)] border border-[var(--border)]'],
  ['bg-white shadow-xs border border-zinc-200', 'bg-[var(--surface)] border border-[var(--border)]'],
  ['bg-zinc-50 border border-zinc-200', 'bg-[var(--surface-muted)] border border-[var(--border)]'],
  ['bg-zinc-100 h-1.5', 'bg-[var(--surface-muted)] h-1.5'],
  ['border border-zinc-200', 'border border-[var(--border)]'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-600', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
]);

// 4. DirectMessagesView.tsx
replaceInFile('src/components/common/DirectMessagesView.tsx', [
  ['h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6.5rem)] rounded-2xl border border-black/[0.08] bg-white shadow-sm flex overflow-hidden shadow-2xl relative', 'h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6.5rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-2xl flex overflow-hidden relative'],
  ['w-full md:w-80 border-r border-black/[0.08] flex-col shrink-0 bg-[#DFE3E8]/60', 'w-full md:w-80 border-r border-[var(--border)] flex-col shrink-0 bg-[var(--surface-muted)]'],
  ['p-3.5 border-b border-black/[0.08]', 'p-3.5 border-b border-[var(--border)]'],
  ['bg-zinc-100 text-zinc-500 border border-black/[0.08]', 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'],
  ['bg-white border border-black/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-500', 'bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)]'],
  ['bg-white shadow-xs border-l-2 border-[#00B4D8]', 'bg-[var(--surface)] shadow-xs border-l-2 border-[#00B4D8]'],
  ['hover:bg-black/[0.03]', 'hover:bg-black/5 dark:hover:bg-white/5'],
  ['flex-1 flex-col min-w-0 bg-[#F8FAFC]', 'flex-1 flex-col min-w-0 bg-[var(--surface-elevated)]'],
  ['p-3 sm:p-3.5 border-b border-black/[0.08] flex items-center justify-between gap-3 bg-white/95 border-b border-black/[0.08] backdrop-blur-md', 'p-3 sm:p-3.5 border-b border-[var(--border)] flex items-center justify-between gap-3 bg-[var(--surface-elevated)]/95 backdrop-blur-md'],
  ['bg-white border border-black/[0.08] text-xs', 'bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)]'],
  ['absolute right-0 top-10 z-40 w-48 rounded-xl bg-white shadow-xl border border-zinc-200 shadow-2xl py-1 text-xs text-zinc-700 animate-slide-up backdrop-blur-xl', 'absolute right-0 top-10 z-40 w-48 rounded-xl bg-[var(--surface-elevated)] shadow-2xl border border-[var(--border)] py-1 text-xs text-[var(--text-primary)] animate-slide-up backdrop-blur-xl'],
  ['hover:bg-zinc-100 flex items-center', 'hover:bg-black/5 dark:hover:bg-white/5 flex items-center'],
  ['hidden group-hover:flex items-center gap-0.5 bg-white border border-zinc-200 rounded-lg px-1 py-0.5 shadow-xl z-20 backdrop-blur-md', 'hidden group-hover:flex items-center gap-0.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-1 py-0.5 shadow-xl z-20 backdrop-blur-md'],
  ['bg-white text-zinc-800 border border-zinc-200 rounded-bl-none shadow-sm', 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-none shadow-sm'],
  ['my-2 p-3.5 rounded-2xl bg-white text-zinc-900 border border-zinc-200/90', 'my-2 p-3.5 rounded-2xl bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)]'],
  ['bg-white border border-zinc-200 text-[11px]', 'bg-[var(--surface)] border border-[var(--border)] text-[11px]'],
  ['p-3 sm:p-3.5 border-t border-black/[0.08] bg-[#DFE3E8]/60 space-y-2 pb-safe', 'p-3 sm:p-3.5 border-t border-[var(--border)] bg-[var(--surface-muted)] space-y-2 pb-safe'],
  ['p-2.5 rounded-xl bg-white border border-[#00B4D8]/40 text-xs animate-slide-up', 'p-2.5 rounded-xl bg-[var(--surface)] border border-[#00B4D8]/40 text-xs animate-slide-up'],
  ['px-3 py-1.5 rounded-full bg-white hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-200 text-zinc-700', 'px-3 py-1.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-muted)] active:scale-95 border border-[var(--border)] text-[var(--text-primary)]'],
  ['bg-slate-50 border border-slate-200', 'bg-[var(--surface)] border border-[var(--border)]'],
  ['p-2 rounded-xl bg-white border border-zinc-200', 'p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]'],
  ['bg-white hover:bg-zinc-50 active:bg-zinc-100 border-black/[0.08] text-zinc-500 hover:text-zinc-800', 'bg-[var(--surface)] hover:bg-[var(--surface-muted)] active:scale-95 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'],
  ['bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#007E93]', 'bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#007E93]'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
]);

// 5. ShareProfileModal.tsx
replaceInFile('src/components/common/ShareProfileModal.tsx', [
  ['bg-white text-zinc-900 border border-black/[0.08] shadow-2xl overflow-hidden my-auto', 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto'],
  ['bg-zinc-50/70', 'bg-[var(--surface-muted)]'],
  ['bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700', 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'],
  ['p-4 rounded-2xl bg-zinc-50 border border-black/[0.08]', 'p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]'],
  ['border-black/[0.08]', 'border-[var(--border)]'],
  ['border-zinc-200', 'border-[var(--border)]'],
  ['bg-zinc-50', 'bg-[var(--surface-muted)]'],
  ['bg-white', 'bg-[var(--surface)]'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
]);

// 6. ConnectModal.tsx
replaceInFile('src/components/common/ConnectModal.tsx', [
  ['bg-white text-zinc-900 border border-black/[0.08] p-6 shadow-2xl text-zinc-900 space-y-5', 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] p-6 shadow-2xl space-y-5'],
  ['border-black/[0.08]', 'border-[var(--border)]'],
  ['border-black/[0.06]', 'border-[var(--border)]'],
  ['border-zinc-300', 'border-[var(--border)]'],
  ['border-zinc-200', 'border-[var(--border)]'],
  ['bg-zinc-50 hover:bg-zinc-100', 'bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)]'],
  ['bg-white', 'bg-[var(--surface)]'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
]);

// 7. BlogPostModal.tsx
replaceInFile('src/components/common/BlogPostModal.tsx', [
  ['bg-white text-zinc-900 border border-black/[0.08] shadow-2xl text-zinc-900 overflow-hidden my-auto max-h-[92vh] flex flex-col', 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col'],
  ['bg-white/95 backdrop-blur-md border-b border-black/[0.08]', 'bg-[var(--surface-elevated)]/95 backdrop-blur-md border-b border-[var(--border)]'],
  ['border-black/[0.08]', 'border-[var(--border)]'],
  ['border-zinc-200', 'border-[var(--border)]'],
  ['bg-zinc-50', 'bg-[var(--surface-muted)]'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
]);

// 8. ApproachCreatorModal.tsx
replaceInFile('src/components/business/ApproachCreatorModal.tsx', [
  ['bg-white text-zinc-900 border border-black/[0.08] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col', 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col'],
  ['bg-zinc-50/70', 'bg-[var(--surface-muted)]'],
  ['bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700', 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'],
  ['border-black/[0.08]', 'border-[var(--border)]'],
  ['border-black/[0.06]', 'border-[var(--border)]'],
  ['border-zinc-300', 'border-[var(--border)]'],
  ['border-zinc-200', 'border-[var(--border)]'],
  ['bg-zinc-50', 'bg-[var(--surface-muted)]'],
  ['bg-zinc-100 hover:bg-zinc-200 text-zinc-700', 'bg-[var(--surface-muted)] hover:bg-[var(--surface-recessed)] text-[var(--text-secondary)]'],
  ['bg-white text-zinc-900', 'bg-[var(--surface)] text-[var(--text-primary)]'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
  ['hover:bg-zinc-200 rounded-xl', 'hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] rounded-xl'],
]);

// 9. CreatorPassport.tsx
replaceInFile('src/components/creator/CreatorPassport.tsx', [
  ['bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-all cursor-pointer shadow-sm group', 'bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-xs font-semibold text-[var(--text-primary)] transition-all cursor-pointer shadow-sm group border border-[var(--border)]'],
  ['border border-black/[0.08]', 'border border-[var(--border)]'],
  ['border-b border-black/[0.08]', 'border-b border-[var(--border)]'],
  ['border-t border-black/[0.08]', 'border-t border-[var(--border)]'],
  ['relative rounded-3xl p-5 sm:p-7 overflow-hidden border border-[#D4DEE7] bg-gradient-to-br from-white via-[#F7FAFC] to-[#EAF5F6] shadow-[0_12px_32px_-18px_rgba(23,37,54,0.24),inset_0_1px_0_rgba(255,255,255,0.98)] backdrop-blur-2xl', 'relative rounded-3xl p-5 sm:p-7 overflow-hidden border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl text-[var(--text-primary)]'],
  ['bg-white/80 border border-zinc-200 rounded-2xl p-3 sm:px-4 sm:py-3 backdrop-blur-xl shrink-0', 'bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl p-3 sm:px-4 sm:py-3 backdrop-blur-xl shrink-0 text-[var(--text-primary)]'],
  ['border-zinc-200', 'border-[var(--border)]'],
  ['border-zinc-300', 'border-[var(--border)]'],
  ['bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200', 'bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]'],
  ['p-3 rounded-2xl bg-white/90 border border-emerald-200', 'p-3 rounded-2xl bg-[var(--surface)] border border-emerald-500/40'],
  ['text-zinc-900', 'text-[var(--text-primary)]'],
  ['text-zinc-800', 'text-[var(--text-primary)]'],
  ['text-zinc-700', 'text-[var(--text-secondary)]'],
  ['text-zinc-600', 'text-[var(--text-secondary)]'],
  ['text-zinc-500', 'text-[var(--text-muted)]'],
]);

console.log('=== Remedying Complete ===');
