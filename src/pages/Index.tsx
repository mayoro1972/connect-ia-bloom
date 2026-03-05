import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MetiersSection from "@/components/MetiersSection";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <HeroSection />
        <MetiersSection />
        <WhyUsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
