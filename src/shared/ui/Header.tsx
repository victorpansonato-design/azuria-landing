"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { GlassSurface } from "./GlassSurface";
import { Arrow } from "./Icons";
import { Modal } from "./Modal";
import { platformUrl, whatsapp } from "@/data/business";
export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [portal, setPortal] = useState(false);
  const links = [
    ["Estilos", "/#estilos"],
    ["O olhar", "/#como-funciona"],
    ["Plano", "/#plano"],
  ];
  const enter = () =>
    platformUrl ? window.location.assign(platformUrl) : setPortal(true);
  return (
    <>
      <header className={`header header-glass ${pathname !== "/" ? "header-inner" : ""}`}>
        <Link href="/" className="brand-link" aria-label="Azuria, início">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={100}
            borderWidth={0.07}
            backgroundOpacity={0.04}
            saturation={1.45}
            distortionScale={-180}
            className="header-brand-glass"
          >
            <Logo white />
          </GlassSurface>
        </Link>
        <nav aria-label="Principal" className="desktop-nav">
          {links.map(([name, href]) =>
            pathname === "/" ? (
              <a key={name} href={href.slice(1)}>
                {name}
              </a>
            ) : (
              <Link key={name} href={href}>
                {name}
              </Link>
            ),
          )}
        </nav>
        <div className="header-actions">
          {platformUrl ? (
            <a className="enter-button" href={platformUrl}>
              Entrar
            </a>
          ) : (
            <button className="enter-button" onClick={enter}>
              Entrar
            </button>
          )}
          {pathname === "/" ? (
            <a className="header-cta" href="#plano">
              Vamos começar <Arrow diagonal />
            </a>
          ) : (
            <Link className="header-cta" href={pathname === "/planos" ? "/contratar" : "/planos"}>
              Vamos começar <Arrow diagonal />
            </Link>
          )}
          <button
            className="menu-toggle"
            aria-label="Abrir menu"
            onClick={() => setMenu(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      {menu && (
        <Modal
          label="Menu de navegação"
          onClose={() => setMenu(false)}
          className="mobile-menu"
        >
          <Logo />
          <nav aria-label="Menu móvel">
            {links.map(([name, href]) =>
              pathname === "/" ? (
                <a
                  key={name}
                  href={href.slice(1)}
                  onClick={() => setMenu(false)}
                >
                  {name}
                  <Arrow diagonal />
                </a>
              ) : (
                <Link key={name} href={href} onClick={() => setMenu(false)}>
                  {name}
                  <Arrow diagonal />
                </Link>
              ),
            )}
            {pathname === "/" ? (
              <a href="#plano" onClick={() => setMenu(false)}>
                Conhecer o plano
                <Arrow diagonal />
              </a>
            ) : (
              <Link href={pathname === "/planos" ? "/contratar" : "/planos"} onClick={() => setMenu(false)}>
                {pathname === "/planos" ? "Começar minha nova fase" : "Conhecer o plano"}
                <Arrow diagonal />
              </Link>
            )}
          </nav>
        </Modal>
      )}
      {portal && (
        <Modal label="Acesso à plataforma" onClose={() => setPortal(false)}>
          <div className="dialog-copy">
            <span className="eyebrow">Área de entregas</span>
            <h2>O portal está em preparação.</h2>
            <p>
              O endereço de acesso ainda precisa ser confirmado. Para falar
              sobre seu conteúdo, converse com o Victor.
            </p>
            <a
              className="button blue"
              href={whatsapp(
                "Olá, Victor! Preciso de ajuda com o acesso ao portal da Azuria.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Falar com Victor
              <Arrow diagonal />
            </a>
          </div>
        </Modal>
      )}
    </>
  );
}
