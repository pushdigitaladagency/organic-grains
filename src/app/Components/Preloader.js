"use client";
import React, { useState, useEffect } from "react";
import { asset } from "../lib/asset";
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
      <img src={asset("/logo11.png")} alt="Organic Heritage Logo" className="preloader-logo" />
      <h1 className="preloader-text">Organic Grains</h1>
      <div className="loader-bar"></div>
    </div>
  );
};

export default Preloader;
