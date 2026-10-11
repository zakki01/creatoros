/**
 * CREATOROS MEDIA & GIF CONFIGURATION
 * Centralized settings for direct messaging media uploads.
 */

export const MEDIA_CONFIG = {
  // Max GIF size in Megabytes (configurable)
  MAX_GIF_SIZE_MB: 25,

  // Allowed MIME types strictly for GIF upload
  ALLOWED_GIF_MIME_TYPES: ['image/gif'] as const,

  // Allowed file extensions
  ALLOWED_GIF_EXTENSIONS: ['.gif'] as const,

  // Standard max display dimensions in chat
  CHAT_DISPLAY: {
    MAX_WIDTH_DESKTOP: 380, // px
    MAX_HEIGHT_DESKTOP: 320, // px
    MAX_WIDTH_MOBILE_VW: 78, // % of viewport width
  },

  // User-facing friendly error messages (No technical stack traces)
  ERRORS: {
    INVALID_FILE: 'Select a GIF file.',
    INVALID_MIME: "This file isn't a valid GIF.",
    TOO_LARGE: 'GIF is too large.',
    UPLOAD_FAILED: 'Upload failed. Try again.',
    NETWORK: "Couldn't upload GIF. Check your connection.",
    UNAUTHORIZED: "You can't send media in this conversation.",
    SERVER: 'Something went wrong. Try again.',
  },
} as const;

export type AllowedGifMimeType = typeof MEDIA_CONFIG.ALLOWED_GIF_MIME_TYPES[number];
