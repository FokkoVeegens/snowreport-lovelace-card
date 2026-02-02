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
   - ✅ Added constants for DEFAULT_DISPLAY_OPTIONS and SUPPORTED_LANGUAGES (en, nl, de, it, fr)

3. **Implement localization system**
   - Create src/localize/localize.ts with `localize()` function that reads from language files
   - Create src/localize/languages/en.json with keys: snow_depth, elevation, last_update, mountain, valley, forecast_5d, snowfall_24h, unavailable, etc.
   - Create src/localize/languages/nl.json with Dutch translations
   - Add additional language files as needed (German, Italian for ski resort regions)

4. **Create main card component**
   - Create src/snowreport-card.ts extending `LitElement`
   - Implement `setConfig(config)` validating required entities exist, storing config
   - Implement `set hass(hass)` to update component when Home Assistant state changes
   - Implement `getCardSize()` returning 4 (50px × 4 = 200px height estimate)
   - Implement `getStubConfig()` returning minimal valid config for card picker
   - Register custom element as `snowreport-card`
   - Add to `window.customCards` array for dashboard picker visibility

5. **Build SVG mountain visualization** ✅ COMPLETED
   - ✅ Created src/utils/svg-mountain.ts with function `generateMountainSVG(config, data)`
   - ✅ Implemented SVG using Lit's `svg` template tag with viewBox="0 0 500 300" for scaling
   - ✅ Created mountain silhouette using `<polygon>` with gradient fill (snow cap to gray mountain)
   - ✅ Added two data points: mountain point at (360, 100) and valley point at (140, 200)
   - ✅ Positioned snow depth text (e.g., "80cm") and elevation text (e.g., "2225m") at each data point
   - ✅ Added dashed connecting lines from data points to labels with circular markers
   - ✅ Applied CSS custom properties for theming (`--primary-text-color`)
   - ✅ Made responsive with percentage-based SVG sizing
   - ✅ Created preview.html for testing the SVG without full HA setup (open in browser to preview)

6. **Implement card rendering logic**
   - In src/snowreport-card.ts, implement `render()` method using Lit's `html` template
   - Wrap content in `<ha-card>` element with optional header showing resort name
   - Display last update timestamp at top (from `last_update` entity state or `last_changed` attribute)
   - Render SVG mountain graphic in center using imported `generateMountainSVG()`
   - Extract entity values using `this.hass.states[entityId]?.state`
   - Handle unavailable/unknown states with fallback text using localize strings
   - Conditionally display forecast section if entities configured and `show_forecast` enabled
   - Apply compact mode styling if configured

7. **Add card styling**
   - Create src/styles.ts with Lit CSS template
   - Style `.card-content` with padding, flexbox layout
   - Style `.last-update` with smaller font, secondary text color
   - Style `.mountain-container` as flex center with appropriate sizing
   - Style `.forecast-section` with optional display, border-top separator
   - Add responsive breakpoints for mobile layouts (compact mode automatic on small screens)
   - Use CSS custom properties for theme compatibility
   - Import styles into main card component

8. **Create visual configuration editor**
   - Create src/editor.ts extending `LitElement`
   - Implement static `getConfigForm()` returning schema with entity selectors for mountain_snow_depth, valley_snow_depth, last_update, and optional entities
   - Use Home Assistant selector types: `{ entity: { domain: 'sensor' } }` for entity pickers
   - Add grid section for display options with boolean selectors (switches)
   - Add text selector for optional resort_name
   - Add language selector with dropdown for supported languages
   - Implement `setConfig()` to receive current config
   - Dispatch `config-changed` event on user changes
   - Register custom element as `snowreport-card-editor`
   - Reference editor in main card's `getConfigElement()` method

9. **Add Home Assistant integration helpers**
   - Create src/utils/ha-helper.ts with utility functions
   - Implement `getEntityValue(hass, entityId)` returning numeric value or null for unavailable
   - Implement `getEntityLastUpdated(hass, entityId)` returning formatted date string
   - Implement `formatSnowDepth(value, locale)` for proper unit display
   - Implement `formatElevation(value, locale)` for elevation display
   - Add null safety and error handling throughout

10. **Write documentation**
    - Update README.md with project description, features list, and screenshot placeholder
    - Add installation instructions for HACS and manual installation
    - Add configuration examples: minimal config and full config with all options
    - Document all configuration options with entity requirements and defaults
    - Add troubleshooting section for common issues (entities not found, card not loading)
    - Add development setup instructions (npm install, npm run build, npm run dev)
    - Create info.md for HACS info panel with quick start guide
    - Move current configuration.yaml content to example section showing sensor setup for Sexten resort
    - Add detailed guide on setting up scrape sensors for new ski resorts:
      - Navigate to https://www.sneeuwhoogte.nl/ and search for desired ski resort
      - Copy the resort's overview page URL (e.g., `.../overzicht/[country]/[region]/[area]/[resort-name]`)
      - Copy the weather/forecast page URL (add `/weer` to overview URL)
      - Explain that CSS selectors may need adjustment if website structure changes
      - Provide instructions on using browser DevTools to inspect elements and find correct selectors
      - Include troubleshooting steps for when selectors don't work (website updates, different resort layouts)
      - Note that sneeuwhoogte.nl has no public API, so web scraping is the only option
      - Recommend setting appropriate scan_interval (3600 seconds = 1 hour) to avoid overwhelming the website

11. **Build and bundle**
    - Add npm scripts to package.json: `build`, `dev`, `watch`, `lint`
    - Configure Rollup to output to `dist/snowreport-card.js`
    - Setup development server using `rollup-plugin-serve` for live testing
    - Create production build with minification and source maps
    - Test bundle loads correctly in Home Assistant `www/community/` directory

12. **Create installation resources**
    - Add installation note in README.md about adding resource to dashboard: `/local/community/snowreport-card/snowreport-card.js`, type `module`
    - Document adding card via UI or YAML configuration
    - Provide example dashboard YAML snippet
    - Add badge/shields to README for HACS, version, license

**Verification**

- Install built card in test Home Assistant instance via `www/community/snowreport-card/`
- Add resource to dashboard resources configuration
- Verify card appears in card type picker with correct metadata
- Create card instance with minimal config using existing Sexten sensors from configuration.yaml
- Verify mountain graphic renders correctly showing 80cm/2225m and 35cm/1130m data points
- Verify last update timestamp displays correctly
- Test visual editor: change entities, toggle display options, verify changes apply
- Test missing/unavailable entities show proper fallback text
- Test responsive behavior on mobile viewport
- Test with dark and light Home Assistant themes
- Create second card instance for different resort (if available) to verify multi-resort support
- Run `npm run build` successfully with no errors
- Verify TypeScript compilation and linting pass cleanly

**Decisions**

- **Sensor config remains as example**: The current configuration.yaml with Sexten-specific sensors becomes reference documentation. Users replicate this pattern for their chosen resorts with their own sensor names
- **Card handles display only**: All web scraping and sensor creation stays in Home Assistant configuration. Card consumes any compatible sensor entities regardless of naming
- **LitElement over vanilla JS**: Better maintainability, Home Assistant standard, smaller learning curve for contributors
- **SVG over Canvas**: Better accessibility, scalability, theme integration, and easier to maintain programmatic graphics
- **Entity selectors over templates**: More user-friendly than requiring users to understand templating syntax
- **English as primary language**: Code, documentation, and default UI in English; translations via localization files
