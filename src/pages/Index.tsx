import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomeEntrySection from "@/components/HomeEntrySection";
import MetiersSection from "@/components/MetiersSection";
import WhyUsSection from "@/components/WhyUsSection";
import HomeTrustSection from "@/components/HomeTrustSection";
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
        <HomeEntrySection />
        <MetiersSection />
        <WhyUsSection />
        <HomeTrustSection />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
