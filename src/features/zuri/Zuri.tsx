"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { artworks } from "@/data/gallery";
import { matchQuestion, type Reply } from "./matcher";
import { whatsapp } from "@/data/business";
import { SocialIcon } from "@/shared/ui/Icons";
import { ZuriCompanion } from "./ZuriCompanion";
type Message = { role: "user" | "zuri"; text: string; reply?: Reply };
export function Zuri() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [height, setHeight] = useState<number>();
  const [mobilePanel, setMobilePanel] = useState(false);
  const [keyboardGap, setKeyboardGap] = useState(0);
  const dock = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const history = useRef<HTMLDivElement>(null);
  const lastSent = useRef(0);
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const curate = () => {
      setOpen(true);
      setMessages((m) =>
        [
          ...m,
          {
            role: "zuri" as const,
            text: "Qual é o seu negócio e que sensação você quer passar? Por exemplo: pet shop minimalista ou joias ousadas.",
          },
        ].slice(-40),
      );
    };
    const look = () => {
      dock.current?.classList.remove("zuri-reading");
      requestAnimationFrame(() => dock.current?.classList.add("zuri-reading"));
    };
    window.addEventListener("zuri-curate", curate);
    window.addEventListener("zuri-look", look);
    return () => {
      window.removeEventListener("zuri-curate", curate);
      window.removeEventListener("zuri-look", look);
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("zuri-open", open);
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const media = matchMedia("(max-width: 700px)");
    const background = new Map<HTMLElement, boolean>();
    const resize = () => {
      const viewport = window.visualViewport;
      setHeight(viewport?.height || innerHeight);
      setMobilePanel(media.matches);
      window.dispatchEvent(
        new CustomEvent("azuria-scroll-lock", {
          detail: { id: "zuri-mobile", locked: media.matches },
        }),
      );
      setKeyboardGap(
        media.matches
          ? Math.max(
              0,
              innerHeight -
                (viewport?.height || innerHeight) -
                (viewport?.offsetTop || 0),
            )
          : 0,
      );
      if (media.matches) {
        Array.from(document.body.children).forEach((el) => {
          if (
            !(el instanceof HTMLElement) ||
            el.matches(".zuri-panel,.zuri-backdrop,.zuri-companion,script")
          )
            return;
          if (!background.has(el)) background.set(el, el.inert);
          el.inert = true;
        });
      } else {
        background.forEach((inert, el) => {
          el.inert = inert;
        });
        background.clear();
      }
    };
    resize();
    window.visualViewport?.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("scroll", resize);
    window.addEventListener("resize", resize);
    const keys = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.querySelector("dialog[open]")) return;
        setOpen(false);
        dock.current?.focus();
      }
      if (e.key === "Tab" && window.matchMedia("(max-width: 700px)").matches) {
        const els =
          panel.current?.querySelectorAll<HTMLElement>("button, a, input");
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("keydown", keys);
      window.visualViewport?.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("scroll", resize);
      window.removeEventListener("resize", resize);
      background.forEach((inert, el) => {
        el.inert = inert;
      });
      window.dispatchEvent(
        new CustomEvent("azuria-scroll-lock", {
          detail: { id: "zuri-mobile", locked: false },
        }),
      );
      document.documentElement.classList.remove("zuri-open");
      previous?.focus();
    };
  }, [open]);
  useEffect(() => {
    history.current?.scrollTo({ top: history.current.scrollHeight });
  }, [messages]);
  function ask(text: string) {
    if (!text.trim() || Date.now() - lastSent.current < 250) return;
    lastSent.current = Date.now();
    const prior = messages.filter((m) => m.reply).at(-1)?.reply?.ids;
    const reply = matchQuestion(text, prior);
    setMessages((m) =>
      [
        ...m,
        { role: "user" as const, text: text.slice(0, 600) },
        { role: "zuri" as const, text: reply.text, reply },
      ].slice(-40),
    );
    setInput("");
  }
  const targets: Record<string, string> = {
    planos: "/planos",
    contratar: "/contratar",
    estilos: "/#estilos",
    processo: "/#como-funciona",
    privacidade: "/privacidade",
  };
  return (
    <>
      {open && (
        <button
          className="zuri-backdrop"
          aria-label="Fechar ajuda"
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <div
          ref={panel}
          id="zuri-help"
          className="zuri-panel"
          role="dialog"
          aria-modal={mobilePanel || undefined}
          aria-label="Ajuda do Zuri"
          style={
            height
              ? {
                  maxHeight: `min(380px, calc(${height}px - ${mobilePanel ? 32 : 136}px - env(safe-area-inset-bottom, 0px)))`,
                  ...(mobilePanel
                    ? {
                        bottom: `calc(${keyboardGap + 12}px + env(safe-area-inset-bottom, 0px))`,
                      }
                    : {}),
                }
              : undefined
          }
        >
          <div className="zuri-panel-head">
            <div>
              <strong>Zuri</strong>
              <small>Ajuda local da Azuria</small>
            </div>
            <button
              aria-label="Fechar ajuda do Zuri"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="zuri-history" ref={history}>
            <p className="zuri-greeting">
              Oi, eu sou o Zuri. Posso te mostrar os estilos e explicar como a
              Azuria funciona.
            </p>
            <div className="zuri-choices">
              <button onClick={() => ask("me mostra um estilo")}>
                Ver estilos
              </button>
              <button onClick={() => ask("O que está incluído no plano?")}>
                Entender o plano
              </button>
              <a href={whatsapp()} target="_blank" rel="noreferrer">
                <SocialIcon kind="whatsapp" />
                Falar com Victor
              </a>
            </div>
            {messages.map((message, index) => (
              <div key={index} className={`zuri-message ${message.role}`}>
                <p>{message.text}</p>
                {message.reply?.direction && (
                  <div className="zuri-references">
                    {message.reply.ids.map((id) => {
                      const work = artworks.find((a) => a.id === id);
                      return work ? (
                        <Link
                          href="/#estilos"
                          key={id}
                          onClick={() => setOpen(false)}
                        >
                          <Image
                            src={`/${work.thumbnail}`}
                            width={work.largura}
                            height={work.altura}
                            sizes="140px"
                            alt={work.titulo}
                          />
                          <span>{work.directionName}</span>
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
                {message.reply?.action === "whatsapp" && (
                  <a
                    className="zuri-action"
                    href={whatsapp(
                      "Olá, Victor! Tenho uma dúvida sobre a Azuria.",
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <SocialIcon kind="whatsapp" />
                    Falar com Victor
                  </a>
                )}
                {message.reply && targets[message.reply.action] && (
                  <Link
                    className="zuri-action"
                    href={targets[message.reply.action]}
                    onClick={() => setOpen(false)}
                  >
                    {message.reply.action === "estilos"
                      ? "Explorar referências"
                      : message.reply.action === "contratar"
                        ? "Ver contratação demonstrativa"
                        : message.reply.action === "processo"
                          ? "Ver como funciona"
                          : "Consultar detalhes"}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {messages.at(-1)?.role === "zuri" ? messages.at(-1)?.text : ""}
          </div>
          <form
            className="zuri-form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <label className="sr-only" htmlFor="zuri-question">
              Sua pergunta sobre a Azuria
            </label>
            <input
              id="zuri-question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder="Pergunte sobre a Azuria…"
              enterKeyHint="send"
              autoComplete="off"
            />
            <button type="submit" aria-label="Enviar pergunta">
              ↑
            </button>
          </form>
          <button
            className="clear-chat"
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
          >
            Limpar conversa
          </button>
        </div>
      )}
      <ZuriCompanion open={open} onToggle={() => setOpen(!open)} dock={dock} />
    </>
  );
}
