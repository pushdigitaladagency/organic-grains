"use client";
import { useRouter } from "next/navigation";
import Home from './Components/Home';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Preloader from './Components/Preloader';

export default function Page() {
  const router = useRouter();

  // Navigate to the product's own route, e.g. /grains/product/beetroot-multivitamin-malt
  const handleProductClick = (slug) => {
    if (slug) router.push(`/product/${slug}`);
  };

  return (
    <div>
      <Preloader />
      <Navbar />
      <Home onProductClick={handleProductClick} />
      <Footer />
    </div>
  );
}
