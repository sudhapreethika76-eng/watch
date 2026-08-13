import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import watchModelUrl from '../assets/images/citirenn_tommy_hilfiger.glb';
import './ScrollWatch.css';

// Import fallback images
import watchHeroImg from '../assets/images/watch_hero.png';
import watchDialImg from '../assets/images/watch_dial_detail.png';
import watchMovementImg from '../assets/images/watch_movement_detail.png';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollWatch() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const watchModelRef = useRef(null);
  const mixerRef = useRef(null);
  const pointLightRef = useRef(null);
  const spotLightRef = useRef(null);

  // Texts to display during scroll phases
  const textPhases = [
    {
      title: "TIME,",
      subtitle: "REFINED.",
      desc: "Precision engineered. Timeless by design.",
      align: "left",
      phase: 0 // 0% - 20%
    },
    {
      title: "EVERY SECOND",
      subtitle: "HAS A MECHANISM.",
      desc: "An intricate assembly of over 200 components, synchronized in perfect harmony.",
      align: "right",
      phase: 1 // 20% - 50%
    },
    {
      title: "ENGINEERED",
      subtitle: "WITHOUT COMPROMISE.",
      desc: "Every surface hand-polished. Every tolerance measured in microns.",
      align: "left",
      phase: 2 // 50% - 75%
    },
    {
      title: "THE ARCHITECTURE",
      subtitle: "OF CHRONOLOGY.",
      desc: "Behold the beauty of pure mechanical physics operating at 28,800 vibrations per hour.",
      align: "right",
      phase: 3 // 75% - 100%
    }
  ];

  // 1. Setup GSAP ScrollTrigger
  useEffect(() => {
    const scrollContainer = containerRef.current;
    
    const trigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        
        // Determine active text phase
        const progress = self.progress;
        if (progress < 0.25) {
          setActiveTextIndex(0);
        } else if (progress >= 0.25 && progress < 0.55) {
          setActiveTextIndex(1);
        } else if (progress >= 0.55 && progress < 0.8) {
          setActiveTextIndex(2);
        } else {
          setActiveTextIndex(3);
        }
      }
    });

    // Fade-in effect for texts inside ScrollWatch
    gsap.utils.toArray('.scroll-text-group').forEach((group, idx) => {
      ScrollTrigger.create({
        trigger: scrollContainer,
        start: () => `top+=${idx * 25}% top`,
        end: () => `top+=${(idx + 1) * 25}% top`,
        toggleActions: 'play reverse play reverse',
        onEnter: () => {
          gsap.to(group, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
        },
        onLeave: () => {
          gsap.to(group, { opacity: 0, y: -30, filter: 'blur(5px)', duration: 0.8, ease: 'power2.in' });
        },
        onEnterBack: () => {
          gsap.to(group, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          gsap.to(group, { opacity: 0, y: 30, filter: 'blur(5px)', duration: 0.8, ease: 'power2.in' });
        }
      });
    });

    // Timeout for 3D loading (falls back to high-res images if loading takes more than 4s)
    const fallbackTimeout = setTimeout(() => {
      if (loading) {
        console.warn("3D asset loading timed out, switching to high-fidelity 2D fallback.");
        setFallback(true);
        setLoading(false);
        if (window.setAssetLoadingProgress) {
          window.setAssetLoadingProgress(100);
        }
      }
    }, 4500);

    return () => {
      trigger.kill();
      clearTimeout(fallbackTimeout);
    };
  }, [loading]);

  // 2. Setup Three.js Scene
  useEffect(() => {
    if (fallback) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.8); // warm champagne light
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 15);
    pointLight.position.set(-3, 2, -2);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // Moving spotlight for luxury reflections
    const spotLight = new THREE.SpotLight(0xe5c158, 2.5, 10, Math.PI / 6, 0.5, 1);
    spotLight.position.set(0, 4, 3);
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // Load 3D Model
    const loader = new GLTFLoader();
    
    loader.load(
      watchModelUrl,
      (gltf) => {
        const model = gltf.scene;
        
        // Center model bounds
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Scale appropriately
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.4 / maxDim;
        model.scale.setScalar(scale);

        // Apply premium dark material styling
        model.traverse((node) => {
          if (node.isMesh && node.material) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((mat) => {
              if (mat.color) {
                // Blend color towards dark background (#0b0d14)
                mat.color.lerp(new THREE.Color(0x0b0d14), 0.7); 
              }
              mat.metalness = Math.max(mat.metalness !== undefined ? mat.metalness : 0.5, 0.85);
              mat.roughness = Math.min(mat.roughness !== undefined ? mat.roughness : 0.5, 0.2);
              mat.envMapIntensity = 2.5;
              mat.needsUpdate = true;
            });
          }
        });

        // Setup animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixerRef.current.clipAction(clip).play();
          });
        }

        scene.add(model);
        watchModelRef.current = model;
        setLoading(false);

        // Notify preloader
        if (window.setAssetLoadingProgress) {
          window.setAssetLoadingProgress(100);
        }
      },
      (xhr) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        if (window.setAssetLoadingProgress) {
          window.setAssetLoadingProgress(percent);
        }
      },
      (error) => {
        console.error("Three.js model loading error. Falling back:", error);
        setFallback(true);
        setLoading(false);
      }
    );

    // Animation Tick
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.01;
      const progress = scrollProgressRef.current;

      // Define default target angles
      let targetRotY = progress * Math.PI * 2.2;
      let targetRotX = 0;
      let targetRotZ = 0;
      let targetCamZ = 5;
      let targetCamY = 0;
      let targetCamX = 0;

      // 3D camera & model positioning based on scroll progress
      // 0–20%: Show complete watch rotating slowly.
      if (progress <= 0.2) {
        const p = progress / 0.2;
        targetRotY = p * 0.6 + time * 0.08;
        targetRotX = Math.sin(time * 0.4) * 0.03 + 0.1;
        targetCamZ = 5.2;
        targetCamY = 0;
      }
      // 20–35%: Rotate watch slowly to show side/profile.
      else if (progress <= 0.35) {
        const p = (progress - 0.2) / 0.15;
        targetRotY = 0.6 + p * (Math.PI * 0.4);
        targetRotX = 0.1 + p * 0.15;
        targetCamZ = 5.2;
        targetCamY = 0;
      }
      // 35–50%: Move camera closer.
      else if (progress <= 0.5) {
        const p = (progress - 0.35) / 0.15;
        targetRotY = 0.6 + (Math.PI * 0.4);
        targetRotX = 0.25;
        targetCamZ = 5.2 - p * 2.4; // zoom in close!
        targetCamY = -p * 0.25;
      }
      // 50–65%: Reveal dial details/crown.
      else if (progress <= 0.65) {
        const p = (progress - 0.5) / 0.15;
        targetRotY = (0.6 + Math.PI * 0.4) + p * (Math.PI * 0.35);
        targetRotX = 0.25 - p * 0.5;
        targetCamZ = 2.8;
        targetCamY = -0.25 + p * 0.35;
      }
      // 65–80%: Turn watch around to transition to movement.
      else if (progress <= 0.8) {
        const p = (progress - 0.65) / 0.15;
        targetRotY = (0.6 + Math.PI * 0.75) + p * (Math.PI * 0.95); // flip around
        targetRotX = -0.25 + p * 0.3;
        targetCamZ = 2.8;
        targetCamY = 0.1 - p * 0.1;
      }
      // 80–100%: Show caseback details & gear movement closeup.
      else {
        const p = (progress - 0.8) / 0.2;
        targetRotY = (0.6 + Math.PI * 1.7) + p * 0.4;
        targetRotX = 0.05 + p * 0.15;
        targetCamZ = 2.8 - p * 1.4; // deep close-up!
        targetCamY = 0;
      }

      // Lerp (Linear Interpolate) model transforms
      if (watchModelRef.current) {
        watchModelRef.current.rotation.y += (targetRotY - watchModelRef.current.rotation.y) * 0.04;
        watchModelRef.current.rotation.x += (targetRotX - watchModelRef.current.rotation.x) * 0.04;
        watchModelRef.current.rotation.z += (targetRotZ - watchModelRef.current.rotation.z) * 0.04;
        
        // Add tiny float bounce
        watchModelRef.current.position.y = Math.sin(time * 0.8) * 0.025;
      }

      if (mixerRef.current) {
        mixerRef.current.update(0.016); // Approximate delta for 60fps
      }

      // Lerp camera settings
      if (cameraRef.current) {
        cameraRef.current.position.z += (targetCamZ - cameraRef.current.position.z) * 0.04;
        cameraRef.current.position.y += (targetCamY - cameraRef.current.position.y) * 0.04;
        cameraRef.current.position.x += (targetCamX - cameraRef.current.position.x) * 0.04;
      }

      // Slowly move spotLight for dynamic reflection sweeps
      if (spotLightRef.current) {
        spotLightRef.current.position.x = Math.sin(time * 0.3) * 3;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [fallback]);

  // Compute 2D fallback layout properties based on scroll state
  const getFallbackTransforms = () => {
    const progress = scrollProgressRef.current;
    
    // Scale watch, rotate, and fade between images
    let scale = 1;
    let rotation = progress * 40;
    let opacityHero = 1;
    let opacityDial = 0;
    let opacityMovement = 0;

    if (progress <= 0.4) {
      // Phase 1 (Hero to side view)
      scale = 1 + progress * 0.4;
      opacityHero = 1;
    } else if (progress > 0.4 && progress <= 0.75) {
      // Phase 2 (Dial detail zoom)
      const p = (progress - 0.4) / 0.35;
      scale = 1.4 + p * 0.6;
      opacityHero = 1 - p;
      opacityDial = p;
    } else {
      // Phase 3 (Caseback/movement detail zoom)
      const p = (progress - 0.75) / 0.25;
      scale = 2.0 + p * 0.8;
      opacityDial = 1 - p;
      opacityMovement = p;
    }

    return {
      hero: {
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        opacity: opacityHero
      },
      dial: {
        transform: `translate(-50%, -50%) rotate(${-rotation * 0.3}deg) scale(${scale * 0.95})`,
        opacity: opacityDial
      },
      movement: {
        transform: `translate(-50%, -50%) rotate(${rotation * 0.5}deg) scale(${scale * 0.9})`,
        opacity: opacityMovement
      }
    };
  };

  const [fallbackStyles, setFallbackStyles] = useState({
    hero: { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
    dial: { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0 },
    movement: { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 0 }
  });

  // Keep fallback styles updated in React loop if rendering 2D
  useEffect(() => {
    if (!fallback) return;

    let animFrame;
    const updateFallback = () => {
      setFallbackStyles(getFallbackTransforms());
      animFrame = requestAnimationFrame(updateFallback);
    };
    updateFallback();

    return () => cancelAnimationFrame(animFrame);
  }, [fallback]);

  const handleExploreClick = () => {
    const nextSection = document.querySelector('#collection');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="scrollwatch-section-wrapper" ref={containerRef} id="hero">
      
      {/* Pinned Visual Section */}
      <div className="scrollwatch-sticky-container">
        
        {/* Spot Light Overlay */}
        <div className="spotlight"></div>
        
        {/* Watch Render Area */}
        <div className="scrollwatch-visual-container">
          {!fallback ? (
            <canvas ref={canvasRef} className="scrollwatch-canvas" />
          ) : (
            <div className="scrollwatch-fallback-container">
              {/* Fallback Image Crossfade Stack */}
              <img 
                src={watchHeroImg} 
                alt="Aurelis watch front" 
                className="fallback-watch-image"
                style={fallbackStyles.hero}
              />
              <img 
                src={watchDialImg} 
                alt="Aurelis watch dial detail" 
                className="fallback-watch-image"
                style={fallbackStyles.dial}
              />
              <img 
                src={watchMovementImg} 
                alt="Aurelis watch movement detail" 
                className="fallback-watch-image"
                style={fallbackStyles.movement}
              />
            </div>
          )}
          
          {/* Subtle reflection overlay */}
          <div className="lens-reflection"></div>
        </div>

        {/* Text Scroll Layers (Scrolling Content over the Pinned Watch) */}
        <div className="scrollwatch-texts-container">
          
          {/* Section 1: Hero */}
          <div className="scroll-text-group text-align-left full-hero-layout" style={{ opacity: 1, transform: 'translateY(0)' }}>
            <h1 className="hero-main-title">
              TIME,<br />
              <span className="accent-color">REFINED.</span>
            </h1>
            <p className="hero-subtitle-desc">
              Precision engineered.<br />
              Timeless by design.
            </p>
            <button className="btn-premium hero-cta-btn" onClick={handleExploreClick}>
              EXPLORE THE COLLECTION <span>→</span>
            </button>
            <div className="hero-scroll-indicator">
              <span>SCROLL TO DISCOVER</span>
              <div className="indicator-arrow">↓</div>
            </div>
          </div>

          {/* Section 2: Every second has a mechanism */}
          <div className="scroll-text-group text-align-right" style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <span className="section-label">01 / CALIBER</span>
            <h2 className="editorial-title">
              EVERY SECOND<br />
              <span className="accent-color">HAS A MECHANISM.</span>
            </h2>
            <p className="editorial-desc">
              An intricate assembly of micro-components operating in complete unison, turning tension into chronographic fluid movement.
            </p>
          </div>

          {/* Section 3: Engineered without compromise */}
          <div className="scroll-text-group text-align-left" style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <span className="section-label">02 / FINISHING</span>
            <h2 className="editorial-title">
              ENGINEERED<br />
              <span className="accent-color">WITHOUT COMPROMISE.</span>
            </h2>
            <p className="editorial-desc">
              Carved from solid 316L block-steel. Hand-finished surfaces alternating between satin brushing and flawless mirror polishing.
            </p>
          </div>

          {/* Section 4: Movement Closeup */}
          <div className="scroll-text-group text-align-right" style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <span className="section-label">03 / HEARTBEAT</span>
            <h2 className="editorial-title">
              THE ARCHITECTURE<br />
              <span className="accent-color">OF CHRONOLOGY.</span>
            </h2>
            <p className="editorial-desc">
              Behold the beauty of pure mechanical oscillation. A heartbeat pulsating at 28,800 vibrations per hour under a display sapphire back.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
