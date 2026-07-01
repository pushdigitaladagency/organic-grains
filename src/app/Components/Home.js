"use client";
// HMR trigger — contact form: "Sending..." button + inline status message
import { asset } from "../lib/asset";
import { sendContact } from "../lib/sendContact";

import "./Home.css";

import { useEffect, useState } from "react";

import {
  STATIC_RICE,
  STATIC_PUTTU,
  STATIC_SOUP,
  STATIC_MALT,
  STATIC_COOKIES as COOKIES,
  STATIC_VADAM_VATHAL as VADAM_VATHAL
} from "../lib/staticData";

/* ─────────────────────────────────────────────────────────────────────────────
 * API data helpers (mirrors helpers used in Product.js)
 * ───────────────────────────────────────────────────────────────────────────── */
const _getName = (p) => p?.name || p?.title || p?.productName || "";
const _buildImg = (f) => (!f ? "" : f.startsWith("http") || f.startsWith("/") ? f : `/Images/${f}`);
const _getImg = (p) => _buildImg((Array.isArray(p?.images) ? p.images[0] : null) || p?.image || p?.imageUrl || p?.img || "");
const _getDesc = (p) => p?.short_description || p?.description || "";
const _getPoints = (p) => {
  const hl = Array.isArray(p?.feature_highlights) ? p.feature_highlights : [];
  return hl.length ? hl.slice(0, 5).map((h) => `✔ ${h.title}`) : [];
};

