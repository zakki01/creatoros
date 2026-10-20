import { MEDIA_CONFIG } from '../config/mediaConfig';

export interface GifValidationResult {
  isValid: boolean;
  error?: string;
  width?: number;
  height?: number;
  fileSizeBytes: number;
  fileName: string;
}

/**
 * Validates a GIF file using client and binary inspection rules:
 * 1. File extension (.gif)
 * 2. MIME type (image/gif)
 * 3. File size limit (MAX_GIF_SIZE_MB)
 * 4. Magic bytes header inspection (GIF87a or GIF89a)
 * 5. Extracts native dimensions from Logical Screen Descriptor
 */
export async function validateGifFile(file: File | Blob, rawFileName?: string): Promise<GifValidationResult> {
  const fileName = rawFileName || (file instanceof File ? file.name : 'upload.gif');
  const fileSizeBytes = file.size;

  // 1. File Extension Validation
  const hasGifExtension = fileName.toLowerCase().endsWith('.gif');
  if (!hasGifExtension) {
    return {
      isValid: false,
      error: MEDIA_CONFIG.ERRORS.INVALID_FILE,
      fileSizeBytes,
      fileName,
    };
  }

  // 2. MIME Type Validation
  if (file.type && file.type !== 'image/gif') {
    return {
      isValid: false,
      error: MEDIA_CONFIG.ERRORS.INVALID_MIME,
      fileSizeBytes,
      fileName,
    };
  }

  // 3. File Size Validation
  const maxBytes = MEDIA_CONFIG.MAX_GIF_SIZE_MB * 1024 * 1024;
  if (fileSizeBytes > maxBytes) {
    return {
      isValid: false,
      error: MEDIA_CONFIG.ERRORS.TOO_LARGE,
      fileSizeBytes,
      fileName,
    };
  }

  if (fileSizeBytes < 14) {
    // A valid GIF header + screen descriptor requires at least 13-14 bytes
    return {
      isValid: false,
      error: MEDIA_CONFIG.ERRORS.INVALID_MIME,
      fileSizeBytes,
      fileName,
    };
  }

  // 4. Magic Bytes & Header Inspection
  try {
    const slice = file.slice(0, 16);
    const arrayBuffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Read first 6 bytes as ASCII string
    let header = '';
    for (let i = 0; i < 6; i++) {
      header += String.fromCharCode(bytes[i]);
    }

    if (header !== 'GIF87a' && header !== 'GIF89a') {
      return {
        isValid: false,
        error: MEDIA_CONFIG.ERRORS.INVALID_MIME,
        fileSizeBytes,
        fileName,
      };
    }

    // Extract Logical Screen Width & Height (Bytes 6-7 and 8-9, little-endian)
    const width = bytes[6] | (bytes[7] << 8);
    const height = bytes[8] | (bytes[9] << 8);

    return {
      isValid: true,
      width: width > 0 ? width : undefined,
      height: height > 0 ? height : undefined,
      fileSizeBytes,
      fileName,
    };
  } catch {
    return {
      isValid: false,
      error: MEDIA_CONFIG.ERRORS.SERVER,
      fileSizeBytes,
      fileName,
    };
  }
}

export function formatGifFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

