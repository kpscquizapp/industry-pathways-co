import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Logos from "@/components/landing/Logos";
import HowItWorks from "@/components/landing/HowItWorks";
import AiHiring from "@/components/landing/AiHiring";
import Roles from "@/components/landing/Roles";
import TrustedCompanies from "@/components/landing/TrustedCompanies";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

const Index = () => {
  // Initialize fade-in animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background isolate">
      <div className="w-full h-10 bg-[#75d6ff]" />
      <Navbar />
      <main>
        <Hero />
        <Logos />
        <HowItWorks />
        <Roles />
        <TrustedCompanies />
        <AiHiring />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
