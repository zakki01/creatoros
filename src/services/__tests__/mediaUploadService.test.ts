import { describe, it, expect } from 'vitest';
import {
  sanitizeFileName,
  formatBytes,
  formatDuration,
  inspectFileMagicBytes,
  validateVideoFile,
  validateImageFile,
} from '../mediaUploadService';

describe('MediaUploadService', () => {
  describe('Path Traversal & Filename Sanitization', () => {
    it('strips dangerous path traversal attempts and directory separators', () => {
      expect(sanitizeFileName('../../etc/passwd')).toBe('passwd');
      expect(sanitizeFileName('..\\..\\windows\\system32\\cmd.exe')).toBe('cmd.exe');
      expect(sanitizeFileName('/var/www/uploads/exploit.php')).toBe('exploit.php');
    });

    it('strips null bytes and malicious characters', () => {
      expect(sanitizeFileName('lookbook\0.jpg')).toBe('lookbook.jpg');
      expect(sanitizeFileName('my file (1) [final].mp4')).toBe('my_file__1___final_.mp4');
    });

    it('prevents hidden files by stripping leading dots', () => {
      expect(sanitizeFileName('.env')).toBe('env');
      expect(sanitizeFileName('...secret.key')).toBe('secret.key');
    });

    it('provides a safe fallback name if filename is entirely stripped', () => {
      expect(sanitizeFileName('...')).toMatch(/^file_\d+/);
    });
  });

  describe('Formatting Utilities', () => {
    it('formats byte sizes cleanly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024 * 5)).toBe('5 MB');
      expect(formatBytes(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });

    it('formats duration in seconds to mm:ss format', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(45)).toBe('0:45');
      expect(formatDuration(75)).toBe('1:15');
      expect(formatDuration(600)).toBe('10:00');
    });
  });

  describe('Magic Bytes Inspection', () => {
    it('recognizes JPEG magic bytes (FF D8 FF)', async () => {
      const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const file = new File([jpegBytes], 'photo.jpg', { type: 'image/jpeg' });

      const result = await inspectFileMagicBytes(file);
      expect(result.detectedType).toBe('image/jpeg');
      expect(result.isAllowed).toBe(true);
    });

    it('recognizes PNG magic bytes (89 50 4E 47 0D 0A 1A 0A)', async () => {
      const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const file = new File([pngBytes], 'avatar.png', { type: 'image/png' });

      const result = await inspectFileMagicBytes(file);
      expect(result.detectedType).toBe('image/png');
      expect(result.isAllowed).toBe(true);
    });

    it('recognizes MP4 ftyp header', async () => {
      const mp4Bytes = new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]); // ....ftyp
      const file = new File([mp4Bytes], 'reel.mp4', { type: 'video/mp4' });

      const result = await inspectFileMagicBytes(file);
      expect(result.detectedType).toBe('video/mp4');
      expect(result.isAllowed).toBe(true);
    });

    it('recognizes WebM EBML header (1A 45 DF A3)', async () => {
      const webmBytes = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]);
      const file = new File([webmBytes], 'clip.webm', { type: 'video/webm' });

      const result = await inspectFileMagicBytes(file);
      expect(result.detectedType).toBe('video/webm');
      expect(result.isAllowed).toBe(true);
    });

    it('recognizes PDF header (%PDF)', async () => {
      const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
      const file = new File([pdfBytes], 'brief.pdf', { type: 'application/pdf' });

      const result = await inspectFileMagicBytes(file);
      expect(result.detectedType).toBe('application/pdf');
      expect(result.isAllowed).toBe(true);
    });

    it('explicitly rejects Windows Executables (MZ)', async () => {
      const exeBytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]);
      const file = new File([exeBytes], 'malware.jpg', { type: 'image/jpeg' });

      const result = await inspectFileMagicBytes(file);
      expect(result.isAllowed).toBe(false);
      expect(result.detectedType).toBe('application/x-msdownload');
    });
  });

  describe('File Validation Constraints', () => {
    it('rejects video exceeding 100MB size limit', async () => {
      // Mock File size property without allocating 110MB in memory
      const fakeVideo = new File([new Uint8Array(10)], 'huge.mp4', { type: 'video/mp4' });
      Object.defineProperty(fakeVideo, 'size', { value: 110 * 1024 * 1024 });

      const result = await validateVideoFile(fakeVideo);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('100MB limit');
    });

    it('rejects video with unauthorized extension', async () => {
      const file = new File([new Uint8Array(10)], 'test.avi', { type: 'video/avi' });
      const result = await validateVideoFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file extension');
    });

    it('rejects image exceeding 20MB limit', async () => {
      const fakeImage = new File([new Uint8Array(10)], 'huge.png', { type: 'image/png' });
      Object.defineProperty(fakeImage, 'size', { value: 25 * 1024 * 1024 });

      const result = await validateImageFile(fakeImage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('20MB limit');
    });

    it('rejects image with unauthorized extension', async () => {
      const file = new File([new Uint8Array(10)], 'graphic.bmp', { type: 'image/bmp' });
      const result = await validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported image format');
    });
  });
});
