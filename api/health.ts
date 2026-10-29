/**
 * Vercel Serverless Function: /api/health
 * Production health and uptime verification endpoint.
 */

export default function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  return res.status(200).json({
    ok: true,
    status: 'healthy',
    service: 'CreatorOS Production Engine',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    providers: {
      supabase: Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
      livekit: Boolean(process.env.LIVEKIT_API_KEY),
    },
  });
}
