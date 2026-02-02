import { LovelaceCardConfig } from 'custom-card-helpers';

export interface SnowReportCardConfig extends LovelaceCardConfig {
  type: string;
  entities: {
    mountain_snow_depth: string;
    valley_snow_depth: string;
    last_update?: string;
    snowfall_24h?: string;
    forecast_mountain_snow?: string;
    forecast_valley_snow?: string;
    mountain_elevation?: string;
    valley_elevation?: string;
  };
  display_options?: {
    show_forecast?: boolean;
    show_elevation?: boolean;
    show_mountain_graphic?: boolean;
    compact_mode?: boolean;
    mountain_color?: string;
    snow_color?: string;
  };
  resort_name?: string;
  language?: 'en' | 'nl' | 'de' | 'it' | 'fr';
}

export interface DisplayOptions {
  show_forecast: boolean;
  show_elevation: boolean;
  show_mountain_graphic: boolean;
  compact_mode: boolean;
  mountain_color?: string;
  snow_color?: string;
}

export const DEFAULT_DISPLAY_OPTIONS: DisplayOptions = {
  show_forecast: true,
  show_elevation: true,
  show_mountain_graphic: true,
  compact_mode: false,
};

export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'it', 'fr'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
