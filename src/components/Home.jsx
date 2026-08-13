import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import WatchHero from './WatchHero';
import './Home.css';

// ── Product images
import chronoImg   from '../assets/images/collection_chrono.png';
import classicImg  from '../assets/images/collection_classic.png';
import noirImg     from '../assets/images/collection_noir.png';
import heroImg     from '../assets/images/watch_hero.png';
import lifestyleImg from '../assets/images/lifestyle_watch.png';
import dialImg     from '../assets/images/watch_dial_detail.png';
import movementImg from '../assets/images/watch_movement_detail.png';
import parallaxImg from '../assets/images/watch.jpeg';
import owner1 from '../assets/images/owner_1.png';
import owner2 from '../assets/images/owner_2.png';
import owner3 from '../assets/images/owner_3.png';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const TABS = ['Best Sellers', 'New In', 'Sale'];

const PRODUCTS = {
  'Best Sellers': [
    { id: 1, brand: 'AURELIS', name: 'Aurelis Chrono European Exclusive', price: 9200, img: chronoImg },
    { id: 2, brand: 'AURELIS', name: 'Aurelis Classic Powermatic 80', price: 7800, oldPrice: 8900, img: classicImg },
    { id: 3, brand: 'AURELIS', name: 'Aurelis Noir Pilot Big Date', price: 10500, img: noirImg },
    { id: 4, brand: 'AURELIS', name: 'Aurelis Heritage Steel Bracelet', price: 12500, oldPrice: 14000, img: heroImg },
  ],
  'New In': [
    { id: 5, brand: 'AURELIS', name: 'Aurelis Calibre 8910 Blue', price: 11200, img: dialImg },
    { id: 6, brand: 'AURELIS', name: 'Aurelis Movement Skeleton', price: 15600, img: movementImg },
    { id: 7, brand: 'AURELIS', name: 'Aurelis Noir Limited 100', price: 18000, img: noirImg },
    { id: 8, brand: 'AURELIS', name: 'Aurelis Chrono Gold Case', price: 22000, img: chronoImg },
  ],
  'Sale': [
    { id: 9,  brand: 'AURELIS', name: 'Aurelis Classic Silver Dial', price: 5600, oldPrice: 7800, img: classicImg },
    { id: 10, brand: 'AURELIS', name: 'Aurelis Heritage Black Strap', price: 8900, oldPrice: 12500, img: heroImg },
    { id: 11, brand: 'AURELIS', name: 'Aurelis Chrono Steel', price: 7200, oldPrice: 9200, img: chronoImg },
    { id: 12, brand: 'AURELIS', name: 'Aurelis Pilot Steel Blue', price: 8100, oldPrice: 10500, img: noirImg },
  ],
};

const BRANDS = ['TIMEX', 'GUCCI', 'OMEGA', 'TISSOT', 'Cartier', 'CASIO'];

const TESTIMONIALS = [
  {
    name: 'Mark',
    text: 'I am thrilled with the watch I purchased! The design is exquisite, and it adds a touch of sophistication to my style. Highly recommended!',
    watchImg: lifestyleImg,
    userImg: owner1,
  },
  {
    name: 'Milana',
    text: "I love my new watch. It's a perfect blend of style and functionality. The attention to detail is impressive.",
    watchImg: dialImg,
    userImg: owner2,
  },
  {
    name: 'Nikolas',
    text: 'Great customer service and an amazing selection of watches! I found the perfect timepiece that suits my taste and lifestyle. Will definitely be a repeat customer.',
    watchImg: movementImg,
    userImg: owner3,
  },
];

