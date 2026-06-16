# BioSyn CEPPEA · Setor Pó · Dashboard Industrial

Dashboard web do Setor Pó da BioSyn Saúde Animal — Maio 2026.

## Stack
- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Recharts
- Deploy: Vercel

## Como rodar localmente

```bash
# 1. Instalar Node.js 18+ em nodejs.org

# 2. Instalar dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev
# Abrir http://localhost:3000
```

## Como atualizar os dados

Todos os dados do dashboard estão em **`data/ceppea-po.ts`**:

- **Equipe**: array `EQUIPE` — editar custos, responsabilidades, cargos
- **Equipamentos**: array `EQUIPAMENTOS` — status, capacidade, responsáveis
- **Produtos**: array `PRODUTOS` — volumes vendidos e estimados
- **Parâmetros**: objeto `PARAMS` — horas, dias úteis, metas
- **Plano de Limpeza**: array `PLANO_LIMPEZA`
- **USE/Materiais**: array `USE_MATERIAIS` + constantes `USE_MES`, `MANUT_MES`
- **Cronograma**: array `CRONOGRAMA`

Após editar, salve e o Next.js atualiza automaticamente (dev) ou faça novo deploy (prod).

## Deploy na Vercel

### Opção A — Deploy direto via CLI

```bash
npm install -g vercel
vercel --prod
```

### Opção B — Via GitHub (recomendado)

```bash
git init
git add .
git commit -m "BioSyn CEPPEA Pó dashboard"
git remote add origin https://github.com/SEU_USUARIO/biosyn-ceppea-po.git
git push -u origin main
```

Depois acesse [vercel.com/new](https://vercel.com/new):
1. Importe o repositório GitHub
2. Framework: **Next.js** (detectado automaticamente)
3. Clique em **Deploy**

A Vercel gera uma URL pública como `biosyn-ceppea-po.vercel.app`.

### Para republicar após atualizar dados

```bash
git add data/ceppea-po.ts
git commit -m "Atualizar dados maio/2026"
git push
# Vercel faz deploy automático
```

## Seções do Dashboard

| Seção | Conteúdo |
|---|---|
| Visão Geral | OEE gauge, KPIs, gráficos, pontos de atenção |
| Mapa do Setor | Planta baixa SVG interativa com bonecos clicáveis |
| Equipe & Organograma | Hierarquia + perfis completos |
| Cronograma | Timeline diária 08:00–18:00 expansível |
| Produção | Capacidade, calculadora interativa, produtos |
| Custos | Tabela RH, USE, manutenção, consolidado |
| Equipamentos | 17 equipamentos com ficha técnica |
| Plano de Limpeza | PLIM.01.00 filtrável por periodicidade |
| Biossegurança | NB-2, custos USE, materiais, checklist |
| Manutenção | Preventivas, impacto de paradas |
| Fluxograma | 4 raias swimlane interativo |

## Funcionalidades

- **Toggle Meta S&OP**: recalcula custos RH com bônus ao vivo
- **Expandir tudo**: abre todos itens colapsáveis
- **Exportar PDF**: `window.print()` com CSS de impressão
- **Modais**: clique em pessoas, equipamentos, etapas do fluxo
- **Responsivo**: sidebar colapsável em mobile

---

Desenvolvido para BioSyn Saúde Animal · Dados referência: Maio 2026
