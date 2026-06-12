"use client";
import React, { useState, useEffect, useRef } from 'react';
import Home from './Components/Home';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import InnerPage from './Components/Product';

const BASE_URL = process.env.NEXT_PUBLIC_PRODUC_URI;

// Normalise API list responses to a plain array.
const list = (v) => (Array.isArray(v) ? v : []);

const getCategoryName = (c) => c?.name || c?.title || c?.categoryName || "";
const getCategorySlug = (c) => c?.slug || c?.categorySlug || c?.id || "";
const getProductName  = (p) => p?.name || p?.title || p?.productName || "";

function matchProductCategory(product, catSlug, catName) {
  const val = (product?.category_slug || product?.categorySlug || product?.category || product?.categoryName || "").toLowerCase();
  return val === catSlug.toLowerCase() || val === catName.toLowerCase();
}

export default function Page() {
  const [selectedSlug, setSelectedSlug] = useState(null);

  // Data pre-fetched on home render — handed to Product so it skips its own fetch.
  const [prefetchedData, setPrefetchedData] = useState(null);
  const fetchStarted = useRef(false);

  // Fetch all product data as soon as the home page mounts.
  useEffect(() => {
    if (fetchStarted.current) return;   // run only once
    fetchStarted.current = true;

    async function prefetchAll() {
      try {
        const [catsData, prodsData, featData] = await Promise.all([
          fetch(`${BASE_URL}/api/grains/categories`).then((r) => r.json()),
          fetch(`${BASE_URL}/api/grains/products`).then((r) => r.json()),
          fetch(`${BASE_URL}/api/grains/products/featured`).then((r) => r.json()),
        ]);

        const cats  = list(catsData.data  ?? catsData.categories ?? catsData);
        const prods = list(prodsData.data ?? prodsData.products  ?? prodsData);
        const feat  = list(featData.data  ?? featData.products   ?? featData);

        // Build the category → product dropdown menu (same logic as Product.js).
        const menu = await Promise.all(
          cats.map(async (cat) => {
            const catName = getCategoryName(cat);
            const catSlug = getCategorySlug(cat);
            let products;
            try {
              const data = await fetch(`${BASE_URL}/api/grains/categories/${catSlug}/products`).then((r) => r.json());
              products = list(data.data ?? data.products ?? data);
            } catch {
              products = prods.filter((pr) => matchProductCategory(pr, catSlug, catName));
            }
            return {
              title: catName,
              dropdownClass: catName.toLowerCase().includes("flour") ? "flour-dropdown" : undefined,
              links: products.map((pr) => ({ name: getProductName(pr), slug: pr?.slug || "" })).filter((l) => l.name),
            };
          })
        );

        setPrefetchedData({ allProducts: prods, featuredProducts: feat, categoryMenu: menu });
      } catch (err) {
        console.error("Home prefetch error:", err);
      }
    }

    prefetchAll();
  }, []);

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
      <Navbar onBack={selectedSlug ? handleBack : null} key={selectedSlug || "home"} />
      {selectedSlug ? (
        <InnerPage
          initialSlug={selectedSlug}
          onBack={handleBack}
          prefetchedData={prefetchedData}
        />
      ) : (
        <Home onProductClick={handleProductClick} />
      )}
      <Footer />
    </div>
  );
}
