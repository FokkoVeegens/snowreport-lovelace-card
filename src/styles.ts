import { css } from 'lit';

export const cardStyles = css`
  :host { display: block; }
  ha-card { padding: 12px; }
  .card-header { font-weight: 600; font-size: 16px; margin-bottom: 6px; }
  .last-snowfall { font-size: 12px; color: var(--secondary-text-color); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color, #e0e0e0); }
  .mountain-container { display: flex; justify-content: center; align-items: center; }
  .forecast-section { margin-top: 10px; border-top: 1px solid var(--divider-color, #e0e0e0); padding-top: 8px; font-size: 13px; color: var(--secondary-text-color); }
  ha-card.compact { padding: 8px; }
  ha-card.compact .card-header { font-size: 14px; }
`;

export default cardStyles;
