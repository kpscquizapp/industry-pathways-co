import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HomeJobsSection from '@/components/HomeJobsSection';
import FeaturedCompanies from '@/components/FeaturedCompanies';
import SmartCareerTools from '@/components/SmartCareerTools';
import Footer from '@/components/Footer';

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
      <Header />
      <main>
        <Hero />
        <HomeJobsSection />
        <FeaturedCompanies />
        <SmartCareerTools />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
