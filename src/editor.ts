import { LitElement, html, css } from 'lit';
import { SnowReportCardConfig } from './types';
import { fireEvent } from 'custom-card-helpers';

class SnowReportCardEditor extends LitElement {
  private _config?: SnowReportCardConfig;
  private _hass: any;

  static styles = css`
    :host { display: block; padding: 12px; }
    .section { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--divider-color); }
    .section-title { font-weight: 600; font-size: 14px; margin-bottom: 12px; color: var(--primary-text-color); }
    label { display: block; font-size: 13px; margin-top: 12px; margin-bottom: 4px; color: var(--secondary-text-color); }
    input, select, ha-entity-picker { width: 100%; }
    input, select { padding: 6px; box-sizing: border-box; }
    .checkbox-row { display: flex; align-items: center; margin-top: 8px; }
    .checkbox-row input[type="checkbox"] { width: auto; margin-right: 8px; }
    .checkbox-row label { margin: 0; }
  `;

  set hass(hass: any) {
    this._hass = hass;
    this.requestUpdate();
  }

  setConfig(config: SnowReportCardConfig) {
    this._config = { ...config };
    if (!this._config.entities) {
      this._config.entities = {
        mountain_snow_depth: '',
        valley_snow_depth: '',
      };
    }
    if (!this._config.display_options) {
      this._config.display_options = {
        show_forecast: true,
        show_elevation: true,
        show_mountain_graphic: true,
        compact_mode: false,
      };
    }
  }

  private _valueChanged(ev: CustomEvent) {
    if (!this._config) return;
    const target = ev.target as any;
    const value = ev.detail?.value ?? target.value;
    
    if (target.configValue) {
      const newConfig = { ...this._config };
      const path = target.configValue.split('.');
      
      let obj: any = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) {
          obj[path[i]] = {};
        } else {
          // Deep clone nested objects
          obj[path[i]] = { ...obj[path[i]] };
        }
        obj = obj[path[i]];
      }
      
      if (value === '' || value === undefined) {
        delete obj[path[path.length - 1]];
      } else {
        obj[path[path.length - 1]] = value;
      }
      
