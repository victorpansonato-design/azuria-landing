# Azuria — direção e implementação

Fonte principal: `Downloads/prompt (1).md` e `Azuria_Landing_Atualizado.zip`. O arquivo `prompt.md` anterior fixa um hero; a revisão mais recente libera sua composição. Os arquivos inicialmente soltos em `azuria-landing/` estavam renomeados incorretamente; preservados, recuperamos o ZIP sem modificar o portal.

Três composições consideradas: (1) instalação de pôsteres lateral, (2) marca monumental central e (3) tipografia assimétrica com uma abertura luminosa de exposição. Escolhida a terceira: conserva a leitura da proposta, traz um material próprio e deixa as imagens protagonizarem a galeria. A abertura tem duas obras, não uma órbita de cartões. Mobile empilha a mensagem e transforma a instalação em uma faixa curta.

Instrument Sans variável local, peso 400–700; branco, papel #F7F9FF, azul #164BEA, profundo #050D81, transição #0831CB, reflexo #619EFF. Logo e Zuri vetoriais originais. Vidro em navegação e ajuda; pôsteres sem arredondamentos artificiais.

Home: hero → exposição → processo/autoria → oferta → fechamento. A luz expande na passagem para a exposição; o trilho se alinha ao chegar ao processo; a janela inclina levemente para abrir o plano; a marca final sobe pelo enquadramento. Progresso baseado em posição de scroll, reversible, com fallback estático.

Next App Router/TypeScript, páginas renderizadas no servidor, ilhas client em galeria, navegação, motion, checkout e Zuri persistente no layout. Dados comerciais vêm de um JSON; matcher substitui templates com esses dados. Scroll nativo e redução de movimento em todas as camadas.

Checkout: validar campos → adapter demonstrativo gera identificador de tentativa → resultado aguardando → escolha explícita de simulação → concluído/cancelado/erro. Dados pessoais somente na memória da sessão atual; URL contém estado e identificador aleatório, nunca o formulário. Nenhuma liberação de assinatura e nenhuma chamada a gateway.

Referências estudadas: gravações 05/07/11/04, painéis e catálogo completo, Shopify Design, Displace e Cathy Dolle ao vivo. Fontes técnicas: https://nextjs.org/docs/app/getting-started/installation e https://motion.dev/docs/react-accessibility. Nenhum código React Bits incorporado. Skills: frontend-design, emil-design-eng, mobile-native e ui-ux-pro-max; regras específicas do briefing prevalecem sobre paletas genéricas ou bloqueio do scroll.
