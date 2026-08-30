/**
 * Folds the Vite build into one self-contained HTML fragment.
 *
 * Used to publish a shareable preview: CSS and JS are inlined, and the output
 * carries no <html>/<head>/<body> wrapper so a host page can render it directly.
 * Run after `npm run build`.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'dist', 'assets');
const out = process.argv[2] || join(root, 'dist', 'bootstack-single.html');

const files = readdirSync(assets);
const css = files.find((f) => f.endsWith('.css'));
const js = files.find((f) => f.endsWith('.js'));

if (!css || !js) {
  throw new Error('No built assets found — run `npm run build` first.');
}

const fonts =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800' +
  '&family=Inter+Tight:ital,wght@0,300..700;1,400&family=JetBrains+Mono:wght@400;500&display=swap';

const html = `<title>Bootstack</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fonts}" rel="stylesheet">
<style>
${readFileSync(join(assets, css), 'utf8')}
</style>
<div id="root"></div>
<script type="module">
${readFileSync(join(assets, js), 'utf8')}
</script>
`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html, 'utf8');
console.log(`Wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
