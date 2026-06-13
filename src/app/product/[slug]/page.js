"use client";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import InnerPage from "../../Components/Product";
import { useGrainsData } from "../../Components/DataProvider";

export default function ProductPage() {
  const router = useRouter();
  const { slug } = useParams();
  const prefetchedData = useGrainsData(); // shared, fetched once in the layout

  const handleBack = () => router.push("/");

  return (
    <div>
      <Navbar onBack={handleBack} key={slug} />
      <InnerPage initialSlug={slug} onBack={handleBack} prefetchedData={prefetchedData} />
      <Footer />
    </div>
  );
}
