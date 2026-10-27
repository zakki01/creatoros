/**
 * Vercel Serverless Function: /api/live/session
 * 
 * Securely signs and generates authentic LiveKit AccessTokens for Creators and Viewers.
 * Secrets (LIVEKIT_API_KEY, LIVEKIT_API_SECRET) remain strictly on the server.
 */

import { AccessToken } from 'livekit-server-sdk';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const creatorId = body.creatorId || 'cr-anonymous';
    const creatorName = body.creatorName || 'Creator';
    const roomName = body.roomName || `creatoros-live-${creatorId}`;
    const role = body.role || 'host';

    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret_key_dev_mode_creatoros_2026';
    const wsUrl = process.env.LIVEKIT_URL || 'wss://live.creatoros.ai';

    const at = new AccessToken(apiKey, apiSecret, {
      identity: creatorId,
      name: creatorName,
    });

    const isHost = role === 'host';
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHost,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return res.status(200).json({
      success: true,
      token,
      wsUrl,
      roomName,
      identity: creatorId,
      role,
    });
  } catch (err: any) {
    console.error('Error in /api/live/session:', err);
    return res.status(500).json({
      error: 'Failed to generate LiveKit session token',
      details: err?.message || String(err),
    });
  }
}
