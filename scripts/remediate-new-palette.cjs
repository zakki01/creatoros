const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '..', 'src')
];

const patterns = [
  // Class variants with opacity or borders
  { regex: /\[#00B4D8\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#00b4d8\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#007E93\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#007e93\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#00869B\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#00869b\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#078FA5\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#0798AF\]/gi, replace: '[var(--primary)]' },
  { regex: /\[#006C80\]/gi, replace: '[var(--primary-hover)]' },
  { regex: /\[#006779\]/gi, replace: '[var(--primary-hover)]' },
  { regex: /\[#0096B4\]/gi, replace: '[var(--primary-hover)]' },

  { regex: /\[#EDF0F4\]/gi, replace: '[var(--background)]' },
  { regex: /\[#edf0f4\]/gi, replace: '[var(--background)]' },
  { regex: /\[#0B0D11\]/gi, replace: '[var(--background)]' },
  { regex: /\[#0b0d11\]/gi, replace: '[var(--background)]' },
  { regex: /\[#0B0E14\]/gi, replace: '[var(--background)]' },
  { regex: /\[#0b0e14\]/gi, replace: '[var(--background)]' },

  // String literals in TS/JS
  { regex: /'#00B4D8'/gi, replace: "'var(--primary)'" },
  { regex: /"#00B4D8"/gi, replace: '"var(--primary)"' },
  { regex: /'#007E93'/gi, replace: "'var(--primary)'" },
  { regex: /"#007E93"/gi, replace: '"var(--primary)"' },
  { regex: /'#00869B'/gi, replace: "'var(--primary)'" },
  { regex: /"#00869B"/gi, replace: '"var(--primary)"' },
  { regex: /'#006C80'/gi, replace: "'var(--primary-hover)'" },
  { regex: /"#006C80"/gi, replace: '"var(--primary-hover)"' },

  { regex: /'#EDF0F4'/gi, replace: "'#F0F0F0'" },
  { regex: /"#EDF0F4"/gi, replace: '"#F0F0F0"' },
  { regex: /'#0B0D11'/gi, replace: "'#02070A'" },
  { regex: /"#0B0D11"/gi, replace: '"#02070A"' },
  { regex: /'#0B0E14'/gi, replace: "'#02070A'" },
  { regex: /"#0B0E14"/gi, replace: '"#02070A"' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Do not rewrite tokens.ts or theme.css which were already customized
  if (filePath.endsWith('theme.css') || filePath.endsWith('tokens.ts')) {
    return 0;
  }

  for (const { regex, replace } of patterns) {
    content = content.replace(regex, replace);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return 1;
  }
  return 0;
}

function walk(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        count += walk(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css'))) {
      count += processFile(fullPath);
    }
  }
  return count;
}

let modified = 0;
for (const dir of targetDirs) {
  modified += walk(dir);
}

console.log(`✅ Successfully updated ${modified} files with new palette tokens.`);
