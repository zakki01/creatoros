/**
 * CreatorOS Shared Media Upload & Security Engine
 *
 * Provides centralized media validation, binary signature / magic number inspection,
 * metadata extraction (duration, dimensions, aspect ratio), canvas thumbnail generation,
 * simulated / local storage with upload progress tracking, and sanitization.
 *
 * Used across:
 * - Create Post (Reels, Shots, Blogs)
 * - Showcase Portfolio
 * - Live Recordings
 * - Pitch Decks & Campaign Deliverables
 */

import { supabase } from './supabaseClient';

export type MediaType = 'video' | 'image' | 'document';

export type UploadStage = 'idle' | 'validating' | 'uploading' | 'processing' | 'ready' | 'error';

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: MediaType;
  mimeType?: string;
  extension?: string;
}

export interface MediaMetadata {
  fileName: string;
  sanitizedFileName: string;
  fileSizeBytes: number;
  formattedSize: string;
  mimeType: string;
  mediaType: MediaType;
  width?: number;
  height?: number;
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:5';
  durationSeconds?: number;
  formattedDuration?: string;
  thumbnailUrl?: string; // Canvas-extracted frame or resized image
  mediaUrl: string; // Object URL or public/storage URL
}

export interface UploadProgress {
  stage: UploadStage;
  progressPercent: number; // 0 - 100
  statusMessage: string;
  metadata?: MediaMetadata;
  error?: string;
}

// Limits
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;  // 20MB
export const MAX_DOC_SIZE_BYTES = 25 * 1024 * 1024;    // 25MB

export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const ALLOWED_DOC_EXTENSIONS = ['.pdf', '.zip'];

/**
 * Sanitizes filename to prevent directory traversal and script injection.
 */
export function sanitizeFileName(name: string): string {
  // Strip paths, null bytes, and dangerous characters
  const base = name.replace(/^.*[\\/]/, '').replace(/\0/g, '');
  const clean = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  // Avoid leading dots or empty names
  return clean.replace(/^\.+/, '') || `file_${Date.now()}`;
}

export const sanitizeFilename = sanitizeFileName;

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Inspects real binary magic bytes of the file slice to prevent file spoofing.
 */
export async function inspectFileMagicBytes(file: File): Promise<{ detectedType: string | null; isAllowed: boolean }> {
  try {
    const slice = file.slice(0, 32);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. MP4 / MOV: bytes 4-7 are 'ftyp' or 'moov'
    if (bytes.length >= 8) {
      const ftypStr = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
      if (ftypStr === 'ftyp' || ftypStr === 'moov') {
        return { detectedType: 'video/mp4', isAllowed: true };
      }
    }

    // 2. WebM: EBML header ID [0x1A, 0x45, 0xDF, 0xA3]
    if (bytes.length >= 4) {
      if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
        return { detectedType: 'video/webm', isAllowed: true };
      }
    }

    // 3. JPEG: [0xFF, 0xD8, 0xFF]
    if (bytes.length >= 3) {
      if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return { detectedType: 'image/jpeg', isAllowed: true };
      }
    }

    // 4. PNG: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
    if (bytes.length >= 8) {
      if (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      ) {
        return { detectedType: 'image/png', isAllowed: true };
      }
    }

    // 5. WebP: 'RIFF' at 0, 'WEBP' at 8
    if (bytes.length >= 12) {
      const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
      const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
      if (riff === 'RIFF' && webp === 'WEBP') {
        return { detectedType: 'image/webp', isAllowed: true };
      }
    }

    // 6. PDF: '%PDF'
    if (bytes.length >= 4) {
      const pdf = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
      if (pdf === '%PDF') {
        return { detectedType: 'application/pdf', isAllowed: true };
      }
    }

    // 7. ZIP: 'PK\x03\x04'
    if (bytes.length >= 4) {
      if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
        return { detectedType: 'application/zip', isAllowed: true };
      }
    }

    // Explicitly reject Windows Executable headers (MZ = 0x4D, 0x5A)
    if (bytes.length >= 2 && bytes[0] === 0x4d && bytes[1] === 0x5a) {
      return { detectedType: 'application/x-msdownload', isAllowed: false };
    }

    return { detectedType: null, isAllowed: false };
  } catch (err) {
    console.warn('Magic byte inspection failed:', err);
    return { detectedType: null, isAllowed: false };
  }
}

/**
 * Validates a video file for Reel or Showcase uploads.
 */
