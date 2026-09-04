import { describe, it, expect } from 'vitest';
import { DEFAULT_DISPLAY_OPTIONS, SUPPORTED_LANGUAGES } from '../src/types';

describe('types and defaults', () => {
  it('defines correct default display options', () => {
    expect(DEFAULT_DISPLAY_OPTIONS).toEqual({
      show_forecast: true,
      show_elevation: true,
      show_mountain_graphic: true,
      compact_mode: false,
    });
  });

  it('defines supported languages', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['en', 'nl', 'de', 'it', 'fr', 'es']);
  });
});
