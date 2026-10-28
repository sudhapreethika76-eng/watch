import React from 'react';
import './Footer.css';

export default function Footer() {
  const handleScrollTo = (selector) => {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        
        {/* Top Footer Row */}
        <div className="footer-top-row">
          
          {/* Brand Col */}
          <div className="footer-brand-col">
            <h2 className="footer-logo" onClick={() => handleScrollTo('#hero')}>AURELIS</h2>
            <p className="footer-tagline">TIME, REFINED.</p>
            <p className="footer-brand-desc">
              Mastering Swiss horology, mechanical precision, and timeless design.
            </p>
          </div>

          {/* Links Col */}
          <div className="footer-links-col">
            <h4>NAVIGATE</h4>
            <div className="footer-links-grid">
              <span onClick={() => handleScrollTo('#collection')}>COLLECTION</span>
              <span onClick={() => handleScrollTo('#craftsmanship')}>CRAFTSMANSHIP</span>
              <span onClick={() => handleScrollTo('#movement')}>THE MOVEMENT</span>
              <span onClick={() => handleScrollTo('#lifestyle')}>JOURNAL</span>
              <span onClick={() => handleScrollTo('#about-section')}>ABOUT US</span>
            </div>
          </div>

          {/* Socials Col */}
          <div className="footer-socials-col">
            <h4>CONNECT</h4>
            <div className="footer-socials-list">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YOUTUBE</a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Footer Row */}
        <div className="footer-bottom-row">
          <p className="copyright-text">© {new Date().getFullYear()} AURELIS. ALL RIGHTS RESERVED.</p>
          <p className="footer-legal-links">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF USE</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
