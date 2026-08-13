import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Movement.css';

gsap.registerPlugin(ScrollTrigger);

export default function Movement() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    
    // GSAP ScrollTrigger to rotate gears based on vertical scroll
    gsap.to('.gear-main', {
      rotation: 120,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.gear-escapement', {
      rotation: -280,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.gear-balance', {
      rotation: 180,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.gear-auxiliary', {
      rotation: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Animate Labels into view
    gsap.fromTo(
      '.movement-label-dot',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section className="movement-section" ref={sectionRef} id="movement">
      
      {/* Subtle radial background glow */}
      <div className="movement-glow"></div>

      <div className="container movement-container">
        
        {/* Editorial Text */}
        <div className="movement-text-content">
          <span className="section-label">ENGINEERING</span>
          <h2 className="movement-title">THE HEART OF TIME.</h2>
          <p className="movement-desc">
            A mechanical architecture built for precision. Powered by Caliber 8910, a self-winding movement that transforms natural body movement into eternal energy.
          </p>
        </div>

        {/* Interactive Gear Visualizer */}
        <div className="movement-visualizer">
          
          <div className="gears-viewport">
            
            {/* Gear 1: Large Balance Wheel (Brass/Gold outline) */}
            <svg className="gear gear-balance" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="0.5" strokeDasharray="3 2" />
              {/* Spokes */}
              <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1.5" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1.5" />
              <line x1="16" y1="16" x2="84" y2="84" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
              <line x1="84" y1="16" x2="16" y2="84" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
              {/* Inner details */}
              <circle cx="50" cy="50" r="10" fill="#0d0d0d" stroke="var(--accent-champagne)" strokeWidth="1" />
              <circle cx="50" cy="50" r="3" fill="#e82e5b" /> {/* Ruby pivot */}
            </svg>

            {/* Gear 2: Main Gear (Large dark metal steel cog) */}
            <svg className="gear gear-main" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="36" fill="none" stroke="#252526" strokeWidth="6" strokeDasharray="1 1.5" />
              <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              {/* Curved inner cutouts */}
              <path d="M 50 20 A 30 30 0 0 1 80 50 L 70 50 A 20 20 0 0 0 50 30 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
              <path d="M 50 80 A 30 30 0 0 1 20 50 L 30 50 A 20 20 0 0 0 50 70 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="8" fill="#151517" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <circle cx="50" cy="50" r="2.5" fill="rgba(255,255,255,0.4)" />
            </svg>

            {/* Gear 3: Escapement Gear (Small precise brass wheel) */}
            <svg className="gear gear-escapement" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="22" fill="none" stroke="var(--accent-champagne)" strokeWidth="3" strokeDasharray="1.8 1.2" />
              {/* Inner spokes */}
              <line x1="50" y1="28" x2="50" y2="72" stroke="var(--accent-champagne)" strokeWidth="0.8" />
              <line x1="28" y1="50" x2="72" y2="50" stroke="var(--accent-champagne)" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="6" fill="#0d0d0d" stroke="var(--accent-champagne)" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="1.5" fill="#e82e5b" /> {/* Ruby pivot */}
            </svg>

            {/* Gear 4: Auxiliary Small Steel Cog */}
            <svg className="gear gear-auxiliary" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="15" fill="none" stroke="#444" strokeWidth="2.5" strokeDasharray="0.8 1" />
              <circle cx="50" cy="50" r="4" fill="#0d0d0d" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            </svg>

          </div>

          {/* Labels & Callouts */}
          
          {/* Label 1: Balance Wheel */}
          <div className="movement-callout callout-balance" style={{ top: '15%', left: '5%' }}>
            <div className="movement-label-dot"></div>
            <div className="movement-label-line line-right"></div>
            <div className="movement-label-text">
              <h4>BALANCE WHEEL</h4>
              <p>Oscillates at 4Hz to regulate timebeat</p>
            </div>
          </div>

          {/* Label 2: Mainspring */}
          <div className="movement-callout callout-mainspring" style={{ top: '22%', right: '5%' }}>
            <div className="movement-label-dot"></div>
            <div className="movement-label-line line-left"></div>
            <div className="movement-label-text">
              <h4>MAINSPRING</h4>
              <p>Stores 42 hours of elastic tension</p>
            </div>
          </div>

          {/* Label 3: Escapement */}
          <div className="movement-callout callout-escapement" style={{ bottom: '25%', left: '5%' }}>
            <div className="movement-label-dot"></div>
            <div className="movement-label-line line-right"></div>
            <div className="movement-label-text">
              <h4>ESCAPEMENT</h4>
              <p>Converts impulse into precise ticks</p>
            </div>
          </div>

          {/* Label 4: Gear Train */}
          <div className="movement-callout callout-geartrain" style={{ bottom: '15%', right: '5%' }}>
            <div className="movement-label-dot"></div>
            <div className="movement-label-line line-left"></div>
            <div className="movement-label-text">
              <h4>GEAR TRAIN</h4>
              <p>Multiplies speed and drives hands</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
