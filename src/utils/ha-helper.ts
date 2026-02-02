import { HomeAssistant } from 'custom-card-helpers';

export function getEntityValue(hass: any, entityId?: string): number | null {
  if (!hass || !entityId) return null;
  const st = hass.states[entityId];
  if (!st) return null;
  const v = st.state;
  const num = Number(v);
  if (v === 'unknown' || v === 'unavailable' || isNaN(num)) return null;
  return num;
}

export function getEntityLastUpdated(hass: any, entityId?: string): string | null {
  if (!hass || !entityId) return null;
  const st = hass.states[entityId];
  if (!st) return null;
  const ts = st.last_changed || st.last_updated || null;
  try {
    return ts ? new Date(ts).toLocaleString(undefined) : null;
  } catch (e) {
    return String(st.state ?? null);
  }
}

export function formatSnowDepth(value: number | null, locale?: string): string {
  if (value === null || value === undefined) return '—';
  return `${value}cm`;
}

export function formatElevation(value: number | null, locale?: string): string {
  if (value === null || value === undefined) return '—';
  return `${value}m`;
}

export default { getEntityValue, getEntityLastUpdated, formatSnowDepth, formatElevation };
