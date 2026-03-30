const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf-8');

// The hero section's background-color was var(--body). It should be var(--bg-base) since it's everywhere as the base.
// Color of text in hero should be var(--body) or var(--heading).
css = css.replace(/\.hero-section\s*\{([^}]+)\}/, (match, body) => {
  let b = body.replace(/background-color:\s*var\([^)]+\);/, 'background-color: var(--surface);');
  b = b.replace(/color:\s*var\([^)]+\);/, 'color: var(--body);'); // fallback color for section
  return `.hero-section {${b}}`;
});

// Products section
css = css.replace(/\.products-section\s*\{([^}]+)\}/, (match, body) => {
  let b = body.replace(/background-color:\s*var\([^)]+\);/, 'background-color: var(--bg-base);');
  b = b.replace(/color:\s*var\([^)]+\);/, 'color: var(--body);');
  return `.products-section {${b}}`;
});

// Features section grid lines (was a red background making 1px lines)
css = css.replace(/\.features-grid\s*\{([^}]+)\}/, (match, body) => {
  let b = body.replace(/background-color:\s*var\([^)]+\);/, 'background-color: var(--border);');
  return `.features-grid {${b}}`;
});

// Blog section
css = css.replace(/\.blog-section\s*\{([^}]+)\}/, (match, body) => {
  let b = body.replace(/background-color:\s*var\([^)]+\);/, 'background-color: var(--bg-base);');
  b = b.replace(/color:\s*var\([^)]+\);/, 'color: var(--body);');
  return `.blog-section {${b}}`;
});

// Testimonials section
css = css.replace(/\.testimonials-section\s*\{([^}]+)\}/, (match, body) => {
  let b = body.replace(/background-color:\s*var\([^)]+\);/, 'background-color: var(--surface);');
  b = b.replace(/color:\s*var\([^)]+\);/, 'color: var(--body);');
  return `.testimonials-section {${b}}`;
});

// Footer
css = css.replace(/\.footer-section\s*\{([^}]+)\}/, (match, body) => {
  let b = body.replace(/background-color:\s*var\([^)]+\);/, 'background-color: var(--bg-base);');
  b = b.replace(/color:\s*var\([^)]+\);/, 'color: var(--body);');
  return `.footer-section {${b}}`;
});

// Make sure other generic text has right color (no white text since bg is peach)
// Replace white text anywhere it's used generally except buttons
css = css.replace(/color:\s*var\(--bg-base\);/g, 'color: var(--body);'); 
css = css.replace(/color:\s*var\(--white\);/g, 'color: var(--body);'); 
// Then we re-enforce .btn-primary white
css = css.replace(/\.btn-primary\s*\{([^}]+)\}/, (match, body) => {
  let b = body.replace(/color:\s*var\([^)]+\);/, 'color: var(--white);');
  return `.btn-primary {${b}}`;
});

// Button secondary needs to be secondary
css = css.replace(/\.btn-secondary\s*\{([^}]+)\}/, (match, body) => {
  let b = body;
  b = b.replace(/border: 1px solid var\([^)]+\);/, 'border: 1px solid var(--secondary);');
  b = b.replace(/color:\s*var\([^)]+\);/, 'color: var(--secondary);');
  b = b.replace(/background-color:\s*[^;]+;/, 'background-color: transparent;');
  return `.btn-secondary {${b}}`;
});

css = css.replace(/\.btn-secondary:hover\s*\{([^}]+)\}/, (match, body) => {
  let b = body;
  b = b.replace(/background-color:\s*var\([^)]+\);/, 'background-color: var(--secondary);');
  b = b.replace(/color:\s*var\([^)]+\);/, 'color: var(--white);');
  return `.btn-secondary:hover {${b}}`;
});

// Remove any remaining generic backgrounds that are pure primary not meant for buttons/accents
// Like if background-color: var(--primary); is on a non-button
css = css.replace(/background-color:\s*var\(--body\);/g, 'background-color: var(--primary);'); // if we missed any
// Wait, the user asked for orange everywhere as accent and peach as background. We should make sure that nav, etc. have peach background.
// .navbar has --bg-base, we are good.

// The Phoenix Logo should be gradient from bg-base? Actually, the logo icon gradients are --primary, --secondary, --gold.
css = css.replace(/var\(--bg-base\)/g, 'var(--bg-base)');

fs.writeFileSync('style.css', css, 'utf-8');
console.log('Processed section colors');
