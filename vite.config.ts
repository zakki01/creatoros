import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { AccessToken } from 'livekit-server-sdk';

function liveKitDevPlugin(): Plugin {
  return {
    name: 'livekit-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/live/session', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        let bodyRaw = '';
        req.on('data', (chunk) => {
          bodyRaw += chunk;
        });
        req.on('end', async () => {
          try {
            const body = bodyRaw ? JSON.parse(bodyRaw) : {};
            const creatorId = body.creatorId || 'cr-dev-01';
            const creatorName = body.creatorName || 'Dev Creator';
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
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                token,
                wsUrl,
                roomName,
                identity: creatorId,
                role,
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Server error' }));
          }
        });
      });
    },
  };
}

function authDevPlugin(): Plugin {
  return {
    name: 'auth-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/auth/demo', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          return res.end();
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
        }
        let bodyRaw = '';
        req.on('data', (chunk) => { bodyRaw += chunk; });
        req.on('end', () => {
          try {
            const body = bodyRaw ? JSON.parse(bodyRaw) : {};
            const { role } = body;
            if (role !== 'creator' && role !== 'brand' && role !== 'business') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Invalid demo request. Role must be creator or brand/business.' }));
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
                };
            const payload = {
              sub: demoUser.id,
              name: demoUser.name,
              email: demoUser.email,
              role: demoUser.role,
              exp: Math.floor(Date.now() / 1000) + 86400,
            };
            const token = 'cos_demo_' + Buffer.from(JSON.stringify(payload)).toString('base64url');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, token, user: demoUser }));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e?.message || 'Server error' }));
          }
        });
      });

      server.middlewares.use('/api/auth/verify', async (req, res) => {
        if (req.method === 'OPTIONS') {
          return res.end();
        }
        const authHeader = req.headers['authorization'] || '';
        if (!authHeader.startsWith('Bearer ')) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ authorized: false, error: 'Unauthorized' }));
        }
        const token = authHeader.replace('Bearer ', '').trim();
        if (token.startsWith('cos_demo_')) {
          try {
            const payload = JSON.parse(Buffer.from(token.replace('cos_demo_', ''), 'base64url').toString('utf8'));
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ authorized: true, user: payload }));
          } catch {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ authorized: false, error: 'Invalid token' }));
          }
        }
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ authorized: false, error: 'Unknown token format' }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), liveKitDevPlugin(), authDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname || '.', './src'),
    },
  },
});
