import { describe, it, expect } from 'vitest';
import cardStyles, { cardStyles as namedStyles } from '../src/styles';
import { CSSResult } from 'lit';

describe('styles', () => {
  it('exports valid CSSResult for Lit elements', () => {
    expect(cardStyles).toBeInstanceOf(CSSResult);
    expect(namedStyles).toBeInstanceOf(CSSResult);
    expect(cardStyles).toBe(namedStyles);
  });

  it('contains expected CSS selectors and rules', () => {
    const cssText = cardStyles.cssText;
    expect(cssText).toContain(':host');
    expect(cssText).toContain('.last-snowfall');
    expect(cssText).toContain('.forecast-section');
    expect(cssText).toContain('ha-card.compact');
  });
});
