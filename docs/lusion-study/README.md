# Estudo Lusion e revisão Azuria

Referência: [Lusion](https://lusion.co/), examinada no Edge em 05/10/2026, junto ao vídeo recebido em `../ref_lusion.mp4`.

## Capturas

- `ref-contact-sheet.jpg`: amostras do vídeo fornecido.
- `live/frame-*.jpg`: 110 capturas adicionais do navegador, cobrindo hero, desenho da faixa azul, expansão do reel e apresentação dos projetos.
- `lusion-cenas-adicionais.mp4`: sequência dessas capturas, com 0,5 segundo por imagem, para rever composição e estados da animação. É um vídeo de estudo por amostragem, não uma gravação contínua em 60 fps.
- `azuria-artworks.jpg`: contato das imagens existentes usadas na curadoria.
- `azuria/`: imagens da implementação local verificadas no navegador.

## Aplicação no site

A segunda seção virou uma exposição com tipografia grande, imagens em duas colunas independentes e faixa azul de curvas largas (`#3333ff`). A faixa se desenha com o scroll; seu percurso foi ajustado ao comprimento da curadoria da Azuria.

Cada imagem mantém sua proporção e recebe uma superfície WebGL subdividida, com ondulação nas bordas, reação ao cursor e deslocamento suave durante o scroll. As imagens originais continuam como fallback. Os contextos gráficos só existem perto da área visível e são liberados ao sair dela.

A passagem entre a galeria e “Além do óbvio” ganhou uma seção própria: uma abertura elíptica transforma o fundo claro em um ambiente escuro. O menu acompanha a mudança de contraste.

A escultura é uma malha 3D fechada em forma de nó, com 420 segmentos e 48 lados, normais suaves, reflexos cromados e azuis. A renderização desktop parte de 1920 px e chega a 3840 px de largura conforme o espaço disponível; no teste de 4K o buffer foi de 3840 × 2684. Essa resolução é do elemento renderizado, e não uma alegação de aumento da resolução das fotos existentes.

O ambiente escuro passa para o azul do plano por um gradiente. O plano e o rodapé compartilham a cor na junção, com uma cortina elíptica e movimento suave na entrada do rodapé.

## Navegação e verificações

- Menu principal, links do hero, CTA da galeria, capítulos, CTA do processo, CTA do rodapé e retorno ao topo verificados no navegador.
- Filtros da curadoria, abertura/fechamento do modal e devolução do foco verificados.
- Fluxo do Zuri para `/planos`, fechamento do painel e liberação do scroll verificados.
- `/planos`, `/contratar`, `/privacidade` e `/termos` respondem HTTP 200. Rotas do menu e do rodapé foram também examinadas pela interface.
- Todos os links locais com hash têm um destino existente.
- Vinheta: fechamento, abertura, opacidade final zero e liberação do scroll conferidos. A animação de fechamento agora é cancelada quando a de abertura começa, evitando que seu estado final volte a cobrir a página.
- Links inferiores foram afastados da posição padrão do Zuri, que cobria “Voltar ao topo” no desktop.
- Na largura móvel solicitada de 390 px, a extensão apresentou 434 px de viewport CSS por conta do zoom do navegador. Não houve overflow horizontal; menu, capítulos e navegação funcionaram. A captura visual nessa configuração falhou na extensão, portanto a validação móvel registrada foi de layout e interação via DOM.
- A viewport temporária foi restaurada ao finalizar os testes.
- Build de produção e checagem TypeScript aprovados. Suíte existente: 8 testes aprovados.

Prévia local: `http://127.0.0.1:3002/`. Não houve publicação nem alteração dos destinos externos de contato.
