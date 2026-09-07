"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark-theme" : "light");
    document.body.classList.toggle("dark-theme");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header>
        <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem' }}>
          <div className="logo">
            <Image src={theme === "light" ? "/logo1.png" : "/logo-dark.png"} alt="Logo" width={192} height={128} priority />
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="welcome-section" style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', background: 'linear-gradient(45deg, #8b4513, #daa520)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to QuickBlip!
          </h1>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '5rem', color: '#7a5c2e' }}>
            Quick notes, one blip away.
          </h2>
          <Link href="/login" style={{ background: 'linear-gradient(45deg, #8b4513, #daa520)', color: 'white', padding: '1rem 2.5rem', borderRadius: '50px', textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>

        <div className="usecase-section" style={{ background: 'rgba(255, 255, 255, 0.5)', borderRadius: '20px', padding: '3rem 2rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#8b4513' }}>Perfect for Every Scenario</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="usecase-card">
              <h4>Daily Journaling</h4>
              <p>Track thoughts. Reflect fast. Grow daily.</p>
            </div>
            <div className="usecase-card">
              <h4>Work & Projects</h4>
              <p>Blip meetings, tasks & ideas. Stay sharp.</p>
            </div>
            <div className="usecase-card">
              <h4>Study & Research</h4>
              <p>Snap notes. Ace tests. Blip smarter.</p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-bottom" style={{ padding: '1.5rem 0', textAlign: 'center', borderTop: '1px solid rgba(245, 245, 220, 0.3)' }}>
          <p>&copy; 2025 QuickBlip. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
