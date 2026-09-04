import { describe, it, expect, beforeEach } from 'vitest';
import '../src/editor';
import { SnowReportCardConfig } from '../src/types';

describe('SnowReportCardEditor component', () => {
  let editor: any;

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
    editor = document.createElement('snowreport-card-editor');
    document.body.appendChild(editor);
  });

  it('is defined and can be instantiated', () => {
    expect(editor).toBeDefined();
  });

  it('sets config and initializes defaults', () => {
    editor.setConfig(validConfig);
    expect(editor._config.resort_name).toBe('Test Resort');
    expect(editor._config.entities.mountain_snow_depth).toBe('sensor.mountain_snow');
    expect(editor._config.display_options.show_forecast).toBe(true);
  });

  it('initializes missing entities and display options with defaults when setting empty config', () => {
    editor.setConfig({ type: 'custom:snowreport-card' } as any);
    expect(editor._config.entities.mountain_snow_depth).toBe('');
    expect(editor._config.entities.valley_snow_depth).toBe('');
    expect(editor._config.display_options.show_forecast).toBe(true);
  });

  it('sets hass and requests update', () => {
    const mockHass = { states: {} };
    editor.hass = mockHass;
    expect(editor._hass).toBe(mockHass);
  });

  it('handles value changes and fires config-changed event', async () => {
    editor.setConfig(validConfig);
    let changedConfig: SnowReportCardConfig | null = null;

    editor.addEventListener('config-changed', (ev: CustomEvent) => {
      changedConfig = ev.detail.config;
    });

    // Simulate input change for resort_name
    const event = new CustomEvent('input', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(event, 'target', {
      value: { configValue: 'resort_name', value: 'New Resort Name' },
    });

    editor._valueChanged(event);
    expect(changedConfig).not.toBeNull();
    expect(changedConfig?.resort_name).toBe('New Resort Name');
  });

  it('handles nested value changes (e.g. entities.mountain_snow_depth)', async () => {
    editor.setConfig(validConfig);
    let changedConfig: SnowReportCardConfig | null = null;

    editor.addEventListener('config-changed', (ev: CustomEvent) => {
      changedConfig = ev.detail.config;
    });

    const event = new CustomEvent('value-changed', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(event, 'target', {
      value: { configValue: 'entities.mountain_snow_depth', value: 'sensor.new_mountain' },
    });

    editor._valueChanged(event);
    expect(changedConfig?.entities.mountain_snow_depth).toBe('sensor.new_mountain');
  });

  it('handles toggle changes for checkboxes', async () => {
    editor.setConfig(validConfig);
    let changedConfig: SnowReportCardConfig | null = null;

    editor.addEventListener('config-changed', (ev: CustomEvent) => {
      changedConfig = ev.detail.config;
    });

    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: { configValue: 'display_options.compact_mode', checked: true },
    });

    editor._toggleChanged(event);
    expect(changedConfig?.display_options?.compact_mode).toBe(true);
  });

  it('handles value deletion when value is empty string or undefined', async () => {
    editor.setConfig(validConfig);
    let changedConfig: SnowReportCardConfig | null = null;

    editor.addEventListener('config-changed', (ev: CustomEvent) => {
      changedConfig = ev.detail.config;
    });

    const event = new CustomEvent('input', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(event, 'target', {
      value: { configValue: 'resort_name', value: '' },
    });

    editor._valueChanged(event);
    expect(changedConfig?.resort_name).toBeUndefined();
  });

  it('handles nested path creation when nested object is missing', async () => {
    const minConfig: SnowReportCardConfig = {
      type: 'custom:snowreport-card',
      entities: {
        mountain_snow_depth: 's1',
        valley_snow_depth: 's2',
      },
    };
    editor.setConfig(minConfig);
    delete (editor._config as any).display_options;

    const event = new CustomEvent('input', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(event, 'target', {
      value: { configValue: 'display_options.mountain_color', value: '#123456' },
    });

    editor._valueChanged(event);
    expect(editor._config.display_options.mountain_color).toBe('#123456');
  });

  it('renders form inputs when config is provided', async () => {
    editor.setConfig(validConfig);
    await editor.updateComplete;

    const inputs = editor.shadowRoot?.querySelectorAll('input');
    expect(inputs?.length).toBeGreaterThan(0);

    const select = editor.shadowRoot?.querySelector('select');
    expect(select).not.toBeNull();
  });
});
