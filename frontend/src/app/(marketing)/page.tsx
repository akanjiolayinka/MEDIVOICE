import Hero from "@/components/home/Hero";
import ConceptGrid from "@/components/home/ConceptGrid";
import QuoteSection from "@/components/home/QuoteSection";
import StepList from "@/components/home/StepList";
import ProductPreview from "@/components/home/ProductPreview";
import MultilingualSection from "@/components/home/MultilingualSection";
import SafetySection from "@/components/home/SafetySection";
import ResearchTeaser from "@/components/home/ResearchTeaser";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ConceptGrid />
      <QuoteSection />
      <StepList />
      <ProductPreview />
      <MultilingualSection />
      <SafetySection />
      <ResearchTeaser />
      <FinalCTA />
    </>
  );
}
