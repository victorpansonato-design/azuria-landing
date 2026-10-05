import { test } from "node:test";
import assert from "node:assert/strict";
import {
  matchQuestion,
  normalize,
  template,
} from "../src/features/zuri/matcher";
import { plan, totals, price } from "../src/data/business";
import {
  demoPaymentProvider,
  validateCheckout,
} from "../src/features/checkout/payment";
test("offer totals count carousel publications, not pages", () => {
  assert.equal(totals.stories, 24);
  assert.equal(totals.feedPublications, 12);
  assert.equal(
    plan.deliveriesPerCycle * plan.perDelivery.staticFeed,
    plan.staticFeedPerCycle,
  );
  assert.equal(
    plan.deliveriesPerCycle * plan.perDelivery.carouselFeed,
    plan.carouselFeedPerCycle,
  );
  assert.equal(
    plan.deliveriesPerCycle * totals.storiesPerDelivery,
    totals.stories,
  );
  assert.equal(
    template("{{price}}: {{storiesPerDelivery}} stories"),
    `${price}: 6 stories`,
  );
});
test("FAQ recognizes accents, shorthand and multiple intents", () => {
  assert.equal(normalize("  PREÇO?  "), "preco");
  assert.ok(matchQuestion("qto custa?").ids.includes("preco"));
  const mixed = matchQuestion("quanto custa e posso cancelar?");
  assert.ok(mixed.ids.includes("preco"));
  assert.ok(mixed.ids.includes("cancelamento"));
  assert.match(mixed.text, /confirmadas/);
  assert.doesNotMatch(mixed.text, /sem fidelidade/);
  assert.ok(matchQuestion("297 inclui o quê?").ids.includes("incluido"));
  assert.ok(matchQuestion("O que vem no plano?").ids.includes("incluido"));
});
test("FAQ distinguishes story, deadlines, pages and five weeks", () => {
  assert.ok(matchQuestion("quantos stories").ids.includes("stories"));
  assert.ok(matchQuestion("4 páginas são 4 posts?").ids.includes("carrossel"));
  assert.deepEqual(matchQuestion("prazo?").ids, ["prazo"]);
  assert.ok(matchQuestion("ajustes", ["prazo"]).ids.includes("ajuste_prazo"));
  assert.ok(
    matchQuestion("5 semanas muda a quantidade?").ids.includes("cinco_semanas"),
  );
});
test("styles follow intention rather than segment", () => {
  assert.equal(
    matchQuestion("pet shop minimalista").direction,
    "editorial-minimalismo",
  );
  assert.equal(matchQuestion("joias ousadas").direction, "tipografia-impacto");
  assert.equal(
    matchQuestion("restaurante sofisticado").direction,
    "luxo-sensorial",
  );
  assert.equal(matchQuestion("pet shop").action, "curadoria");
});
test("out-of-scope, unsupported automation and undefined policies stay honest", () => {
  assert.deepEqual(matchQuestion("qual a arte de fazer uma bomba?").ids, [
    "fallback",
  ]);
  assert.ok(matchQuestion("publica no insta?").ids.includes("publicacao"));
  assert.ok(matchQuestion("tem GPT?").ids.includes("gerador"));
  assert.ok(
    matchQuestion("em quanto tempo recebo?").ids.includes("prazo_inicial"),
  );
  assert.ok(matchQuestion("tem reembolso?").ids.includes("reembolso"));
});
test("demo checkout validates and preserves attempt without charging", async () => {
  assert.equal(
    Object.keys(
      validateCheckout({
        responsible: "",
        company: "",
        email: "bad",
        instagram: "https://evil.test",
      }),
    ).length,
    4,
  );
  const input = {
    responsible: "Pessoa de teste",
    company: "Marca exemplo",
    email: "teste@example.com",
    instagram: "@marca",
  };
  assert.deepEqual(validateCheckout(input), {});
  const first = await demoPaymentProvider.createCheckout(input);
  assert.equal(first.status, "aguardando");
  const second = await demoPaymentProvider.createCheckout(input, first);
  assert.equal(second.id, first.id);
  await assert.rejects(
    demoPaymentProvider.createCheckout({ ...input, email: "invalid" }),
  );
});
