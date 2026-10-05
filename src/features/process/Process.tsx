import { Arrow } from "@/shared/ui/Icons";
import { DirectionStudio } from "./DirectionStudio";

export function Process() {
  return (
    <section
      id="como-funciona"
      className="process2"
      data-scene="process"
      aria-labelledby="process-heading"
    >
      <div className="process2-bridge" aria-hidden="true">
        <span>OLHE</span>
        <span>DE NOVO.</span>
      </div>
      <div className="process2-content">
        <div className="process2-heading">
          <span className="eyebrow">02 / Beleza com intenção</span>
          <h2 id="process-heading">
            Bonito chama.
            <br />
            <em>Direção fica.</em>
          </h2>
          <p>
            Você já cuida de tudo no seu negócio.
            <br />O design não precisa ser mais uma tarefa.
            <br />A Azuria transforma personalidade em presença.
          </p>
        </div>
        <DirectionStudio />
        <div className="author2">
          <div className="author2-name">
            <span>O olhar por trás</span>
            <strong>
              Victor
              <br />
              <em>Capitani.</em>
            </strong>
          </div>
          <div>
            <span className="eyebrow">Direção de arte & criação</span>
            <h3>
              Uma marca tem gente.
              <br />A Azuria também.
            </h3>
            <p>
              Sou o Victor. Criei a Azuria para aproximar design com
              personalidade e uma rotina de conteúdo organizada dos pequenos
              negócios.
            </p>
            <a
              href="https://victor-capitani-web.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Entre no meu universo <Arrow diagonal />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
