import { siteUrl } from "@/data/business";
import { Legal } from "@/shared/ui/Legal";
export const metadata = {
  title: "Privacidade em preparação",
  description:
    "Informações sobre a demonstração local da Azuria. O texto de privacidade do produto final está em preparação.",
  ...(siteUrl ? { alternates: { canonical: "/privacidade" } } : {}),
};
export default function Privacy() {
  return <Legal type="privacidade" />;
}
