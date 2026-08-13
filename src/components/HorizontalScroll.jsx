import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HorizontalScroll.css';

// Import images
import classicImg from '../assets/images/collection_classic.png';
import chronoImg from '../assets/images/collection_chrono.png';
import noirImg from '../assets/images/collection_noir.png';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.matchMedia();

    ctx.add("(min-width: 769px)", () => {
      const track = trackRef.current;
      const container = containerRef.current;
      
      // Calculate scroll width
      const scrollWidth = track.scrollWidth - window.innerWidth;
      
      // GSAP ScrollTrigger translation
      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="horizontal-scroll-container" ref={containerRef}>
      <div className="horizontal-sticky">
        <div className="horizontal-slider-track" ref={trackRef}>
          
          {/* Slide 1: Big Typography Title Slide */}
          <div className="horizontal-slide title-slide">
            <div className="title-slide-content">
              <span className="section-label">EXHIBITION</span>
              <h2 className="horizontal-title">
                THE ART<br />
                <span className="accent-gold-text">OF TIME.</span>
              </h2>
              <p className="horizontal-desc-text">Scroll to explore horological aesthetics in motion.</p>
            </div>
            <div className="title-bg-text">AURELIS</div>
          </div>

          {/* Slide 2: Chrono Model Details */}
          <div className="horizontal-slide product-slide panel-dark">
            <div className="product-slide-grid">
              <div className="product-slide-image">
                <img src={chronoImg} alt="Aurelis Chrono" />
              </div>
              <div className="product-slide-info">
                <span className="slide-num">01 / CHRONO</span>
                <h3>SYMMETRY IN MOTION.</h3>
                <p>Designed with mathematical precision. Dual registers align in perfect horizontal balance, creating an aesthetic layout inspired by automotive dashboard controls.</p>
                <div className="slide-details-row">
                  <div>
                    <h5>DIAL</h5>
                    <p>41mm gold</p>
                  </div>
                  <div>
                    <h5>GLASS</h5>
                    <p>Sapphire</p>
                  </div>
                  <div>
                    <h5>CALIBER</h5>
                    <p>A-890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3: Classic Model Details */}
          <div className="horizontal-slide product-slide">
            <div className="product-slide-grid">
              <div className="product-slide-info text-right-layout">
                <span className="slide-num">02 / CLASSIC</span>
                <h3>THE VALUE OF OMISSION.</h3>
                <p>No date windows, no tachymeters, no clutter. Only three hands sweeping across a satin silver surface. Luxury is not about what we add, but what we refuse to include.</p>
                <div className="slide-details-row text-right-row">
                  <div>
                    <h5>CASE</h5>
                    <p>39mm steel</p>
                  </div>
                  <div>
                    <h5>STRAP</h5>
                    <p>Calfskin</p>
                  </div>
                  <div>
                    <h5>WATER</h5>
                    <p>50 Meters</p>
                  </div>
                </div>
              </div>
              <div className="product-slide-image">
                <img src={classicImg} alt="Aurelis Classic" />
              </div>
            </div>
          </div>

          {/* Slide 4: Noir Model Details */}
          <div className="horizontal-slide product-slide panel-dark">
            <div className="product-slide-grid">
              <div className="product-slide-image">
                <img src={noirImg} alt="Aurelis Noir" />
              </div>
              <div className="product-slide-info">
                <span className="slide-num">03 / NOIR</span>
                <h3>STEALTH SOPHISTICATION.</h3>
                <p>Finished in Diamond-Like Carbon (DLC) coating for high hardness. Designed for those who prefer subtle, understated luxury. Visually silent, physically supreme.</p>
                <div className="slide-details-row">
                  <div>
                    <h5>COATING</h5>
                    <p>Stealth DLC</p>
                  </div>
                  <div>
                    <h5>POWER</h5>
                    <p>42 hours</p>
                  </div>
                  <div>
                    <h5>LIMITED</h5>
                    <p>100 Pieces</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
