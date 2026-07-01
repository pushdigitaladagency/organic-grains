"use client";
import React, { useState, useEffect } from "react";
import { asset } from "../lib/asset";
import "./Preloader.css";

const Preloader = ({ readyToHide = false }) => {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [minimumTimeDone, setMinimumTimeDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimeDone(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!minimumTimeDone || !readyToHide || !shouldRender) return;

    setLoading(false);
    sessionStorage.setItem("hasSeenPreloader", "true");
    // Allow some time for the fade-out animation to complete before unmounting
    const fadeTimer = setTimeout(() => setShouldRender(false), 800);

    return () => clearTimeout(fadeTimer);
  }, [minimumTimeDone, readyToHide, shouldRender]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
      setShouldRender(false);
      sessionStorage.setItem("hasSeenPreloader", "true");
    }, 10000);

    return () => clearTimeout(fallbackTimer);
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