/* ─────────────────────────────────────────────
   Home Page
───────────────────────────────────────────── */
export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('Best Sellers');
  const [cartCount, setCartCount] = useState(0);
  const [activeAboutImage, setActiveAboutImage] = useState(0); // 0 = dialImg large, 1 = movementImg large

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const addToCart = () => setCartCount(c => c + 1);

  return (
    <div className="home-wrapper">

      {/* ── Navbar ── */}
      <Navbar cartCount={cartCount} />

      {/* ── Hero (3-D) ── */}
      <WatchHero onLoaded={() => setHeroLoaded(true)} />

      {/* ═══════════════════════════════
          SHOP / PRODUCTS
      ═══════════════════════════════ */}
      <section className="shop-section" id="shop-section">
        <div className="shop-container">

          {/* Tabs */}
          <div className="shop-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`shop-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="product-grid">
            {PRODUCTS[activeTab].map((p) => (
              <div className="product-card" key={p.id}>
                <div className="product-img-wrap">
                  <img src={p.img} alt={p.name} className="product-img" />
                  <button className="quick-view-btn" onClick={addToCart}>Add to Cart</button>
                </div>
                <div className="product-info">
                  <span className="product-brand">{p.brand}</span>
                  <p className="product-name">{p.name}</p>
                  <div className="product-price-row">
                    <span className="product-price">₹{p.price.toLocaleString()}</span>
                    {p.oldPrice && (
                      <span className="product-old-price">₹{p.oldPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          ABOUT US / LEGACY SECTION
      ═══════════════════════════════ */}
      <section className="about-section" id="about-section">
        <div className="about-container">
          
          {/* Left Side: Overlapping Interactive Image Stack */}
          <div className="about-images-side">
            <div className="about-image-stack">
              <div 
                className={`about-img-frame img-frame-primary ${activeAboutImage === 0 ? 'state-large' : 'state-small'}`}
                onClick={() => setActiveAboutImage(0)}
              >
                <img src={dialImg} alt="Luxury Watch Face Close-up" className="about-img" />
              </div>
              <div 
                className={`about-img-frame img-frame-secondary ${activeAboutImage === 1 ? 'state-large' : 'state-small'}`}
                onClick={() => setActiveAboutImage(1)}
              >
                <img src={movementImg} alt="Luxury Mechanical Movement Close-up" className="about-img" />
              </div>
            </div>
          </div>

          {/* Right Side: Copywriting Content */}
          <div className="about-content-side">
            <div className="about-eyebrow">
              <span className="about-eyebrow-text">About Us</span>
            </div>
            <h2 className="about-title">Timepieces of Pure Distinction</h2>
            <p className="about-desc">
              At Aurelis, we believe a watch is more than a tool for tracking time—it is a testament to history, engineering, and personal expression. Founded on the principles of Swiss mechanical precision, our timepieces are designed for those who value heritage and refuse to compromise.
            </p>
            <p className="about-desc">
              Every curve of the case, every gear in the calibre, and every hand-finished component is crafted by master horologists who pour decades of experience into every detail. We create timepieces that are built to outlast trends and be passed down through generations.
            </p>
            <button className="about-readmore-btn">
              Read More
            </button>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════
          PARALLAX PROMO BANNER
      ═══════════════════════════════ */}
      <section className="parallax-banner" id="craftsmanship" style={{ backgroundImage: `url(${parallaxImg})` }}>
        <div className="parallax-overlay" />
        <div className="parallax-content">
          <span className="parallax-subtitle">Designed for Distinction</span>
          <h2 className="parallax-title">Uncompromising Craftsmanship</h2>
          <p className="parallax-text">
            Choose a timepiece that becomes a seamless extension of your identity — a symbol of precision, legacy, and design refinement.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════
          BRANDS WE LOVE
      ═══════════════════════════════ */}
      <section className="brands-section">
        <div className="brands-container">
          <h2 className="brands-title">Brands We Love</h2>
          <div className="brands-row">
            {BRANDS.map((b) => (
              <span key={b} className="brand-name">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════ */}
      <section className="testimonials-section" id="lifestyle">
        <div className="testimonials-container">
          <span className="testimonials-eyebrow">Client Experience</span>
          <h2 className="testimonials-title">Voices of Distinction</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial-card" key={t.name}>
                {/* Full-card blurred watch background on hover */}
                <img src={t.watchImg} alt="" className="testimonial-card-bg" />

                <span className="testimonial-quote-icon">“</span>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-profile">
                  <div className="testimonial-avatar-wrap">
                    <img src={t.userImg} alt={t.name} className="testimonial-avatar" />
                  </div>
                  <div className="testimonial-profile-info">
                    <h4 className="testimonial-name">{t.name}</h4>
                    <span className="testimonial-verified">Verified Owner</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          BOTTOM DARK BANNER
      ═══════════════════════════════ */}
      <section className="bottom-hero" id="movement">
        <div className="bottom-hero-overlay" />
        <img src={dialImg} alt="Watch close-up" className="bottom-hero-bg" />
        <div className="bottom-hero-content">
          <span className="bottom-eyebrow">THE AURELIS CALIBER</span>
          <h2 className="bottom-hero-title">
            EVERY SECOND<br />
            <span>HAS A MECHANISM.</span>
          </h2>
          <button className="bottom-hero-btn" onClick={() => document.querySelector('#shop-section')?.scrollIntoView({ behavior: 'smooth' })}>
            SHOP NOW
          </button>
        </div>
      </section>

    </div>
  );
}
