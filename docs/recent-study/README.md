# Plano Azuria — direção editorial

Revisão concluída em 06/10/2026.

## Referências

- [Recent / Branding](https://recent.design/?category=branding): composição de campanhas, contraste, tipografia e apresentação de identidades.
- [Fastino Labs Identity / Bakers Studio](https://recent.design/i/0lj68ni-fastino-labs-brand-identity): pôsteres com tipografia protagonista e um símbolo metálico sobreposto ao universo visual da marca.

A implementação usa composição própria: pôsteres feitos em HTML/CSS, roseta cromada vetorial, textura e material azul já existentes da Azuria. As imagens das referências não foram incorporadas como exemplos de trabalho da marca.

## Página entregue

`/planos` abre pelo botão “Começar meu próximo nível” da landing. A nova abertura usa fundo escuro, papel claro, azul e um acento verde claro. O botão principal fica inteiro no primeiro enquadramento desktop verificado, de 1769 × 773 px CSS.

O escopo ganha números grandes, organização editorial e um cartão de contratação que acompanha o scroll. Preço, quantidades e condições permanecem vinculados à configuração central: R$ 297 por ciclo mensal, 8 posts, 4 carrosséis, 24 stories e 4 entregas. Os oito itens do FAQ e a prévia interativa de entrega foram preservados.

Os CTAs do cabeçalho, menu móvel e rodapé seguem para `/contratar` quando o visitante já está em `/planos`. A próxima etapa continua sendo a demonstração existente, sem pagamento real.

## Verificação

- Caminho real: landing `/#plano` → botão do pacote → nova página `/planos` → cartão de contratação → `/contratar`.
- Âncora `#seu-ciclo`, destino existente, scroll e término da vinheta com opacidade zero conferidos.
- Prévia: seleção de entrega 3 e alternância entre Conteúdos, Legenda e Baixar conferidas.
- FAQ: oito perguntas presentes; abertura e fechamento com Enter conferidos.
- Menu móvel: CTA para contratação fecha o diálogo e termina a vinheta corretamente.
- Sem overflow horizontal em viewports CSS de 320, 376, 768, 1441 e 1769 px. O zoom do Edge altera a relação entre a dimensão solicitada e a viewport CSS.
- As verificações móveis foram de layout e interação via DOM. Capturas visuais registradas no desktop em `plano-abertura.jpg` e `plano-pacote.jpg`.
- Animações e revelações têm tratamento de `prefers-reduced-motion`; o efeito de interação acompanha o cursor e o scroll sem loop JavaScript contínuo.
- Console observado sem erros ou avisos. Build de produção, TypeScript e oito testes existentes aprovados.
- Viewport temporária restaurada. Prévia local mantida em `http://127.0.0.1:3002/planos`.
