# Snow Report Lovelace Card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)
[![hacs][hacsbadge]][hacs]

A beautiful custom Lovelace card for Home Assistant that visualizes ski resort snow conditions with an SVG mountain graphic, displaying snow depths at valley and mountain elevations.

![Snow Report Card Preview](https://via.placeholder.com/600x400?text=Snow+Report+Card+Preview)

## Features

✨ **Beautiful SVG Mountain Visualization** - Displays snow depth data on an elegant mountain graphic  
🌍 **Multi-language Support** - English, Dutch, German, Italian, French, and Spanish  
🎨 **Theme Compatible** - Automatically adapts to your Home Assistant theme  
📱 **Responsive Design** - Looks great on desktop and mobile  
⚙️ **Highly Configurable** - Customize colors, display options, and more  
🔄 **Multi-Resort Support** - Add multiple cards for different ski resorts  
📊 **Forecast Display** - Optional 5-day snow forecast and 24-hour snowfall  
🎯 **Visual Editor** - Easy configuration through the Lovelace UI

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to "Frontend" section
3. Click the "+" button
4. Search for "Snow Report Lovelace Card"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download `snowreport-card.js` from the [latest release][releases]
2. Copy it to `<config>/www/community/snowreport-card/snowreport-card.js`
3. Add the resource to your Lovelace dashboard:
   - Go to Settings → Dashboards → Resources
   - Click "+ Add Resource"
   - URL: `/local/community/snowreport-card/snowreport-card.js`
   - Resource type: JavaScript Module
4. Refresh your browser

### Building from Source

If you want to build from source:

```bash
npm install
npm run build
```

Then copy `dist/snowreport-card.js` to `<config>/www/community/snowreport-card/snowreport-card.js`.

## Quick Start

Before using this card, you need to set up sensors that scrape snow data from a website. See the [Setting Up Sensors](#setting-up-sensors) section below for detailed instructions.

### Minimal Configuration

```yaml
type: custom:snowreport-card
resort_name: My Ski Resort
entities:
  mountain_snow_depth: sensor.resort_mountain_snow
  valley_snow_depth: sensor.resort_valley_snow
language: en
```

### Full Configuration Example

```yaml
type: custom:snowreport-card
resort_name: My Ski Resort
entities:
  mountain_snow_depth: sensor.resort_mountain_snow
  valley_snow_depth: sensor.resort_valley_snow
  last_update: sensor.resort_last_update
  snowfall_24h: sensor.resort_snowfall_24h
  forecast_mountain_snow: sensor.resort_forecast_mountain_snow
  forecast_valley_snow: sensor.resort_forecast_valley_snow
  mountain_elevation: sensor.resort_mountain_elevation
  valley_elevation: sensor.resort_valley_elevation
display_options:
  show_forecast: true
  show_elevation: true
  show_mountain_graphic: true
  compact_mode: false
  mountain_color: '#D3D3D3'
  snow_color: '#FFFFFF'
language: en
```

## Configuration Options

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | string | **Yes** | - | Must be `custom:snowreport-card` |
| `resort_name` | string | No | - | Display name for the ski resort |
| `language` | string | No | `en` | Language code: `en`, `nl`, `de`, `it`, `fr`, `es` |

### Entities

All entities should be sensor entity IDs. At minimum, you need `mountain_snow_depth` and `valley_snow_depth`.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mountain_snow_depth` | string | **Yes** | Sensor showing snow depth at mountain elevation (in cm) |
| `valley_snow_depth` | string | **Yes** | Sensor showing snow depth at valley elevation (in cm) |
| `last_update` | string | No | Sensor or timestamp for last data update |
| `snowfall_24h` | string | No | Snowfall in the last 24 hours (in cm) |
| `forecast_mountain_snow` | string | No | 5-day forecast for mountain snow (in cm) |
| `forecast_valley_snow` | string | No | 5-day forecast for valley snow (in cm) |
| `mountain_elevation` | string | No | Mountain elevation (in meters) |
| `valley_elevation` | string | No | Valley elevation (in meters) |

### Display Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `show_forecast` | boolean | `true` | Show forecast section if forecast entities are configured |
| `show_elevation` | boolean | `true` | Show elevation information |
| `show_mountain_graphic` | boolean | `true` | Show the mountain SVG graphic |
| `compact_mode` | boolean | `false` | Use compact layout with smaller padding |
| `mountain_color` | string | `#D3D3D3` | Custom color for the mountain graphic |
| `snow_color` | string | `#FFFFFF` | Custom color for snow markers |

## Setting Up Sensors

This card requires sensor entities that provide snow depth data. Since most ski resorts don't have public APIs, the most common approach is to use Home Assistant's **scrape integration** to extract data from snow report websites.

### Using sneeuwhoogte.nl (Recommended)

[sneeuwhoogte.nl](https://www.sneeuwhoogte.nl/) is a comprehensive snow report aggregator covering many European ski resorts.

#### Step 1: Find Your Ski Resort

1. Navigate to [https://www.sneeuwhoogte.nl/](https://www.sneeuwhoogte.nl/)
2. Search for your ski resort
3. Copy the resort URL (e.g., `https://www.sneeuwhoogte.nl/overzicht/frankrijk/savoie/espace-killy/tignes`)

#### Step 2: Create Scrape Sensors

| Note: replace `[Resort]` with your resort name and `[your-resort-url]` with the URL slug from https://www.sneeuwhoogte.nl.

Add to your `configuration.yaml`:

```yaml
scrape:
  - resource: https://www.sneeuwhoogte.nl/overzicht/[your-resort-url]
    scan_interval: 3600  # Update every hour
    sensor:
      - name: "[Resort] Mountain Snow Raw"
        select: "h2.summary_card__heights span.summary-card__label:contains('Berg') + span"
      
      - name: "[Resort] Valley Snow Raw"
        select: "h2.summary_card__heights span.summary-card__label:contains('Dal') + span"
      
      - name: "[Resort] Snowfall 24h Raw"
        select: "tr th:contains('Laatste 24') + td"
      
      - name: "[Resort] Elevation Raw"
        select: "div.entry-header h6"
```

For forecast data, add a second scrape entry with `/weer` appended:

| Note: don't repeat `scrape:`; just add another item to the existing list.

```yaml
scrape:
  - resource: https://www.sneeuwhoogte.nl/overzicht/[your-resort-url]/weer
    scan_interval: 3600
    sensor:
      - name: "[Resort] Forecast Mountain Snow Raw"
        select: ".forecast__footer-value"
        index: 0
      
      - name: "[Resort] Forecast Valley Snow Raw"
        select: ".forecast__footer-value"
        index: 2
```
#### Step 3: Create Template Sensors

The raw sensors return text like "80 cm". Use template sensors to extract numeric values:

```yaml
template:
  - sensor:
      - name: "[Resort] Mountain Snow"
        unit_of_measurement: "cm"
        state_class: measurement
        state: >
          {% set v = states('sensor.[resort]_mountain_snow_raw') %}
          {% if v not in ('unknown', 'unavailable', '') %}
            {% set nums = v | regex_findall('\d+') %}
            {{ nums[0] if nums | length > 0 else 0 }}
          {% else %}
            0
          {% endif %}
      
      - name: "[Resort] Valley Snow"
        unit_of_measurement: "cm"
        state_class: measurement
        state: >
          {% set v = states('sensor.[resort]_valley_snow_raw') %}
          {% if v not in ('unknown', 'unavailable', '') %}
            {% set nums = v | regex_findall('\d+') %}
            {{ nums[0] if nums | length > 0 else 0 }}
          {% else %}
            0
          {% endif %}
```

**Note:** See [configuration.yaml](docs/configuration.yaml) for a complete working example using the Tignes resort.

### Troubleshooting Sensors

**CSS Selectors Not Working?**

Websites change their structure. To find the correct selectors:

1. Open the resort page in your browser
2. Right-click the snow depth value → "Inspect Element"
3. Use browser DevTools to identify the correct CSS selector
4. Update your `configuration.yaml` with the new selector
5. Restart Home Assistant

**Best Practices:**
- Use `scan_interval: 3600` (1 hour) - snow doesn't change that quickly
- Never use less than 600 seconds to avoid overloading source websites
- Check [configuration.yaml](docs/configuration.yaml) for a complete working example

## Troubleshooting

### Card doesn't appear in the card picker

- Verify the resource is correctly added to your dashboard resources
- Check the browser console (F12) for JavaScript errors
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Ensure the file path is correct: `/local/community/snowreport-card/snowreport-card.js`

### "Custom element doesn't exist: snowreport-card"

- The JavaScript file isn't loading. Check the resource URL
- Look in the browser Network tab to see if the file loads (should return 200 OK)
- Verify the file exists in `<config>/www/community/snowreport-card/`

### Card shows "Invalid configuration"

- Ensure `mountain_snow_depth` and `valley_snow_depth` entities are specified
- Check that entity IDs are correct and exist in your Home Assistant instance
- Verify the YAML syntax is correct (proper indentation)

### Snow depth shows "--" or "unavailable"

- Check that your sensor entities are working and have valid states
- Go to Developer Tools → States and verify the sensor values
- Ensure sensor values are numeric (not "unknown" or "unavailable")
- If using scrape sensors, check that CSS selectors are still valid

### Mountain graphic doesn't display

- Ensure `show_mountain_graphic` is not set to `false`
- Check browser console for SVG rendering errors
- Try refreshing the page

### Data is outdated

- Check your scrape sensor `scan_interval` setting
- Verify the source website hasn't changed its structure
- Test the scrape URL in your browser to ensure it's accessible

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Credits

Built with:
- [LitElement](https://lit.dev/) - Web components
- [Home Assistant](https://www.home-assistant.io/) - Smart home platform
- [custom-card-helpers](https://github.com/custom-cards/custom-card-helpers) - Helper library

---

[releases-shield]: https://img.shields.io/github/release/FokkoVeegens/snowreport-lovelace-card.svg?style=for-the-badge
[releases]: https://github.com/FokkoVeegens/snowreport-lovelace-card/releases
[license-shield]: https://img.shields.io/github/license/FokkoVeegens/snowreport-lovelace-card.svg?style=for-the-badge
[hacs]: https://hacs.xyz
[hacsbadge]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge

