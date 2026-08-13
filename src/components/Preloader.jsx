import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate initial progress loading
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Slow down near the end if the 3D model isn't ready
      if (currentProgress < 85) {
        currentProgress += Math.floor(Math.random() * 8) + 2;
      } else if (currentProgress < 98) {
        currentProgress += 1;
      } else {
        clearInterval(interval);
      }
      setProgress(Math.min(currentProgress, 99));
    }, 120);

    // Safety timeout of 5 seconds max - luxury sites shouldn't make users wait forever
    const timeout = setTimeout(() => {
      setProgress(100);
      setIsLoaded(true);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (progress === 100 || isLoaded) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      tl.to('.preloader-line-fill', { width: '100%', duration: 0.4 })
        .to('.preloader-text', { 
          opacity: 0, 
          y: -20, 
          filter: 'blur(10px)', 
          duration: 0.8, 
          ease: 'power3.inOut' 
        })
        .to('.preloader-container', { 
          opacity: 0, 
          pointerEvents: 'none', 
          duration: 1.2, 
          ease: 'power4.inOut' 
        });
    }
  }, [progress, isLoaded, onComplete]);

  // Expose a way to set progress to 100 from outside when GLB is fully loaded
  window.setAssetLoadingProgress = (val) => {
    if (val >= 100) {
      setProgress(100);
      setIsLoaded(true);
    } else {
      setProgress(Math.max(Math.floor(val), progress));
    }
  };

  return (
    <div className="preloader-container">
      <div className="preloader-content">
        <div className="preloader-text">
          <h1 className="preloader-title">AURELIS</h1>
          <p className="preloader-subtitle">TIME, REFINED.</p>
        </div>
        <div className="preloader-line-container">
          <div 
            className="preloader-line-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="preloader-percentage">
          {progress}%
        </div>
      </div>
    </div>
  );
}
