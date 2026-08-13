import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Craftsmanship.css';
import dialDetailImg from '../assets/images/watch_dial_detail.png';

gsap.registerPlugin(ScrollTrigger);

export default function Craftsmanship() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    
    // Parallax on image
    gsap.fromTo(
      '.craftsmanship-image',
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    // Stagger feature reveal
    gsap.fromTo(
      '.craftsmanship-feature',
      { opacity: 0, y: 40, filter: 'blur(3px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.25,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.craftsmanship-features-list',
          start: 'top 80%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section className="craftsmanship-section section-padding" ref={sectionRef} id="craftsmanship">
      <div className="container craftsmanship-container">
        
        {/* Left Side: Close-up Image Container */}
        <div className="craftsmanship-visual">
          <div className="image-frame">
            <img 
              src={dialDetailImg} 
              alt="Aurelis watch dial detail craftsmanship" 
              className="craftsmanship-image"
            />
            <div className="frame-border"></div>
          </div>
        </div>

        {/* Right Side: Copy Content */}
        <div className="craftsmanship-content">
          <span className="section-label">MASTERY</span>
          <h2 className="craftsmanship-title">
            CRAFTED FOR<br />
            EVERY SECOND.
          </h2>
          <p className="craftsmanship-desc">
            From the precision of its movement to the finish of every surface, every AURELIS timepiece is designed around the pursuit of absolute perfection.
          </p>

          <div className="craftsmanship-features-list">
            
            <div className="craftsmanship-feature">
              <div className="feature-num">01</div>
              <div className="feature-info">
                <h3>PRECISION</h3>
                <p>Regulated to a tolerance of +/- 2 seconds per day, exceeding official chronometer standards.</p>
              </div>
            </div>

            <div className="craftsmanship-feature">
              <div className="feature-num">02</div>
              <div className="feature-info">
                <h3>MATERIALS</h3>
                <p>Forged in medical-grade 316L stainless steel, resistant to corrosion and polished to a mirror shine.</p>
              </div>
            </div>

            <div className="craftsmanship-feature">
              <div className="feature-num">03</div>
              <div className="feature-info">
                <h3>CRAFT</h3>
                <p>Assembled and adjusted by master watchmakers in our swiss workshop, carrying centuries of horology heritage.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
