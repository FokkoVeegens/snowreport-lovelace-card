# Plan: Snow Report Lovelace Card for Home Assistant

Create a custom Lovelace card for Home Assistant that visualizes ski resort snow conditions with a mountain graphic, displaying snow depths at valley and mountain elevations, plus last update timestamp. The card will be fully configurable, supporting multiple ski resorts through entity selectors, with internationalization support and modern development tooling.

**Key Design Decisions:**
- **LitElement + TypeScript**: Aligns with Home Assistant standards, provides type safety and maintainability
- **SVG-based mountain graphic**: Scalable, accessible, and easily styled for theming
- **Rollup bundler**: Standard for HA custom cards, produces optimized bundles
- **HACS distribution**: Primary installation method for users
- **Entity selector configuration**: Users specify their sensor entities rather than hardcoded resort names
- **Separate card implementation from sensor config**: The configuration.yaml stays as an example; users create their own sensor configs for their chosen resorts

**Steps**

1. **Setup project infrastructure** ✅ COMPLETED
   - ✅ Create package.json with dependencies: `lit`, `custom-card-helpers`, TypeScript, Rollup, and dev tools
   - ✅ Create tsconfig.json for TypeScript compilation targeting ES2019
   - ✅ Create rollup.config.js to bundle TypeScript to JS module with Terser minification
   - ✅ Create .gitignore excluding `node_modules/`, `dist/`, and editor files
   - ✅ Create hacs.json with metadata for HACS distribution (name, render_readme, filename)
   - ✅ Create project structure: `src/`, `dist/`, `src/localize/languages/`

2. **Define TypeScript interfaces and types** ✅ COMPLETED
   - ✅ Created src/types.ts with `SnowReportCardConfig` interface defining required entities (mountain_snow_depth, valley_snow_depth) and optional entities (last_update, snowfall_24h, forecast_mountain_snow, forecast_valley_snow, mountain_elevation, valley_elevation)
   - ✅ Added `DisplayOptions` interface for show_forecast, show_elevation, show_mountain_graphic, compact_mode, custom colors (mountain_color, snow_color)
   - ✅ Added constants for DEFAULT_DISPLAY_OPTIONS and SUPPORTED_LANGUAGES (en, nl, de, it, fr, es)

3. **Implement localization system** ✅ COMPLETED
   - ✅ Create src/localize/localize.ts with `localize()` function that reads from language files
   - ✅ Create src/localize/languages/en.json with keys: snow_depth, elevation, last_update, mountain, valley, unavailable
   - ✅ Create src/localize/languages/nl.json with Dutch translations
   - ✅ Add language files for de, it, fr, es (German, Italian, French, Spanish)

4. **Create main card component** ✅ COMPLETED
   - ✅ Create src/snowreport-card.ts extending `LitElement`
   - ✅ Implement `setConfig(config)` with full validation and error handling
   - ✅ Implement `set hass(hass)` to update component when Home Assistant state changes
   - ✅ Implement `getCardSize()` returning 4
   - ✅ Implement `getStubConfig()` returning minimal valid config for card picker
   - ✅ Register custom element as `snowreport-card`
   - ✅ Add to `window.customCards` array for dashboard picker visibility
   - ✅ Implement `getConfigElement()` method referencing editor

5. **Build SVG mountain visualization** ✅ COMPLETED
   - ✅ Create src/utils/svg-mountain.ts with function `generateMountainSVG(config, data)`
   - ✅ Implement SVG using Lit's `svg` template tag with viewBox="0 0 500 300" for scaling
   - ✅ Create mountain silhouette using `<polygon>` with gradient fill (snow cap to gray mountain)
   - ✅ Add two data points: mountain point at (360, 100) and valley point at (140, 200)
   - ✅ Position snow depth text (e.g., "80cm") and elevation text (e.g., "2225m") at each data point
   - ✅ Add dashed connecting lines from data points to labels with circular markers
   - ✅ Apply CSS custom properties for theming (`--primary-text-color`)
   - ✅ Make responsive with percentage-based SVG sizing
   - ✅ Create preview.html for testing the SVG without full HA setup (open in browser to preview)

6. **Implement card rendering logic** ✅ COMPLETED
   - ✅ In src/snowreport-card.ts, implement `render()` method using Lit's `html` template
   - ✅ Wrap content in `<ha-card>` element with optional header showing resort name
   - ✅ Display last update timestamp at top (from `last_update` entity state or `last_changed` attribute)
   - ✅ Render SVG mountain graphic in center using imported `generateMountainSVG()`
   - ✅ Extract entity values using `this.hass.states[entityId]?.state`
   - ✅ Handle unavailable/unknown states with fallback text using localize strings
   - ✅ Conditionally display forecast section if entities configured and `show_forecast` enabled
   - ✅ Apply compact mode styling if configured