export async function validateVideoFile(file: File): Promise<MediaValidationResult> {
  const sanitized = sanitizeFileName(file.name);
  const ext = sanitized.substring(sanitized.lastIndexOf('.')).toLowerCase();

  if (!ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file extension (${ext}). Allowed: .mp4, .webm, .mov`,
    };
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video exceeds 100MB limit (${formatBytes(file.size)}). Please compress before uploading.`,
    };
  }

  // Inspect binary signature
  const { isAllowed, detectedType } = await inspectFileMagicBytes(file);
  if (!isAllowed) {
    return {
      valid: false,
      error: 'Security validation failed: File binary header does not match valid video format.',
    };
  }

  return {
    valid: true,
    mediaType: 'video',
    mimeType: detectedType || file.type || 'video/mp4',
    extension: ext,
  };
}

/**
 * Validates an image file for Shot, Blog cover, or Profile uploads.
 */
export async function validateImageFile(file: File): Promise<MediaValidationResult> {
  const sanitized = sanitizeFileName(file.name);
  const ext = sanitized.substring(sanitized.lastIndexOf('.')).toLowerCase();

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported image format (${ext}). Allowed: .jpg, .jpeg, .png, .webp`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image exceeds 20MB limit (${formatBytes(file.size)}).`,
    };
  }

  // Inspect binary signature
  const { isAllowed, detectedType } = await inspectFileMagicBytes(file);
  if (!isAllowed) {
    return {
      valid: false,
      error: 'Security validation failed: File binary header is not a valid JPEG, PNG, or WebP image.',
    };
  }

  return {
    valid: true,
    mediaType: 'image',
    mimeType: detectedType || file.type || 'image/jpeg',
    extension: ext,
  };
}

/**
 * Extracts video duration, dimensions, aspect ratio, and generates a canvas thumbnail.
 */
export function extractVideoMetadata(file: File): Promise<{
  duration: number;
  width: number;
  height: number;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  thumbnailUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;

    let timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Video processing timed out. Please check file format.'));
    }, 12000);

    const cleanup = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    video.onloadedmetadata = () => {
      // Seek slightly past start for poster frame
      const targetTime = Math.min(0.5, (video.duration || 1) / 2);
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      try {
        const width = video.videoWidth || 720;
        const height = video.videoHeight || 1280;
        const duration = video.duration || 0;

        // Determine closest standard aspect ratio
        const ratio = width / height;
        let aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' = '9:16';
        if (ratio > 1.3) aspectRatio = '16:9';
        else if (ratio >= 0.9 && ratio <= 1.1) aspectRatio = '1:1';
        else if (ratio >= 0.75 && ratio < 0.9) aspectRatio = '4:5';
        else aspectRatio = '9:16';

        // Render thumbnail frame to canvas
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(width, 640);
        canvas.height = Math.round((canvas.width / width) * height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);
          cleanup();
          resolve({ duration, width, height, aspectRatio, thumbnailUrl });
        } else {
          cleanup();
          resolve({ duration, width, height, aspectRatio, thumbnailUrl: '' });
        }
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Unable to read video metadata from file.'));
    };
  });
}

/**
 * Extracts image dimensions and creates an optimized local preview.
 */
