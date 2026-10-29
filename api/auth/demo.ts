/**
 * Vercel Serverless Function: /api/auth/demo
 * 
 * Secure Server-Side Controlled Demo Account Token Dispenser.
 * Strictly dispenses sessions ONLY for the TWO authorized demo identities:
 * 1. demo.creator@creatoros.ai (CreatorOS Demo Creator)
 * 2. demo.brand@creatoros.ai   (CreatorOS Demo Brand)
 * 
 * Never hardcodes secrets in client bundles. Enforces server-side validation.
 */

export default async function handler(req: any, res: any) {
  // Set CORS and security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
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
            'deposit_escrow',
            'approve_deliverables',
            'invite_creators',
          ],
        };

    const serverSessionToken = `cos_demo_${Buffer.from(
      JSON.stringify({
        sub: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        is_demo: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400, // 24-hour expiration
      })
    ).toString('base64url')}`;

    return res.status(200).json({
      success: true,
      user: demoUser,
      token: serverSessionToken,
      expiresAt: Date.now() + 86400000,
      authorizationMode: 'server_controlled_sandbox',
    });
  } catch (err: any) {
    console.error('Error in /api/auth/demo:', err);
    return res.status(500).json({
      error: 'Failed to process demo authorization request',
      details: err?.message || String(err),
    });
  }
}
