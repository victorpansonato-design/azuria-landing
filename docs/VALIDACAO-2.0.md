# Validação Azuria 2.0 — 04/10/2026

Revisão implementada no projeto existente. Prévia otimizada em `http://127.0.0.1:3000`. A direção e as fontes de referência estão em [REMAKE-2.0.md](REMAKE-2.0.md).

## Executado

- Build de produção aprovado, com 11 entradas estáticas geradas; TypeScript aprovado.
- `npm audit --omit=dev`: nenhuma vulnerabilidade reportada.
- Oito testes aprovados: oferta e totais, FAQ do Zuri, múltiplas intenções, limites de resposta, checkout demonstrativo, extremos e retorno da galeria, mapeamento e limites do arrasto do trilho.
- Home final verificada no Edge em oito larguras, aproximadamente 320, 360, 390, 430, 768, 1024, 1440 e 1920px. Nenhum overflow horizontal. Dados completos em `artifacts/v2/responsive-final.json`; pequenas diferenças de 1px refletem o zoom do navegador.
- Plano, contratação, privacidade e termos conferidos também em 320px, sem overflow. Registro em `artifacts/v2/routes-mobile.json`.
- Cinco cenas na home; hero com a marca SVG original e o material azul do anexo, partículas e luz que reage ao ponteiro.
- Wheel suavizado em desktop; gesto vertical nativo no celular. Trilho personalizado nas duas versões, com clique, arrasto capturado e teclado. Arrasto real no navegador deslocou a página de forma verificável; Home e End chegaram aos limites.
- Galeria fixa em desktop: scroll vertical move o trilho horizontal até o máximo; no último quadro, a página continua verticalmente. Movimento reversível. Filtros reiniciam a exposição; modal abre a imagem inteira e a procedência, com fechamento por Escape.
- Ateliê alterna personalidade, direção e rotina. Portfólio aponta para `https://victor-capitani-web.vercel.app/`.
- Zuri original sem caixa branca: voo contextual, corpo virando, olhar e piscar independentes, flutuação e mensagens ocasionais. Arrasto real deslocou o Zuri sem abrir a conversa. Clique posterior abriu a ajuda e Escape recolheu. A pergunta “O que vem no plano?” retornou o escopo aprovado.
- Fechamento conferido com Zuri de 190px no desktop e 125px no celular, em área reservada. Material da logo usa máscara do SVG original; fallback continua legível em touch, movimento reduzido ou ausência de WebGL. Instagram colorido aplicado.
- F5 abaixo do hero restaurou `scrollY` exatamente na posição observada e pulou a vinheta, inclusive com `#estilos` no endereço. F5 após Home reproduziu a vinheta e manteve `scrollY = 0`.
- Menu móvel abriu e fechou por Escape. O caminho plano → formulário → resultado demonstrativo foi executado com dados fictícios; campos vazios exibiram erros e conclusão confirmou ausência de pagamento.
- Revisão de continuidade: a primeira entrada por `/planos` seguida de volta à home e F5 preservou `scrollY = 1288,8888`, sem vinheta. A memória agora pertence somente à home e a animação não se repete na navegação interna.
- Chat móvel conferido com 311px de altura disponível: painel entre 20px e 299px, campo de entrada visível, foco circular com Shift+Tab e fundo removido da navegação acessível. Escape removeu `inert` e o bloqueio de scroll. Posição considera teclado e safe area; teste em teclado físico continua pendente.
- Galeria em desktop de 1440 × 600px: stage de 600px, controles encerrando em 564px. CTA do hero encerrando em 541px. Texto principal no celular ampliado para 14px e itens da oferta para 13px.
- Arrasto do trilho preserva o ponto onde o thumb foi pego; teste cobre as duas extremidades. Abertura de modal pausa a inércia, e a ajuda cede Escape ao diálogo superior. Animações respeitam a preferência reduzida também na saída do ateliê.
- Verificação real após essas correções: arrasto pela parte inferior do thumb levou ao progresso de 44%. Com ajuda desktop aberta, abrir uma obra pausou Lenis; Escape fechou somente a obra, manteve a ajuda e retomou o scroll.
- Destino de Entrar aponta ao login informado pelo usuário. A landing não altera autenticação nem o código de conta do portal.
- Console da prévia: nenhum erro ou aviso capturado na verificação final. Fontes locais e fundo WebP; loops de canvas pausam fora da cena ou com a aba oculta, com desenho limitado a aproximadamente 30 vezes por segundo.
- Custo de scroll reduzido: leitura das geometrias em lote, escrita apenas dos valores alterados, uma medição por cena para o Zuri, alvos de voo estáveis e canvas de partículas com DPR 1. A imagem azul mantém sua resolução.

## Evidências

Capturas em `artifacts/v2/`: hero desktop e mobile, galeria, processo, oferta, rodapé desktop e mobile, resultado demonstrativo. Os painéis em `research/` registram quadros dos três vídeos Framer fornecidos. Capturas são evidências de composição, não uma medição de fluidez.

## Alcance da validação

Responsividade foi conferida no navegador com larguras emuladas. Safari/iPhone, Android físico, teclado virtual e desempenho em aparelhos reais ainda precisam de homologação. Movimento reduzido e fallback foram revisados no código.

A amostra local inicial de produção registrou LCP de 380ms e CLS de aproximadamente 0,00018, mas intervalo mediano entre frames de 41,7ms e p95 de 111ms durante automação e pesquisa com outras abas abertas. A medição posterior teve amostragem incompleta e Event Timing longo. Portanto, a meta de fluidez e interação ainda não foi certificada; não há resultado de Lighthouse ou promessa de 60/120fps.

Checkout continua demonstrativo; os textos legais continuam preparatórios e a galeria mantém créditos e identificação como referências de terceiros. Publicação, gateway real, autenticação integrada e autorização final das obras não fazem parte desta revisão local.
