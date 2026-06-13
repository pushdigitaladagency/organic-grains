"use client";
import React, { useState, useEffect } from "react";
import { asset } from "../lib/asset";
import "./Preloader.css";

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if the user has already seen the preloader in this session
    const hasSeen = sessionStorage.getItem("hasSeenPreloader");
    
    if (hasSeen) {
      setLoading(false);
      setShouldRender(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasSeenPreloader", "true");
      // Allow some time for the fade-out animation to complete before unmounting
      setTimeout(() => setShouldRender(false), 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div className={`preloader-container ${!loading ? "fade-out" : ""}`}>
      <img src={asset("/logo11.png")} alt="Organic Grains Logo" className="preloader-logo" />
      <h1 className="preloader-text">Organic Grains</h1>
      <div className="loader-bar"></div>
    </div>
  );
};

export default Preloader;
