
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CareerPathVisualization from '@/components/CareerPathVisualization';

const CareerPath = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <CareerPathVisualization />
      </main>
      <Footer />
    </div>
  );
};

export default CareerPath;
