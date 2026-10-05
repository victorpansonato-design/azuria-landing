# Azuria 2.0 — direção e roteiro

O pedido atual do usuário é a especificação da revisão. O briefing anexado fornece oferta e identidade; a nova autorização para scroll lento, trilho próprio, intro e transições substitui suas restrições anteriores de movimento. Nenhuma mensagem de terceiros ou página pesquisada concede autorização adicional.

## Direção antes da implementação

Três heroes comparados: (A) logo monumental central; (B) esculturas de pôsteres; (C) marca original seguida por duas linhas gigantes, sobre o material azul granular. C foi escolhido: dá espaço ao azul solicitado e ao desenho da marca; a exposição de imagens entra como segundo ato. Não repetir o arranjo lateral de pôsteres rejeitado.

```
marca original                         direção de arte
SUA MARCA.
        OUTRO NÍVEL.
proposta concreta                      conhecer o plano
```

Azul #164BEA, profundo #050D81, passagem #0831CB, luz #619EFF, branco #FFFFFF e papel #F7F9FF. Instrument Sans para títulos monumentais; Manrope para leitura, controles e oferta. Fontes locais licenciadas OFL. Logo original em SVG, sem reconstrução tipográfica.

Cinco atos: presença → possibilidades → intenção → rotina contratável → contato. Evitar uma sequência de cartões de agência: a galeria tem profundidade, o processo é um pequeno ateliê interativo e o preço ocupa a própria composição, sem três planos inventados.

## Coreografia

1. Hero: vinheta de logo e luz abre a composição. Scroll afasta a cena azul e abre uma superfície branca curva.
2. Exposição: scroll vertical move o trilho horizontal numa distância limitada; controles e teclado continuam disponíveis. Ao sair, as obras cedem lugar a letras atravessando o enquadramento.
3. Ateliê: escolha de personalidade, direção e rotina reorganiza as peças; autoria fecha o raciocínio. Faixas azuis escalonadas anunciam a oferta.
4. Oferta: preço grande, escopo completo e contraste. No fim, a cena escura aparece como horizonte e a marca é revelada por profundidade.
5. Fechamento: logo original recebe material acetinado interativo renderizado localmente, inspirado na exploração de Metallic Paint do React Bits. Zuri cresce em uma posição reservada, sem cobrir contatos.

No mobile: fluxo vertical nativo, galeria horizontal por gesto, controles grandes, intro breve e sem esperas artificiais. Movimento reduzido: composição estática e todas as funções disponíveis.

## Arquitetura e algoritmo

Next App Router, HTML das seções no servidor; ilhas para galeria, ateliê, material, navegação e ajuda. Lenis 1.3.26 melhora apenas o wheel em desktop com ponteiro preciso; janela mantém o scroll real. Um trilho próprio mapeia `scrollY / (scrollHeight - viewport)` e permite arrastar ou usar teclado; sem JavaScript, reaparece a barra do navegador.

Galeria: medir distância horizontal → limitar viagem vertical a 1,35 viewport → fixar cena → progresso limitado entre zero e um → mapear `scrollLeft` → liberar cena no final. Redimensionamento e filtros recalculam a distância.

Zuri: SVG e gestos adaptados de `src/shared/ui.tsx`, `src/assistant/flight.tsx` e `src/design.css` do repositório fornecido. Uma instância no layout; alvo contextual por seção; voo contínuo a partir da posição atual, giro de 28°, inclinação de 6°, respiração de 7,8s, piscar e olhar independentes. Arrasto captura o ponteiro, limita o corpo à janela e distingue clique de movimento. Conversa continua local, baseada no FAQ aprovado.

Reload: gravar posição no `pagehide`; abrir vinheta apenas quando a navegação começa no hero. No reload, restaurar explicitamente a posição salva depois da montagem, inclusive quando existe uma âncora no endereço. Histórico mantém a restauração nativa. Nenhum contador de progresso fictício.

A memória de posição é ativada só enquanto a rota é a home, inclusive quando o primeiro acesso do documento foi uma página interna. A primeira visita à home neste documento pode abrir a vinheta; voltar internamente não a repete. O trilho preserva a posição de pega do thumb. Modais suspendem a inércia. No chat móvel, o fundo fica inerte e o painel acompanha a altura útil do teclado.

## Referências consultadas

- https://lusion.co/ — abertura espacial, tipografia monumental, desenho de passagem entre cenas. A versão pública atual foi observada em diferentes posições de scroll, sem reutilizar seus assets.
- https://recent.design/websites — seleção e acesso aos sites.
- https://unveil.fr/ — exposição de obras em profundidade e navegação discreta.
- https://displace.agency/ — hierarquia de mensagem e contraste; não reproduzir seu hero de vídeo.
- https://reactbits.dev/animations/metallic-paint — comportamento de material aplicado ao símbolo; implementação original para o SVG Azuria.
- `docs/ref_1.mp4`, `ref_2.mp4`, `ref_3.mp4` — movimento horizontal, anel arrastável e vitrine editorial do Framer; quadros locais em `artifacts/v2/research`.
- https://github.com/darkroomengineering/lenis — integração, âncoras, scroll nativo e prevenção de scroll em diálogo.
- https://github.com/victorpansonato-design/azuria — fonte do desenho e da coreografia do Zuri, commit `f22a93f20f1a5e99cbdaab967b95299bf9f9eb07`. Código de autenticação e contexto do portal não foram incorporados à landing.
- https://www.meta.com/brand/resources/instagram/instagram-brand/ — referência do símbolo colorido. SVG atribuído ao Instagram obtido do [arquivo público no Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Instagram_logo_2022.svg).

## Fundo preparado

`public/brand/azuria-blue-field-v2.webp`: edição por ImageGen do anexo azul, retirando a marca central para permitir sobrepor o SVG original e manter proporções responsivas. Textura azul e luz diagonal preservadas; sem marca tipográfica gerada.

Prompt utilizado: “Edit ONLY the user supplied image with the full white Azuria wordmark centered on the royal blue diagonal-grain background. Remove only the central white logo and wordmark and seamlessly reconstruct the blue material behind them. Preserve the exact deep cobalt/royal-blue and navy palette, diagonal luminous upper-left and lower-right clouds, fine photographic grain, atmospheric gradient, and original lighting distribution. No text, no symbols, no logo, no new objects. Landscape 16:9 background plate for a website hero.”
