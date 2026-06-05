"use client";
// HMR trigger
import React, { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className={`navbar ${scrolled ? "navbar-scroll" : ""}`}>
      <a href="#home" className="nav-link" onClick={() => setMenuOpen(false)}>Home</a>
      <a href="#about" className="nav-link" onClick={() => setMenuOpen(false)}>About</a>
      <a href="#products" className="nav-link" onClick={() => setMenuOpen(false)}>Products</a>

      <a href="#home" className="logo">
        <img src="/logo11.png" alt="logo" />
      </a>

      <a href="#benefits" className="nav-link" onClick={() => setMenuOpen(false)}>Benefits</a>
      <a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a>
      <button className="order-btn nav-link" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Order Now</button>

      {/* MOBILE HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>

      {/* MOBILE MENU */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
        <a href="#benefits" onClick={() => setMenuOpen(false)}>Benefits</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <button className="order-btn" onClick={() => { setMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Order Now</button>
      </div>

    </div>
  );
}