      this._config = newConfig;
      fireEvent(this, 'config-changed', { config: newConfig });
    }
  }

  private _toggleChanged(ev: Event) {
    const target = ev.target as any;
    if (!this._config || !target.configValue) return;
    
    const newConfig = { ...this._config };
    const path = target.configValue.split('.');
    
    let obj: any = newConfig;
    for (let i = 0; i < path.length - 1; i++) {
      if (!obj[path[i]]) {
        obj[path[i]] = {};
      } else {
        // Deep clone nested objects
        obj[path[i]] = { ...obj[path[i]] };
      }
      obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = target.checked;
    
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  render() {
    if (!this._config) {
      return html``;
    }

    const cfg = this._config;
    const entities = cfg.entities || {};
    const displayOpts = cfg.display_options || {};

    return html`
      <div>
        <div class="section">
          <div class="section-title">General Settings</div>
          
          <label>Resort Name</label>
          <input
            type="text"
            .value=${cfg.resort_name || ''}
            .configValue=${'resort_name'}
            @input=${this._valueChanged}
          />

          <label>Language</label>
          <select
            .value=${cfg.language || 'en'}
            .configValue=${'language'}
            @change=${this._valueChanged}
          >
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div class="section">
          <div class="section-title">Required Entities</div>
          
          <label>Mountain Snow Depth *</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.mountain_snow_depth || ''}
              .configValue=${'entities.mountain_snow_depth'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.mountain_snow_depth || ''}
              .configValue=${'entities.mountain_snow_depth'}
              @input=${this._valueChanged}
              placeholder="sensor.mountain_snow_depth"
            />
          `}

          <label>Valley Snow Depth *</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.valley_snow_depth || ''}
              .configValue=${'entities.valley_snow_depth'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.valley_snow_depth || ''}
              .configValue=${'entities.valley_snow_depth'}
              @input=${this._valueChanged}
              placeholder="sensor.valley_snow_depth"
            />
          `}
        </div>

        <div class="section">
          <div class="section-title">Optional Entities</div>
          
          <label>Mountain Elevation</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.mountain_elevation || ''}
              .configValue=${'entities.mountain_elevation'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.mountain_elevation || ''}
              .configValue=${'entities.mountain_elevation'}
              @input=${this._valueChanged}
              placeholder="sensor.mountain_elevation"
            />
          `}

          <label>Valley Elevation</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.valley_elevation || ''}
              .configValue=${'entities.valley_elevation'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.valley_elevation || ''}
              .configValue=${'entities.valley_elevation'}
              @input=${this._valueChanged}
              placeholder="sensor.valley_elevation"
            />
          `}

          <label>Last Update</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.last_update || ''}
              .configValue=${'entities.last_update'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.last_update || ''}
              .configValue=${'entities.last_update'}
              @input=${this._valueChanged}
              placeholder="sensor.last_update"
            />
          `}

          <label>Snowfall 24h</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.snowfall_24h || ''}
              .configValue=${'entities.snowfall_24h'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.snowfall_24h || ''}
              .configValue=${'entities.snowfall_24h'}
              @input=${this._valueChanged}
              placeholder="sensor.snowfall_24h"
            />
          `}

          <label>Forecast Mountain Snow</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.forecast_mountain_snow || ''}
              .configValue=${'entities.forecast_mountain_snow'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.forecast_mountain_snow || ''}
              .configValue=${'entities.forecast_mountain_snow'}
              @input=${this._valueChanged}
              placeholder="sensor.forecast_mountain_snow"
            />
          `}

          <label>Forecast Valley Snow</label>
          ${this._hass ? html`
            <ha-entity-picker
              .hass=${this._hass}
              .value=${entities.forecast_valley_snow || ''}
              .configValue=${'entities.forecast_valley_snow'}
              @value-changed=${this._valueChanged}
              allow-custom-entity
            ></ha-entity-picker>
          ` : html`
            <input
              type="text"
              .value=${entities.forecast_valley_snow || ''}
              .configValue=${'entities.forecast_valley_snow'}
              @input=${this._valueChanged}
              placeholder="sensor.forecast_valley_snow"
            />
          `}
        </div>

        <div class="section">
          <div class="section-title">Display Options</div>
          
          <div class="checkbox-row">
            <input
              type="checkbox"
              id="show_forecast"
              .checked=${displayOpts.show_forecast !== false}
              .configValue=${'display_options.show_forecast'}
              @change=${this._toggleChanged}
            />
            <label for="show_forecast">Show Forecast</label>
          </div>

          <div class="checkbox-row">
            <input
              type="checkbox"
              id="show_elevation"
              .checked=${displayOpts.show_elevation !== false}
              .configValue=${'display_options.show_elevation'}
              @change=${this._toggleChanged}
            />
            <label for="show_elevation">Show Elevation</label>
          </div>

          <div class="checkbox-row">
            <input
              type="checkbox"
              id="show_mountain_graphic"
              .checked=${displayOpts.show_mountain_graphic !== false}
              .configValue=${'display_options.show_mountain_graphic'}
              @change=${this._toggleChanged}
            />
            <label for="show_mountain_graphic">Show Mountain Graphic</label>
          </div>

          <div class="checkbox-row">
            <input
              type="checkbox"
              id="compact_mode"
              .checked=${displayOpts.compact_mode === true}
              .configValue=${'display_options.compact_mode'}
              @change=${this._toggleChanged}
            />
            <label for="compact_mode">Compact Mode</label>
          </div>

          <label>Mountain Color</label>
          <input
            type="text"
            .value=${displayOpts.mountain_color || ''}
            .configValue=${'display_options.mountain_color'}
            @input=${this._valueChanged}
            placeholder="#8B7355"
          />

          <label>Snow Color</label>
          <input
            type="text"
            .value=${displayOpts.snow_color || ''}
            .configValue=${'display_options.snow_color'}
            @input=${this._valueChanged}
            placeholder="#FFFFFF"
          />
        </div>
      </div>
    `;
  }
}

customElements.define('snowreport-card-editor', SnowReportCardEditor);

export default SnowReportCardEditor;
