import { Hero } from "@/features/hero/Hero";
import { Gallery } from "@/features/gallery/Gallery";
import { Process } from "@/features/process/Process";
import { Pricing } from "@/features/pricing/Pricing";
import { Footer } from "@/shared/ui/Footer";
export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <Gallery />
      <Process />
      <Pricing />
      <Footer />
    </main>
  );
}
