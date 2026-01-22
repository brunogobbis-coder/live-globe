# Nuvemshop Live Globe - Architecture

## Component Structure

The application has been refactored into modular components for better maintainability.

```
nuvemshop-live-globe/
├── index.html              # Main HTML (still contains inline styles/scripts)
├── css/
│   ├── main.css            # Main entry point (imports all components)
│   ├── base.css            # Variables, resets, utilities
│   └── components/
│       ├── header.css          # Header navigation
│       ├── gmv-display.css     # GMV counter
│       ├── stats-bar.css       # Stats bar with Brazilian context
│       ├── segment-filters.css # Product segment filters
│       ├── channel-tabs.css    # Sales channel tabs
│       ├── solutions-stats.css # NuvemPay/NuvemEnvios stats
│       ├── sales-panel.css     # Recent sales list
│       ├── brazil-map.css      # Interactive map & city dots
│       ├── info-panel.css      # Left info panel
│       ├── region-tooltip.css  # City/state tooltips
│       ├── celebration.css     # First sale celebration
│       ├── animations.css      # Delivery, money, regional emojis
│       ├── loading.css         # Loading screen
│       └── right-sidebar.css   # Right sidebar container
├── js/
│   ├── config.js               # Configuration & data
│   ├── utils.js                # Utility functions
│   └── components/
│       ├── stats.js            # Stats display & updates
│       ├── celebration.js      # First sale celebrations
│       ├── map-animations.js   # Map animations
│       ├── map-zoom.js         # Zoom functionality
│       ├── tooltip.js          # Region tooltips
│       └── filters.js          # Segment & channel filters
├── lambda/                     # AWS Lambda functions
├── terraform/                  # Infrastructure as code
└── scripts/                    # Deployment scripts
```

## Component Descriptions

### CSS Components

| Component | Description |
|-----------|-------------|
| `base.css` | Nimbus Design System variables, resets, scrollbars |
| `header.css` | Top navigation bar with logo and CTA |
| `gmv-display.css` | Large GMV counter with tooltip |
| `stats-bar.css` | Horizontal stats with Brazilian context |
| `segment-filters.css` | Product category filter buttons |
| `channel-tabs.css` | Sales channel filter tabs |
| `solutions-stats.css` | NuvemPay & NuvemEnvios stats |
| `sales-panel.css` | Left panel with recent sales list |
| `brazil-map.css` | SVG map, city dots, zoom controls |
| `info-panel.css` | Left side info title panel |
| `region-tooltip.css` | Detailed city/state popup |
| `celebration.css` | First sale modal with confetti |
| `animations.css` | Delivery, money, regional emojis |
| `loading.css` | Initial loading overlay |
| `right-sidebar.css` | Right sidebar container |

### JavaScript Components

| Component | Description |
|-----------|-------------|
| `config.js` | API config, segments, channels, states, icons |
| `utils.js` | Format functions, random generators |
| `stats.js` | Stats updates, Brazilian context, map pulse |
| `celebration.js` | First sale celebration logic |
| `map-animations.js` | Delivery, money, regional emoji animations |
| `map-zoom.js` | Zoom to state functionality |
| `tooltip.js` | Region tooltip display |
| `filters.js` | Segment and channel filtering |

## Usage

### Current State (Inline)

The `index.html` currently contains all styles and scripts inline for simplicity. The component files serve as reference for future refactoring.

### Future Migration

To use the modular files:

1. Replace the inline `<style>` with:
```html
<link rel="stylesheet" href="css/main.css">
```

2. Replace inline scripts with:
```html
<script src="js/config.js"></script>
<script src="js/utils.js"></script>
<script src="js/components/stats.js"></script>
<script src="js/components/celebration.js"></script>
<script src="js/components/map-animations.js"></script>
<script src="js/components/map-zoom.js"></script>
<script src="js/components/tooltip.js"></script>
<script src="js/components/filters.js"></script>
<script src="js/app.js"></script>
```

### Build Process (Optional)

For production, consider using:
- **Vite** or **esbuild** for bundling
- **PostCSS** for CSS processing
- **Terser** for JS minification

## Design System

The application uses **Nimbus Design System** (Nuvemshop's design system):

- Primary: `#0059d5` (Blue)
- Success: `#36b37e` (Green)
- Warning: `#ffab00` (Orange)
- Danger: `#de350b` (Red)

Brazilian identity is added through:
- Regional emojis and expressions
- State-specific icons and colors
- Emotional celebration messages
- Contextual stats labels

## Rollback

To rollback to pre-refactor version:
```bash
git checkout v1.0-pre-brazilian-ui
```
