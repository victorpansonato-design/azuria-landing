import { Hero } from "@/features/hero/Hero";
import { Gallery } from "@/features/gallery/Gallery";
import { Process } from "@/features/process/Process";
import { ImmersionBridge } from "@/features/process/ImmersionBridge";
import { Pricing } from "@/features/pricing/Pricing";
import { Footer } from "@/shared/ui/Footer";
export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <Gallery />
      <ImmersionBridge />
      <Process />
      <Pricing />
      <Footer />
    </main>
  );
}
