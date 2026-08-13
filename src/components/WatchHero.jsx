import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import watchModelUrl from '../assets/images/citirenn_tommy_hilfiger.glb';
import './WatchHero.css';

export default function WatchHero({ onLoaded }) {
  const canvasRef  = useRef(null);
  const mountRef   = useRef(null);
  const modelRef   = useRef(null);
  const frameRef   = useRef(null);
  const clockRef   = useRef(new THREE.Clock());
  const mixerRef   = useRef(null);

  // Interaction state stored in refs so the animation loop sees fresh values
  const isDragging   = useRef(false);
  const prevMouse    = useRef({ x: 0, y: 0 });
  const velocity     = useRef({ x: 0, y: 0 });   // inertia
  const targetRot    = useRef({ x: 0, y: 0 });    // desired rotation
  const currentRot   = useRef({ x: 0, y: 0 });    // damped rotation
  const autoRotY     = useRef(0);                  // base auto-spin offset
  const introSpeed   = useRef(1.8);                // extra spin boost at page open (decays to 0)

  const [modelLoaded, setModelLoaded] = useState(false);


  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let initRafId;
    let cleanupFn = null;

    // Wait one paint frame so the CSS grid has finished layout → correct clientWidth/Height
    initRafId = requestAnimationFrame(() => {
      cleanupFn = initThree(mount);
    });

    function initThree(mount) {
      /* ─── Scene ─────────────────────────────────── */
      const scene = new THREE.Scene();

      /* ─── Camera ────────────────────────────────── */
      const w = mount.clientWidth  || window.innerWidth  / 2;
      const h = mount.clientHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 200);
      camera.position.set(-0.3, 0.2, 7);

      /* ─── Renderer ──────────────────────────────── */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      /* ─── Environment (IBL) ─────────────────────── */
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      pmrem.dispose();

      /* ─── Lighting ──────────────────────────────── */
      scene.add(new THREE.AmbientLight(0xffffff, 1.5));

      const keyLight = new THREE.DirectionalLight(0xfff8e8, 2.0);
      keyLight.position.set(4, 6, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xc8d8ff, 1.0);
      fillLight.position.set(-5, 2, -2);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xe5c158, 1.5);
      rimLight.position.set(0, -3, -4);
      scene.add(rimLight);

      const spotTop = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI / 4, 0.3);
      spotTop.position.set(0, 8, 4);
      scene.add(spotTop);

      const frontLight = new THREE.PointLight(0xffffff, 1.5, 20);
      frontLight.position.set(0, 0, 7);
      scene.add(frontLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
      topLight.position.set(0, 10, 0);
      scene.add(topLight);

      /* ─── Load GLB ──────────────────────────────── */
      const loader = new GLTFLoader();
      loader.load(
        watchModelUrl,
        (gltf) => {
          const model = gltf.scene;

          // Centre & normalise scale
          const box    = new THREE.Box3().setFromObject(model);
          const maxDim = box.getSize(new THREE.Vector3())
                            .toArray()
                            .reduce((a, b) => Math.max(a, b));
          
          const scale = 2.8 / maxDim;
          model.scale.setScalar(scale);

          // Get center AFTER scaling
          const box2 = new THREE.Box3().setFromObject(model);
          const centre = box2.getCenter(new THREE.Vector3());
          model.position.sub(centre);

          const pivot = new THREE.Group();
          pivot.add(model);

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

          scene.add(pivot);
          modelRef.current = pivot;

          setModelLoaded(true);
          if (window.setAssetLoadingProgress) window.setAssetLoadingProgress(100);
          if (onLoaded) onLoaded();
        },
        (xhr) => {
          // Report real download progress to window preloader
          if (xhr.lengthComputable) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            if (window.setAssetLoadingProgress) window.setAssetLoadingProgress(pct);
          } else {
            // Fallback: estimate based on bytes loaded (GLB ≈ 20MB)
            const estimated = Math.min(Math.round((xhr.loaded / 20_000_000) * 100), 95);
            if (window.setAssetLoadingProgress) window.setAssetLoadingProgress(estimated);
          }
        },
        (err) => {
          console.error('GLB load error', err);
          setModelLoaded(true);
          if (onLoaded) onLoaded();
        },
      );

      /* ─── Pointer / touch drag ──────────────────── */
      const DRAG_SENSITIVITY = 0.007;
      const DAMPING          = 0.88;
      const DAMP_LERP        = 0.10;

      const onPointerDown = (e) => {
        isDragging.current  = true;
        prevMouse.current   = { x: e.clientX, y: e.clientY };
        velocity.current    = { x: 0, y: 0 };
        mount.style.cursor  = 'grabbing';
      };

      const onPointerMove = (e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - prevMouse.current.x;
        const dy = e.clientY - prevMouse.current.y;
        prevMouse.current = { x: e.clientX, y: e.clientY };
        velocity.current.x = dy * DRAG_SENSITIVITY;
        velocity.current.y = dx * DRAG_SENSITIVITY;
        targetRot.current.x += velocity.current.x;
        targetRot.current.y += velocity.current.y;
        targetRot.current.x = Math.max(-0.6, Math.min(0.6, targetRot.current.x));
      };

      const onPointerUp = () => {
        isDragging.current = false;
        mount.style.cursor = 'grab';
      };

      const onTouchStart = (e) => {
        const t = e.touches[0];
        isDragging.current  = true;
        prevMouse.current   = { x: t.clientX, y: t.clientY };
        velocity.current    = { x: 0, y: 0 };
      };
      const onTouchMove = (e) => {
        if (!isDragging.current) return;
        const t  = e.touches[0];
        const dx = t.clientX - prevMouse.current.x;
        const dy = t.clientY - prevMouse.current.y;
        prevMouse.current = { x: t.clientX, y: t.clientY };
        velocity.current.x = dy * DRAG_SENSITIVITY;
        velocity.current.y = dx * DRAG_SENSITIVITY;
        targetRot.current.x += velocity.current.x;
        targetRot.current.y += velocity.current.y;
        targetRot.current.x  = Math.max(-0.6, Math.min(0.6, targetRot.current.x));
      };
      const onTouchEnd = () => { isDragging.current = false; };

      mount.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup',   onPointerUp);
      mount.addEventListener('touchstart',   onTouchStart, { passive: true });
      window.addEventListener('touchmove',   onTouchMove,  { passive: true });
      window.addEventListener('touchend',    onTouchEnd);
      mount.style.cursor = 'grab';

      /* ─── Animate loop ──────────────────────────── */
      const AUTO_SPIN = 0.18;

      const tick = () => {
        frameRef.current = requestAnimationFrame(tick);
        const delta = Math.min(clockRef.current.getDelta(), 0.05);

        if (modelRef.current) {
          if (!isDragging.current) {
            if (introSpeed.current > 0) {
              introSpeed.current = Math.max(0, introSpeed.current - delta * 0.9);
            }
            autoRotY.current += (AUTO_SPIN + introSpeed.current) * delta;
            velocity.current.x *= DAMPING;
            velocity.current.y *= DAMPING;
            targetRot.current.x += velocity.current.x;
            targetRot.current.y += velocity.current.y;
            targetRot.current.x = Math.max(-0.6, Math.min(0.6, targetRot.current.x));
            targetRot.current.x += (0 - targetRot.current.x) * 0.015;
          }
          currentRot.current.x += (targetRot.current.x - currentRot.current.x) * DAMP_LERP;
          currentRot.current.y += (targetRot.current.y - currentRot.current.y) * DAMP_LERP;
          modelRef.current.rotation.x = currentRot.current.x;
          modelRef.current.rotation.y = autoRotY.current + currentRot.current.y;
          const elapsed = clockRef.current.elapsedTime;
          modelRef.current.position.y = Math.sin(elapsed * 0.8) * 0.055;
        }

        if (mixerRef.current) {
          mixerRef.current.update(delta);
        }

        renderer.render(scene, camera);
      };
      clockRef.current.start();
      tick();

      /* ─── Resize handler ────────────────────────── */
      const onResize = () => {
        const nw = mount.clientWidth;
        const nh = mount.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', onResize);

      // Return cleanup refs
      return () => {
        cancelAnimationFrame(frameRef.current);
        window.removeEventListener('resize',      onResize);
        mount.removeEventListener('pointerdown',  onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup',   onPointerUp);
        mount.removeEventListener('touchstart',   onTouchStart);
        window.removeEventListener('touchmove',   onTouchMove);
        window.removeEventListener('touchend',    onTouchEnd);
        envTexture.dispose();
        dracoLoader.dispose();
        renderer.dispose();
      };
    } // end initThree

    return () => {
      cancelAnimationFrame(initRafId);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  const handleOrderNow = () => {
    document.querySelector('#shop-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="watch-hero-section" id="hero">

      {/* ── LEFT: Hero copy ── */}
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-text">Swiss Mechanical Mastery</span>
        </div>

        <h1 className="hero-headline">
          <span className="hero-headline-line1">TIME,</span>
          <span className="hero-headline-line2">Refined.</span>
        </h1>

        <p className="hero-tagline">
          Precision engineered for those who refuse to compromise.
          Handcrafted movements, eternal aesthetics.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">1847</span>
            <span className="hero-stat-label">Est. Year</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">350+</span>
            <span className="hero-stat-label">Components</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">72h</span>
            <span className="hero-stat-label">Power Reserve</span>
          </div>
        </div>

        <div className="hero-cta-row">
          <button className="hero-order-btn" onClick={handleOrderNow}>
            Order Now
          </button>
          <button
            className="hero-explore-link"
            onClick={() => document.querySelector('#collection-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Collection
          </button>
        </div>
      </div>


      {/* ── RIGHT: 3-D canvas ── */}
      <div ref={mountRef} className="hero-canvas-mount">
        <canvas ref={canvasRef} className="hero-canvas" />
      </div>



      {/* ── Scroll cue ── */}
      <div className="hero-scroll-cue">
        <div className="hero-scroll-line" />
      </div>

      {/* ── Drag hint ── */}
      {modelLoaded && (
        <div className="hero-drag-hint">
          <span>DRAG TO ROTATE</span>
        </div>
      )}
    </section>
  );
}
