import { LitElement, html } from 'lit';
import { SnowReportCardConfig } from './types';
import { generateMountainSVG, MountainData } from './utils/svg-mountain';
import localize from './localize/localize';
import { cardStyles } from './styles';
// import './editor'; // Using built-in form editor instead

// Declare customCards on window for TypeScript
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      preview?: boolean;
      description?: string;
    }>;
  }
}

export const VERSION = '0.1.0';

class SnowReportCard extends LitElement {
  private _config?: SnowReportCardConfig;
  private _hass: any;

  static styles = cardStyles;

  static getStubConfig(): SnowReportCardConfig {
    // Return config with placeholder entities for preview (will show mock data)
    return {
      type: 'custom:snowreport-card',
      entities: {
        mountain_snow_depth: 'sensor.mountain_snow',
        valley_snow_depth: 'sensor.valley_snow',
        mountain_elevation: 'sensor.mountain_elevation',
        valley_elevation: 'sensor.valley_elevation',
        snowfall_24h: 'sensor.snowfall_24h',
        forecast_mountain_snow: 'sensor.forecast_mountain_snow',
        forecast_valley_snow: 'sensor.forecast_valley_snow',
      },
      resort_name: 'Ski Resort',
      language: 'en',
    } as SnowReportCardConfig;
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'resort_name', selector: { text: {} } },
        { 
          name: 'language', 
          selector: { 
            select: { 
              options: [
                { value: 'en', label: 'English' },
                { value: 'nl', label: 'Nederlands' },
                { value: 'de', label: 'Deutsch' },
                { value: 'it', label: 'Italiano' },
                { value: 'fr', label: 'Français' },
                { value: 'es', label: 'Español' },
              ]
            } 
          } 
        },
        { 
          name: 'entities.mountain_snow_depth', 
          required: true, 
          selector: { 
            entity: {} 
          } 
        },
        { 
          name: 'entities.valley_snow_depth', 
          required: true, 
          selector: { 
            entity: {} 
          } 
        },
        {
          type: 'expandable',
          title: 'Optional Entities',
          name: '',
          flatten: true,
          schema: [
            { name: 'entities.mountain_elevation', selector: { entity: {} } },
            { name: 'entities.valley_elevation', selector: { entity: {} } },
            { name: 'entities.last_update', selector: { entity: {} } },
            { name: 'entities.snowfall_24h', selector: { entity: {} } },
            { name: 'entities.forecast_mountain_snow', selector: { entity: {} } },
            { name: 'entities.forecast_valley_snow', selector: { entity: {} } },
          ]
        },
        {
          type: 'expandable',
          title: 'Display Options',
          name: '',
          flatten: true,
          schema: [
            { name: 'display_options.show_forecast', selector: { boolean: {} } },
            { name: 'display_options.show_elevation', selector: { boolean: {} } },
            { name: 'display_options.show_mountain_graphic', selector: { boolean: {} } },
            { name: 'display_options.compact_mode', selector: { boolean: {} } },
            { name: 'display_options.mountain_color', selector: { color_rgb: {} } },
            { name: 'display_options.snow_color', selector: { color_rgb: {} } },
          ]
        },
      ],
      computeLabel: (schema: any) => {
        const labels: Record<string, string> = {
          'resort_name': 'Resort Name',
          'language': 'Language',
          'entities.mountain_snow_depth': 'Mountain Snow Depth',
          'entities.valley_snow_depth': 'Valley Snow Depth',
          'entities.mountain_elevation': 'Mountain Elevation',
          'entities.valley_elevation': 'Valley Elevation',
          'entities.last_update': 'Last Update',
          'entities.snowfall_24h': 'Snowfall 24h',
          'entities.forecast_mountain_snow': 'Forecast Mountain Snow',
          'entities.forecast_valley_snow': 'Forecast Valley Snow',
          'display_options.show_forecast': 'Show Forecast',
          'display_options.show_elevation': 'Show Elevation',
          'display_options.show_mountain_graphic': 'Show Mountain Graphic',
          'display_options.compact_mode': 'Compact Mode',
          'display_options.mountain_color': 'Mountain Color',
          'display_options.snow_color': 'Snow Color',
        };
        return labels[schema.name] || undefined;
      },
    };
  }

  setConfig(config: SnowReportCardConfig) {
    if (!config) throw new Error('Invalid configuration for snowreport-card: no configuration provided');
    
    // Handle flattened config format from HA visual editor (e.g., "entities.snowfall_24h" at root level)
    const normalizedConfig: any = { ...config };
    
    // Create mutable copies of nested objects
    normalizedConfig.entities = normalizedConfig.entities ? { ...normalizedConfig.entities } : {};
    normalizedConfig.display_options = normalizedConfig.display_options ? { ...normalizedConfig.display_options } : {};
    
    // Merge flattened "entities.*" properties into entities object
    Object.keys(config).forEach((key) => {
      if (key.startsWith('entities.')) {
        const propName = key.substring(9); // Remove "entities." prefix
        normalizedConfig.entities[propName] = (config as any)[key];
      } else if (key.startsWith('display_options.')) {
        const propName = key.substring(16); // Remove "display_options." prefix
        normalizedConfig.display_options[propName] = (config as any)[key];
      }
    });
    
    if (!normalizedConfig.entities || typeof normalizedConfig.entities !== 'object') {
      throw new Error('Invalid configuration for snowreport-card: missing `entities` object');
    }
    const { mountain_snow_depth, valley_snow_depth } = normalizedConfig.entities;
    if (!mountain_snow_depth || !valley_snow_depth) {
      throw new Error('Invalid configuration for snowreport-card: `entities.mountain_snow_depth` and `entities.valley_snow_depth` are required');
    }
    this._config = normalizedConfig as SnowReportCardConfig;
  }

  set hass(hass: any) {
    this._hass = hass;
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 4;
  }

  private _getEntityState(entityId?: string): string | null {
    if (!entityId) return null;
    // If hass is not available yet, don't show mock data
    if (!this._hass || !this._hass.states) return null;
    
    const st = this._hass.states[entityId];
    if (!st) {
      // Provide mock data for preview when using stub config placeholder sensors
      if (entityId === 'sensor.mountain_snow') return '85';
      if (entityId === 'sensor.valley_snow') return '45';
      if (entityId === 'sensor.mountain_elevation') return '2300';
      if (entityId === 'sensor.valley_elevation') return '1550';
      if (entityId === 'sensor.forecast_mountain_snow') return '15';
      if (entityId === 'sensor.forecast_valley_snow') return '10';
      if (entityId === 'sensor.snowfall_24h') return '12';
      return null;
    }
    return st.state;
  }

  private _formatRelativeDate(timestamp: string | null): string {
    if (!timestamp) return '';
    
    try {
      // Parse the timestamp and normalize to midnight (ignore time component)
      const date = new Date(timestamp);
      const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Get today at midnight
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Calculate difference in days
      const diffMs = today.getTime() - targetDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffDays < 14) {
        return 'About a week ago';
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `About ${weeks} weeks ago`;
      } else if (diffDays < 60) {
        return 'About a month ago';
      } else {
        const months = Math.floor(diffDays / 30);
        return `About ${months} months ago`;
      }
    } catch (e) {
      return '';
    }
  }

  render() {
    const cfg = this._config;
    if (!cfg) return html`<ha-card>Snow Report card: no configuration provided</ha-card>`;

    const mountainSnowRaw = this._getEntityState(cfg.entities.mountain_snow_depth);
    const valleySnowRaw = this._getEntityState(cfg.entities.valley_snow_depth);
    const mountainElevationRaw = this._getEntityState(cfg.entities.mountain_elevation);
    const valleyElevationRaw = this._getEntityState(cfg.entities.valley_elevation);

    const data: MountainData = {
      mountainSnow: mountainSnowRaw && !isNaN(Number(mountainSnowRaw)) ? Number(mountainSnowRaw) : null,
      valleySnow: valleySnowRaw && !isNaN(Number(valleySnowRaw)) ? Number(valleySnowRaw) : null,
      mountainElevation: mountainElevationRaw && !isNaN(Number(mountainElevationRaw)) ? Number(mountainElevationRaw) : null,
      valleyElevation: valleyElevationRaw && !isNaN(Number(valleyElevationRaw)) ? Number(valleyElevationRaw) : null,
    };

    // Determine last snowfall text (using relative date format)
    const lang = cfg.language || 'en';
    const lastUpdateKey = cfg.entities.last_update;
    let lastSnowfallDate: string | null = null;
    if (lastUpdateKey && this._hass && this._hass.states) {
      const st = this._hass.states[lastUpdateKey];
      if (st) {
        lastSnowfallDate = st.last_changed || st.last_updated || st.attributes?.last_changed || st.state || null;
      }
    } else if (this._hass && this._hass.states) {
      // fallback to mountain sensor's last_changed
      const fallback = cfg.entities.mountain_snow_depth;
      const st = fallback ? this._hass.states[fallback] : null;
      if (st) {
        lastSnowfallDate = st.last_changed || st.last_updated || null;
      }
    }
    
    const lastSnowfallText = this._formatRelativeDate(lastSnowfallDate) || localize('unavailable', lang);
    const lastSnowfallLabel = localize('last_snowfall', lang);

    // Forecast display
    const showForecast = cfg.display_options?.show_forecast ?? true;
    const forecastMountain = this._getEntityState(cfg.entities.forecast_mountain_snow);
    const forecastValley = this._getEntityState(cfg.entities.forecast_valley_snow);
    const snowfall24 = this._getEntityState(cfg.entities.snowfall_24h);

    const compact = cfg.display_options?.compact_mode ?? false;

    return html`
      <ha-card class=${compact ? 'compact' : ''}>
        ${cfg.resort_name ? html`<h1 class="card-header"><div class="name">${cfg.resort_name} ${localize('snow_conditions', lang)}</div></h1>` : ''}
        <div class="card-content">
        <div>
          ${cfg.display_options?.show_mountain_graphic === false ? html`` : generateMountainSVG(cfg, data)}
        </div>

        ${showForecast && (forecastMountain || forecastValley || snowfall24)
          ? html`
              <div class="forecast-section">
                ${forecastMountain ? html`<div>${localize('mountain', lang)}: ${forecastMountain}${isNaN(Number(forecastMountain)) ? '' : 'cm'}</div>` : ''}
                ${forecastValley ? html`<div>${localize('valley', lang)}: ${forecastValley}${isNaN(Number(forecastValley)) ? '' : 'cm'}</div>` : ''}
                ${snowfall24 ? html`<div>${localize('snowfall_24h', lang)}: ${snowfall24}${isNaN(Number(snowfall24)) ? '' : 'cm'}</div>` : ''}
                <div>${lastSnowfallLabel}: ${lastSnowfallText}</div>
              </div>
            `
          : html`<div class="forecast-section"><div>${lastSnowfallLabel}: ${lastSnowfallText}</div></div>`}
        </div>
      </ha-card>
    `;
  }
}

// Register the main card element
customElements.define('snowreport-card', SnowReportCard);

// Add to customCards for the card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'snowreport-card',  // NO "custom:" prefix here!
  name: 'Snow Report Card',
  preview: true,
  description: 'A card showing ski resort snow conditions',
});

// Log success
console.info(
  `%c SNOWREPORT-CARD %c v${VERSION} `,
  'color: white; background: #1e88e5; font-weight: bold;',
  'color: #1e88e5; background: white; font-weight: bold;'
);

export default SnowReportCard;
