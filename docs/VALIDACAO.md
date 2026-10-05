# Validação — 04/10/2026

> Registro histórico da versão 1.0. A revisão atual está em [VALIDACAO-2.0.md](VALIDACAO-2.0.md).

Implementação e prévia local concluídas. Este registro distingue o que foi executado do que ainda precisa de homologação para lançamento.

## Verificações executadas

- `npm run build`: aprovado; todas as rotas pré-renderizadas.
- `npm run typecheck`: aprovado.
- `npm test`: seis testes aprovados, cobrindo totais da oferta, matcher de Zuri, múltiplas intenções, ambiguidades, políticas indefinidas, validação e preservação da tentativa demonstrativa.
- `npm audit --omit=dev`: zero vulnerabilidades reportadas nesta execução.
- Home com exatamente cinco filhos principais no `main`: hero, galeria, processo/autoria, oferta e fechamento.
- Oito larguras verificadas no Edge: 320, 360, 390, 430, 768, 1024, 1440 e 1920px. Nenhuma com overflow horizontal; CTA principal visível antes do fim da primeira tela. Dados brutos em `artifacts/responsive.json`.
- Todas as rotas de venda e legais verificadas também em 320px. Inputs e seletor móvel com pelo menos 16px; zoom não desabilitado.
- Seis filtros da galeria: quatro obras em cada direção. Coleção inicial com oito obras. Anterior/próximo deslocam o trilho nativo. Modal com imagem completa, procedência, crédito disponível e CTA; Escape retorna o foco à obra.
- Menu móvel abre como diálogo; Escape retorna ao botão de abertura. Sheet móvel do Zuri cabe no viewport; Shift+Tab mantém foco no painel e Escape recolhe.
- Zuri reconheceu preço + cancelamento na mesma pergunta sem inventar política. “Pet shop minimalista” apresentou duas referências editoriais com justificativa. Ajuda local identificada e opção de limpar conversa.
- Prévia da plataforma: alternância entre conteúdos, legenda e baixar; seletor mudou para a entrega 4. Download permanece uma explicação honesta do produto.
- `/planos → /contratar → /contratar/resultado`: executado no navegador com dados fictícios. Validação vazia apresentou erros; aguardando, conclusão, cancelamento e erro funcionaram. Retomar preservou dados e identificador na navegação interna. Nova execução no build final confirmou conclusão demonstrativa.
- Navegação interna sem reiniciar a entrada. Âncora Estilos chegou ao topo com o espaçamento do header; recarga abaixo da dobra manteve contexto e não reiniciou a vinheta. Scroll reversível observado no percurso.
- Console do build final: nenhum erro ou aviso capturado. Nenhuma imagem quebrada observada e nenhum link vazio `href="#"` nas rotas verificadas.
- Portal informado carregou a página de login em `https://azuria-three.vercel.app/login`; Entrar aponta para ela. Não se tentou autenticar. Instagram `_capitanii_` encontrado com nome “victor”, privado; identidade e destino de portfólio continuam provisórios.

## Medição local de desempenho

Build otimizado, Edge no computador disponível, sem emular rede móvel. Amostras de oito segundos pelo `PerformanceObserver` e `requestAnimationFrame`, ativadas somente por `?auditoria`. Dados em `artifacts/performance.json`.

| Medida | Desktop 1440px | Mobile emulado 390px |
|---|---:|---:|
| LCP observado | 292ms | 128ms |
| CLS na amostra inicial | 0 | 0 |
| Intervalo mediano entre frames | 13,9ms | 14ms |
| Intervalo p95 entre frames | 243,1ms | 305,6ms |
| Frames acima de 34ms | 23 / 174 | 24 / 165 |
| Maior Event Timing após ações do Zuri | 1136ms | Sem interação na amostra |

LCP e CLS ficaram dentro das metas nestas amostras locais. Há pausas longas e a meta de interação de 200ms não foi comprovada. O maior Event Timing não equivale a uma medição completa de INP em campo. A automação influencia a amostra; estes números não certificam fluidez em aparelhos reais. Durante a captura houve inclusive uma interação de 5088ms. Não se mediu Lighthouse nem se promete 120fps.

Após observar pausas, o ruído SVG foi convertido em textura PNG de 96×96, a luz ganhou sua própria camada e o blur de fundo do modal foi removido. Vidro permanece limitado ao header e às superfícies pequenas. A rolagem não usa captura de wheel, canvas, Lenis ou estado React por frame.

## Evidências

- `artifacts/desktop-final.jpg`: hero no navegador restaurado.
- `artifacts/desktop-1440.jpg`, `mobile-320.jpg`, `mobile-390.jpg`: capturas responsivas.
- `artifacts/home-completa.jpg`, `plano-mobile.jpg`: páginas completas.
- `artifacts/galeria-detalhe.jpg`, `zuri-curadoria.jpg`, `checkout-concluido.jpg`: estados funcionais.
- `artifacts/azuria-percurso.mp4`: percurso do hero às quatro passagens e retorno, montado de 40 capturas reais do navegador. Amostragem variável, com pausas de captura encurtadas; serve para revisar composição e sequência, não para avaliar FPS. Frames e timestamps preservados em `artifacts/frames/`.

As gravações 05, 07, 11 e 04 foram reproduzidas localmente para complementar painéis, catálogo e sites de referência. Vídeos de pesquisa não entram no bundle.

## Limites para lançamento

Safari em iPhone e Chrome em Android físicos, teclado virtual, safe areas, mudança real de redução de movimento, arraste manual da scrollbar e fluidez ainda exigem homologação. A automação de arraste não produziu um resultado conclusivo; a barra nativa foi preservada e está visível. A preferência de movimento foi revisada no código: remove animações e transforms, sem remover conteúdo nem contraste do header.

Domínio final, titularidade do Instagram, direitos das obras, textos legais, autenticação e gateway real ainda precisam ser definidos. Não houve publicação, cobrança, envio automático de mensagem ou liberação de acesso. Checkout e Zuri mantêm dados apenas em memória; links de WhatsApp contêm texto curto fixo, sem histórico ou formulário. React escapa as mensagens e os parâmetros de resultado são validados; não há chave secreta no cliente.
