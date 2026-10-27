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

export default defineConfig({
  plugins: [react(), liveKitDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname || '.', './src'),
    },
  },
});
