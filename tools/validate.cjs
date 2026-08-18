const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const routes = ['a1', 'a2', 'a3'];
const checkoutUrl = 'https://pay.kiwify.com.br/o4LJryy';
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
    ['CSS externo da rota', html.includes(`href="/${route}/styles.css"`)],
    ['JavaScript externo da rota', html.includes(`src="/${route}/script.js"`)],
    ['foto da hero', html.includes('/assets/natalia-neves-hero.jpg')],
    ['foto da apresentação', html.includes('/assets/natalia-neves-apresentacao.jpg')],
    ['data do evento atualizada', html.includes('29/08/2026 às 10h') && !html.includes('22/08/2026')],
    ['sete CTAs conectados ao checkout', (html.match(new RegExp(`href="${checkoutUrl}"`, 'g')) || []).length === 7],
    ['sem CTA de compra interno', !html.includes('href="#oferta"') && !html.includes('href="#garantia"')],
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

for (const asset of ['natalia-neves-hero.jpg', 'natalia-neves-apresentacao.jpg', 'og-natalia-neves.png']) {
  const assetPath = path.join(root, 'assets', asset);
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size < 1024) {
    console.error(`Imagem ausente ou inválida: ${assetPath}`);
    failed = true;
  }
}

if (failed) process.exit(1);

const thanksHtmlPath = path.join(root, 'obrigado', 'index.html');
const thanksCssPath = path.join(root, 'obrigado', 'styles.css');
for (const file of [thanksHtmlPath, thanksCssPath]) {
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    console.error(`Página de agradecimento ausente ou vazia: ${file}`);
    failed = true;
  }
}

if (fs.existsSync(thanksHtmlPath)) {
  const thanksHtml = fs.readFileSync(thanksHtmlPath, 'utf8');
  const thanksChecks = [
    ['confirmação da inscrição', thanksHtml.includes('Sua vaga está confirmada.')],
    ['data correta', thanksHtml.includes('29/08/2026 às 10h')],
    ['orientação sobre a Kiwify', thanksHtml.includes('confirmação da Kiwify')],
    ['proteção contra indexação', thanksHtml.includes('noindex, nofollow')],
    ['CSS da rota', thanksHtml.includes('href="/obrigado/styles.css"')],
  ];
  for (const [name, ok] of thanksChecks) {
    if (!ok) {
      console.error(`/obrigado: falhou em ${name}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('Validação concluída: /a1, /a2, /a3 e /obrigado estão completas.');
