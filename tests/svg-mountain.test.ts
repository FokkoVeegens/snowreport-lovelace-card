import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import { generateMountainSVG, MountainData } from '../src/utils/svg-mountain';
import { SnowReportCardConfig } from '../src/types';

describe('generateMountainSVG', () => {
  const baseConfig: SnowReportCardConfig = {
    type: 'custom:snowreport-card',
    entities: {
      mountain_snow_depth: 'sensor.mountain_snow',
      valley_snow_depth: 'sensor.valley_snow',
    },
  };

  const sampleData: MountainData = {
    mountainSnow: 85,
    valleySnow: 45,
    mountainElevation: 2300,
    valleyElevation: 1550,
  };

  it('renders SVG element into container with snow and elevation data', () => {
    const template = generateMountainSVG(baseConfig, sampleData);
    const container = document.createElement('div');
    render(template, container);

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('role')).toBe('img');

    expect(container.textContent).toContain('85cm');
    expect(container.textContent).toContain('45cm');
    expect(container.textContent).toContain('2300m');
    expect(container.textContent).toContain('1550m');
  });

  it('renders placeholders when data values are null', () => {
    const emptyData: MountainData = {
      mountainSnow: null,
      valleySnow: null,
      mountainElevation: null,
      valleyElevation: null,
    };

    const template = generateMountainSVG(baseConfig, emptyData);
    const container = document.createElement('div');
    render(template, container);

    expect(container.textContent).toContain('--');
    expect(container.textContent).toContain('—');
  });

  it('applies custom mountain and snow colors when configured', () => {
    const customConfig: SnowReportCardConfig = {
      ...baseConfig,
      display_options: {
        show_forecast: true,
        show_elevation: true,
        show_mountain_graphic: true,
        compact_mode: false,
        mountain_color: '#123456',
        snow_color: '#789abc',
      },
    };

    const template = generateMountainSVG(customConfig, sampleData);
    const container = document.createElement('div');
    render(template, container);

    const pathElement = container.querySelector('#Page-1');
    expect(pathElement?.getAttribute('fill')).toBe('#123456');

    const circleElement = container.querySelector('#Oval-19');
    expect(circleElement?.getAttribute('fill')).toBe('#789abc');
  });

  it('uses default colors when display_options is missing custom colors', () => {
    const template = generateMountainSVG(baseConfig, sampleData);
    const container = document.createElement('div');
    render(template, container);

    const pathElement = container.querySelector('#Page-1');
    expect(pathElement?.getAttribute('fill')).toBe('#D3D3D3');

    const circleElement = container.querySelector('#Oval-19');
    expect(circleElement?.getAttribute('fill')).toBe('#FFFFFF');
  });
});
