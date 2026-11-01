const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://fthqnbqqsgfkotsmsjgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0aHFuYnFxc2dma290c21zamd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDIwMDYsImV4cCI6MjEwODg3ODAwNn0.X3z-fWrjyKymWwF_p5rGsNgibuOk7e7BUS7rGqdviJE';

async function testSupabaseAuth() {
  console.log('Testing Supabase Client & Auth Service...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. Test getSession
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error('getSession error: ' + sessionError.message);
  }
  console.log(' Supabase getSession executed successfully. Active session:', sessionData.session ? 'Yes' : 'No');

  // 2. Test invalid login returns real error
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'nonexistent-user-test-999@creatoros.ai',
    password: 'WrongPassword123!',
  });
  if (!loginError) {
    throw new Error('Expected invalid credentials error, but got success!');
  }
  console.log(' Real authentication error returned for invalid credentials:', loginError.message);

  console.log(' Task 1 Supabase Auth test passed!');
}

testSupabaseAuth().catch((err) => {
  console.error(' Test failed:', err);
  process.exit(1);
});
