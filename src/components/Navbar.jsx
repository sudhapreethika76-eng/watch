import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import './Navbar.css';

export default function Navbar({ cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
      // Animate overlay items
      setTimeout(() => {
        gsap.fromTo(
          '.overlay-menu-item',
          { opacity: 0, y: 30, filter: 'blur(5px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleLinkClick = (selector) => {
    setIsOpen(false);
    document.body.style.overflow = '';
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => handleLinkClick('#hero')}>
            AURELIS
          </div>
          
          <div className="navbar-links">
            <a href="#collection" className="nav-link" onClick={(e) => { e.preventDefault(); handleLinkClick('#collection'); }}>COLLECTION</a>
            <a href="#craftsmanship" className="nav-link" onClick={(e) => { e.preventDefault(); handleLinkClick('#craftsmanship'); }}>CRAFTSMANSHIP</a>
            <a href="#movement" className="nav-link" onClick={(e) => { e.preventDefault(); handleLinkClick('#movement'); }}>THE MOVEMENT</a>
            <a href="#lifestyle" className="nav-link" onClick={(e) => { e.preventDefault(); handleLinkClick('#lifestyle'); }}>JOURNAL</a>
          </div>

          <div className="navbar-right-actions">
            <div className="navbar-cart" onClick={() => handleLinkClick('#shop-section')}>
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <div className="navbar-menu-btn" onClick={toggleMenu}>
              {isOpen ? <X size={20} className="menu-icon-spin" /> : <Menu size={20} />}
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div className={`mobile-overlay ${isOpen ? 'overlay-open' : ''}`}>
        <div className="mobile-overlay-bg"></div>
        <div className="overlay-content">
          <div className="overlay-links">
            <a href="#collection" className="overlay-menu-item" onClick={(e) => { e.preventDefault(); handleLinkClick('#collection'); }}>
              <span>01</span> Collection
            </a>
            <a href="#craftsmanship" className="overlay-menu-item" onClick={(e) => { e.preventDefault(); handleLinkClick('#craftsmanship'); }}>
              <span>02</span> Craftsmanship
            </a>
            <a href="#movement" className="overlay-menu-item" onClick={(e) => { e.preventDefault(); handleLinkClick('#movement'); }}>
              <span>03</span> The Movement
            </a>
            <a href="#lifestyle" className="overlay-menu-item" onClick={(e) => { e.preventDefault(); handleLinkClick('#lifestyle'); }}>
              <span>04</span> Journal
            </a>
          </div>
          <div className="overlay-footer overlay-menu-item">
            <p>TIME, REFINED.</p>
            <div className="overlay-socials">
              <span>INSTAGRAM</span>
              <span>FACEBOOK</span>
              <span>YOUTUBE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
