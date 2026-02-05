import { svg, SVGTemplateResult } from 'lit';
import { SnowReportCardConfig } from '../types';

export interface MountainData {
  mountainSnow: number | null;
  valleySnow: number | null;
  mountainElevation: number | null;
  valleyElevation: number | null;
}

/**
 * Generates an SVG mountain graphic with snow depth and elevation data points
 * @param config Card configuration for styling options
 * @param data Mountain and valley data
 * @returns SVG template result for rendering
 */
export function generateMountainSVG(
  config: SnowReportCardConfig,
  data: MountainData
): SVGTemplateResult {
  const { mountainSnow, valleySnow, mountainElevation, valleyElevation } = data;
  
  // Color customization from config or defaults
  const mountainColor = config.display_options?.mountain_color || '#D3D3D3';
  const snowColor = config.display_options?.snow_color || '#FFFFFF';
  const lineColor = 'var(--primary-text-color, #000000)';
  const textColor = 'var(--primary-text-color, #000000)';
  
  // Mountain peak position (top center)
  const peakX = 250;
  const peakY = 40;
  
  // Mountain base positions
  const leftBaseX = 50;
  const rightBaseX = 450;
  const baseY = 280;
  
  // Valley data point position (left slope, lower third)
  const valleyPointX = 140;
  const valleyPointY = 200;
  
  // Mountain data point position (right slope, upper third)
  const mountainPointX = 360;
  const mountainPointY = 100;
  
  // Label positions (to the left of valley point, to the right of mountain point)
  const valleyLabelX = 30;
  const valleyLabelY = valleyPointY;
  const mountainLabelX = 470;
  const mountainLabelY = mountainPointY;

  return svg`
    <svg 
      viewBox="0 0 500 185" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto; max-height: 185px;"
      role="img"
      aria-label="Mountain snow report visualization"
    >
      <g id="Snowfall" transform="translate(2.000000, 10.000000)">
        <path id="Page-1" d="M211.483865,16 L135.799805,164.239258 L347.929688,164.239258 L299.238237,99.3686221 L259.749149,138.857349 L257.167107,134.871781 L277.710029,114.708816 L211.483865,16 Z M212.359375,29.359375 L250.58604,87.463927 L229.37207,67.8369141 L225.604998,91.8886841 L214.416016,65.5478516 L205.131836,90.3828125 L197.766602,69.4726565 L187.387695,77.2480471 L212.359375,29.359375 Z" fill="${mountainColor}" transform="translate(241.864746, 90.119629) scale(-1, 1) translate(-241.864746, -90.119629) "></path>
        <path id="Line" d="M273.17481,18.5 L91.4057823,18.5" stroke="#999999" stroke-linecap="square"></path>
        <path id="Line-Copy-27" d="M204.999998,114.5 L91.4057823,114.5" stroke="#999999" stroke-linecap="square"></path>
        <circle id="Oval-19" stroke="#2F619B" stroke-width="2" fill="${snowColor}" cx="272" cy="18" r="6"></circle>
        <path id="Oval-19-Copy" d="M204,120 C207.313708,120 210,117.313708 210,114 C210,110.686292 207.313708,108 204,108 C200.686292,108 198,110.686292 198,114 C198,117.313708 200.686292,120 204,120 Z" stroke="#2F619B" stroke-width="2" fill="${snowColor}"></path>
        <text id="height-top" font-size="12" font-weight="normal" line-spacing="22" fill="#999999"><tspan x="90.5" y="30">${mountainElevation !== null ? `${mountainElevation}m` : '—'}</tspan></text>
        <text id="height-valley" font-size="12" font-weight="normal" line-spacing="22" fill="#999999"><tspan x="91" y="124.5">${valleyElevation !== null ? `${valleyElevation}m` : '—'}</tspan></text>
        <text id="snowheight-top" font-size="24" font-weight="600" fill="#424242" text-anchor="end"><tspan x="80" y="25">${mountainSnow !== null ? `${mountainSnow}cm` : '--'}</tspan></text>
        <text id="snowheight-valley" font-size="21" font-weight="600" line-spacing="30" fill="#424242" text-anchor="end"><tspan x="79" y="120">${valleySnow !== null ? `${valleySnow}cm` : '--'}</tspan></text>
      </g>
    </svg>
  `;
}
