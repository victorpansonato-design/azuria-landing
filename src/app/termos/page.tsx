import { siteUrl } from "@/data/business";
import { Legal } from "@/shared/ui/Legal";
export const metadata = {
  title: "Termos em preparação",
  description:
    "Termos do produto Azuria em preparação. A contratação atual é demonstrativa e não ativa uma assinatura.",
  ...(siteUrl ? { alternates: { canonical: "/termos" } } : {}),
};
export default function Terms() {
  return <Legal type="termos" />;
}
