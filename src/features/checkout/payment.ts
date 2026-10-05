export type CheckoutStatus = "aguardando" | "concluido" | "cancelado" | "erro";
export type CheckoutInput = {
  responsible: string;
  company: string;
  email: string;
  instagram?: string;
};
export type CheckoutAttempt = {
  id: string;
  status: CheckoutStatus;
  createdAt: string;
};
export interface PaymentProviderAdapter {
  createCheckout(
    input: CheckoutInput,
    previous?: CheckoutAttempt,
  ): Promise<CheckoutAttempt>;
}
export function validateCheckout(
  input: CheckoutInput,
): Partial<Record<keyof CheckoutInput, string>> {
  const errors: Partial<Record<keyof CheckoutInput, string>> = {};
  if (input.responsible.trim().length < 2 || input.responsible.length > 100)
    errors.responsible = "Informe o nome do responsável (2 a 100 caracteres).";
  if (input.company.trim().length < 2 || input.company.length > 100)
    errors.company = "Informe o nome da empresa (2 a 100 caracteres).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    input.email.length > 254
  )
    errors.email = "Informe um e-mail válido.";
  if (input.instagram && !/^@?[a-zA-Z0-9._]{1,30}$/.test(input.instagram))
    errors.instagram = "Use apenas o nome do perfil, como @suamarca.";
  return errors;
}
export const demoPaymentProvider: PaymentProviderAdapter = {
  async createCheckout(input, previous) {
    if (Object.keys(validateCheckout(input)).length)
      throw new Error("Revise os campos do formulário.");
    return previous
      ? { ...previous, status: "aguardando" }
      : {
          id: crypto.randomUUID(),
          status: "aguardando",
          createdAt: new Date().toISOString(),
        };
  },
};
// Future live adapter: create hosted checkout on the server; verified, idempotent webhook confirms access.
// Browser result parameters never authorize a subscription.
