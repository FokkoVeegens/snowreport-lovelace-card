import { css } from 'lit';

export const cardStyles = css`
  :host { display: block; }
  .last-snowfall { font-size: 12px; color: var(--secondary-text-color); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color, #e0e0e0); }
  .forecast-section { margin-top: 10px; border-top: 1px solid var(--divider-color, #e0e0e0); padding-top: 8px; font-size: 13px; color: var(--secondary-text-color); }
  ha-card.compact { padding: 8px; }
  ha-card.compact .card-header { font-size: 14px; }
`;

export default cardStyles;
