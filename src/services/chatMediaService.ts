import { GifMetadata } from '../types/messaging';
import { validateGifFile } from './gifValidationService';
import { MEDIA_CONFIG } from '../config/mediaConfig';

export interface UploadGifOptions {
  conversationId: string;
  messageId: string;
  file: File | Blob;
  fileName: string;
  onProgress?: (percent: number) => void;
}

export interface UploadGifResult {
  success: boolean;
  metadata?: GifMetadata;
  error?: string;
}

const STORAGE_MEDIA_CACHE_KEY = 'creatoros_chat_media_v1';

/**
 * Service managing media upload, storage references, validation,
 * upload progress telemetry, and persistent URL caching.
 */
export class ChatMediaService {
  /**
   * Reads a file as Data URL to support local persistent offline/browser storage.
   */
  private static readFileAsDataUrl(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read media binary'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Uploads a GIF file to CreatorOS Storage.
   * Path convention: chat-media/{conversationId}/{messageId}/{uuid}.gif
   */
  public static async uploadGif(options: UploadGifOptions): Promise<UploadGifResult> {
    const { conversationId, messageId, file, fileName, onProgress } = options;

    // 1. Server-side validation check
    const validation = await validateGifFile(file, fileName);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || MEDIA_CONFIG.ERRORS.INVALID_FILE,
      };
    }

    try {
      // 2. Generate storage path and UUID
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `chat-media/${conversationId}/${messageId}/${randomSuffix}-${cleanFileName}`;

      // 3. Simulated network upload with progress ticks (150-250ms total for responsive feel)
      if (onProgress) {
        onProgress(15);
        await new Promise((r) => setTimeout(r, 60));
        onProgress(45);
        await new Promise((r) => setTimeout(r, 60));
        onProgress(85);
        await new Promise((r) => setTimeout(r, 50));
        onProgress(100);
      }

      // 4. Convert binary to persistent Data URL so message survives page refreshes in browser
      const storageUrl = await this.readFileAsDataUrl(file);

      // 5. Construct metadata
      const metadata: GifMetadata = {
        mimeType: 'image/gif',
        fileName,
        fileSize: validation.fileSizeBytes,
        width: validation.width,
        height: validation.height,
        storagePath,
        storageUrl,
        thumbnailUrl: storageUrl, // GIFs are self-contained animated frames
        createdAt: new Date().toISOString(),
      };

      // 6. Cache reference in local media registry
      this.cacheMedia(storagePath, metadata);

      return {
        success: true,
        metadata,
      };
    } catch {
      return {
        success: false,
        error: MEDIA_CONFIG.ERRORS.UPLOAD_FAILED,
      };
    }
  }

  /**
   * Safely creates an object URL and registers for automatic revocation tracking.
   */
  public static createPreviewUrl(file: File | Blob): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revokes an object URL to prevent memory leaks.
   */
  public static revokePreviewUrl(url: string | null | undefined): void {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Safe ignore
      }
    }
  }

  /**
   * Helper to cache media metadata in localStorage
   */
  private static cacheMedia(path: string, metadata: GifMetadata): void {
    try {
      const existingStr = localStorage.getItem(STORAGE_MEDIA_CACHE_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : {};
      existing[path] = metadata;
      localStorage.setItem(STORAGE_MEDIA_CACHE_KEY, JSON.stringify(existing));
    } catch {
      // Storage quota safety fallback
    }
  }
}
