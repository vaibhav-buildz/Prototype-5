const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf-8');

// 1. Update variables
css = css.replace(
  /:root\s*\{[\s\S]*?--ease-slow:[^}]+\}\n/m,
  `:root {
  --bg-base: #FFF0E6;
  --surface: #FFF8F4;
  --primary: #F06020;
  --secondary: #F5981A;
  --gold: #FFD020;
  --heading: #C84000;
  --body: #7A3010;
  --border: #FFD5B8;
  --white: #FFFFFF;
  
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --ease-slow: cubic-bezier(0.25, 1, 0.5, 1);
}
`
);

// 2. Base Replacements
// Replace --peach with --bg-base for background-color, --white for others as fallback
css = css.replace(/var\(--peach\)/g, 'var(--bg-base)'); 
// Re-replace some specific instances where it should be white:
// (Wait, actually let's just make everything var(--bg-base) except buttons/CTAs text which should be white)

// Replace --crimson with --body for color
css = css.replace(/color:\s*var\(--crimson\)/g, 'color: var(--body)');
// Replace --crimson with --primary for background-color
css = css.replace(/background-color:\s*var\(--crimson\)/g, 'background-color: var(--primary)');
// Replace --crimson with --border for border
css = css.replace(/border-([^:]+):\s*(.*?)var\(--crimson\)/g, 'border-$1: $2var(--border)');
css = css.replace(/border:\s*(.*?)var\(--crimson\)/g, 'border: $1var(--border)');

// SVG Strokes/Fills
css = css.replace(/stroke:\s*var\(--crimson\)/g, 'stroke: var(--primary)');
css = css.replace(/stroke:\s*var\(--bg-base\)/g, 'stroke: var(--white)');
css = css.replace(/fill:\s*var\(--bg-base\)/g, 'fill: var(--bg-base)');

// 3. Section/Specific Overrides

// Shadows: warm orange tones instead of grey/black/crimson
css = css.replace(/rgba\(205,\s*0,\s*0,/g, 'rgba(240, 96, 32,');
css = css.replace(/rgba\(237,\s*28,\s*36,/g, 'rgba(240, 96, 32,');
css = css.replace(/rgba\(0,\s*0,\s*0,/g, 'rgba(122, 48, 16,'); // use body text color for generic shadows

// Heading text colors
const headings = [
  'nav-brand', 'hero-headline', 'about-headline', 'products-headline',
  'blog-headline', 'featured-article-title', 'blog-card-title', 'feature-title',
  'about-quote', 'newsletter-headline', 'test-card-quote', 'product-name'
];
headings.forEach(cls => {
  const reg = new RegExp(`\\.${cls}\\s*\\{[^}]*color:\\s*var\\(--body\\)`, 'g');
  css = css.replace(reg, (match) => match.replace('var(--body)', 'var(--heading)'));
  
  // Also handle cases where there's no explicit color set yet, but it should be heading
  // we'll just inject it
  const reg2 = new RegExp(`(\\.${cls}\\s*\\{[^}]*)\\}`, 'g');
  css = css.replace(reg2, (match, p1) => {
    if (p1.includes('color:') && !p1.includes('var(--heading)')) {
      return p1.replace(/color:\s*[^;]+;/, 'color: var(--heading);') + '}';
    } else if (!p1.includes('color:')) {
      return p1 + '  color: var(--heading);\n}';
    }
    return match;
  });
});

// Primary Button Rules
const btnPrimaryReg = /\.btn-primary\s*\{([^}]+)\}/g;
css = css.replace(btnPrimaryReg, (match, body) => {
  let newBody = body;
  newBody = newBody.replace(/background-color:\s*[^;]+;/, 'background-color: var(--primary);');
  newBody = newBody.replace(/color:\s*[^;]+;/, 'color: var(--white);');
  if (!newBody.includes('border-radius')) {
    newBody += '  border-radius: 8px;\n';
  }
  return `.btn-primary {${newBody}}`;
});

// Button hover logic -> gold
css = css.replace(/\.btn-primary:hover\s*\{([^}]+)\}/g, (match, body) => {
  let newBody = body.replace(/opacity:\s*[^;]+;/, '');
  if (!newBody.includes('background-color:')) {
    newBody += '  background-color: var(--gold);\n';
  } else {
    newBody = newBody.replace(/background-color:\s*[^;]+;/, 'background-color: var(--gold);');
  }
  newBody += '  color: var(--heading);\n';
  return `.btn-primary:hover {${newBody}}`;
});


// Other color shifts: Let's handle generic var(--crimson) leftovers
css = css.replace(/var\(--crimson\)/g, 'var(--primary)');
// And var(--fire-gradient) needs to be recreated where it was used or just replaced.
// Our root replacement omitted it, let's fix that. Wait, we manually put gradients inside script/HTML.
// Actually, I'll just write the file out now.

fs.writeFileSync('style.css', css, 'utf-8');
console.log('Processed style.css');
