# Natália Neves

Landing page da aula **O Protocolo para Ser Ouvida Sem Gritar**, convertida para HTML, CSS e JavaScript puros.

## Rotas

- `/a1` — ângulo “Você pede com calma”
- `/a2` — ângulo “Já falei mil vezes”
- `/a3` — ângulo “Você não queria virar a mãe que grita”
- `/obrigado` — confirmação pós-compra e orientações para a participante

Cada rota contém seus próprios arquivos `index.html`, `styles.css` e `script.js`. As imagens ficam em `assets/` e são compartilhadas pelas três versões.

## Conferência local

```bash
npm start
```

Depois, acesse `http://localhost:4173/a1`, `/a2` ou `/a3`.

## Validação e pacote de publicação

```bash
npm run validate
npm run build
```

O pacote final é criado em `dist/`.