export default function Home({ onProductClick, prefetchedData, onHeroVideoReady }) {
  const heroVideoSrc = asset("/hero_bg1.mp4?v=faststart-ready");

  // Responsive visible-card count for the product carousels:
  // 3 cards on desktop/tablet, 2 cards on mobile (max-width: 640px).
  // This keeps the track step (100 / visibleItems) and maxIndex in sync with
  // the CSS card width (50% at <=640px) so exactly 2 full cards show on mobile
  // and the last card stays reachable. Defaults to 3 for SSR/first paint.
  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const applyVisible = () => setVisibleItems(mq.matches ? 2 : 3);
    applyVisible();
    mq.addEventListener("change", applyVisible);
    return () => mq.removeEventListener("change", applyVisible);
  }, []);

  const [index, setIndex] = useState(0);

  const totalItems = 9;
  const maxIndex = totalItems - visibleItems;

  const next = () => {
    if (index < maxIndex) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  // Soup & Booster carousel state
  const [index3, setIndex3] = useState(0);
  const totalItems3 = 7;
  const maxIndex3 = totalItems3 - visibleItems;

  const next3 = () => {
    if (index3 < maxIndex3) {
      setIndex3(index3 + 1);
    }
  };

  const prev3 = () => {
    if (index3 > 0) {
      setIndex3(index3 - 1);
    }
  };

  // Special Mixes carousel state
  const [index5, setIndex5] = useState(0);
  const totalItems5 = 6;
  const maxIndex5 = totalItems5 - visibleItems;

  const next5 = () => {
    if (index5 < maxIndex5) {
      setIndex5(index5 + 1);
    }
  };

  const prev5 = () => {
    if (index5 > 0) {
      setIndex5(index5 - 1);
    }
  };

  // Other Products carousel state
  const [index6, setIndex6] = useState(0);
  const totalItems6 = 5;
  const maxIndex6 = totalItems6 - visibleItems;

  const next6 = () => {
    if (index6 < maxIndex6) {
      setIndex6(index6 + 1);
    }
  };

  const prev6 = () => {
    if (index6 > 0) {
      setIndex6(index6 - 1);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text }

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

    if (name === "name") {
      const lettersOnly = value.replace(/[0-9]/g, "");
      setFormData({ ...formData, [name]: lettersOnly });
    } else if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setStatus(null);
    try {
      setSubmitting(true);
      await sendContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      });
      setStatus({ type: "success", text: "Thank you! Your message has been sent — our team will get back to you shortly." });
      setErrors({});
      // Clear the form fields and hide the message after 2 seconds.
      setTimeout(() => {
        setFormData({ name: "", phone: "", email: "", product: "", message: "" });
        setStatus(null);
      }, 2000);
    } catch (err) {
      console.error("Contact send error:", err);
      setStatus({ type: "error", text: "Sorry, we couldn't send your message right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  /* ────────────────────────────────────────────────────────────────────────────
   * Derive product items from API data (prefetchedData) or fall back to
   * static arrays when data hasn't arrived yet.
   *
   * _getSection(...keywords):
   *   1. Tries to match categories by title keyword → returns their products.
   *   2. Falls back to filtering allProducts by slug keyword.
   * ────────────────────────────────────────────────────────────────────────── */
  const _allProds = prefetchedData?.allProducts || [];
  const _catMenu = prefetchedData?.categoryMenu || [];

  function _getSection(...keywords) {
    for (const kw of keywords) {
      const cats = _catMenu.filter((c) => c.title.toLowerCase().includes(kw.toLowerCase()));
      if (cats.length) {
        const seen = new Set();
        return cats
          .flatMap((c) => c.links)
          .filter((l) => { if (seen.has(l.slug)) return false; seen.add(l.slug); return true; })
          .map((l) => _allProds.find((p) => p.slug === l.slug))
          .filter(Boolean);
      }
    }
    // Slug-level fallback
    return _allProds.filter((p) =>
      keywords.some((k) => (p?.slug || "").toLowerCase().includes(k.toLowerCase()))
    );
  }

  // ── Rice (up to 3 products) ──────────────────────────────────────────────
  const riceItems = STATIC_RICE;

  // ── Puttu & Idiyappam (up to 6 products) ────────────────────────────────
  const puttuItems = STATIC_PUTTU;

  // ── Soup & Booster Mixes (up to 5 products) ─────────────────────────────
  const soupItems = STATIC_SOUP;

  // ── Health Malts (up to 2 products) ─────────────────────────────────────
  const maltItems = STATIC_MALT;

  // ── Special Mixes (up to 5 products) ─────────────────────────────────────
  const specialItems = COOKIES;

  // ── Other New Products (up to 5 products) ────────────────────────────────
  const otherItems = VADAM_VATHAL;

  return (
    <div>

      {/* <Navbar /> */}

      {/* 🔹 HERO SECTION */}
      <section className="hero" id="home">
        <link rel="preload" as="video" href={heroVideoSrc} type="video/mp4" />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="background-video"
          onLoadedData={onHeroVideoReady}
          onCanPlay={onHeroVideoReady}
          onError={onHeroVideoReady}
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>


        {/* HERO CONTENT */}
        <div className="hero-content">
          <div className="badge">🌿 100% PURE & CHEMICAL-FREE</div>

          <h1 className="pure">
            Pure Organic Nutrition <br />
            for a <span style={{ color: "#E6C9A8" }}>Healthier Life</span>
          </h1>

          <p className="des">
            Rediscover the power of traditional grains and natural health drinks.<br />
            Nourish your body with chemical-free, nutrient-rich foods.
          </p>

          <div className="buttons">
            <button className="explore" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>Explore Products →</button>
            <button className="contact" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact Us</button>
          </div>
        </div>




      </section>


      {/* 🔹 ABOUT SECTION */}
      <section className="about" id="about">
        <img src={asset("/red_wheat.png")} alt="background" className="products10" />
        {/* LEFT IMAGE */}
        <div className="about-img">
          <img src={asset("/paddy.png")} alt="about" />
          <div className="quote">
            "Food should be pure, simple, and beneficial — just the way nature intended."
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">

          <span className="tags">ABOUT US</span>

          <h2 className="root">
            Rooted in Tradition,<br />
            Driven by <span>Health</span>
          </h2>

          <p className="we">
            We are dedicated to bringing back the goodness of traditional organic foods that have nourished generations. Our products are carefully sourced, minimally processed, and packed with natural nutrients to support a healthy lifestyle.
          </p>

          <div className="features">

            <div className="feature">
              <div className="icon5">
                <img src={asset("/leaf.png")} alt="leaf icon" />
              </div>
              <div>
                <h4 className="head">Sourced with Care</h4>
                <p className="head2" id="hea">Grown by traditional farmers using time-honoured organic methods.</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">
                <img src={asset("/shield.png")} alt="leaf icon" />
              </div>
              <div>
                <h4 className="head">Minimally Processed</h4>
                <p className="head2" id="hea">Pure, simple foods that retain every gram of natural nutrition.</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon6">
                <img src={asset("/heart.png")} alt="leaf icon" />
              </div>
              <div>
                <h4 className="head">Made for Wellness</h4>
                <p className="head2" id="hea">Designed to nourish every generation — from children to elders.</p>
              </div>
            </div>

          </div> <div className="stats">
            <div>
              <h2>17+ <img className="star" src={asset("/star.png")} /></h2>
              <p>Heritage Products</p>
            </div>
            <div>
              <h2>100% <img className="star" src={asset("/star.png")} /></h2>
              <p>Organic & Natural</p>
            </div>
            <div>
              <h2>0 <img className="star" src={asset("/star.png")} /></h2>
              <p>Preservatives</p>
            </div>
          </div>


        </div>

      </section>

      {/* 🔹 PRODUCTS SECTION */}
      <section className="products" id="products">
        <img src={asset("/heritage-bg.png")} alt="background" className="products-bg96" />

        <span className="product-tag">OUR PRODUCTS</span>

        <h2>
          Heritage Grains & <br />
          <span>Wellness Drinks</span>
        </h2>

        <p className="product-desc">
          From traditional rice and flours to nourishing mixes and malts –
          explore our complete range of pure, organic foods.
        </p>

        <h3 className="product-title">Heritage Rice</h3>

        <div className="product-cards">

          {riceItems.map((item, index) => (
            <div
              className="card"
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => onProductClick && onProductClick(item.slug)}
            >

              <div className="img-box">
                <img src={asset(item.img)} alt="rice" />

                <div className="card-overlay">
                  <ul>
                    {item.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={item.badge}>Heritage Rice</div>

              <div className="card-content" id={index == 1 ? "card2" : index == 2 ? "card3" : " "} >
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>

            </div>
          ))}

        </div>
      </section>

      <section className="products2" id="products2">
        <img src={asset("/back_paddy1.png")} alt="background" className="products-bg2" />

        <h3 className="product2-title">Puttu & Idiyappam</h3>

        <div className="carousel-wrapper">

          {/* LEFT ARROW */}
          <button className="arrow left" onClick={prev}>
            <img src={asset("/buttonleft.png")} alt="Prev" />
          </button>

          <div className="carousel-container">

            {/* TRACK - all items inside here */}
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${index * (100 / visibleItems)}%)` }}
            >

              {puttuItems.map((item, i) => (
                <div className="carousel-item" key={i}>
                  <div
                    className="card2"
                    style={{ cursor: "pointer" }}
                    onClick={() => onProductClick && onProductClick(item.slug)}
                  >

                    <div className="img-box">
                      <img src={asset(item.img)} alt={item.alt} />

                      <div className="card2-overlay">
                        <ul>
                          {item.points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={item.badge}>{item.badgeText}</div>

                    <div className="card2-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>

                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT ARROW */}
          <button className="arrow right" onClick={next}>
            <img src={asset("/buttonright.png")} alt="Next" />
          </button>

        </div>
      </section>




      <div className="products-wrapper">

        <section className="products3" id="products3">
          <img src={asset("/back_paddy.png")} alt="background" className="products-bg3" />
          <img src={asset("/wheat_collec.png")} alt="background" className="products-bg6" />

          <h3 className="product3-title">Soup & Booster Mixes</h3>

          <div className="carousel-wrapper">

            {/* LEFT ARROW */}
            <button className="arrow left" onClick={prev3}>
              <img src={asset("/buttonleft.png")} alt="Prev" />
            </button>

            <div className="carousel-container">

              {/* TRACK - all items inside here */}
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${index3 * (100 / visibleItems)}%)` }}
              >

                {soupItems.map((item, i) => (
                  <div className="carousel-item" key={i}>
                    <div
                      className="card3"
                      style={{ cursor: "pointer" }}
                      onClick={() => onProductClick && onProductClick(item.slug)}
                    >

                      <div className="img-box">
                        <img src={asset(item.img)} alt={item.alt} />

                        <div className="card2-overlay">
                          <ul>
                            {item.points.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className={item.badge}>{item.badgeText}</div>

                      <div className="card3-content">
                        <h4 className="soup_h">{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT ARROW */}
            <button className="arrow right" onClick={next3}>
              <img src={asset("/buttonright.png")} alt="Next" />
            </button>

          </div>
        </section>




        <section className="products4" id="products4">

          <h3 className="product4-title">Health Malts</h3>

          <div className="product4-cards">

            {maltItems.map((item, i) => (
              <div
                className="card4"
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() => onProductClick && item.slug && onProductClick(item.slug)}
              >

                <div className="img-box4">
                  <img src={asset(item.img)} alt="malt" />

                  <div className="card4-overlay">
                    <ul>
                      {item.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={item.badge}>Health Malt</div>

                <div className="card4-content">
                  <h4 className="health_malts">{item.title}</h4>
                  <p>{item.desc}</p>
                </div>

              </div>
            ))}

          </div>

        </section>



        {/* ── Special Mixes ── */}
        <section className="products5" id="products5">
          <img src={asset("/back_paddy.png")} alt="background" className="products-wheat" />

          <h3 className="product5-title">Cookies</h3>

          <div className="carousel-wrapper">

            {/* LEFT ARROW */}
            <button className="arrow left" onClick={prev5}>
              <img src={asset("/buttonleft.png")} alt="Prev" />
            </button>

            <div className="carousel-container">

              {/* TRACK - all items inside here */}
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${index5 * (100 / visibleItems)}%)` }}
              >

                {specialItems.map((item, i) => (
                  <div className="carousel-item" key={i} onClick={() => onProductClick && item.slug && onProductClick(item.slug)} >
                    <div className="card5">
                      <div className="img-box5">
                        <img src={asset(item.img)} alt="mix" />
                        <div className="card5-overlay">
                          <ul>
                            {item.points.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="badge5s">{item.badgeText}</div>
                      <div className="card5-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT ARROW */}
            <button className="arrow right" onClick={next5}>
              <img src={asset("/buttonright.png")} alt="Next" />
            </button>

          </div>
        </section>



        {/* ── Additional Section ── */}
        <section className="products6" id="products6">
         <img src={asset("/back_paddy1.png")} alt="background" className="products-paddy" />

          <h3 className="product6-title">Vadam & Vathal</h3>

          <div className="carousel-wrapper">

            {/* LEFT ARROW */}
            <button className="arrow left" onClick={prev6}>
              <img src={asset("/buttonleft.png")} alt="Prev" />
            </button>

            <div className="carousel-container">

              {/* TRACK - all items inside here */}
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${index6 * (100 / visibleItems)}%)` }}
              >

                {otherItems.map((item, i) => (
                  <div className="carousel-item" key={i} onClick={() => onProductClick && item.slug && onProductClick(item.slug)}>
                    <div className="card6">
                      <div className="img-box6">
                        <img src={asset(item.img)} alt="product" />
                        <div className="card6-overlay">
                          <ul>
                            {item.points.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="badge6s">{item.badgeText}</div>
                      <div className="card6-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT ARROW */}
            <button className="arrow right" onClick={next6}>
              <img src={asset("/buttonright.png")} alt="Next" />
            </button>

          </div>
        </section>


      </div>

      <section className="benefits-section" id="benefits">
        <img src={asset("/red_wheat.png")} alt="background" className="products-bg8" />
        <span className="benefitss-tag">WHY CHOOSE US</span>

        <h2 className="benefits-heading">
          Pure benefits, <br />
          nothing <span>artificial</span>
        </h2>

        <div className="benefits-grid">

          {/* BOX 1 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src={asset("/icon1.png")} alt="icon" />
            </div>
            <h4 className="grown">100% Natural & Organic</h4>
            <p>Grown without synthetic chemicals or fertilizers.</p>
          </div>

          {/* BOX 2 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src={asset("/icon2.png")} alt="icon" />
            </div>
            <h4 className="grown">No Preservatives</h4>
            <p>Nothing artificial. Just pure, wholesome food.</p>
          </div>

          {/* BOX 3 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src={asset("/icon3.png")} alt="icon" />
            </div>
            <h4 className="grown">Authentic Heritage Varieties</h4>
            <p>Traditional grains preserved through generations.</p>
          </div>

          {/* BOX 4 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src={asset("/icon4.png")} alt="icon" />
            </div>
            <h4 className="grown">Rich in Nutrients</h4>
            <p>Naturally packed with vitamins and minerals.</p>
          </div>

          {/* BOX 5 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src={asset("/icon5.png")} alt="icon" />
            </div>
            <h4 className="grown">Supports Wellness</h4>
            <p>Holistic nutrition that nurtures lasting health.</p>
          </div>

          {/* BOX 6 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src={asset("/icon6.png")} alt="icon" />
            </div>
            <h4 className="grown">For All Age Groups</h4>
            <p>Suitable for children, adults, and elders alike.</p>
          </div>

        </div>

      </section>
      <section className="life-section">
        <img src={asset("/grass.png")} alt="background" className="products-bg10" />
        <span className="life-tag">FOR EVERY GENERATION</span>

        <h2 className="life-heading">
          Nourishment through <br />
          <span>every stage of life</span>
        </h2>

        <div className="life-container">

          {/* ITEM 1 */}
          <div className="life-item">
            <div className="life-circle">
              <span className="life-number">01</span>
              <img src={asset("/Component 1.png")} alt="icon" />
            </div>
            <h4>Growing Children</h4>
            <p>Build strong bodies and sharp minds.</p>
          </div>

          {/* ITEM 2 */}
          <div className="life-item">
            <div className="life-circle">
              <span className="life-number">02</span>
              <img src={asset("/Component 2.png")} alt="icon" />
            </div>
            <h4>Working Professionals</h4>
            <p>Sustained energy through busy days.</p>
          </div>

          {/* ITEM 3 */}
          <div className="life-item">
            <div className="life-circle">
              <span className="life-number">03</span>
              <img src={asset("/Component 3.png")} alt="icon" />
            </div>
            <h4>Pregnant & Postpartum Women</h4>
            <p>Gentle, nourishing strength.</p>
          </div>

          {/* ITEM 4 */}
          <div className="life-item">
            <div className="life-circle">
              <span className="life-number">04</span>
              <img src={asset("/Component 4.png")} alt="icon" />
            </div>
            <h4>Elderly Care</h4>
            <p>Easy-to-digest wholesome nutrition.</p>
          </div>

        </div>

      </section>


      <section className="contact-section" id="contact">
        <img src={asset("/heritage-bg.png")} alt="background" className="products-bg11" />
        {/* LEFT SIDE */}
        <div className="contact-left">

          <span className="contact-tag">GET IN TOUCH</span>

          <h2>
            Ready to switch to <br />
            <span>healthier living?</span>
          </h2>

          <p className="contact-desc">
            Contact us today to place your order or learn more about our heritage products.
          </p>

          {/* INFO BOXES */}
          <div className="contact-info">

            <div className="info-box">
              <div className="info-icon">
                <img src={asset("./Images/mobile.svg")} alt="phone" />
              </div>
              <div>
                <span className="phone">PHONE</span>
                <p>+ 919940399388</p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon" id="email">
                <img src={asset("./Images/mail.svg")} alt="email" id="emails" />
              </div>
              <div>
                <span className="phone">EMAIL</span>
                <p> thirugailifestylecenter@gmail.com</p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon" id="location-icon">
                <img src={asset("./Images/location.svg")} alt="location" />
              </div>
              <div>
                <span className="phone">LOCATION</span>
                <p>Thirugai Life style Center
                  Thirukarugavur, Thanjavur -614302</p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE FORM */}
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

            {/* <div className="form-group">
          <label className="name">Popular Products</label>
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="product-select"
          >
            <option value="" disabled>Select a product</option>
            <option value="Karuppu Kavuni Rice">Karuppu Kavuni Rice</option>
            <option value="Rathasali Rice">Rathasali Rice</option>
            <option value="Thuyamalli Rice">Thuyamalli Rice</option>
            <option value="Beetroot Multivitamin Malt">Beetroot Multivitamin Malt</option>
            <option value="Panchamirtha Malt">Panchamirtha Malt</option>
          </select>
          {errors.product && <span className="error-msg">{errors.product}</span>}
        </div> */}
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

          <button type="submit" className="contact-btn" disabled={submitting}>
            {submitting ? "Sending..." : "Order Now →"}
          </button>

          {status && (
            <p
              className={`form-status ${status.type}`}
              role="status"
              style={{
                marginTop: "12px",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: status.type === "success" ? "#2e7d32" : "#c62828",
              }}
            >
              {status.text}
            </p>
          )}
        </form>

      </section>


    </div>
  );
}
