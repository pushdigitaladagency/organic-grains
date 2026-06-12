"use client";
// HMR trigger
import React, { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({ onBack }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleLinkClick = (e, id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);

    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
    } else if (onBack) {
      e.preventDefault();
      onBack();
      setTimeout(() => {
        const afterElement = document.getElementById(id);
        if (afterElement) {
          afterElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll(); // ✅ fix refresh issue

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuOpen]);

  useEffect(() => {
    const sections = ["home", "about", "products", "benefits", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Adjust these margins to control when a section is considered active
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onBack]);

  return (
    <div className={`navbar ${scrolled ? "navbar-scroll" : ""}`}>
      <a href="#home" className={`nav-link ${activeSection === "home" ? "active" : ""}`} onClick={(e) => handleLinkClick(e, "home")}>Home</a>
      <a href="#about" className={`nav-link ${activeSection === "about" ? "active" : ""}`} onClick={(e) => handleLinkClick(e, "about")}>About</a>
      <a href="#products" className={`nav-link ${activeSection === "products" ? "active" : ""}`} onClick={(e) => handleLinkClick(e, "products")}>Products</a>

      <a href="#home" className="logo" onClick={(e) => handleLinkClick(e, "home")}>
        <img src="/logo11.png" alt="logo" />
      </a>

      <a href="#benefits" className={`nav-link ${activeSection === "benefits" ? "active" : ""}`} onClick={(e) => handleLinkClick(e, "benefits")}>Benefits</a>
      <a href="#contact" className={`nav-link ${activeSection === "contact" ? "active" : ""}`} onClick={(e) => handleLinkClick(e, "contact")}>Contact</a>
      <button className="order-btn nav-link" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Order Now</button>

      {/* MOBILE HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>

      {/* MOBILE MENU */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="#home" className={activeSection === "home" ? "active" : ""} onClick={(e) => handleLinkClick(e, "home")}>Home</a>
        <a href="#about" className={activeSection === "about" ? "active" : ""} onClick={(e) => handleLinkClick(e, "about")}>About</a>
        <a href="#products" className={activeSection === "products" ? "active" : ""} onClick={(e) => handleLinkClick(e, "products")}>Products</a>
        <a href="#benefits" className={activeSection === "benefits" ? "active" : ""} onClick={(e) => handleLinkClick(e, "benefits")}>Benefits</a>
        <a href="#contact" className={activeSection === "contact" ? "active" : ""} onClick={(e) => handleLinkClick(e, "contact")}>Contact</a>
        <button className="order-btn" onClick={() => { setMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Order Now</button>
      </div>

    </div>
  );
}

