import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FinalCTA.css';
import watchCTAImg from '../assets/images/watch_hero.png';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Subtle float and hover movements on scroll
    gsap.fromTo(
      '.cta-watch-img',
      { y: 20, rotate: -2, scale: 0.95 },
      {
        y: -10,
        rotate: 2,
        scale: 1,
        duration: 2,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }, []);

  const handleCtaClick = () => {
    // Scroll to the top Hero section
    const topSection = document.querySelector('#hero');
    if (topSection) {
      topSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="final-cta-section" ref={containerRef}>
      
      {/* Heavy central spotlight behind the watch */}
      <div className="cta-spotlight"></div>

      <div className="container cta-container">
        
        {/* Watch Image in Center */}
        <div className="cta-watch-wrapper">
          <img 
            src={watchCTAImg} 
            alt="Aurelis classic timepiece spotlight" 
            className="cta-watch-img"
          />
        </div>

        {/* Large Typography */}
        <h2 className="cta-title">
          YOUR TIME.<br />
          <span className="accent-gold-color">YOUR SIGNATURE.</span>
        </h2>

        {/* CTA Button */}
        <button className="btn-premium cta-btn" onClick={handleCtaClick}>
          DISCOVER AURELIS <span>→</span>
        </button>

      </div>
    </section>
  );
}
