import React, { useState, useEffect, useRef } from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  Camera, 
  Eye, 
  Flame, 
  Sun, 
  Maximize2, 
  Crosshair, 
  Zap, 
  Scan, 
  CircleDot,
  Radio
} from 'lucide-react';

export const CameraPanel = () => {
  const { survivorData, roverState } = useMission();
  const [feedMode, setFeedMode] = useState('RGB'); // 'RGB' | 'THERMAL' | 'NIGHT_VISION'
  const [spotlightOn, setSpotlightOn] = useState(true);
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [snapshotEffect, setSnapshotEffect] = useState(false);

  // Snapshot flash effect
  const handleSnapshot = () => {
    setSnapshotEffect(true);
    setTimeout(() => setSnapshotEffect(false), 200);
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-lg overflow-hidden flex flex-col h-full shadow-md">
      {/* Camera Header Bar */}
      <div className="bg-mine-card px-3 py-2 border-b border-mine-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>● LIVE</span>
          </div>
          <span className="text-white font-semibold">CAM-01 [GIMBAL 1080P]</span>
          <span className="text-mine-muted">|</span>
          <span className="text-cyan-400">18 FPS</span>
          <span className="text-mine-muted">|</span>
          <span className="text-mine-subtext">720p H.265</span>
        </div>

        {/* Feed Switcher Controls */}
        <div className="flex items-center gap-1 bg-mine-darkest p-0.5 rounded-lg border border-mine-border text-xs font-mono">
          <button
            onClick={() => setFeedMode('RGB')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition ${
              feedMode === 'RGB'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-mine-subtext hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>RGB</span>
          </button>

          <button
            onClick={() => setFeedMode('THERMAL')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition ${
              feedMode === 'THERMAL'
                ? 'bg-rose-600 text-white font-bold shadow'
                : 'text-mine-subtext hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>THERMAL</span>
          </button>

          <button
            onClick={() => setFeedMode('NIGHT_VISION')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition ${
              feedMode === 'NIGHT_VISION'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'text-mine-subtext hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>NIGHT VISION</span>
          </button>
        </div>
      </div>

      {/* Viewport Area */}
      <div className={`relative flex-1 min-h-[300px] w-full overflow-hidden flex items-center justify-center select-none ${
        feedMode === 'THERMAL' ? 'bg-[#0a051b]' : feedMode === 'NIGHT_VISION' ? 'bg-[#021405]' : 'bg-[#070b12]'
      }`}>
        {/* Snapshot flash overlay */}
        {snapshotEffect && (
          <div className="absolute inset-0 bg-white z-40 transition-opacity duration-150 opacity-90 pointer-events-none" />
        )}

        {/* Scanlines layer */}
        <div className="tactical-scanlines absolute inset-0 z-20 pointer-events-none" />

        {/* HUD Crosshairs Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-40">
          <div className="w-24 h-24 border border-cyan-400/40 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400/60 rounded-full"></div>
          </div>
          <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-300/70 space-y-0.5">
            <div>FOV: 84° • TILT: -12°</div>
            <div>EXPOSURE: AUTO [MINE DRIFT]</div>
            <div>COMPASS: {roverState.heading}° ENE</div>
          </div>
          <div className="absolute top-4 right-4 font-mono text-[10px] text-cyan-300/70 text-right space-y-0.5">
            <div>OPTICAL ZOOM: {zoomLevel}x</div>
            <div>TARGET LOCK: {survivorData.detected ? 'ACQUIRED' : 'SCANNING'}</div>
            {feedMode === 'THERMAL' && <div className="text-rose-400">CAL: FLIR LEPTON 3.5</div>}
          </div>
        </div>

        {/* Simulated Mine Tunnel Visual Background */}
        <div 
          className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {feedMode === 'RGB' && (
            <svg className="w-full h-full object-cover" viewBox="0 0 800 450" preserveAspectRatio="none">
              <defs>
                <radialGradient id="spotlight" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor={spotlightOn ? '#d9e8f5' : '#455565'} stopOpacity={spotlightOn ? 0.35 : 0.08} />
                  <stop offset="70%" stopColor="#0a0f1d" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#04060c" stopOpacity="0.98" />
                </radialGradient>
                <linearGradient id="coalWall" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0c121e" />
                  <stop offset="50%" stopColor="#1e2a3f" />
                  <stop offset="100%" stopColor="#0c121e" />
                </linearGradient>
              </defs>

              {/* Tunnel Perspective Lines */}
              <rect width="800" height="450" fill="#060911" />
              
              {/* Ceiling & Floor Grids */}
              <polygon points="0,0 800,0 520,170 280,170" fill="#0d1424" stroke="#162544" strokeWidth="1" />
              <polygon points="0,450 800,450 520,290 280,290" fill="#080c16" stroke="#1c2c4c" strokeWidth="1" />
              {/* Mine Track Rails */}
              <line x1="260" y1="450" x2="360" y2="290" stroke="#475569" strokeWidth="3" />
              <line x1="540" y1="450" x2="440" y2="290" stroke="#475569" strokeWidth="3" />
              {/* Rail Ties */}
              {[430, 390, 350, 320, 300].map((y, idx) => (
                <line key={idx} x1={200 + idx * 30} y1={y} x2={600 - idx * 30} y2={y} stroke="#334155" strokeWidth="2.5" />
              ))}

              {/* Wooden Arch Timber Props */}
              <path d="M 120 450 L 120 60 L 680 60 L 680 450" fill="none" stroke="#25354f" strokeWidth="16" />
              <path d="M 230 380 L 230 120 L 570 120 L 570 380" fill="none" stroke="#1b283d" strokeWidth="12" />
              <path d="M 310 320 L 310 160 L 490 160 L 490 320" fill="none" stroke="#152133" strokeWidth="8" />

              {/* Spotlight lighting effect */}
              <rect width="800" height="450" fill="url(#spotlight)" />

              {/* Simulated Miner / Human Silhouette in Distance */}
              {survivorData.detected && (
                <g transform="translate(375, 195)">
                  {/* Worker Silhouette */}
                  <ellipse cx="25" cy="15" rx="8" ry="9" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  {/* Helmet */}
                  <path d="M 16 14 Q 25 5 34 14 Z" fill="#eab308" />
                  <rect x="23" y="10" width="4" height="3" fill="#fef08a" />
                  {/* Torso & High-vis stripes */}
                  <path d="M 14 24 L 36 24 L 34 58 L 16 58 Z" fill="#334155" />
                  <rect x="15" y="32" width="20" height="5" fill="#f97316" />
                  <rect x="16" y="42" width="18" height="4" fill="#38bdf8" />
                  {/* Legs / Seated position */}
                  <path d="M 16 58 L 10 75 L 20 78 L 24 60" fill="#1e293b" />
                  <path d="M 34 58 L 40 75 L 30 78 L 26 60" fill="#1e293b" />
                </g>
              )}
            </svg>
          )}

          {feedMode === 'THERMAL' && (
            <svg className="w-full h-full object-cover" viewBox="0 0 800 450" preserveAspectRatio="none">
              <defs>
                <radialGradient id="thermalBg" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#1e1045" />
                  <stop offset="40%" stopColor="#13082b" />
                  <stop offset="80%" stopColor="#090317" />
                  <stop offset="100%" stopColor="#020008" />
                </radialGradient>
                <radialGradient id="heatBody" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#fbbf24" />
                  <stop offset="60%" stopColor="#ef4444" />
                  <stop offset="85%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              <rect width="800" height="450" fill="url(#thermalBg)" />

              {/* Cold Mine Tunnel Structure in Deep Purple / Indigo */}
              <path d="M 100 450 L 100 70 L 700 70 L 700 450" fill="none" stroke="#3b1d70" strokeWidth="12" opacity="0.6" />
              <path d="M 220 370 L 220 130 L 580 130 L 580 370" fill="none" stroke="#2c1459" strokeWidth="8" opacity="0.5" />

              {/* Cold Ground Tracks in Blue */}
              <line x1="260" y1="450" x2="360" y2="290" stroke="#312e81" strokeWidth="3" opacity="0.5" />
              <line x1="540" y1="450" x2="440" y2="290" stroke="#312e81" strokeWidth="3" opacity="0.5" />

              {/* Thermal Hotspot of Potential Survivor */}
              {survivorData.detected && (
                <g transform="translate(370, 190)">
                  {/* Heat Glow Aura */}
                  <circle cx="28" cy="40" r="45" fill="url(#heatBody)" opacity="0.8" />
                  {/* Thermal Head Hotspot */}
                  <circle cx="28" cy="18" r="10" fill="#ffffff" />
                  {/* Thermal Core */}
                  <ellipse cx="28" cy="38" rx="14" ry="18" fill="#fef08a" />
                  <ellipse cx="28" cy="38" rx="10" ry="14" fill="#ffffff" />
                  {/* Extremities */}
                  <path d="M 16 54 Q 10 70 20 74" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 40 54 Q 46 70 36 74" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
                </g>
              )}
            </svg>
          )}

          {feedMode === 'NIGHT_VISION' && (
            <svg className="w-full h-full object-cover" viewBox="0 0 800 450" preserveAspectRatio="none">
              <rect width="800" height="450" fill="#041208" />
              {/* Green phosphor tunnel lines */}
              <polygon points="0,0 800,0 520,170 280,170" fill="#092210" stroke="#10b981" strokeWidth="1" opacity="0.4" />
              <polygon points="0,450 800,450 520,290 280,290" fill="#06180b" stroke="#10b981" strokeWidth="1" opacity="0.4" />
              <line x1="260" y1="450" x2="360" y2="290" stroke="#10b981" strokeWidth="2" opacity="0.7" />
              <line x1="540" y1="450" x2="440" y2="290" stroke="#10b981" strokeWidth="2" opacity="0.7" />

              {/* Props */}
              <path d="M 120 450 L 120 60 L 680 60 L 680 450" fill="none" stroke="#10b981" strokeWidth="10" opacity="0.5" />
              <path d="M 230 380 L 230 120 L 570 120 L 570 380" fill="none" stroke="#10b981" strokeWidth="7" opacity="0.4" />

              {/* Night Vision Silhouette */}
              {survivorData.detected && (
                <g transform="translate(375, 195)">
                  <ellipse cx="25" cy="15" rx="8" ry="9" fill="#061f0d" stroke="#34d399" strokeWidth="1.5" />
                  <path d="M 14 24 L 36 24 L 34 58 L 16 58 Z" fill="#0a2e14" stroke="#34d399" strokeWidth="1.5" />
                  <path d="M 16 58 L 10 75 L 20 78 L 24 60" fill="#061f0d" stroke="#34d399" strokeWidth="1" />
                  <path d="M 34 58 L 40 75 L 30 78 L 26 60" fill="#061f0d" stroke="#34d399" strokeWidth="1" />
                </g>
              )}
            </svg>
          )}

          {/* YOLOv8n Bounding Box Overlay per DOCS/design.md Section 11 */}
          {survivorData.detected && showAiBoxes && (
            <div 
              className="absolute z-30 pointer-events-none transition-all duration-300"
              style={{
                top: '41%',
                left: '46%',
                width: '74px',
                height: '96px',
              }}
            >
              {/* Tactical Corner Bounding Box */}
              <div className="w-full h-full border-2 border-orange-500 rounded-sm relative shadow-lg shadow-orange-500/30">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white"></div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white"></div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white"></div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white"></div>

                {/* YOLO Detection Tag */}
                <div className="absolute -top-6 left-0 bg-orange-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  PERSON {survivorData.yoloConfidence}%
                </div>

                {/* Metadata Tag at Bottom */}
                <div className="absolute -bottom-5 left-0 bg-mine-darkest/90 text-orange-300 border border-orange-600/50 font-mono text-[8px] px-1 py-0.5 rounded whitespace-nowrap flex items-center gap-1">
                  <span>{survivorData.thermalTemp}°C</span>
                  <span>•</span>
                  <span>{survivorData.distance}m</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thermal Palette Legend (Shown in Thermal Mode) */}
        {feedMode === 'THERMAL' && (
          <div className="absolute right-3 bottom-3 z-30 bg-mine-darkest/90 border border-mine-border p-2 rounded text-[10px] font-mono text-white flex flex-col items-center gap-1 shadow-lg">
            <span className="text-rose-400 font-bold">42°C</span>
            <div className="w-3 h-24 rounded bg-gradient-to-t from-[#1e1045] via-[#ef4444] to-[#ffffff] border border-mine-border" />
            <span className="text-blue-400">18°C</span>
          </div>
        )}
      </div>

      {/* Camera Toolbar / Footnote */}
      <div className="bg-mine-card px-3 py-2 border-t border-mine-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Spotlight toggle */}
          <button
            onClick={() => setSpotlightOn(!spotlightOn)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition ${
              spotlightOn
                ? 'bg-amber-950/60 text-amber-300 border-amber-600/70'
                : 'bg-mine-surface text-mine-muted border-mine-border hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>SPOTLIGHT: {spotlightOn ? 'ON' : 'OFF'}</span>
          </button>

          {/* AI Bounding Boxes Toggle */}
          <button
            onClick={() => setShowAiBoxes(!showAiBoxes)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition ${
              showAiBoxes
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-600/70'
                : 'bg-mine-surface text-mine-muted border-mine-border hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>AI OVERLAYS: {showAiBoxes ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-mine-darkest px-2 py-1 rounded border border-mine-border">
            <span className="text-mine-muted text-[11px]">ZOOM:</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.25))}
              className="px-1 text-cyan-400 hover:text-cyan-200 font-bold"
              disabled={zoomLevel <= 1}
            >
              -
            </button>
            <span className="text-white font-bold">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
              className="px-1 text-cyan-400 hover:text-cyan-200 font-bold"
              disabled={zoomLevel >= 2.5}
            >
              +
            </button>
          </div>

          {/* Snapshot Button */}
          <button
            onClick={handleSnapshot}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-mine-surface hover:bg-mine-hover text-mine-subtext hover:text-white border border-mine-border transition"
            title="Capture frame to Mission Evidence Folder"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>SNAPSHOT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
