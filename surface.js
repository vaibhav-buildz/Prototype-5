const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf-8');

// The original script didn't apply --surface to cards. 
// Let's identify card classes and set their background-color to var(--surface);
const surfaceClasses = ['.blog-card', '.feature-cell', '.test-card', '.about-graphic'];

surfaceClasses.forEach(cls => {
  const reg = new RegExp(`(\\.${cls.replace('.', '')}\\s*\\{[^}]*)background-color:\\s*var\\(--bg-base\\)`, 'g');
  css = css.replace(reg, '$1background-color: var(--surface)');
  
  // also handle some edge cases
  const reg2 = new RegExp(`(\\.${cls.replace('.', '')}\\s*\\{[^}]*)background:\\s*var\\(--bg-base\\)`, 'g');
  css = css.replace(reg2, '$1background: var(--surface)');
});

// For .test-card we know it is a card and might have its bg-base changed
css = css.replace(/\.test-card\s*\{([^}]+)\}/, (match, body) => {
  return `.test-card {${body.replace(/background-color:\s*var\(--bg-base\)/, 'background-color: var(--surface)')}}`;
});

// For .feature-cell
css = css.replace(/\.feature-cell\s*\{([^}]+)\}/, (match, body) => {
  return `.feature-cell {${body.replace(/background-color:\s*var\(--bg-base\)/, 'background-color: var(--surface)')}}`;
});

// For .blog-card
css = css.replace(/\.blog-card\s*\{([^}]+)\}/, (match, body) => {
  return `.blog-card {${body.replace(/background-color:\s*var\(--bg-base\)/, 'background-color: var(--surface)')}}`;
});

// also .navbar might need something but they just asked for "use this everywhere as the base"
// and "Surface/cards/sections: #FFF8F4"

fs.writeFileSync('style.css', css, 'utf-8');
console.log('Processed surfaces');
