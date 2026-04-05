# Antigravity Repo Skill

This skill defines the development environment and standards for the Blazion Prototype-5 project.

## Project Overview
Blazion Prototype-5 is a high-end web prototype focused on branding, visual excellence, and premium design. It uses a custom Node.js server for development and has a script-based theme management system.

## Performance & Style
- **Aesthetics**: Always prioritize visual excellence. Use the established color palette (e.g., those defined in `retheme.js`).
- **Typography**: Use 'Cormorant Garamond' for displays and 'DM Sans' for body text.
- **Server**: Run `node serve.js` to start the local development server at `http://localhost:3000`.

## Architecture
- **HTML**: Main structure in standalone HTML files.
- **CSS**: Centralized `style.css`, modified via `retheme.js` for theme updates.
- **JS**: Modular scripts like `script.js`, `surface.js`, `sections.js`.

## Task Workflows
Use the following workflows for common tasks:
- `/start`: Start the development server.
- `/theme`: Apply the theme changes from `retheme.js`.
- `/page <name>`: Create a new page from the base template.

## Rules
1. Never use plain colors; always use the CSS variables defined in `:root`.
2. Ensure every interactive element has a unique ID for testing.
3. Always check `retheme.js` before making global CSS changes to ensure they are compatible with the theme processor.
