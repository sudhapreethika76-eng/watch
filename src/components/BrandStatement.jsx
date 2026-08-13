import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BrandStatement.css';

gsap.registerPlugin(ScrollTrigger);

export default function BrandStatement() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    
    // Animate lines
    const lines = el.querySelectorAll('.statement-line');
    
    gsap.fromTo(
      lines,
      {
        opacity: 0,
        y: 60,
        filter: 'blur(8px)'
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section className="brand-statement-section" ref={containerRef}>
      <div className="spotlight"></div>
      <div className="container statement-container">
        <h2 className="statement-text">
          <div className="statement-line">NOT MADE</div>
          <div className="statement-line">TO FOLLOW TIME.</div>
          <div className="statement-line statement-space"></div>
          <div className="statement-line accent-gold">MADE</div>
          <div className="statement-line accent-gold">TO DEFINE IT.</div>
        </h2>
      </div>
    </section>
  );
}
