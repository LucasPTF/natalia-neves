const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const routes = ['a1', 'a2', 'a3'];
const expectedHeadlines = [
  'Você pede com calma.<br>Mas só é ouvida quando grita.',
  '“Já falei mil vezes.”<br>E mesmo assim parece que ele não me escuta.',
  'Você não queria virar a mãe que grita.<br>Mas tem dias que parece inevitável.',
];

let failed = false;

for (const [index, route] of routes.entries()) {
  const routeDir = path.join(root, route);
  const htmlPath = path.join(routeDir, 'index.html');
  const cssPath = path.join(routeDir, 'styles.css');
  const jsPath = path.join(routeDir, 'script.js');

  for (const file of [htmlPath, cssPath, jsPath]) {
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      console.error(`Arquivo ausente ou vazio: ${file}`);
      failed = true;
    }
  }

  if (!fs.existsSync(htmlPath)) continue;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const checks = [
    ['headline correta', html.includes(expectedHeadlines[index])],
    ['CSS externo', html.includes('href="styles.css"')],
    ['JavaScript externo', html.includes('src="script.js"')],
    ['imagem local', html.includes('../assets/natalia-neves-hero.png')],
    ['sem hotlink antigo', !html.includes('eltonitokazu.com')],
    ['cinco perguntas de FAQ', (html.match(/class="faq-question"/g) || []).length === 5],
  ];

  for (const [name, ok] of checks) {
    if (!ok) {
      console.error(`/${route}: falhou em ${name}`);
      failed = true;
    }
  }
}

for (const asset of ['natalia-neves-hero.png', 'natalia-neves-sobre.png', 'og-natalia-neves.png']) {
  const assetPath = path.join(root, 'assets', asset);
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size < 1024) {
    console.error(`Imagem ausente ou inválida: ${assetPath}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Validação concluída: /a1, /a2 e /a3 estão completas e independentes.');
