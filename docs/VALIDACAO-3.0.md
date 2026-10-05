# Validação da revisão imersiva

- `npm run typecheck`: aprovado.
- `npm test`: 8 testes aprovados.
- `npm run build`: aprovado; 11 páginas estáticas geradas.
- Console do navegador: sem erros ou avisos na revisão final.

## Revisão no navegador

Preview local: `http://127.0.0.1:3001`.

- Desktop: 1769 × 810 px CSS; Hero, cápsula de vidro do header, galeria, escultura 3D, preço e rodapé revisados visualmente.
- Mobile: 320 × 760 e aproximadamente 391 × 845 px CSS, considerando o zoom já configurado no navegador. Sem overflow horizontal.
- Galeria: 12 imagens na seleção inicial; AZ088 (hambúrguer verde) excluído de todas as obras exportadas. Filtro Surreal e 3D e lightbox verificados.
- Zuri: arrastado de x=1669/y=710 para x=1522/y=560. Posição manual preservada após navegação com vinheta até o pacote. Painel reduzido a aproximadamente 280 × 380 px desktop; em 320 px, painel permaneceu dentro da viewport. Rodapé limitado a aproximadamente 100 px desktop.
- Vinheta: navegação até `#plano` concluída e overlay removido; rolagem liberada depois da animação.
- Texto dos capítulos: entrada opaca e capítulos inativos fora da navegação de teclado; layout sequencial em mobile e com movimento reduzido.

Capturas: `artifacts/v3/hero-desktop.png`, `gallery-desktop.png` e `process-desktop.png`.

## Imagem e referências

Geração, prompt completo, arquivos entregues e limite da resolução nativa: `docs/IMAGEM-HERO-4K.md`.

O vídeo `docs/ref_zuri.mp4` foi inspecionado em 24 quadros ao longo dos 7,57 segundos; a sequência está em `artifacts/v3/zuri-reference-sequence.jpg`. A interação recria pressão, deformação conforme velocidade, inclinação, piscar e retorno elástico, preservando o desenho do Zuri.

A refração do Hero e a escultura são shaders WebGL próprios. As membranas da galeria e o traço azul seguem a referência visual do Lusion, sem alegação de equivalência exata com a implementação original. As verificações acima são locais; não houve publicação em produção.
