import Hero from "@/components/home/Hero";
import QuoteSection from "@/components/home/QuoteSection";
import StepList from "@/components/home/StepList";
import VoiceFirstSection from "@/components/home/VoiceFirstSection";
import MultilingualSection from "@/components/home/MultilingualSection";
import SafetySection from "@/components/home/SafetySection";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <QuoteSection />
      <StepList />
      <VoiceFirstSection />
      <MultilingualSection />
      <SafetySection />
      <FinalCTA />
    </>
  );
}
