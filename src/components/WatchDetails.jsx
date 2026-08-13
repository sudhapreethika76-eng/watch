import React, { useState, useEffect } from 'react';
import './WatchDetails.css';
import watchDetailImg from '../assets/images/watch_hero.png';

export default function WatchDetails() {
  const [activeHotspot, setActiveHotspot] = useState('crystal');

  const hotspots = {
    crystal: {
      id: 'crystal',
      title: 'SAPPHIRE CRYSTAL',
      desc: 'Double-domed sapphire glass with multi-layered anti-reflective coating inside. Virtually scratchproof and offers crystal-clear dial visibility under any light conditions.',
      x: '50%',
      y: '26%',
      lineX: '20%',
      lineY: '26%',
      cardSide: 'left'
    },
    steel: {
      id: 'steel',
      title: '316L STAINLESS STEEL',
      desc: 'Medical-grade steel case forged for maximum hardness and corrosion resistance. Polished by hand using black-polishing techniques for flawless mirror reflections.',
      x: '38%',
      y: '48%',
      lineX: '20%',
      lineY: '48%',
      cardSide: 'left'
    },
    movement: {
      id: 'movement',
      title: 'AUTOMATIC CALIBER',
      desc: 'A custom mechanical heartbeat with 42-hour power reserve. Self-winding with every movement of your wrist, oscillating at 4Hz behind a transparent caseback.',
      x: '55%',
      y: '53%',
      lineX: '80%',
      lineY: '53%',
      cardSide: 'right'
    },
    leather: {
      id: 'leather',
      title: 'ITALIAN LEATHER',
      desc: 'Hand-stitched full-grain calf leather strap sourced from traditional tanneries in Florence. Develops a unique, personal character and patina over time.',
      x: '48%',
      y: '80%',
      lineX: '80%',
      lineY: '80%',
      cardSide: 'right'
    }
  };

  const activeData = hotspots[activeHotspot];

  return (
    <section className="watch-details-section section-padding" id="details">
      <div className="container details-container">
        
        {/* Editorial Heading */}
        <div className="details-header text-center">
          <span className="section-label">DETAILS</span>
          <h2 className="details-main-title">EVERY DETAIL, REFINED.</h2>
          <p className="details-main-desc">Hover or tap on the indicators to explore the anatomical craftsmanship of Aurelis.</p>
        </div>

        {/* Interactive Diagram Grid */}
        <div className="details-interactive-grid">
          
          {/* Left Info Panel */}
          <div className="details-panel panel-left">
            <div className={`detail-card ${activeData.cardSide === 'left' ? 'card-visible' : 'card-hidden'}`}>
              <span className="card-number">{activeHotspot === 'crystal' ? '01' : '02'}</span>
              <h3 className="card-title">{activeData.title}</h3>
              <p className="card-desc">{activeData.desc}</p>
            </div>
          </div>

          {/* Center Image with Markers */}
          <div className="details-image-wrapper">
            <img 
              src={watchDetailImg} 
              alt="Aurelis watch details anatomy" 
              className="details-watch-img"
            />
            
            {/* SVG Connector Lines */}
            <svg className="details-svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Object.values(hotspots).map((spot) => {
                const isActive = activeHotspot === spot.id;
                
                // SVG points coordinate formatting
                const x1 = parseFloat(spot.x);
                const y1 = parseFloat(spot.y);
                const x2 = parseFloat(spot.lineX);
                const y2 = parseFloat(spot.lineY);
                
                return (
                  <g key={spot.id} className={`connector-line-group ${isActive ? 'active' : ''}`}>
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      className="connector-path"
                    />
                    <circle 
                      cx={x2} 
                      cy={y2} 
                      r="0.8" 
                      className="connector-end-dot" 
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hotspots */}
            {Object.values(hotspots).map((spot) => {
              const isActive = activeHotspot === spot.id;
              return (
                <div 
                  key={spot.id} 
                  className={`hotspot-dot ${isActive ? 'active' : ''}`}
                  style={{ top: spot.y, left: spot.x }}
                  onMouseEnter={() => setActiveHotspot(spot.id)}
                  onClick={() => setActiveHotspot(spot.id)}
                >
                  <div className="hotspot-pulse"></div>
                  <div className="hotspot-center"></div>
                </div>
              );
            })}
          </div>

          {/* Right Info Panel */}
          <div className="details-panel panel-right">
            <div className={`detail-card ${activeData.cardSide === 'right' ? 'card-visible' : 'card-hidden'}`}>
              <span className="card-number">{activeHotspot === 'movement' ? '03' : '04'}</span>
              <h3 className="card-title">{activeData.title}</h3>
              <p className="card-desc">{activeData.desc}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
