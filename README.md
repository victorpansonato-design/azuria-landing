# Azuria 2.0

Landing independente do portal, com Next.js App Router, TypeScript, Motion e Lenis. Cinco cenas conectadas: hero azul com material animado, exposição horizontal controlada pelo scroll, ateliê interativo, oferta e fechamento com a marca monumental. Zuri usa o desenho e os gestos do portal original, acompanha a navegação, aceita arrasto e cresce no rodapé.

## Executar

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:3000. Para reproduzir a versão otimizada:

```sh
npm run build
npm run start
```

```sh
npm run typecheck
npm test
npm audit --omit=dev
```

## Configuração e conteúdo

- `src/data/config-landing.json`: oferta, contatos, ajustes e estado demonstrativo. Números e resumos são derivados desses dados.
- `src/data/curadoria-artes.json`: 24 referências, dimensões, créditos e condições de uso. Para publicação, substituir por obras próprias ou autorizadas e atualizar `contentKind`/status de uso.
- `src/data/zuri-faq.json` e `features/zuri/matcher.ts`: conversa roteirizada, sem serviço de IA ou envio de histórico.
- `src/features/checkout/payment.ts`: interface `PaymentProviderAdapter`. O adapter atual apenas cria uma tentativa de demonstração. Dados do formulário permanecem em memória e desaparecem ao recarregar.
- `src/app/globals.css`: estilos compartilhados, modais e páginas internas. `src/app/v2.css`: direção visual e responsividade da revisão. Manrope local para leitura e Instrument Sans para títulos, ambas com licença OFL; logo original em SVG.
- `src/shared/motion/ScrollExperience.tsx`: wheel suavizado em desktop e trilho próprio com arrasto, clique e teclado. Mobile usa gesto nativo. `SceneMotion.tsx` coordena as passagens e a entrada, preservando a posição ao recarregar abaixo do hero.

Copie `.env.example` para `.env.local` e configure `NEXT_PUBLIC_SITE_URL` quando houver domínio final. Canonical, sitemap e imagem social usam esse domínio após novo build. `NEXT_PUBLIC_PLATFORM_URL` permite atualizar o destino de Entrar; o login informado foi verificado no navegador. Nenhuma variável pública pode conter chave secreta.

O protótipo mantém `noindex` e robots bloqueado. A publicação exige textos legais definidos, autorização das obras, confirmação do Instagram provisório e testes em aparelhos reais. Autenticação e pagamento real ainda não fazem parte desta etapa. Um adapter futuro precisa criar sessão hospedada no servidor e liberar acesso somente após webhook verificado e idempotente.

## Organização e evidências

`app/` contém rotas; `features/` reúne hero, galeria, processo, plano, checkout e Zuri; `shared/` contém navegação, modal e motion. Páginas de marketing são pré-renderizadas. A posição real de scroll permanece no navegador; a barra personalizada aparece após inicializar o JavaScript, com uma versão mais fina no celular. Sem JavaScript, a barra nativa continua disponível. A preferência de movimento reduzido mantém conteúdo e controles, com as cenas estáticas.

[Direção e roteiro 2.0](docs/REMAKE-2.0.md) · [Validação 2.0](docs/VALIDACAO-2.0.md) · Capturas em `artifacts/v2/`. Os documentos sem sufixo 2.0 registram a versão anterior.

`reference-kit/` contém o ZIP recuperado e material de estudo, fora do bundle e ignorado pelo Git. A pasta inicial `azuria-landing/`, com extensões trocadas, foi preservada. Não se alterou o código do portal.
