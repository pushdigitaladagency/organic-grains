"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_PRODUC_URI;

const GrainsDataContext = createContext(null);

/** Read the shared, prefetched product data (null until the first fetch resolves). */
export const useGrainsData = () => useContext(GrainsDataContext);

/* ---------- helpers (shared with Home/Product) ---------- */
const list = (v) => (Array.isArray(v) ? v : []);
const getCategoryName = (c) => c?.name || c?.title || c?.categoryName || "";
const getCategorySlug = (c) => c?.slug || c?.categorySlug || c?.id || "";
const getProductName = (p) => p?.name || p?.title || p?.productName || "";
const matchProductCategory = (product, catSlug, catName) => {
  const val = (product?.category_slug || product?.categorySlug || product?.category || product?.categoryName || "").toLowerCase();
  return val === catSlug.toLowerCase() || val === catName.toLowerCase();
};

/**
 * Fetches all product data ONCE when the app first mounts and keeps it in
 * context. Because this provider lives in the root layout, it is NOT remounted
 * when navigating between "/" and "/product/[slug]", so the data is fetched a
 * single time and reused across every page.
 */
export default function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const fetchStarted = useRef(false);

  useEffect(() => {
    if (fetchStarted.current) return; // run only once
    fetchStarted.current = true;

    async function prefetchAll() {
      try {
        const [catsData, prodsData, featData] = await Promise.all([
          fetch(`${BASE_URL}/api/grains/categories`).then((r) => r.json()),
          fetch(`${BASE_URL}/api/grains/products`).then((r) => r.json()),
          fetch(`${BASE_URL}/api/grains/products/featured`).then((r) => r.json()),
        ]);

        const cats = list(catsData.data ?? catsData.categories ?? catsData);
        const prods = list(prodsData.data ?? prodsData.products ?? prodsData);
        const feat = list(featData.data ?? featData.products ?? featData);

        // Build the category → product dropdown menu.
        const menu = await Promise.all(
          cats.map(async (cat) => {
            const catName = getCategoryName(cat);
            const catSlug = getCategorySlug(cat);
            let products;
            try {
              const d = await fetch(`${BASE_URL}/api/grains/categories/${catSlug}/products`).then((r) => r.json());
              products = list(d.data ?? d.products ?? d);
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

        setData({ allProducts: prods, featuredProducts: feat, categoryMenu: menu });
      } catch (err) {
        console.error("Grains prefetch error:", err);
      }
    }

    prefetchAll();
  }, []);

  return <GrainsDataContext.Provider value={data}>{children}</GrainsDataContext.Provider>;
}