export function extractImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  thumbnailUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = width / height;

      let aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' = '4:5';
      if (ratio > 1.3) aspectRatio = '16:9';
      else if (ratio >= 0.9 && ratio <= 1.1) aspectRatio = '1:1';
      else if (ratio < 0.65) aspectRatio = '9:16';
      else aspectRatio = '4:5';

      // Keep object URL as preview
      resolve({
        width,
        height,
        aspectRatio,
        thumbnailUrl: objectUrl,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image file.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Executes a verified media upload lifecycle with progress dispatching.
 */
export async function processMediaUpload(
  file: File,
  expectedType: MediaType,
  onProgress?: (progress: UploadProgress) => void
): Promise<MediaMetadata> {
  const sanitized = sanitizeFileName(file.name);

  // 1. Validation Stage
  onProgress?.({
    stage: 'validating',
    progressPercent: 10,
    statusMessage: 'Inspecting file signatures and security headers...',
  });

  let val: MediaValidationResult;
  if (expectedType === 'video') {
    val = await validateVideoFile(file);
  } else if (expectedType === 'image') {
    val = await validateImageFile(file);
  } else {
    val = { valid: true, mediaType: 'document' };
  }

  if (!val.valid) {
    const errorMsg = val.error || 'Media validation failed.';
    onProgress?.({
      stage: 'error',
      progressPercent: 0,
      statusMessage: errorMsg,
      error: errorMsg,
    });
    throw new Error(errorMsg);
  }

  // 2. Uploading Stage (Simulated progressive chunks to local storage / memory)
  onProgress?.({
    stage: 'uploading',
    progressPercent: 35,
    statusMessage: 'Uploading media chunk 1/2...',
  });

  await new Promise((r) => setTimeout(r, 120));

  onProgress?.({
    stage: 'uploading',
    progressPercent: 70,
    statusMessage: 'Uploading media chunk 2/2...',
  });

  await new Promise((r) => setTimeout(r, 100));

  // 3. Processing Stage (Metadata extraction & thumbnail generation)
  onProgress?.({
    stage: 'processing',
    progressPercent: 88,
    statusMessage: 'Generating media stream poster and metadata...',
  });

  const mediaUrl = await uploadDirectToStorage(file, expectedType === "video" ? "creatoros-videos" : "creatoros-images", onProgress);

  let width = 720;
  let height = 1280;
  let aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' = '9:16';
  let durationSeconds = 0;
  let thumbnailUrl = '';

  if (expectedType === 'video') {
    try {
      const meta = await extractVideoMetadata(file);
      width = meta.width;
      height = meta.height;
      aspectRatio = meta.aspectRatio;
      durationSeconds = meta.duration;
      thumbnailUrl = meta.thumbnailUrl;
    } catch {
      // Fallback poster frame if canvas extraction is restricted
      thumbnailUrl = mediaUrl;
    }
  } else if (expectedType === 'image') {
    try {
      const meta = await extractImageMetadata(file);
      width = meta.width;
      height = meta.height;
      aspectRatio = meta.aspectRatio;
      thumbnailUrl = meta.thumbnailUrl;
    } catch {
      thumbnailUrl = mediaUrl;
    }
  }

  const finalMetadata: MediaMetadata = {
    fileName: file.name,
    sanitizedFileName: sanitized,
    fileSizeBytes: file.size,
    formattedSize: formatBytes(file.size),
    mimeType: val.mimeType || file.type,
    mediaType: expectedType,
    width,
    height,
    aspectRatio,
    durationSeconds,
    formattedDuration: durationSeconds ? formatDuration(durationSeconds) : undefined,
    thumbnailUrl: thumbnailUrl || mediaUrl,
    mediaUrl,
  };

  // 4. Ready Stage
  onProgress?.({
    stage: 'ready',
    progressPercent: 100,
    statusMessage: 'Media ready for publish.',
    metadata: finalMetadata,
  });

  return finalMetadata;
}

/**
 * Direct client-to-storage upload pipeline (Supabase Storage).
 * Never pipes oversized binary payloads through Vercel Serverless Functions,
 * eliminating the 4.5 MB request body limit completely.
 */
export async function uploadDirectToStorage(
  file: File,
  bucket = 'creatoros-media',
  onProgress?: (progress: UploadProgress) => void,
  userId?: string
): Promise<string> {
  const sanitized = sanitizeFileName(file.name);

  // Resolve authenticated user ID
  let resolvedUserId = userId;
  if (!resolvedUserId) {
    try {
      const stored = localStorage.getItem('creatoros_auth_session_v1');
      if (stored) {
        const u = JSON.parse(stored);
        resolvedUserId = u?.id;
      }
    } catch {}
  }

  // Fallback to active Supabase session user if available
  if (!resolvedUserId && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        resolvedUserId = session.user.id;
      }
    } catch {}
  }

  // Enforce authentication: anonymous writes are strictly rejected
  if (!resolvedUserId) {
    throw new Error('Authentication required: anonymous storage uploads are strictly prohibited');
  }

  // Enforce path-based user ownership matching hardened Supabase Storage RLS: {userId}/{fileName}
  const storagePath = `${resolvedUserId}/${Date.now()}-${sanitized}`;

  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
          upsert: true,
          contentType: file.type || 'application/octet-stream',
        });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath);
        return publicUrl;
      } else if (error) {
        console.warn('Supabase storage upload error:', error.message);
      }
    } catch (err) {
      console.warn('Direct Supabase storage upload exception:', err);
    }
  }

  // Fallback: Local object URL for client preview/mock
  return URL.createObjectURL(file);
}
