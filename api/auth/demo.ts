/**
 * Vercel Serverless Function: /api/auth/demo
 * 
 * Secure Server-Side Controlled Demo Account Token Dispenser.
 * Strictly disabled in production when VITE_ENABLE_DEMO !== 'true'.
 */

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Reject demo token generation in production
  const isDemoAllowed = process.env.VITE_ENABLE_DEMO === 'true' || process.env.ENABLE_DEMO === 'true';
  if (!isDemoAllowed) {
    return res.status(403).json({
      error: 'Demo accounts are strictly disabled in the production environment.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { role } = body;

    if (role !== 'creator' && role !== 'brand' && role !== 'business') {
      return res.status(400).json({
        error: 'Invalid demo request. CreatorOS permits exactly TWO controlled demo roles: creator or brand.',
      });
    }

    const isCreator = role === 'creator';
    const demoUser = isCreator
      ? {
          id: 'demo-creator-01',
          name: 'CreatorOS Demo Creator',
          email: 'demo.creator@creatoros.ai',
          role: 'creator',
          handle: '@democreator',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          is_demo: true,
          isDemo: true,
          account_type: 'demo',
          provider: 'demo',
          permissions: [
            'view_contracts',
            'sign_contracts',
            'upload_deliverables',
            'access_live_studio',
            'request_payouts',
          ],
        }
      : {
          id: 'demo-brand-01',
          name: 'CreatorOS Demo Brand',
          email: 'demo.brand@creatoros.ai',
          role: 'business',
          handle: '@demobrand',
          avatarUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
          is_demo: true,
          isDemo: true,
          account_type: 'demo',
          provider: 'demo',
          permissions: [
            'create_campaigns',
            'issue_contracts',
            'fund_escrow',
            'review_deliverables',
            'manage_team',
          ],
        };

    // Dispense an expirable token (valid for 2 hours)
    const tokenPayload = {
      sub: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7200,
    };

    const token = `cos_demo_${Buffer.from(JSON.stringify(tokenPayload)).toString('base64url')}`;

    return res.status(200).json({
      user: demoUser,
      token,
      mode: 'demo_sandbox',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to initialize demo session.' });
  }
}
