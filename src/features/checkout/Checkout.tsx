"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { business, price, plan, totals } from "@/data/business";
import { Arrow } from "@/shared/ui/Icons";
import {
  demoPaymentProvider,
  validateCheckout,
  type CheckoutInput,
  type CheckoutAttempt,
} from "./payment";
let draft: CheckoutInput = {
  responsible: "",
  company: "",
  email: "",
  instagram: "",
};
let attempt: CheckoutAttempt | undefined;
export function Checkout() {
  const router = useRouter();
  const [form, setForm] = useState(draft);
  const [errors, setErrors] = useState<ReturnType<typeof validateCheckout>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  useEffect(() => {
    draft = form;
  }, [form]);
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateCheckout(form);
    setErrors(found);
    setFailure("");
    if (Object.keys(found).length) {
      document.getElementById(`checkout-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      attempt = await demoPaymentProvider.createCheckout(form, attempt);
      router.push(
        `/contratar/resultado?estado=aguardando&tentativa=${attempt.id}`,
      );
    } catch {
      setFailure(
        "Não foi possível iniciar a simulação. Revise os dados e tente novamente.",
      );
      setBusy(false);
    }
  }
  return (
    <div className="checkout-grid">
      <form className="checkout-form" onSubmit={submit} noValidate>
        <span className="eyebrow">Vamos dar o primeiro passo</span>
        <h1>Sobre a sua marca.</h1>
        <p>Preencha os dados para explorar o fluxo de contratação.</p>
        <div className="demo-notice">{business.checkout.demoNotice}</div>
        {(
          [
            ["responsible", "Nome do responsável", "text", "name"],
            ["company", "Nome da empresa", "text", "organization"],
            ["email", "E-mail", "email", "email"],
            ["instagram", "Instagram (opcional)", "text", "off"],
          ] as const
        ).map(([key, label, type, autocomplete]) => (
          <div className="field" key={key}>
            <label htmlFor={`checkout-${key}`}>{label}</label>
            <input
              id={`checkout-${key}`}
              name={key}
              type={type}
              autoComplete={autocomplete}
              value={form[key] || ""}
              maxLength={key === "email" ? 254 : key === "instagram" ? 31 : 100}
              aria-invalid={!!errors[key]}
              aria-describedby={errors[key] ? `error-${key}` : undefined}
              required={key !== "instagram"}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
            {errors[key] && (
              <small className="field-error" id={`error-${key}`}>
                {errors[key]}
              </small>
            )}
          </div>
        ))}
        <small className="form-privacy">
          Os dados ficam somente na memória desta demonstração e são descartados
          ao recarregar. Não são enviados a servidor ou WhatsApp.{" "}
          <Link href="/privacidade">Sobre privacidade</Link>
        </small>
        {failure && (
          <p role="alert" className="field-error">
            {failure}
          </p>
        )}
        <button disabled={busy} className="button blue" type="submit">
          {busy ? "Abrindo demonstração…" : "Ir para checkout demonstrativo"}
          <Arrow diagonal />
        </button>
      </form>
      <aside className="checkout-summary">
        <span className="eyebrow">Seu plano</span>
        <h2>Azuria</h2>
        <div className="plan-price">
          {price}
          <span>por ciclo mensal</span>
        </div>
        <p>
          {plan.staticFeedPerCycle} posts estáticos
          <br />
          {plan.carouselFeedPerCycle} carrosséis de até{" "}
          {plan.maxPagesPerCarouselIncludingCover} páginas
          <br />
          {totals.stories} stories
          <br />
          {plan.deliveriesPerCycle} entregas por ciclo
        </p>
        <p>
          Uma direção aprovada. Uma rodada consolidada de ajustes por entrega,
          solicitada em até {business.adjustments.requestWindowBusinessDays}{" "}
          dias úteis.
        </p>
        <Link href="/planos">
          Revisar todos os detalhes
          <Arrow />
        </Link>
        <span className="summary-end">
          Nenhum cartão será solicitado.
          <br />
          Nenhuma assinatura será ativada.
        </span>
      </aside>
    </div>
  );
}
