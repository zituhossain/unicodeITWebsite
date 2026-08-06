const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const root = 'app/globals.css';
const lines = fs.readFileSync(root, 'utf8').split(/\r?\n/);
const out = [];
for (const ln of lines) {
  const t = ln.trim();
  if (t.startsWith('@import ')) {
    const q1 = t.indexOf('"');
    if (q1 === -1) {
      out.push(ln);
      continue;
    }
    const q2 = t.indexOf('"', q1 + 1);
    const imp = t.slice(q1 + 1, q2);
    if (imp.startsWith('.')) {
      const fp = path.resolve(path.dirname(root), imp);
      out.push(fs.readFileSync(fp, 'utf8'));
    }
  } else {
    out.push(ln);
  }
}
const css = out.join('\n');
postcss([tailwind()]).process(css, { from: root })
  .then(() => console.log('ok'))
  .catch((e) => {
    console.log('ERR', e.message);
    console.log('line', e.line, 'col', e.column);
    if (e.source) console.log((e.source || '').slice(0, 260));
  });
