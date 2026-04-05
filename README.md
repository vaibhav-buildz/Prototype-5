# Blazion Prototype 5

## Visual Identity
*   **Palette**: Warm, earthy, and refined.
*   **Typography**: 'Cormorant Garamond' (Serif) and 'DM Sans' (Sans-Serif).
*   **Vibe**: High-end, premium experience.

## Technical Details
This is a modular static site with a custom theme management system (`retheme.js`) and a lightweight Node.js server (`serve.js`).

### Core Files
- `index.html`: Entry point.
- `style.css`: Master stylesheet (use `npm run retheme` after changing variables).
- `script.js`: Main interaction logic.
- `surface.js`: Surface-level UI logic.
- `sections.js`: Custom layout section management.

### Dev Commands
- `npm run dev`: Start the server at `http://localhost:3000/`.
- `npm run retheme`: Apply the current theme variables across the CSS file.

## Antigravity Automation
Type `/` in the prompt to use workflows:
- `/start`: Directly invokes the dev server.
- `/theme`: Runs the retheme tool.