7. **Add card styling** ✅ COMPLETED
   - ✅ Create src/styles.ts with Lit CSS template
   - ✅ Style `.card-header` with font weight and sizing
   - ✅ Style `.last-update` with smaller font, secondary text color
   - ✅ Style `.mountain-container` as flex center with appropriate sizing
   - ✅ Style `.forecast-section` with optional display, border-top separator
   - ✅ Add compact mode styling for mobile layouts
   - ✅ Use CSS custom properties for theme compatibility
   - ✅ Import styles into main card component

8. **Create visual configuration editor** ✅ COMPLETED
   - ✅ Create src/editor.ts extending `LitElement`
   - ✅ Implement form with text inputs for entity IDs (mountain_snow_depth, valley_snow_depth, last_update)
   - ✅ Add text input for optional resort_name
   - ✅ Add language selector dropdown with all supported languages (en, nl, de, it, fr, es)
   - ✅ Implement `setConfig()` to receive current config
   - ✅ Dispatch `config-changed` event on user changes
   - ✅ Register custom element as `snowreport-card-editor`
   - ✅ Referenced editor in main card's `getConfigElement()` method
   - ℹ️ Note: Uses basic text inputs instead of Home Assistant entity selectors (could be enhanced)

9. **Add Home Assistant integration helpers**
   - Create src/utils/ha-helper.ts with utili ✅ COMPLETED
   - ✅ Create src/utils/ha-helper.ts with utility functions
   - ✅ Implement `getEntityValue(hass, entityId)` returning numeric value or null for unavailable
   - ✅ Implement `getEntityLastUpdated(hass, entityId)` returning formatted date string
   - ✅ Implement `formatSnowDepth(value, locale)` for proper unit display
   - ✅ Implement `formatElevation(value, locale)` for elevation display
   - ✅
10. **Write documentation**
10. **Write documentation** ✅ COMPLETED
    - ✅ Update README.md with project description, features list, and badges
    - ✅ Add comprehensive installation instructions for HACS and manual installation
    - ✅ Add configuration examples: minimal config and full config with all options
    - ✅ Document all configuration options with entity requirements and defaults
    - ✅ Add troubleshooting section for common issues (entities not found, card not loading)
    - ✅ Add development setup instructions (npm install, npm run build, npm run dev)
    - ✅ All documentation consolidated into README.md following GitHub documentation standards
    - ✅ configuration.yaml contains complete sensor setup example for Tignes resort
    - ✅ README.md includes comprehensive sensor setup guide:
      - Navigation to sneeuwhoogte.nl and finding ski resorts
      - Complete scrape sensor configuration examples
      - Template sensor setup for data extraction
      - CSS selector troubleshooting with DevTools
      - Best practices including scan_interval recommendations (3600 seconds)
      - Complete working example with Tignes resort

11. **Build and bundle** ✅ COMPLETED
    - ✅ Add npm scripts to package.json: `build`, `dev`, `watch`, `lint`
    - ✅ Configure Rollup to output to `dist/snowreport-card.js`
    - ✅ Setup development server using `rollup-plugin-serve` for live testing (port 10001)
    - ✅ Create production build with minification and source maps
    - ✅ Built files exist in dist/ directory (snowreport-card.js and .map)
    - ⚠️ Not yet tested in Home Assistant `www/community/` directory

12. **Create installation resources** ✅ COMPLETED
    - ✅ Installation notes in README.md
    - ✅ Detailed documentation in INSTALLATION.md for adding resource to dashboard
    - ✅ Documentation for adding card via UI or YAML
    - ✅ Example dashboard YAML snippets
    - ✅ Badges/shields in README (GitHub Release, License, HACS)

**Verification** ❌ NOT STARTED

- ❌ Install built card in test Home Assistant instance via `www/community/snowreport-card/`
- ❌ Add resource to dashboard resources configuration
- ❌ Verify card appears in card type picker with correct metadata
- ❌ Create card instance with minimal config using existing Tignes sensors from configuration.yaml
- ❌ Verify mountain graphic renders correctly showing snow depth and elevation data points
- ❌ Verify last update timestamp displays correctly
- ❌ Test visual editor: change entities, select language, verify changes apply
- ❌ Test missing/unavailable entities show proper fallback text
- ❌ Test responsive behavior on mobile viewport
- ❌ Test with dark and light Home Assistant themes
- ❌ Create second card instance for different resort (if available) to verify multi-resort support
- ✅ Run `npm run build` successfully with no errors (confirmed: dist/snowreport-card.js exists)
- ⚠️ Verify TypeScript compilation and linting pass cleanly (build succeeded, lint script defined but not verified)

**Decisions**

- **Sensor config remains as example**: The current configuration.yaml with Tignes-specific sensors becomes reference documentation. Users replicate this pattern for their chosen resorts with their own sensor names
- **Card handles display only**: All web scraping and sensor creation stays in Home Assistant configuration. Card consumes any compatible sensor entities regardless of naming
- **LitElement over vanilla JS**: Better maintainability, Home Assistant standard, smaller learning curve for contributors
- **SVG over Canvas**: Better accessibility, scalability, theme integration, and easier to maintain programmatic graphics
- **Entity selectors over templates**: More user-friendly than requiring users to understand templating syntax
- **English as primary language**: Code, documentation, and default UI in English; translations via localization files
