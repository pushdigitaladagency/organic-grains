"use client";
import React, { useState, useEffect } from "react";
import "./Preloader.css";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial application load
    // Using a timeout to ensure a smooth transition even on fast connections
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader-container ${!loading ? "fade-out" : ""}`}>
      <img src="/logo11.png" alt="Organic Heritage Logo" className="preloader-logo" />
      <h1 className="preloader-text">Organic Heritage</h1>
      <div className="loader-bar"></div>
    </div>
  );
};

export default Preloader;
