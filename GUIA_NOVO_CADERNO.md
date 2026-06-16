# Guia — Como criar o caderno de um novo setor

O caderno do **Pó** (esta pasta) é o **template oficial**. Para qualquer setor novo
(Sachê, Pasta, Microcaps, Líquido, Premix) você **só troca os dados** — o código,
o visual, o modo edição e a logo já estão prontos e padronizados.

## Passo a passo (recomendado)

### 1. Abrir um chat NOVO no Claude Code
Contexto limpo evita misturar dados de setores diferentes.

### 2. Colar o prompt
Cole o conteúdo de **PROMPT_BUILDER.md** no início do chat.

### 3. Enviar o PDF do setor
Diga, por exemplo: *"Vamos fazer o caderno do Sachê"* e anexe o **PDF do Caderno CEPPEA**
desse setor. Se tiver planilhas/fotos, envie também (opcional).

### 4. O agente clona o template e troca os dados
Tecnicamente, o que acontece:
```
1. Copia C:\biosyn-ceppea-po  →  C:\biosyn-sache   (sem node_modules)
2. Edita data/ceppea-po.ts com os dados do novo setor (equipe, equipamentos,
   produtos, cronograma, custos, plano de limpeza, fluxograma, mapa)
3. Ajusta os créditos (DEFAULT_CREDITOS) e o mês de referência
4. npm install  →  npm run build  →  vercel --prod
```

### 5. Resultado
Uma nova URL pública na Vercel (ex.: biosyn-ceppea-sache.vercel.app), idêntica em
visual e recursos ao caderno do Pó.

## O que muda de setor para setor
- `data/<setor>.ts` — equipe, equipamentos, produtos, cronograma, custos, limpeza
- Mapa do setor (`components/SecaoMapa.tsx`) — planta baixa real do setor
- Fluxograma (`components/SecaoFluxograma.tsx`) — etapas do processo do setor
- Créditos (Elaborado por / Ref. do mês)
- Senhas de edição, se desejar diferentes (`lib/caderno.tsx`)

## O que NÃO muda (já padronizado)
- Logo, sidebar, header, tema claro, fontes
- Modo edição por PIN/função + Exportar/Importar JSON
- Expandir abas + Exportar PDF
- Cards clicáveis, modais, animações de fluxo

## Como editar um caderno já no ar (mês a mês)
1. Rodapé → 🔒 Edição → digite seu código de acesso.
2. Edite Produção / Equipe / USE / Manutenção pelos botões ✏️.
3. (Para oficializar) Exportar JSON e enviar ao responsável para fixar no caderno.

## Setores e estrutura sugerida
```
BioSyn_CEPPEA/
├── PO/        → biosyn-ceppea-po      (PRONTO — template)
├── SACHE/     → biosyn-ceppea-sache
├── PASTA/     → biosyn-ceppea-pasta
├── MICROCAPS/ → biosyn-ceppea-microcaps
├── LIQUIDO/   → biosyn-ceppea-liquido
├── PREMIX/    → biosyn-ceppea-premix
└── HUB/       → página índice com links de todos os cadernos (futuro)
```
