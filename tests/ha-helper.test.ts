import { describe, it, expect } from 'vitest';
import defaultHaHelper, {
  getEntityValue,
  getEntityLastUpdated,
  formatSnowDepth,
  formatElevation,
} from '../src/utils/ha-helper';

describe('ha-helper utils', () => {
  it('exports default helper object containing utility functions', () => {
    expect(defaultHaHelper.getEntityValue).toBe(getEntityValue);
    expect(defaultHaHelper.getEntityLastUpdated).toBe(getEntityLastUpdated);
    expect(defaultHaHelper.formatSnowDepth).toBe(formatSnowDepth);
    expect(defaultHaHelper.formatElevation).toBe(formatElevation);
  });
  describe('getEntityValue', () => {
    it('returns null if hass or entityId is missing', () => {
      expect(getEntityValue(null, 'sensor.snow')).toBeNull();
      expect(getEntityValue({}, undefined)).toBeNull();
      expect(getEntityValue(undefined, undefined)).toBeNull();
    });

    it('returns null if state is missing, unknown, unavailable or non-numeric', () => {
      const mockHass = {
        states: {
          'sensor.missing': undefined,
          'sensor.unknown': { state: 'unknown' },
          'sensor.unavailable': { state: 'unavailable' },
          'sensor.text': { state: 'not_a_number' },
        },
      };

      expect(getEntityValue(mockHass, 'sensor.missing')).toBeNull();
      expect(getEntityValue(mockHass, 'sensor.unknown')).toBeNull();
      expect(getEntityValue(mockHass, 'sensor.unavailable')).toBeNull();
      expect(getEntityValue(mockHass, 'sensor.text')).toBeNull();
      expect(getEntityValue(mockHass, 'sensor.not_found')).toBeNull();
    });

    it('returns numeric value for valid number states', () => {
      const mockHass = {
        states: {
          'sensor.snow': { state: '85' },
          'sensor.zero': { state: '0' },
          'sensor.float': { state: '12.5' },
          'sensor.negative': { state: '-5' },
        },
      };

      expect(getEntityValue(mockHass, 'sensor.snow')).toBe(85);
      expect(getEntityValue(mockHass, 'sensor.zero')).toBe(0);
      expect(getEntityValue(mockHass, 'sensor.float')).toBe(12.5);
      expect(getEntityValue(mockHass, 'sensor.negative')).toBe(-5);
    });
  });

  describe('getEntityLastUpdated', () => {
    it('returns null if hass or entityId is missing', () => {
      expect(getEntityLastUpdated(null, 'sensor.snow')).toBeNull();
      expect(getEntityLastUpdated({}, undefined)).toBeNull();
    });

    it('returns null if state is missing', () => {
      const mockHass = { states: {} };
      expect(getEntityLastUpdated(mockHass, 'sensor.snow')).toBeNull();
    });

    it('returns formatted string for last_changed or last_updated', () => {
      const mockHass = {
        states: {
          'sensor.changed': { state: '85', last_changed: '2026-09-04T12:00:00Z' },
          'sensor.updated': { state: '85', last_updated: '2026-09-04T10:00:00Z' },
        },
      };

      expect(getEntityLastUpdated(mockHass, 'sensor.changed')).toBeDefined();
      expect(typeof getEntityLastUpdated(mockHass, 'sensor.changed')).toBe('string');
      expect(typeof getEntityLastUpdated(mockHass, 'sensor.updated')).toBe('string');
    });

    it('returns fallback string if date parsing fails', () => {
      const mockHass = {
        states: {
          'sensor.invalid_date': { state: 'some_state', last_changed: 'invalid-date-string' },
        },
      };

      const result = getEntityLastUpdated(mockHass, 'sensor.invalid_date');
      expect(result).toBeDefined();
    });
  });

  describe('formatSnowDepth', () => {
    it('returns dash for null or undefined values', () => {
      expect(formatSnowDepth(null)).toBe('—');
      expect(formatSnowDepth(undefined as any)).toBe('—');
    });

    it('appends cm for numbers', () => {
      expect(formatSnowDepth(0)).toBe('0cm');
      expect(formatSnowDepth(120)).toBe('120cm');
    });
  });

  describe('formatElevation', () => {
    it('returns dash for null or undefined values', () => {
      expect(formatElevation(null)).toBe('—');
      expect(formatElevation(undefined as any)).toBe('—');
    });

    it('appends m for numbers', () => {
      expect(formatElevation(0)).toBe('0m');
      expect(formatElevation(2300)).toBe('2300m');
    });
  });
});
