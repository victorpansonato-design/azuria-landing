# Assets da marca

## Adições da revisão 2.0

- `azuria-blue-field-v2.webp`: material do anexo azul atual, editado para retirar a logo embutida; a marca sobreposta permanece o SVG original. PNG de preparação preservado. Prompt e processo em `docs/REMAKE-2.0.md`.
- `Manrope.ttf` e `Manrope-OFL.txt`: fonte variável de leitura, obtida de `google/fonts/ofl/manrope`; licença SIL OFL preservada.
- `instagram-colorido.svg`: símbolo gradiente do Instagram, autoria atribuída ao Instagram, fonte pública `https://commons.wikimedia.org/wiki/File:Instagram_logo_2022.svg`. Aplicado sem redesenhar ou alterar proporções. Os arquivos sociais anteriores permanecem no kit.
- Zuri interativo: desenho original e movimentos adaptados do repositório informado pelo usuário, commit `f22a93f20f1a5e99cbdaab967b95299bf9f9eb07`. Sua instância é única no layout.

## Kit anterior preservado

- azuria-logo.svg: caminho original de src/shared/logo-path.ts, viewBox 875×210, fill currentColor. Inserir inline para controlar branco/azul; em img externo currentColor não herda o texto do elemento pai.
- azuria-logo-branca.svg: variante de preenchimento branco para img externo.
- zuri.svg: desenho do corpo/olhos do ZuriFace no portal, 64×64. Não trocar por outro fantasma genérico.
- azul-brilho-referencia.png: referência original enviada e preservada no repo. A figura branca da imagem **não é a logo Azuria**; usar apenas o material azul.
- instagram-oficial.png e whatsapp-oficial.svg: arquivos reais já presentes no portal; checar diretrizes vigentes de marca para publicação. Usar legíveis, sem esticar ou redesenhar.
- fontes/InstrumentSans-variable.ttf: fonte variável original de google/fonts, peso400–700, largura75–100. Licença OFL e metadados acompanham. Converter para WOFF2 no build se desejado e preservar licença.

O fundo da marca é material, não uma textura em resolução gigante repetida sem cuidado. Reprodução CSS/SVG deve manter azul, granulação e luz, permitindo contraste adequado em qualquer tela.
