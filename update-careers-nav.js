// Removes Careers from header nav (desktop + mobile) on all pages
// Adds Careers link to footer Company section on pages that don't have it yet
// Skips careers.html and careers-thank-you.html (footer already has it; no nav entry to remove)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const SERVICES = path.join(ROOT, 'services');

const rootFiles = [
  'index.html', 'about.html', 'contact.html', 'how-it-works.html',
  'services.html', 'terms.html', 'policy.html', 'accessibility.html',
  'privacy.html', 'thank-you.html'
].map(f => path.join(ROOT, f));

const serviceFiles = fs.readdirSync(SERVICES)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(SERVICES, f));

function updatePage(file, navPrefix, careersPrefix) {
  let content = fs.readFileSync(file, 'utf8');

  // --- 1. Remove from desktop nav ---
  content = content.replace(
    new RegExp(`[ \\t]*<li><a href="${careersPrefix}careers\\.html"[^>]*class="nav-link"[^>]*>Careers</a></li>\\r?\\n`, 'g'),
    ''
  );

  // --- 2. Remove from mobile nav ---
  content = content.replace(
    new RegExp(`[ \\t]*<a href="${careersPrefix}careers\\.html"[^>]*class="nav-mobile-link"[^>]*>Careers</a>\\r?\\n`, 'g'),
    ''
  );

  // --- 3. Add to footer Company section (if not already there) ---
  const careersFooterHref = `${careersPrefix}careers.html`;
  if (!content.includes(`href="${careersFooterHref}" class="footer-link"`)) {
    // Find Company section and insert Careers before its closing </ul>
    content = content.replace(
      /(<h4 class="footer-col-title">Company<\/h4>[\s\S]*?)([ \t]*<\/ul>[\s\S]*?<\/div>)/,
      (match, section, closing) => {
        const indent = (closing.match(/^[ \t]+/) || ['            '])[0];
        const careersLine = `${indent}<li><a href="${careersFooterHref}" class="footer-link">Careers</a></li>\n`;
        return section + careersLine + closing;
      }
    );
  }

  return content;
}

let updated = 0;

for (const file of rootFiles) {
  const original = fs.readFileSync(file, 'utf8');
  const patched = updatePage(file, '', '');
  if (patched !== original) {
    fs.writeFileSync(file, patched, 'utf8');
    console.log(`UPDATED: ${path.basename(file)}`);
    updated++;
  } else {
    console.log(`NO CHANGE: ${path.basename(file)}`);
  }
}

for (const file of serviceFiles) {
  const original = fs.readFileSync(file, 'utf8');
  const patched = updatePage(file, '../', '../');
  if (patched !== original) {
    fs.writeFileSync(file, patched, 'utf8');
    console.log(`UPDATED: ${path.relative(ROOT, file)}`);
    updated++;
  } else {
    console.log(`NO CHANGE: ${path.relative(ROOT, file)}`);
  }
}

console.log(`\nDone — ${updated} files updated.`);
