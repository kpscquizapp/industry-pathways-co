import  { useEffect } from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import UserTypesSection from '@/components/landing/UserTypesSection';
import AIDifferentiation from '@/components/landing/AIDifferentiation';
import TrustMetrics from '@/components/landing/TrustMetrics';
import LandingFooter from '@/components/landing/LandingFooter';

const Index = () => {
  // Initialize fade-in animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <UserTypesSection />
        <AIDifferentiation />
        <TrustMetrics />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
