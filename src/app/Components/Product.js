"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { asset } from "../lib/asset";
import "./product.css";

const BASE_URL = process.env.NEXT_PUBLIC_PRODUC_URI;

// Section icons are static (not provided by the API) — reused by index.
const featureIcons = ["./Images/shield.svg", "./Images/hand.svg", "./Images/Antioxident.svg", "./Images/age.svg"];
const ingredientIcons = ["./Images/shop.svg", "./Images/water.svg", "./Images/salt.svg", "./Images/coconut.svg"];
const benefitIcons = ["./Images/shield.svg", "./Images/Antioxident.svg", "./Images/No preservatives.svg", "./Images/source.svg", "./Images/Stomach.svg", "./Images/fam.svg"];
const storageIcons = ["./Images/store.svg", "./Images/seal.svg", "./Images/best.svg"];

// Static contact details (no API source).
const contactInfo = [
  { icon: "/ph.png", alt: "phone", label: "PHONE", value: "+91 9940399388" },
  { icon: "/em.png", alt: "email", label: "EMAIL", value: " thirugailifestylecenter@gmail.com" },
  { icon: "/log1.png", alt: "location", label: "LOCATION", value: "Thirugai Life style Center, Thirukarugavur, Thanjavur - 614302", iconId: "location-icon" },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Image with Shimmer Skeleton Loader
 * ───────────────────────────────────────────────────────────────────────────── */
const ImageWithSkeleton = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  return (
    <div className={`${!loaded && src ? "shimmer-bg" : ""} ${className}`} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      {src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.15s ease-in-out",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
    </div>
  );
};

/* ---------- HELPERS ---------- */
const list = (v) => (Array.isArray(v) ? v : []);

// Turns a bare filename (e.g. "product-main.svg") into a /Images/ public path.
// Already-absolute URLs (http//) or absolute paths (/) are returned unchanged.
const buildImageUrl = (filename) => {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;
  // Route public/static images through the base-path-aware asset() helper.
  return asset(filename.startsWith("/") ? filename : `/Images/${filename}`);
};

const getProductName = (p) => p?.name || p?.title || p?.productName || "";
// Resolve the first image to a full URL.
const getProductImage = (p) => {
  const raw = list(p?.images)[0] || p?.image || p?.imageUrl || p?.img || p?.thumbnail || "";
  return buildImageUrl(raw);
};
const getCategoryName = (c) => c?.name || c?.title || c?.categoryName || "";
const getCategorySlug = (c) => c?.slug || c?.categorySlug || c?.id || "";

function matchProductCategory(product, catSlug, catName) {
  const val = (product?.category_slug || product?.categorySlug || product?.category || product?.categoryName || "").toLowerCase();
  return val === catSlug.toLowerCase() || val === catName.toLowerCase();
}

// "Pure goodness, nothing else" → ["Pure goodness, ", "nothing else"] to keep the <span> accent.
function splitHeading(str) {
  if (!str) return ["", ""];
  const idx = str.indexOf(", ");
  return idx === -1 ? [str, ""] : [str.slice(0, idx + 2), str.slice(idx + 2)];
}

export default function ProductDetails({ initialSlug, onBack, prefetchedData }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("");
  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);

  const [categoryMenu, setCategoryMenu] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategoryMenu, setActiveCategoryMenu] = useState(null);
  const dropdownRef = useRef(null);

  const toggleCategoryMenu = (index) => {
    setActiveCategoryMenu(activeCategoryMenu === index ? null : index);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      // Also close category menu if clicking outside the category-menu section
      if (activeCategoryMenu !== null && !event.target.closest(".category-menu")) {
        setActiveCategoryMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeCategoryMenu]);

  const getVisibleItems = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth <= 640) return 2;
    return 3;
  };

  /* ---------- DATA ----------
   * Product data is fetched ONCE by the shared DataProvider in the root layout
   * and handed in via `prefetchedData`. This view never fetches the catalogue
   * itself — it just consumes the shared data once it is available.
   * --------------------------------------------------------------------- */
  useEffect(() => {
    if (!prefetchedData) return; // wait for the shared prefetch to resolve

    const { allProducts: prods, featuredProducts: feat, categoryMenu: menu } = prefetchedData;

    setAllProducts(prods);
    setFeaturedProducts(feat);
    setCategoryMenu(menu);

    // Resolve the initial product to display.
    const wanted = initialSlug || new URLSearchParams(window.location.search).get("product");
    const initial = (wanted && prods.find((pr) => pr.slug === wanted)) || prods[0];
    if (initial) setCurrentProduct(initial);
  }, [prefetchedData, initialSlug]);

  // When the parent changes the slug (e.g. user clicks another product in Home), sync it.
  useEffect(() => {
    if (!initialSlug || !allProducts.length) return;
    const found = allProducts.find((pr) => pr.slug === initialSlug);
    if (found) setCurrentProduct(found);
  }, [initialSlug, allProducts]);

  /* ---------- PRODUCT SELECTION ---------- */
  const handleProductSelect = (slug) => {
    if (!slug) return;
    const found = allProducts.find((p) => p.slug === slug) || featuredProducts.find((p) => p.slug === slug);
    const show = (prod) => {
      setCurrentProduct(prod);
      if (prod?.slug) router.push(`/product/${prod.slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    if (found) return show(found);
    fetch(`${BASE_URL}/api/grains/products/${slug}`)
      .then((r) => r.json())
      .then((data) => show(data?.data || data?.product || data))
      .catch((err) => console.error("Product select error:", err));
  };

  useEffect(() => {
    document.body.classList.add("inner-page-active");
    return () => document.body.classList.remove("inner-page-active");
  }, []);

  useEffect(() => {
    const onResize = () => setVisibleItems(getVisibleItems());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Default the pack size to the product's "popular" weight when it changes.
  useEffect(() => {
    const w = list(currentProduct?.weights);
    if (w.length) setSelectedSize((w.find((x) => x.popular) || w[0]).label);
    setIndex(0);
    if (currentProduct) setActiveImg(getProductImage(currentProduct));
  }, [currentProduct]);

  /* ---------- DERIVED ---------- */
  const p = currentProduct;
  const prep = p?.preparation_method;
  const hl = p?.highlights_section;
  const stg = p?.storage;

  const galleryThumbs = list(p?.images).slice(1).map(buildImageUrl);
  const weights = list(p?.weights).map((w) => w.label);
  const featureItems = list(p?.feature_highlights).map((f, i) => ({ icon: featureIcons[i % featureIcons.length], title: f.title, text: f.description }));
  const recipeIngredients = list(prep?.ingredients).map((g, i) => ({ icon: ingredientIcons[i % ingredientIcons.length], title: g.name, sub: g.note, qty: g.quantity }));
  const recipeSteps = list(prep?.steps).map((s, i) => ({ tag: s.label, num: s.step ?? i + 1, label: `STEP ${String(s.step ?? i + 1).padStart(2, "0")}`, title: s.title, text: s.description }));
  const benefitItems = list(hl?.items).map((b, i) => ({ icon: benefitIcons[i % benefitIcons.length], title: b.title, text: b.description }));
  const storageItems = list(stg?.items).map((s, i) => ({ icon: storageIcons[i % storageIcons.length], title: s.title, text: s.description }));

  const recipePre = prep ? `Prep ${prep.prep_time}${prep.cook_time ? ` - Cook ${prep.cook_time}` : ""}` : "";
  const [benefitsHeadingMain, benefitsHeadingAccent] = splitHeading(hl?.heading || "");

  const relatedHeading = p?.related_heading || "";
  const relatedHeritageParts = relatedHeading.split(/heritage/i);
  // Only show products from the same category as the current product.
  const currentCatSlug = (p?.category_slug || p?.categorySlug || p?.category || "").toLowerCase();
  const sameCatProducts = allProducts.filter(
    (ap) =>
      ap.slug !== p?.slug &&
      (ap?.category_slug || ap?.categorySlug || ap?.category || "").toLowerCase() === currentCatSlug
  );
  // Explicit related_products (filtered to same category) come first, rest fill in behind.
  const relatedResolved = list(p?.related_products)
    .map((slug) => sameCatProducts.find((ap) => ap.slug === slug))
    .filter(Boolean);
  const seen = new Set();
  const carouselItems = [...relatedResolved, ...sameCatProducts]
    .filter((rp) => {
      if (!rp?.slug || rp.slug === p?.slug || seen.has(rp.slug)) return false;
      seen.add(rp.slug);
      return true;
    })
    .map((rp) => ({
      img: getProductImage(rp),
      alt: getProductName(rp),
      title: getProductName(rp),
      slug: rp?.slug || "",
    }));

  const maxIndex = Math.max((carouselItems.length || 1) - visibleItems, 0);
  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.product) tempErrors.product = "Please select a product";
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log(formData);
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        product: "",
        message: "",
      });
      setErrors({});
    }
  };

  return (
    <>
      <section className="category-main">
        <button className="back-home-btn" onClick={onBack}>
          <img src={asset("./Images/arrow.svg")} alt="back" className="back-arrow-icon" />
          <span>Back to Home</span>
        </button>
        <div className="category-menu">
          {categoryMenu.map((menu, i) => (
            <div 
              className={`menu-item ${activeCategoryMenu === i ? "active" : ""}`} 
              key={i}
              onClick={() => toggleCategoryMenu(i)}
            >
              <div className="menu-title">
                <span>{menu.title}</span>
                <img src={asset("./Images/arrow.svg")} alt="arrow" className={`arrowss ${activeCategoryMenu === i ? "rotate" : ""}`} />
              </div>
              <div className={`dropdown ${menu.dropdownClass || ""} ${activeCategoryMenu === i ? "show" : ""}`}>
                {menu.links.map((link, j) => (
                  <a href="#" key={j} onClick={(e) => { e.preventDefault(); handleProductSelect(link.slug); }}>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="product-page" id="products">
        <div className="product-container">
          <div className="gallery">
            <div className="main-image">
              <ImageWithSkeleton src={activeImg || getProductImage(p) || undefined} alt="product" />
            </div>
            <div className="thumbs">
              {list(p?.images).slice(1).filter(img => img).map((img, i) => {
                const url = buildImageUrl(img);
                return (
                  <div key={i} className={`thumb-wrapper ${activeImg === url ? "active-thumb" : ""}`} onClick={() => setActiveImg(url)}>
                    <ImageWithSkeleton src={url} alt={`thumb-${i}`} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="product-info">
            <span className="category">
              <img src={asset("./Images/drop.svg")} alt="dropdown" className="dropdown-icon" />
              {p?.badge}
            </span>

            <h1 className="product-title">{getProductName(p)}</h1>
            <h3>{p?.name_tamil}</h3>
            <p className="description">{p?.short_description || p?.description}</p>

            <div className="rating-row">
              <div>
                ⭐⭐⭐⭐⭐ <span>{p?.rating?.value} · {p?.rating?.count} reviews</span>
              </div>
              <div className="sold">● {p?.sold_text}</div>
            </div>

            <hr />

            <div className="size-header">
              <h4 className="pack">PACK SIZE</h4>
              <span className="choose">Choose your weight</span>
            </div>

            <div className="size-options">
              {weights.map((size) => (
                <div key={size} className="size-btn-wrapper">
             
                  <button className={selectedSize === size ? "size-btn active" : "size-btn"} onClick={() => setSelectedSize(size)}>
                    {size}
                  </button>
                </div>
              ))}
            </div>

            <div className="features-grid">
              {featureItems.map((feature, i) => (
                <div className="feature-card" key={i}>
                  <div className="icon-circle">
                    <img src={asset(feature.icon)} alt={feature.title} />
                  </div>
                  <div className="words">
                    <h5>{feature.title}</h5>
                    <p>{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="recipe-section">
        <h2 className="desc-title">Description</h2>
        <h3 className="desc-subtitle">{p?.description_tagline}</h3>
        <p className="desc-text">{p?.description || p?.short_description}</p>
        <h2 className="recipe-heading">{prep?.heading}</h2>

        <div className="ingredients-box">
          <div className="recipe-info">
            <span className="recipe-tag">RECIPE</span>
            <h3>{prep?.recipe_title}</h3>
            <p className="recipe-pre">{recipePre}</p>
            <h4>Main Ingredients</h4>
            <p>{prep?.main_ingredients}</p>
          </div>

          <div className="ingredients-grid">
            {recipeIngredients.map((ing, i) => (
              <div className="ingredient-card" key={i}>
                <div className="icon-shadow">
                  <img src={asset(ing.icon)} alt={ing.title} className="ingredient-icon" />
                </div>
                <div className="sen">
                  <h5 className="ingredients">{ing.title}</h5>
                  <p className="ingredient-sub">{ing.sub}</p>
                </div>
                <span>{ing.qty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="steps-grid">
          {recipeSteps.map((step, i) => (
            <div className="step-card" key={i}>
              <div className="step-top">
                <div className="tag">
                  <p className="step-tag" id="recipe">{step.tag}</p>
                  <span className="step-number">{step.num}</span>
                </div>
                <span>{step.label}</span>
              </div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits-section" id="benefits">
        <div className="benefits-header">
          <span className="benefits-tag">{hl?.eyebrow}</span>
          <h2 className="benefits-title">
            {benefitsHeadingMain}<span>{benefitsHeadingAccent}</span>
          </h2>
          <p className="benefits-desc">{hl?.subtext}</p>
        </div>

        <div className="benefits-body">
          <div className="benefits-left">
            <div className="benefits-grid1">
              {benefitItems.map((benefit, i) => (
                <div className="benefit-card" key={i}>
                  <div className="benefit-icon-circle">
                    <img src={asset(benefit.icon)} alt="" />
                  </div>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="storage-box">
            <h3>{stg?.heading}</h3>
            {storageItems.map((item, i) => (
              <div className="storage-item" key={i}>
                <div className="storage-item-inner">
                  <div className="storage-icon-circle">
                    <img src={asset(item.icon)} alt="" />
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pi-products" id="pi-products">
        <h3 className="pi-product-title">Related product</h3>
        <div className="heritage-main">
          <p className="heritage">
            {relatedHeritageParts.length > 1 ? (
              <>
                {relatedHeritageParts[0]}
                <span style={{ color: "#5A7C36" }}>heritage </span>
                {relatedHeritageParts.slice(1).join("heritage").trimStart()}
              </>
            ) : (
              relatedHeading
            )}
          </p>
        </div>
        <div className="pi-carousel-wrapper">
          <button className="pi-arrow pi-left" onClick={prev}>
            <img src={asset("/buttonleft.png")} alt="Prev" />
          </button>

          <div className="pi-carousel-container">
            <div className="pi-carousel-track" style={{ transform: `translateX(-${index * (100 / visibleItems)}%)` }}>
              {carouselItems.map((item, i) => (
                <div className="pi-carousel-item" key={i}>
                  <div className="pi-card" style={{ cursor: "pointer" }} onClick={() => handleProductSelect(item.slug)}>
                    <div className="pi-img-box">
                      <ImageWithSkeleton src={item.img || undefined} alt={item.alt} />
                    </div>
                    <div className="pi-card-content">
                      <h4>{item.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="pi-arrow pi-right" onClick={next}>
            <img src={asset("/buttonright.png")} alt="Next" />
          </button>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-left">
          <span className="contact-tag">GET IN TOUCH</span>
          <h2>
            Ready to switch to <br />
            <span>healthier living?</span>
          </h2>
          <p className="contact-desc">Contact us today to place your order or learn more about our heritage products.</p>

          <div className="contact-info">
            {contactInfo.map((info, i) => (
              <div className="info-box" key={i}>
                <div className="info-icon" id={info.iconId}>
                  <img src={asset(info.icon)} alt={info.alt} />
                </div>
                <div>
                  <span className="phone">{info.label}</span>
                  <p>{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send us a message</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="name">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="name">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="+91"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="name">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="name">Popular Products</label>
              <div className="product-custom-dropdown" ref={dropdownRef}>
                <div
                  className={`dropdown-selected ${errors.product ? "error" : ""}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {formData.product || "Select a product"}
                  <img
                    src={asset("./Images/arrow.svg")}
                    alt="arrow"
                    className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
                  />
                </div>
                {isDropdownOpen && (
                  <ul className="dropdown-options">
                    {["Karuppu Kavuni Rice", "Rathasali Rice", "Thuyamalli Rice", "Beetroot Multivitamin Malt", "Panchamirtha Malt"].map((item) => (
                      <li
                        key={item}
                        onClick={() => {
                          setFormData({ ...formData, product: item });
                          setIsDropdownOpen(false);
                          if (errors.product) setErrors({ ...errors, product: "" });
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.product && <span className="error-msg">{errors.product}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="name">Message</label>
            <textarea
              name="message"
              placeholder="Tell us what you'd like to order..."
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <span className="error-msg">{errors.message}</span>}
          </div>

          <button type="submit" className="contact-btn">
            Order Now →
          </button>
        </form>
      </section>
    </>
  );
}
