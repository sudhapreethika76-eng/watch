import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Collection.css';

// Import collection images
import chronoImg from '../assets/images/collection_chrono.png';
import classicImg from '../assets/images/collection_classic.png';
import noirImg from '../assets/images/collection_noir.png';

gsap.registerPlugin(ScrollTrigger);

export default function Collection() {
  const listRef = useRef(null);

  const models = [
    {
      id: 'chrono',
      name: 'AURELIS CHRONO',
      price: '$9,200',
      description: 'A masterpiece of competitive timekeeping. Features dual sub-dials, precision tachymeter bezel, and a sunburst champagne-gold dial.',
      image: chronoImg,
      badge: 'CHRONOGRAPH'
    },
    {
      id: 'classic',
      name: 'AURELIS CLASSIC',
      price: '$7,800',
      description: 'The epitome of minimalist watchmaking. A pristine silver dial paired with solid gold indices and hand-stitched Tuscan leather.',
      image: classicImg,
      badge: 'MINIMALIST'
    },
    {
      id: 'noir',
      name: 'AURELIS NOIR',
      price: '$10,500',
      description: 'Stealth luxury. Forged in DLC-coated black steel with matte carbon dials and high-contrast gold hands.',
      image: noirImg,
      badge: 'LIMITED EDITION'
    }
  ];

  useEffect(() => {
    // Fade panels in sequentially as they scroll in
    const panels = listRef.current.querySelectorAll('.collection-panel');
    
    panels.forEach((panel) => {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 80, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  return (
    <section className="collection-section section-padding" id="collection" ref={listRef}>
      <div className="container">
        
        {/* Header */}
        <div className="collection-header text-center">
          <span className="section-label">CURATED PIECES</span>
          <h2 className="collection-main-title">THE COLLECTION</h2>
          <p className="collection-main-desc">Explore the signature timepieces from the House of Aurelis.</p>
        </div>

        {/* Stack of Panels */}
        <div className="collection-panels-stack">
          {models.map((model) => (
            <div key={model.id} className="collection-panel">
              
              {/* Inner metallic reflection layer */}
              <div className="panel-reflection"></div>
              
              {/* Product Info */}
              <div className="panel-info">
                <span className="panel-badge">{model.badge}</span>
                <h3 className="panel-name">{model.name}</h3>
                <p className="panel-desc">{model.description}</p>
                <div className="panel-price-row">
                  <span className="panel-price">{model.price}</span>
                  <button className="btn-explore-text">
                    EXPLORE <span>→</span>
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div className="panel-image-container">
                <img 
                  src={model.image} 
                  alt={model.name} 
                  className="panel-watch-image"
                />
                <div className="watch-backdrop-glow"></div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
