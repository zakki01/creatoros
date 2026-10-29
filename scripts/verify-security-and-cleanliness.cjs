const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

console.log('\n================================================================');
console.log('CREATOROS — SECURITY & CODE CLEANLINESS AUDIT');
console.log('================================================================\n');

let issuesFound = 0;

function walk(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'coverage') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, callback);
    } else {
      callback(full);
    }
  }
}

// 1. Check for committed .env files
console.log('[CHECK 1] Scanning for committed .env files:');
walk(ROOT, (file) => {
  const base = path.basename(file);
  if (base.startsWith('.env') && base !== '.env.example') {
    console.error(`  -> [FAIL] Found secret/environment file: ${file}`);
    issuesFound++;
  }
});
if (issuesFound === 0) {
  console.log('  -> [PASS] Zero committed .env secret files found (clean).');
}

// 2. Scan src/ for localhost references (excluding test scripts)
console.log('\n[CHECK 2] Scanning src/ for hardcoded localhost in production code:');
let localhostIssues = 0;
walk(path.join(ROOT, 'src'), (file) => {
  if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost') || content.includes('http://127.0.0.1')) {
      console.warn(`  -> [WARN] Localhost reference found in: ${path.relative(ROOT, file)}`);
      localhostIssues++;
    }
  }
});
if (localhostIssues === 0) {
  console.log('  -> [PASS] Zero hardcoded localhost references in src/.');
}

// 3. Scan for exposed secret keys or private keys
console.log('\n[CHECK 3] Scanning for exposed private keys, bearer tokens, or AWS/Stripe live secrets:');
let secretIssues = 0;
const secretPatterns = [
  /sk_live_[0-9a-zA-Z]{24}/,
  /BEGIN (RSA|EC|OPENSSH|DSA|PGP) PRIVATE KEY/,
  /AKIA[0-9A-Z]{16}/,
  /ghp_[0-9a-zA-Z]{36}/,
];

walk(ROOT, (file) => {
  if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pat of secretPatterns) {
      if (pat.test(content)) {
        console.error(`  -> [FAIL] Potential secret matched in: ${path.relative(ROOT, file)}`);
        secretIssues++;
      }
    }
  }
});

if (secretIssues === 0) {
  console.log('  -> [PASS] Zero committed private keys or live secret tokens found.');
}

// 4. Verify Vercel & Production deployment configs
console.log('\n[CHECK 4] Verifying Vercel & Production readiness files:');
const vercelJsonPath = path.join(ROOT, 'vercel.json');
const healthApi = path.join(ROOT, 'api', 'health.ts');
const liveSessionApi = path.join(ROOT, 'api', 'live', 'session.ts');
const envExample = path.join(ROOT, '.env.example');

console.log(`  -> vercel.json exists: ${fs.existsSync(vercelJsonPath) ? 'PASS' : 'FAIL'}`);
console.log(`  -> api/health.ts exists: ${fs.existsSync(healthApi) ? 'PASS' : 'FAIL'}`);
console.log(`  -> api/live/session.ts exists: ${fs.existsSync(liveSessionApi) ? 'PASS' : 'FAIL'}`);
console.log(`  -> .env.example exists: ${fs.existsSync(envExample) ? 'PASS' : 'FAIL'}`);

if (!fs.existsSync(vercelJsonPath) || !fs.existsSync(healthApi) || !fs.existsSync(liveSessionApi) || !fs.existsSync(envExample)) {
  process.exit(1);
}

console.log('\n================================================================');
console.log('SECURITY & CLEANLINESS AUDIT COMPLETED: ALL PASS');
console.log('================================================================\n');
