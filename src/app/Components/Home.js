"use client";
// HMR trigger
import Image from "next/image";
import "./Home.css";


import { useEffect, useState } from "react";

export default function Home({ onProductClick }) {
  const visibleItems = 3;

  const [index, setIndex] = useState(0);

  const totalItems = 6;
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
  const totalItems3 = 5;
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

  return (
    <div>

      {/* <Navbar /> */}

      {/* 🔹 HERO SECTION */}
      <section className="hero" id="home">
        <video autoPlay muted loop className="background-video">
          <source src="/hero_bg1.mp4" type="video/mp4" />
        </video>


        {/* HERO CONTENT */}
        <div className="hero-content">
          <div className="badge">🌿 100% PURE & CHEMICAL-FREE</div>

          <h1>
            Pure Organic Nutrition <br />
            for a <span style={{color:"#E6C9A8"}}>Healthier Life</span>
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
        <img src="/red_wheat.png" alt="background" className="products10" />
        {/* LEFT IMAGE */}
        <div className="about-img">
          <img src="/paddy.png" alt="about" />
          <div className="quote">
            "Food should be pure, simple, and beneficial — just the way nature intended."
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">

          <span className="tag">ABOUT US</span>

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
                <img src="/leaf.png" alt="leaf icon" />
              </div>
              <div>
                <h4 className="head">Sourced with Care</h4>
                <p className="head2"id="hea">Grown by traditional farmers using time-honoured organic methods.</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">
                <img src="/shield.png" alt="leaf icon" />
              </div>
              <div>
                <h4 className="head">Minimally Processed</h4>
                <p className="head2"id="hea">Pure, simple foods that retain every gram of natural nutrition.</p>
              </div>
            </div>

            <div className="feature">
              <div className="icon6">
                <img src="/heart.png" alt="leaf icon" />
              </div>
              <div>
                <h4 className="head">Made for Wellness</h4>
                <p className="head2"id="hea">Designed to nourish every generation — from children to elders.</p>
              </div>
            </div>

          </div> <div className="stats">
            <div>
              <h2>17+ <img className= "star" src="/star.png" /></h2>
              <p>Heritage Products</p>
            </div>
            <div>
              <h2>100% <img className= "star" src="/star.png" /></h2>
              <p>Organic & Natural</p>
            </div>
            <div>
              <h2>0 <img className= "star"src="/star.png" /></h2>
              <p>Preservatives</p>
            </div>
          </div>


        </div>

      </section>

      {/* 🔹 PRODUCTS SECTION */}
      <section className="products" id="products">
        <img src="/heritage-bg.png" alt="background" className="products-bg96" />

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

          {[
            {
              img: "/rice1.png",
              badge: "badge2",
              title: "Karuppu Kavuni Rice",
              slug: "karuppu-kavuni-rice",
              desc: "The legendary forbidden black rice",
              points: [
                "✔ Rich in antioxidants",
                "✔ Supports heart health",
                "✔ Helps manage diabetes",
                "✔ Iron-rich (helps anemia)",
                "✔ Anti-aging & good for skin",
              ],
            },
            {
              img: "/rice2.png",
              badge: "badge red",
              title: "Rathasali Rice",
              slug: "rathasali-rice",
              desc: "Ancient red rice for vitality",
              points: [
                "✔ Improves blood health",
                "✔ Increases hemoglobin",
                "✔ Supports digestion",
                "✔ Enhances energy & strength",
                "✔ Helps manage blood sugar",
              ],
            },
            {
              img: "/rice3.png",
              badge: "badge yellow",
              title: "Thuyamalli Rice",
              slug: "thuyamalli-rice",
              desc: "Aromatic, light and easy to digest",
              points: [
                "✔ Easy to digest",
                "✔ Sustained energy",
                "✔ Suitable for diabetics",
                "✔ Boosts immunity",
                "✔ Rich in nutrients",
              ],
            },
          ].map((item, index) => (
            <div
              className="card"
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => onProductClick && onProductClick(item.slug)}
            >

              <div className="card-overlay">
                <ul>
                  {item.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              <img src={item.img} alt="rice" />

              <div className={item.badge}>Heritage Rice</div>

              <div className="card-content"id={index==1?"card2":index==2 ?"card3":" "} >
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>

            </div>
          ))}

        </div>
      </section>

      <section className="products2" id="products2">
        <img src="/back_paddy1.png" alt="background" className="products-bg2" />

        <h3 className="product2-title">Puttu & Idiyappam</h3>

        <div className="carousel-wrapper">

          {/* LEFT ARROW */}
          <button className="arrow left" onClick={prev}>
            <img src="/buttonleft.png" alt="Prev" />
          </button>

          <div className="carousel-container">

            {/* TRACK - all items inside here */}
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${index * (100 / visibleItems)}%)` }}
            >

              {[
                {
                  img: "/puttu111.png",
                  alt: "puttu",
                  badge: "badge3",
                  badgeText: "Puttu Flour",
                  slug: "karuppu-kavuni-puttu-flour",
                  title: "Karuppu Kavuni Puttu Flour",
                  desc: "Stone-ground black rice for traditional puttu",
                  points: [
                    "✔ Antioxidant-rich",
                    "✔ Steamed breakfast staple",
                    "✔ Naturally fibrous",
                  ],
                },
                {
                  img: "/puttu222.png",
                  alt: "idiyappam",
                  badge: "badge3 red",
                  badgeText: "Idiyappam Flour",
                  slug: "karuppu-kavuni-idiyappam-flour",
                  title: "Karuppu Kavuni Idiyappam Flour",
                  desc: "Soft string-hopper flour from heritage black rice",
                  points: [
                    "✔ Smooth, fine texture",
                    "✔ Healthier dinner choice",
                    "✔ Rich in minerals",
                  ],
                },
                {
                  img: "/puttu333.png",
                  alt: "puttu",
                  badge: "badge3 yellow",
                  badgeText: "Puttu Flour",
                  slug: "rathasali-puttu-flour",
                  title: "Rathasali Puttu Flour",
                  desc: "Iron-rich red rice for warm morning puttu",
                  points: [
                    "✔ Boosts hemoglobin",
                    "✔ Energising start",
                    "✔ Easy to digest",
                  ],
                },
                {
                  img: "/puttu444.png",
                  alt: "puttu",
                  badge: "badge0",
                  badgeText: "Idiyappam Flour",
                  slug: "rathasali-idiyappam-flour",
                  title: "Rathasali Idiyappam Flour",
                  desc: "Delicate red rice idiyappam flour",
                  points: [
                    "✔ Light dinner option",
                    "✔ Iron & fibre",
                    "✔ Naturally pigmented",
                  ],
                },
                {
                  img: "/puttu555.png",
                  alt: "puttu",
                  badge: "badge9",
                  badgeText: "Puttu Flour",
                  slug: "thuyamalli-puttu-flour",
                  title: "Thuyamalli Puttu Flour",
                  desc: "Aromatic white rice puttu flour",
                  points: [
                    "✔ Soft & fluffy puttu",
                    "✔ Easy on the gut",
                    "✔ Diabetic-friendly",
                  ],
                },
                {
                  img: "/puttu999.png",
                  alt: "puttu",
                  badge: "badge9",
                  badgeText: "Idiyappam Flour",
                  slug: "thooyamalli-idiyappam-flour",
                  title: "Thuyamalli Idiyappam Flour",
                  desc: "Silky-smooth idiyappam flour",
                  points: [
                    "✔ Light supper choice",
                    "✔ Aromatic & fragrant",
                    "✔ Sustained energy",
                  ],
                },
              ].map((item, i) => (
                <div className="carousel-item" key={i}>
                  <div
                    className="card2"
                    style={{ cursor: "pointer" }}
                    onClick={() => onProductClick && onProductClick(item.slug)}
                  >

                    <div className="img-box">
                      <img src={item.img} alt={item.alt} />

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
            <img src="/buttonright.png" alt="Next" />
          </button>

        </div>
      </section>
















      <div className="products-wrapper">

        <section className="products3" id="products3">
          <img src="/back_paddy.png" alt="background" className="products-bg3" />
          <img src="/wheat_collec.png" alt="background" className="products-bg6" />

          <h3 className="product3-title">Soup & Booster Mixes</h3>

          <div className="carousel-wrapper">

            {/* LEFT ARROW */}
            <button className="arrow left" onClick={prev3}>
              <img src="/buttonleft.png" alt="Prev" />
            </button>

            <div className="carousel-container">

              {/* TRACK - all items inside here */}
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${index3 * (100 / visibleItems)}%)` }}
              >

                {[
                  {
                    img: "/soup222.png",
                    alt: "soup",
                    badge: "badge4",
                    badgeText: "Soup Mix",
                    slug: "karuppu-kavuni-soup-mix",
                    title: "Karuppu Kavuni Soup Mix",
                    desc: "Hearty black rice nourishing soup",
                    points: [
                      "✔ Antioxidant-rich broth",
                      "✔ Comforting & filling",
                      "✔ Quick to prepare",
                    ],
                  },
                  {
                    img: "/soup333.png",
                    alt: "soup",
                    badge: "badge4 red",
                    badgeText: "Soup Mix",
                    slug: "rathasali-soup-mix",
                    title: "Rathasali Soup Mix",
                    desc: "Warming red rice soup blend",
                    points: [
                      "✔ Boosts hemoglobin",
                      "✔ Builds stamina",
                      "✔ Wholesome nutrition",
                    ],
                  },
                  {
                    img: "/soup444.png",
                    alt: "booster",
                    badge: "badge4 yellow",
                    badgeText: "Iron Booster",
                    slug: "rathasali-iron-rich-mix",
                    title: "Rathasali Iron Rich Mix",
                    desc: "A daily dose of natural iron",
                    points: [
                      "✔ Combats anemia",
                      "✔ Increases hemoglobin",
                      "✔ Supports blood health",
                    ],
                  },
                  {
                    img: "/soup555.png",
                    alt: "soup",
                    badge: "badge56",
                    badgeText: "Immune Booster",
                    slug: "karuppu-kavuni-immune-booster-mix",
                    title: "Karuppu Kavuni Immune Booster Mix",
                    desc: "Daily immunity from traditional grains",
                    points: [
                      "✔ Strengthens immunity",
                      "✔ Antioxidant protection",
                      "✔ Immune Booster",
                    ],
                  },
                  {
                    img: "/soup888.png",
                    alt: "soup",
                    badge: "badge56",
                    badgeText: "Kali Mix",
                    slug: "kk-black-gram-kali-mix",
                    title: "KK & Black Gram Kali Mix",
                    desc: "Karuppu Kavuni + Black Gram protein power",
                    points: [
                      "✔ Balanced carbs, protein & minerals",
                      "✔ Improves strength & stamina",
                      "✔ Supports postpartum recovery",
                      "✔ Long-lasting energy",
                    ],
                  },
                ].map((item, i) => (
                  <div className="carousel-item" key={i}>
                    <div
                      className="card3"
                      style={{ cursor: "pointer" }}
                      onClick={() => onProductClick && onProductClick(item.slug)}
                    >

                      <div className="img-box">
                        <img src={item.img} alt={item.alt} />

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
              <img src="/buttonright.png" alt="Next" />
            </button>

          </div>
        </section>




        <section className="products4" id="products4">

          <h3 className="product4-title">Health Malts</h3>

          <div className="product4-cards">

            {[
              {
                img: "/malt11.png",
                badge: "badge5",
                title: "Beetroot Multivitamin Malt",
                desc: "Detoxify and glow naturally",
                points: [
                  "✔ Supports detoxification",
                  "✔ Improves skin health",
                  "✔ Enhances brain function",
                  "✔ Aids digestion",
                ],
              },
              {
                img: "/malt22.png",
                badge: "badge5 yellow",
                title: "Panchamirtha Malt",
                desc: "Five-fold traditional wellness blend",
                points: [
                  "✔Time-honoured recipe",
                  "✔ Boosts overall wellness",
                  "✔ Naturally sweet & nourishing",

                ],
              },
            ].map((item, i) => (
              <div className="card4" key={i}>

                <div className="img-box4">
                  <img src={item.img} alt="malt" />

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

      </div>

      <section className="benefits-section" id="benefits">
        <img src="/red_wheat.png" alt="background" className="products-bg8" />
        <span className="benefits-tag">WHY CHOOSE US</span>

        <h2 className="benefits-heading">
          Pure benefits, <br />
          nothing <span>artificial</span>
        </h2>

        <div className="benefits-grid">

          {/* BOX 1 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src="/icon1.png" alt="icon" />
            </div>
            <h4 className="grown">100% Natural & Organic</h4>
            <p>Grown without synthetic chemicals or fertilizers.</p>
          </div>

          {/* BOX 2 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src="/icon2.png" alt="icon" />
            </div>
            <h4 className="grown">No Preservatives</h4>
            <p>Nothing artificial. Just pure, wholesome food.</p>
          </div>

          {/* BOX 3 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src="/icon3.png" alt="icon" />
            </div>
            <h4 className="grown">Authentic Heritage Varieties</h4>
            <p>Traditional grains preserved through generations.</p>
          </div>

          {/* BOX 4 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src="/icon4.png" alt="icon" />
            </div>
            <h4 className="grown">Rich in Nutrients</h4>
            <p>Naturally packed with vitamins and minerals.</p>
          </div>

          {/* BOX 5 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src="/icon5.png" alt="icon" />
            </div>
            <h4 className="grown">Supports Wellness</h4>
            <p>Holistic nutrition that nurtures lasting health.</p>
          </div>

          {/* BOX 6 */}
          <div className="benefit-box">
            <div className="benefit-icon">
              <img src="/icon6.png" alt="icon" />
            </div>
            <h4 className="grown">For All Age Groups</h4>
            <p>Suitable for children, adults, and elders alike.</p>
          </div>

        </div>

      </section>
      <section className="life-section">
        <img src="/grass.png" alt="background" className="products-bg10" />
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
              <img src="/Component 1.png" alt="icon" />
            </div>
            <h4>Growing Children</h4>
            <p>Build strong bodies and sharp minds.</p>
          </div>

          {/* ITEM 2 */}
          <div className="life-item">
            <div className="life-circle">
              <span className="life-number">02</span>
              <img src="/Component 2.png" alt="icon" />
            </div>
            <h4>Working Professionals</h4>
            <p>Sustained energy through busy days.</p>
          </div>

          {/* ITEM 3 */}
          <div className="life-item">
            <div className="life-circle">
              <span className="life-number">03</span>
              <img src="/Component 3.png" alt="icon" />
            </div>
            <h4>Pregnant & Postpartum Women</h4>
            <p>Gentle, nourishing strength.</p>
          </div>

          {/* ITEM 4 */}
          <div className="life-item">
            <div className="life-circle">
              <span className="life-number">04</span>
              <img src="/Component 4.png" alt="icon" />
            </div>
            <h4>Elderly Care</h4>
            <p>Easy-to-digest wholesome nutrition.</p>
          </div>

        </div>

      </section>


      <section className="contact-section" id="contact">
        <img src="/heritage-bg.png" alt="background" className="products-bg11" />
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
                <img src="/ph.png" alt="phone" />
              </div>
              <div>
                <span className="phone">PHONE</span>
                <p>+ 919940399388</p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src="/em.png" alt="email" />
              </div>
              <div>
                <span className="phone">EMAIL</span>
                <p> thirugailifestylecenter@gmail.com</p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon" id="location-icon">
                <img src="/log1.png" alt="location" />
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
        <div className="contact-form">

          <h3>Send us a message</h3>

          {/* Name & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label className="name">Name</label>
              <input type="text" placeholder="Your name" />
            </div>

            <div className="form-group">
              <label className="name">Phone</label>
              <input type="text" placeholder="+91" />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="name">Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>

          {/* Message */}
          <div className="form-group">
            <label className="name">Message</label>
            <textarea placeholder="Tell us what you'd like to order..."></textarea>
          </div>

          <button className="contact-btn">
            Order Now →
          </button>

        </div>

      </section>
     

    </div>
  );
}