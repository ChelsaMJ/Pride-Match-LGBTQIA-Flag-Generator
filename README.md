# PrideMatch

PrideMatch is an educational LGBT+ identity and pride flag explorer. It includes a searchable flag encyclopedia, an identity and attraction analyzer, stripe meaning details, and guidance for understanding the Split Attraction Model (SAM).

## Features

- Browse 125+ pride flags by category
- Search flags by name, description, tags, and colors
- View local SVG and PNG flag artwork from `assets/flags`
- Inspect stripe colors, meanings, and identity details
- Analyze natural-language descriptions of attraction and identity
- Explore SAM and flag-oriented guidance

## Run Locally

The project is a static HTML, CSS, and JavaScript application. Python is only used as a lightweight local server:

```powershell
python server.py
```

Then open [http://localhost:8080](http://localhost:8080).

You can also serve the project with any static web server. Opening `index.html` directly may restrict ES module loading in some browsers.

## Project Structure

- `index.html` - Application entry point
- `styles.css` - Custom styles
- `js/app.js` - Application initialization and view routing
- `js/components/` - Encyclopedia, analyzer, guide, header, and modal views
- `js/data/flagsData.js` - Flag metadata and image references
- `js/nlp/ragEngine.js` - Identity and attraction matching logic
- `js/utils/svgRenderer.js` - Local asset-backed flag rendering with fallback support
- `assets/flags/` - Bundled flag artwork
- `server.py` - Local development server

## Content Note

PrideMatch is an educational reference tool, not a diagnostic service. Identity labels and flag meanings can vary across communities and over time.
