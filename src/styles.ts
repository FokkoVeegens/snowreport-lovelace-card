import { css } from 'lit';

export const cardStyles = css`
  :host { display: block; }
  .last-snowfall { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color, #e0e0e0); }
  .forecast-section { margin-top: 10px; border-top: 1px solid var(--divider-color, #e0e0e0); padding-top: 8px; }
  .combined-forecast { margin-bottom: 4px; }
  ha-card.compact { padding: 8px; }
`;

export default cardStyles;
