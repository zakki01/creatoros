const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.scripts.test = "node scripts/verify-full-restoration.cjs && node scripts/verify-corrective-pass.cjs && node scripts/verify-profile-live-corrective.cjs && node scripts/verify-smart-implementation.cjs && node scripts/verify-forensic-pass.cjs && node scripts/verify-studio-theme-root-cause.cjs && node scripts/verify-live-2.0.cjs && node scripts/verify-theme-and-face-tracking.cjs && node scripts/verify-dark-modals-and-messages.cjs";

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('[SUCCESS] Updated package.json test script to include verify-dark-modals-and-messages.cjs');
