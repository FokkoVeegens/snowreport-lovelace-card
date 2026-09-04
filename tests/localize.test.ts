import { describe, it, expect } from 'vitest';
import defaultLocalize, { localize, SUPPORTED_LANGUAGES } from '../src/localize/localize';

describe('localize', () => {
  it('exports default function identical to named export', () => {
    expect(defaultLocalize).toBe(localize);
  });
  it('returns translation for valid key and default language (en)', () => {
    expect(localize('snow_conditions')).toBe('snow conditions');
    expect(localize('last_snowfall')).toBe('Last snowfall');
  });

  it('returns translation for explicit language', () => {
    expect(localize('snow_conditions', 'nl')).toBe('sneeuwcondities');
    expect(localize('last_snowfall', 'nl')).toBe('Laatste sneeuwval');
    expect(localize('last_snowfall', 'de')).toBe('Letzter Schneefall');
    expect(localize('last_snowfall', 'it')).toBe('Ultima nevicata');
    expect(localize('last_snowfall', 'fr')).toBe('Dernière chute de neige');
    expect(localize('last_snowfall', 'es')).toBe('Última nevada');
  });

  it('falls back to English when given unsupported language', () => {
    expect(localize('snow_conditions', 'unknown_lang')).toBe('snow conditions');
  });

  it('replaces placeholders with positional parameters when {0} is used', () => {
    expect(localize('days_ago', 'en')).toBe('{n} days ago');
  });

  it('returns the key itself if translation is missing in both target lang and English fallback', () => {
    expect(localize('non_existent_key_12345')).toBe('non_existent_key_12345');
    expect(localize('non_existent_key_12345', 'nl')).toBe('non_existent_key_12345');
  });

  it('exports all supported languages', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['en', 'nl', 'de', 'it', 'fr', 'es']);
  });
});
