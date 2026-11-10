import { describe, it, expect } from 'vitest';
import { lightTokens, darkTokens } from '../tokens';

describe('Design Tokens & Palette Consistency', () => {
  describe('CreatorOS Light Theme Palette Specification', () => {
    it('enforces exact brand foundation tokens for Light Studio mode', () => {
      expect(lightTokens.colors.background).toBe('#F0F0F0');
      expect(lightTokens.colors.primary).toBe('#105BFF');
      expect(lightTokens.colors.brandPrimary).toBe('#105BFF');
      expect(lightTokens.colors.accent).toBe('#FF77BC');
      expect(lightTokens.colors.brandAccent).toBe('#FF77BC');
    });

    it('provides clean high-contrast text and border tokens for light mode', () => {
      expect(lightTokens.colors.textPrimary).toBe('#0A0F1D');
      expect(lightTokens.colors.surface).toBe('#FFFFFF');
      expect(lightTokens.colors.border).toBe('#D8D8DC');
    });
  });

  describe('CreatorOS Dark Theme Palette Specification', () => {
    it('enforces true deep dark palette tokens for Dark mode', () => {
      expect(darkTokens.colors.background).toBe('#02070A');
      expect(darkTokens.colors.primary).toBe('#0297DE');
      expect(darkTokens.colors.brandPrimary).toBe('#0297DE');
      expect(darkTokens.colors.accent).toBe('#FC734D');
      expect(darkTokens.colors.brandAccent).toBe('#FC734D');
    });

    it('ensures dark mode surface hierarchy uses deep navy-black tones rather than white', () => {
      expect(darkTokens.colors.sidebar).toBe('#050D13');
      expect(darkTokens.colors.surface).toBe('#08121A');
      expect(darkTokens.colors.surfaceElevated).toBe('#0E1C27');
      expect(darkTokens.colors.surfaceSubtle).toBe('#101F2B');
      expect(darkTokens.colors.surfaceRecessed).toBe('#040A0F');
      expect(darkTokens.colors.surfaceInput).toBe('#060E14');
    });
  });

  describe('Token Parity Between Themes', () => {
    it('maintains symmetrical color key structures across light and dark tokens', () => {
      const lightKeys = Object.keys(lightTokens.colors);
      const darkKeys = Object.keys(darkTokens.colors);

      // Verify core keys exist in both themes
      const coreKeys = [
        'background',
        'surface',
        'surfaceElevated',
        'primary',
        'primaryHover',
        'accent',
        'textPrimary',
        'border',
      ];

      coreKeys.forEach((key) => {
        expect(lightKeys).toContain(key);
        expect(darkKeys).toContain(key);
      });
    });
  });
});
