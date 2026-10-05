# Azul do Hero

Imagem recriada com o modelo de imagem integrado, a partir de `public/brand/azuria-blue-field-v2.png`.

O modelo retornou uma imagem nativa de **1672 × 941 px**. A entrega 4K foi exportada em **3840 × 2160 px** com reamostragem Lanczos; não é geração nativa em 4K. O original gerado está preservado em `artifacts/v3/hero-generated-native.png`.

- `public/brand/azuria-blue-field-4k.png`: master 4K, 15,6 MB, para exportação.
- `public/brand/azuria-blue-field-4k.webp`: 4K para o site, aproximadamente 979 kB.
- `public/brand/azuria-blue-field-mobile.webp`: 1600 × 900, aproximadamente 210 kB.

## Prompt usado

Use case: precise-object-edit. Asset type: 4K website hero background, landscape 16:9, target 3840 by 2160 pixels or highest available native resolution. Edit target: the supplied Azuria cobalt blue field image. Recreate this EXACT abstract blue material at far higher resolution and polished quality. Preserve the composition: soft pearlescent white/cyan light across upper left and lower right, brilliant saturated electric cobalt and ultramarine in the mid field, deep navy diagonal soft folds/shadows through the middle and bottom left. Keep the same beautiful glassy fine micrograin, rippled translucent material and diffuse luminous color transitions, with elegant subtle finer detail at high resolution. No new objects. No text, logo, watermark, outlines or hard bands. Same blue colors and lighting balance. Smooth luxurious gradient folds, microscopic texture rather than large noise. This must be the same visual made much sharper, suitable for a premium immersive full screen website. Output one opaque 16:9 image.

## Referências de movimento

- React Bits GlassSurface: https://reactbits.dev/components/glass-surface — adaptação em TypeScript, com refração RGB do backdrop na cápsula do header envolvendo a logo branca sólida.
- Lusion: https://lusion.co/ — referência para navegação cinematográfica, membranas elásticas e linha azul desenhada pela rolagem. Implementação própria; não é uma cópia exata de seus shaders.
- `docs/ref_zuri.mp4`: rotação, deformação conforme velocidade, squash ao segurar e retorno elástico ao soltar. Sequência de quadros em `artifacts/v3/zuri-reference-sequence.jpg`.
