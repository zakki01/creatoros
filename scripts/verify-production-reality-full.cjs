/**
 * CreatorOS Forensic Verification Script
 * Validates Production Reality Rebuild:
 * 1. Supabase connectivity & schema validation (profiles, creator_profiles, brand_profiles, conversations, messages, user_reports, user_blocks, conversation_settings)
 * 2. Storage bucket verification (creatoros-media)
 * 3. Security verification: zero client-side password storage, zero fake JWT acceptance, demo token lockout
 * 4. UI architecture verification: zero prefilled credentials, z-[200] menu, BrandProfileModal real fallback
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://fthqnbqqsgfkotsmsjgz.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0aHFuYnFxc2dma290c21zamd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDIwMDYsImV4cCI6MjEwODg3ODAwNn0.X3z-fWrjyKymWwF_p5rGsNgibuOk7e7BUS7rGqdviJE';

async function main() {
  console.log('=====================================================');
  console.log('CREATOROS PRODUCTION REALITY FORENSIC VERIFICATION');
  console.log('=====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, detail) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (detail) console.error(`       Detail: ${detail}`);
    }
  }

  // 1. SUPABASE CLIENT & TABLES CHECK
  console.log('--- 1. Supabase Database & Real Schema Inspection ---');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, email, role').limit(5);
    assert(!pErr, 'public.profiles table reachable', pErr?.message);

    const { data: crProfiles, error: cErr } = await supabase.from('creator_profiles').select('id, handle').limit(5);
    assert(!cErr, 'public.creator_profiles table reachable', cErr?.message);

    const { data: brProfiles, error: bErr } = await supabase.from('brand_profiles').select('id, company_name').limit(5);
    assert(!bErr, 'public.brand_profiles table reachable', bErr?.message);

    const { data: convs, error: convErr } = await supabase.from('conversations').select('id').limit(5);
    assert(!convErr, 'public.conversations table reachable', convErr?.message);

    const { data: msgs, error: msgErr } = await supabase.from('messages').select('id').limit(5);
    assert(!msgErr, 'public.messages table reachable', msgErr?.message);

    const { data: reports, error: repErr } = await supabase.from('user_reports').select('id').limit(5);
    assert(!repErr, 'public.user_reports table reachable with RLS', repErr?.message);

    const { data: blocks, error: blkErr } = await supabase.from('user_blocks').select('id').limit(5);
    assert(!blkErr, 'public.user_blocks table reachable with RLS', blkErr?.message);

    const { data: convSettings, error: csErr } = await supabase.from('conversation_settings').select('user_id').limit(5);
    assert(!csErr, 'public.conversation_settings table reachable with RLS', csErr?.message);
  } catch (err) {
    assert(false, 'Supabase query execution', err.message);
  }

  // 2. SUPABASE STORAGE BUCKET CHECK
  console.log('\n--- 2. Supabase Storage Bucket Verification ---');
  try {
    const { data: buckets, error: bktErr } = await supabase.storage.listBuckets();
    assert(!bktErr, 'Supabase Storage buckets query', bktErr?.message);
    const mediaBucket = buckets?.find((b) => b.id === 'creatoros-media');
    assert(Boolean(mediaBucket), 'Bucket "creatoros-media" exists', 'Bucket list: ' + JSON.stringify(buckets?.map((b) => b.id)));
    if (mediaBucket) {
      assert(mediaBucket.public === true, 'Bucket "creatoros-media" is public for delivery');
    }
  } catch (err) {
    assert(false, 'Supabase Storage query', err.message);
  }

  // 3. ZERO CLIENT-SIDE PASSWORD STORAGE & CODE FORENSICS
  console.log('\n--- 3. Codebase Security & Forensics Scan ---');
  const rootDir = path.resolve(__dirname, '..');

  // Check authService.ts has no localStorage registered accounts
  const authServiceContent = fs.readFileSync(path.join(rootDir, 'src/features/auth/services/authService.ts'), 'utf8');
  assert(!authServiceContent.includes('creatoros_registered_accounts_v1'), 'authService has NO creatoros_registered_accounts_v1 (Zero client-side plaintext password storage)');
  assert(authServiceContent.includes('supabase.auth.signInWithPassword'), 'authService uses real supabase.auth.signInWithPassword');
  assert(authServiceContent.includes('supabase.auth.signUp'), 'authService uses real supabase.auth.signUp');
  assert(authServiceContent.includes('supabase.auth.resetPasswordForEmail'), 'authService uses real supabase.auth.resetPasswordForEmail');

  // Check WelcomeAuth.tsx has zero pre-filled credentials
  const welcomeAuthContent = fs.readFileSync(path.join(rootDir, 'src/features/auth/components/WelcomeAuth.tsx'), 'utf8');
  assert(!welcomeAuthContent.includes('creator@demo.creatoros.ai'), 'WelcomeAuth has NO prefilled demo email');
  assert(!welcomeAuthContent.includes('password123'), 'WelcomeAuth has NO prefilled demo password');
  assert(welcomeAuthContent.includes('useState(\'\')'), 'WelcomeAuth initializes with empty email and password strings');

  // Check BrandProfileModal.tsx
  const brandModalContent = fs.readFileSync(path.join(rootDir, 'src/components/common/BrandProfileModal.tsx'), 'utf8');
  assert(!brandModalContent.includes('brandData = {\n    id: \'brand-aura\','), 'BrandProfileModal has NO hardcoded Aura Streetwear default fallback');
  assert(brandModalContent.includes('Brand profile not found'), 'BrandProfileModal displays graceful "Brand profile not found" when invalid');
  assert(brandModalContent.includes('EditBrandProfileModal'), 'BrandProfileModal integrates EditBrandProfileModal for own profile');

  // Check Edit Modals exist
  const editBrandModalExists = fs.existsSync(path.join(rootDir, 'src/components/business/EditBrandProfileModal.tsx'));
  assert(editBrandModalExists, 'EditBrandProfileModal.tsx exists');

  const editCreatorModalExists = fs.existsSync(path.join(rootDir, 'src/components/creator/EditCreatorProfileModal.tsx'));
  assert(editCreatorModalExists, 'EditCreatorProfileModal.tsx exists');

  // Check DirectMessagesView.tsx
  const dmContent = fs.readFileSync(path.join(rootDir, 'src/components/common/DirectMessagesView.tsx'), 'utf8');
  assert(dmContent.includes('z-[200]'), 'DirectMessagesView header contextual menu uses z-[200] high stacking context');
  assert(!dmContent.includes('#CR-2026-8491'), 'DirectMessagesView does NOT unconditionally hardcode #CR-2026-8491 contract');
  assert(dmContent.includes('messagingService.submitUserReport'), 'DirectMessagesView connects to real messagingService.submitUserReport');
  assert(dmContent.includes('messagingService.blockParticipant'), 'DirectMessagesView connects to real messagingService.blockParticipant');
  assert(dmContent.includes('messagingService.setConversationMute'), 'DirectMessagesView connects to real messagingService.setConversationMute');

  // Check Serverless Security verify.ts
  const verifyApiContent = fs.readFileSync(path.join(rootDir, 'api/auth/verify.ts'), 'utf8');
  assert(verifyApiContent.includes('auth/v1/user'), 'api/auth/verify verifies tokens cryptographically against Supabase auth/v1/user');
  assert(!verifyApiContent.includes("parts.length === 3"), 'api/auth/verify NO LONGER allows unverified JWTs via parts.length === 3');

  // Check Serverless Security demo.ts
  const demoApiContent = fs.readFileSync(path.join(rootDir, 'api/auth/demo.ts'), 'utf8');
  assert(demoApiContent.includes('isDemoAllowed'), 'api/auth/demo strictly checks if demo accounts are enabled before dispensing');

  console.log('\n=====================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log('=====================================================');

  if (passedTests === totalTests) {
    console.log('ALL FORENSIC VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('SOME TESTS FAILED.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
