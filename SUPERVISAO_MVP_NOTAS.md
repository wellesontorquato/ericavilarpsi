# MVP - Supervisão clínica em TCC

Este pacote adiciona a Fase 1 do módulo interno de supervisão clínica ao site Next.js.

## Rotas criadas

- `/admin/supervisao` — Dashboard inicial
- `/admin/supervisao/clinicas` — Cadastro de clínicas
- `/admin/supervisao/terapeutas` — Cadastro de terapeutas
- `/admin/supervisao/pacientes` — Cadastro de pacientes/casos
- `/admin/supervisao/lancamento-semanal` — Lançamento semanal de supervisão

## Backend criado

- `netlify/functions/supervisao-api.js`

A função recebe chamadas do frontend em:

```txt
/.netlify/functions/supervisao-api?resource=clinicas
/.netlify/functions/supervisao-api?resource=terapeutas
/.netlify/functions/supervisao-api?resource=pacientes
/.netlify/functions/supervisao-api?resource=lancamentos
/.netlify/functions/supervisao-api?resource=dashboard
```

## Banco de dados

As coleções criadas/usadas no Firestore são:

- `supervisao_clinicas`
- `supervisao_terapeutas`
- `supervisao_pacientes`
- `supervisao_lancamentos_semanais`

## Variáveis de ambiente necessárias na Netlify

O projeto já usava Firebase Admin, então o módulo reaproveita o mesmo padrão:

```txt
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

Também é possível usar:

```txt
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

como fallback para o Project ID.

## Segurança com Netlify Identity

O frontend usa o login do Netlify Identity. A função exige usuário autenticado via Netlify Identity.

Para restringir por papéis, configure na Netlify:

```txt
SUPERVISAO_ALLOWED_ROLES=admin,supervisora
```

Se essa variável não for configurada, qualquer usuário autenticado no Netlify Identity do site conseguirá acessar a API da supervisão. Para dados clínicos, o recomendado é configurar os papéis.

## Testes realizados

- `npx eslint src/components/supervisao src/pages/admin/supervisao netlify/functions/supervisao-api.js` executado sem erros.
- O build completo do projeto não foi concluído no ambiente de geração porque o processo do Next.js ficou tempo demais em `Creating an optimized production build`. O projeto original também já apresenta erros de lint fora dos arquivos novos, então revise antes de publicar.
