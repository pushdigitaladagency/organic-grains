"use client";
import React, { useState } from 'react';
import Home from './Components/Home';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import InnerPage from './Components/Product';

export default function Page() {
  const [selectedSlug, setSelectedSlug] = useState(null);

  const handleProductClick = (slug) => {
    setSelectedSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar onBack={selectedSlug ? handleBack : null} />
      {selectedSlug ? (
        <InnerPage initialSlug={selectedSlug} onBack={handleBack} />
      ) : (
        <Home onProductClick={handleProductClick} />
      )}
      <Footer />
    </div>
  );
}
