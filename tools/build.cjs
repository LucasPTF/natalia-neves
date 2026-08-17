const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of ['index.html', 'a1', 'a2', 'a3', 'assets']) {
  fs.cpSync(path.join(root, entry), path.join(dist, entry), { recursive: true });
}

console.log('Site preparado em dist/ com as rotas /a1, /a2 e /a3.');
