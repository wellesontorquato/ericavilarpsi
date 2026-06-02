# Supervisão Clínica TCC - Fase 1.1 visual

Esta versão mantém a Fase 1 criada anteriormente e melhora a experiência para ficar mais com cara de sistema interno.

## Principais mudanças

- Dashboard com visual de apresentação, cards executivos e gráficos sem dependência externa.
- Gráficos adicionados:
  - evolução média dos pacientes em anel;
  - radar de competências clínicas;
  - tendência por mês ou por semana;
  - lançamentos por clínica;
  - desempenho por terapeuta;
  - distribuição dos status dos planos.
- Cadastros de clínicas, terapeutas e pacientes agora abrem em modal.
- Lançamento semanal agora abre em modal grande, com a tela principal mostrando apenas resumo e histórico.
- Layout interno remodelado para parecer mais um sistema, com menu lateral escuro, cards, busca e telas mais limpas.

## Rotas

- `/admin/supervisao`
- `/admin/supervisao/clinicas`
- `/admin/supervisao/terapeutas`
- `/admin/supervisao/pacientes`
- `/admin/supervisao/lancamento-semanal`

## Backend

Permanece usando a Netlify Function:

- `netlify/functions/supervisao-api.js`

Coleções usadas no Firestore:

- `supervisao_clinicas`
- `supervisao_terapeutas`
- `supervisao_pacientes`
- `supervisao_lancamentos_semanais`

## Variáveis na Netlify

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `SUPERVISAO_ALLOWED_ROLES=admin,supervisora`

## Validação local feita

Foi executado ESLint nos arquivos novos/alterados do módulo de supervisão. O `next build` iniciou normalmente, mas ficou parado em `Creating an optimized production build` até o limite de tempo do ambiente, comportamento já observado na versão anterior do projeto.
