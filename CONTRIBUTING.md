# Contributing to Snow Report Lovelace Card

Thank you for your interest in contributing! This document provides guidelines and instructions for developers.

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm
- A Home Assistant instance for testing

### Getting Started

1. **Fork and clone the repository**

```bash
git clone https://github.com/FokkoVeegens/snowreport-lovelace-card.git
cd snowreport-lovelace-card
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The dev server runs on `http://localhost:10001` and watches for file changes with automatic reload.

## Project Structure

```
snowreport-lovelace-card/
├── src/
│   ├── snowreport-card.ts      # Main card component
│   ├── editor.ts                # Visual configuration editor
│   ├── types.ts                 # TypeScript interfaces
│   ├── styles.ts                # CSS styles
│   ├── localize/
│   │   ├── localize.ts          # Localization system
│   │   └── languages/           # Translation files (en, nl, de, it, fr, es)
│   └── utils/
│       ├── svg-mountain.ts      # SVG mountain graphic generator
│       └── ha-helper.ts         # Home Assistant helper functions
├── dist/                        # Build output (generated)
├── configuration.yaml           # Example sensor configuration
├── preview.html                 # SVG preview without HA
└── package.json
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Production build with minification |
| `npm run dev` | Development mode with live reload |
| `npm run watch` | Watch mode (alias for dev) |
| `npm run lint` | Run ESLint (if configured) |

## Development Workflow

### 1. Make Changes

Edit TypeScript files in the `src/` directory. The dev server will automatically rebuild and reload.

### 2. Test Locally

#### Option A: Preview SVG (No Home Assistant Required)

Open `preview.html` in your browser to see the mountain graphic without running Home Assistant.

#### Option B: Test in Home Assistant

1. Build the card:
   ```bash
   npm run build
   ```

2. Copy to Home Assistant:
   ```bash
   cp dist/snowreport-card.js /path/to/homeassistant/www/community/snowreport-card/
   ```

3. Add as a resource in Home Assistant:
   - Go to Settings → Dashboards → Resources
   - Add `/local/community/snowreport-card/snowreport-card.js` (type: JavaScript Module)

4. Add the card to a dashboard and test

5. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R) after changes

### 3. Test Different Scenarios

- ✅ Valid sensor data
- ✅ Missing/unavailable sensors
- ✅ Different languages
- ✅ Light and dark themes
- ✅ Mobile and desktop viewports
- ✅ All display options (compact mode, hiding forecast, etc.)

## Code Style Guidelines

### TypeScript

- Use TypeScript for type safety
- Follow existing code structure
- Add JSDoc comments for public methods
- Use meaningful variable names

### Lit Templates

- Use Lit's `html` and `svg` template tags
- Keep template logic simple
- Extract complex logic to methods

### CSS

- Use CSS custom properties for theming
- Support both light and dark modes
- Make responsive (mobile-first)
- Follow existing naming conventions

### Localization

To add a new language:

1. Create `src/localize/languages/XX.json` (where XX is language code)
2. Copy structure from `en.json`
3. Translate all strings
4. Add language code to `SUPPORTED_LANGUAGES` in `src/types.ts`
5. Add option to editor dropdown in `src/editor.ts`

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add tests if applicable
   - Update documentation

3. **Test thoroughly**
   - Build succeeds without errors
   - Card works in Home Assistant
   - No console errors

4. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description of changes"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

6. **PR Requirements**
   - Clear description of changes
   - Screenshots/GIFs for UI changes
   - No breaking changes (or clearly documented)
   - Builds successfully

## Common Development Tasks

### Adding a New Display Option

1. Add to `DisplayOptions` interface in `src/types.ts`
2. Update `DEFAULT_DISPLAY_OPTIONS` with default value
3. Add UI control in `src/editor.ts`
4. Implement logic in `src/snowreport-card.ts` render method
5. Update README.md documentation

### Modifying the SVG Graphic

1. Edit `src/utils/svg-mountain.ts`
2. Test with `preview.html`
3. Verify with different data values (null, 0, large numbers)
4. Ensure responsive scaling works

### Updating Styles

1. Edit `src/styles.ts`
2. Use CSS custom properties for theme support:
   - `--primary-text-color`
   - `--secondary-text-color`
   - `--divider-color`
   - `--card-background-color`
3. Test in both light and dark themes

## Debugging

### Browser DevTools

- Open console (F12) to see errors
- Use Elements tab to inspect rendered HTML/CSS
- Network tab to verify resource loading

### Common Issues

**Card not loading:**
- Check console for errors
- Verify resource path is correct
- Clear browser cache

**Changes not appearing:**
- Hard refresh (Ctrl+Shift+R)
- Check file is actually updated in `www/` folder
- Verify Home Assistant resource configuration

**TypeScript errors:**
- Run `npm run build` to see compilation errors
- Check type definitions in `src/types.ts`

## Testing

Currently, testing is manual. When adding features:

1. Test with real sensor data
2. Test with missing/unavailable data
3. Test all configuration options
4. Test in different browsers (Chrome, Firefox, Safari)
5. Test on mobile devices

## Documentation

When making changes, update:

- README.md - user-facing features and configuration
- CONTRIBUTING.md - developer processes (this file)
- Code comments - complex logic
- This file - new development procedures

## Questions or Problems?

- Check existing [issues](https://github.com/FokkoVeegens/snowreport-lovelace-card/issues)
- Create a new issue with detailed description
- Tag appropriately (bug, enhancement, question)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
