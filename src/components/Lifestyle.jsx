import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Lifestyle.css';
import lifestyleImg from '../assets/images/lifestyle_watch.png';

gsap.registerPlugin(ScrollTrigger);

export default function Lifestyle() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Parallax scrolling effect on background image
    gsap.fromTo(
      imageRef.current,
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    // Text fade in and scaling
    gsap.fromTo(
      '.lifestyle-title-word',
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section className="lifestyle-section" ref={containerRef} id="lifestyle">
      {/* Parallax Image Background */}
      <div className="lifestyle-bg-image-container">
        <img 
          src={lifestyleImg} 
          alt="Aurelis watch luxury lifestyle environment" 
          className="lifestyle-bg-image"
          ref={imageRef}
        />
      </div>

      {/* Dark Vignette Overlay */}
      <div className="lifestyle-overlay"></div>

      {/* Floating Copy */}
      <div className="container lifestyle-container">
        <div className="lifestyle-content">
          <span className="section-label accent-glow-label">PHILOSOPHY</span>
          <h2 className="lifestyle-title">
            <span className="lifestyle-title-word">FOR MOMENTS</span>
            <span className="lifestyle-title-word accent-color-style">THAT MATTER.</span>
          </h2>
          <p className="lifestyle-desc-text lifestyle-title-word">
            A timepiece is not just a tool to measure hours. It is a silent witness to your achievements, a legacy passed down through generations, and a declaration of your standards.
          </p>
        </div>
      </div>
    </section>
  );
}
