# Readify — Frontend Prototype

A multi-page, HTML/CSS/JS-only front-end for Readify, an interactive reading platform.

## Design Documentation

- `design-rationale.md` — Explains the color palette, typography, and responsive strategy.
- `design-documentation.md` — Includes wireframes and mockups for the website pages.

## Website Structure & Content

- `favicon.ico` — Browser tab icon (add a 16x16 or 32x32 ICO file to the root)
- `manifest.json` — PWA manifest for installable app experience
- Expanded text content across all pages for better user engagement and clarity

## Pages

- `index.html` — Home page with hero section.
- `book-explorer.html` — Book browsing with filters and modal details.
- `progress.html` — Reading progress tracking.
- `recommender.html` — Book recommendation system.
- `reading-flow.html` — Reading environment with sound controls.
- `feedback.html` — User feedback and contact.

- `js/*.extra.js` — Page-specific extras providing small UI enhancements (home, explorer, progress, recommender, flow, feedback)
  - Recommender improvements: "View in Explorer" button to open the selected book in the Book Explorer; save button is disabled unless a selection is active and gives user feedback.  
  - Reading Flow: added multi-sound options (Cozy Lounge, Rain, Cafe Ambience), play/pause button, and volume control; settings are persisted in localStorage across sessions.

## How to run

- Open `index.html` in a browser. No server required.
- For local images to load from `assets/`, open the file directly (modern browsers allow file:// requests for local assets).
- In the Feedback page, there is a Google Maps embed showing a sample location and an 'Open in Google Maps' link for navigation. The map is embedded via an iframe and centers on New York by default; update the query in `feedback.html` if you'd like a different location.

## Tools used

LocalStorage for persistence, best-effort accessible interactions, responsive CSS and JS.

## Notes

Images are inline placeholders (SVG/CSS). You can replace with your assets in `assets/` if needed.