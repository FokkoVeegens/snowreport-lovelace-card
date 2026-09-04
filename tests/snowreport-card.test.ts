import { describe, it, expect, beforeEach } from 'vitest';
import '../src/snowreport-card';
import SnowReportCard, { VERSION } from '../src/snowreport-card';
import defaultSnowReportCard from '../src/snowreport-card';
import { SnowReportCardConfig } from '../src/types';

describe('SnowReportCard component', () => {
  let element: SnowReportCard;

  const validConfig: SnowReportCardConfig = {
    type: 'custom:snowreport-card',
    entities: {
      mountain_snow_depth: 'sensor.mountain_snow',
      valley_snow_depth: 'sensor.valley_snow',
    },
    resort_name: 'Test Resort',
    language: 'en',
  };

  beforeEach(() => {
    element = document.createElement('snowreport-card') as SnowReportCard;
    document.body.appendChild(element);
  });

  it('is defined and registered as custom element', () => {
    expect(customElements.get('snowreport-card')).toBeDefined();
    expect(element).toBeInstanceOf(SnowReportCard);
  });

  it('registers in window.customCards for Home Assistant card picker', () => {
    const cardInfo = window.customCards?.find((c) => c.type === 'snowreport-card');
    expect(cardInfo).toBeDefined();
    expect(cardInfo?.name).toBe('Snow Report Card');
    expect(cardInfo?.preview).toBe(true);
  });

  it('exports default class identical to named class', () => {
    expect(defaultSnowReportCard).toBe(SnowReportCard);
  });

  it('exports version constant', () => {
    expect(VERSION).toBe('0.1.0');
  });

  it('returns valid stub config', () => {
    const stubConfig = SnowReportCard.getStubConfig();
    expect(stubConfig.type).toBe('custom:snowreport-card');
    expect(stubConfig.entities.mountain_snow_depth).toBeDefined();
    expect(stubConfig.entities.valley_snow_depth).toBeDefined();
  });

  it('returns valid config form schema and label computer', () => {
    const form = SnowReportCard.getConfigForm();
    expect(form.schema).toBeDefined();
    expect(typeof form.computeLabel).toBe('function');
    expect(form.computeLabel({ name: 'resort_name' })).toBe('Resort Name');
    expect(form.computeLabel({ name: 'unknown_field' })).toBeUndefined();
  });

  it('getCardSize returns 4', () => {
    expect(element.getCardSize()).toBe(4);
  });

  describe('setConfig', () => {
    it('throws error when config is missing', () => {
      expect(() => element.setConfig(null as any)).toThrow(
        'Invalid configuration for snowreport-card: no configuration provided'
      );
    });

    it('throws error when required entity properties are missing', () => {
      expect(() =>
        element.setConfig({
          type: 'custom:snowreport-card',
          entities: {
            mountain_snow_depth: '',
            valley_snow_depth: 'sensor.valley',
          },
        } as any)
      ).toThrow('`entities.mountain_snow_depth` and `entities.valley_snow_depth` are required');
    });

    it('normalizes flattened configuration from HA visual editor', () => {
      const flattenedConfig = {
        type: 'custom:snowreport-card',
        'entities.mountain_snow_depth': 'sensor.flat_mountain',
        'entities.valley_snow_depth': 'sensor.flat_valley',
        'entities.snowfall_24h': 'sensor.flat_snowfall',
        'display_options.compact_mode': true,
        'display_options.show_forecast': false,
      };

      element.setConfig(flattenedConfig as any);
      expect((element as any)._config.entities.mountain_snow_depth).toBe('sensor.flat_mountain');
      expect((element as any)._config.entities.valley_snow_depth).toBe('sensor.flat_valley');
      expect((element as any)._config.entities.snowfall_24h).toBe('sensor.flat_snowfall');
      expect((element as any)._config.display_options.compact_mode).toBe(true);
      expect((element as any)._config.display_options.show_forecast).toBe(false);
    });
  });

  describe('hass property & entity states', () => {
    it('sets and gets hass properly', () => {
      const mockHass = { states: {} };
      element.hass = mockHass;
      expect(element.hass).toBe(mockHass);
    });

    it('returns mock data for stub sensors when hass states are missing', () => {
      element.setConfig(SnowReportCard.getStubConfig());
      element.hass = { states: {} };
      
      const mountainState = (element as any)._getEntityState('sensor.mountain_snow');
      expect(mountainState).toBe('85');

      const valleyState = (element as any)._getEntityState('sensor.valley_snow');
      expect(valleyState).toBe('45');
    });

    it('returns state from hass when entity exists in hass.states', () => {
      element.setConfig(validConfig);
      element.hass = {
        states: {
          'sensor.mountain_snow': { state: '150' },
          'sensor.valley_snow': { state: '60' },
        },
      };

      expect((element as any)._getEntityState('sensor.mountain_snow')).toBe('150');
      expect((element as any)._getEntityState('sensor.valley_snow')).toBe('60');
      expect((element as any)._getEntityState('sensor.unknown_custom_sensor')).toBeNull();
    });
  });

  describe('relative date formatting (_formatRelativeDate)', () => {
    const formatDate = (timestamp: string | null, lang = 'en') =>
      (element as any)._formatRelativeDate(timestamp, lang);

    it('returns empty string for null or invalid timestamp', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('')).toBe('');
      expect(formatDate('invalid-date-string')).toBe('');
    });

    it('formats today correctly', () => {
      const now = new Date().toISOString();
      expect(formatDate(now, 'en')).toBe('Today');
      expect(formatDate(now, 'nl')).toBe('Vandaag');
    });

    it('formats yesterday correctly', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(yesterday, 'en')).toBe('Yesterday');
      expect(formatDate(yesterday, 'nl')).toBe('Gisteren');
    });

    it('formats days_ago correctly (2 to 6 days)', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(threeDaysAgo, 'en')).toBe('3 days ago');
      expect(formatDate(threeDaysAgo, 'nl')).toBe('3 dagen geleden');
    });

    it('formats about_week_ago (7 to 13 days)', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(tenDaysAgo, 'en')).toBe('About a week ago');
    });

    it('formats about_weeks_ago (14 to 29 days)', () => {
      const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(twentyDaysAgo, 'en')).toBe('About 2 weeks ago');
    });

    it('formats about_month_ago (30 to 59 days)', () => {
      const fortyDaysAgo = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(fortyDaysAgo, 'en')).toBe('About a month ago');
    });

    it('formats about_months_ago (60+ days)', () => {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDate(ninetyDaysAgo, 'en')).toBe('About 3 months ago');
    });
  });

  describe('rendering', () => {
    it('renders error notice if config is not provided', async () => {
      element.requestUpdate();
      await element.updateComplete;
      expect(element.shadowRoot?.textContent).toContain('no configuration provided');
    });

    it('renders resort name header and mountain graphic when configured', async () => {
      element.setConfig(validConfig);
      element.hass = {
        states: {
          'sensor.mountain_snow': { state: '100' },
          'sensor.valley_snow': { state: '40' },
        },
      };

      await element.updateComplete;
      const shadow = element.shadowRoot;
      expect(shadow?.querySelector('.card-header')?.textContent).toContain('Test Resort snow conditions');
      expect(shadow?.querySelector('svg')).not.toBeNull();
    });

    it('applies compact mode class when configured', async () => {
      const compactConfig: SnowReportCardConfig = {
        ...validConfig,
        display_options: {
          show_forecast: true,
          show_elevation: true,
          show_mountain_graphic: true,
          compact_mode: true,
        },
      };

      element.setConfig(compactConfig);
      element.hass = { states: {} };
      await element.updateComplete;

      const card = element.shadowRoot?.querySelector('ha-card');
      expect(card?.classList.contains('compact')).toBe(true);
    });

    it('hides mountain graphic when show_mountain_graphic is false', async () => {
      const noGraphicConfig: SnowReportCardConfig = {
        ...validConfig,
        display_options: {
          show_forecast: true,
          show_elevation: true,
          show_mountain_graphic: false,
          compact_mode: false,
        },
      };

      element.setConfig(noGraphicConfig);
      element.hass = { states: {} };
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('renders forecast section with last snowfall and 24h snowfall combination', async () => {
      const forecastConfig: SnowReportCardConfig = {
        ...validConfig,
        entities: {
          ...validConfig.entities,
          forecast_mountain_snow: 'sensor.forecast_m',
          forecast_valley_snow: 'sensor.forecast_v',
          snowfall_24h: 'sensor.snow_24h',
          last_update: 'sensor.last_update',
        },
        display_options: {
          show_forecast: true,
          show_elevation: true,
          show_mountain_graphic: true,
          compact_mode: false,
        },
      };

      const now = new Date().toISOString();
      element.setConfig(forecastConfig);
      element.hass = {
        states: {
          'sensor.mountain_snow': { state: '100', last_changed: now },
          'sensor.valley_snow': { state: '50' },
          'sensor.forecast_m': { state: '15' },
          'sensor.forecast_v': { state: '5' },
          'sensor.snow_24h': { state: '10' },
          'sensor.last_update': { state: now },
        },
      };

      await element.updateComplete;
      const text = element.shadowRoot?.textContent;
      expect(text).toContain('Last snowfall: Today (10cm)');
      expect(text).toContain('5-day forecast: 🏔️ 15cm 🏘️ 5cm');
    });
  });
});
