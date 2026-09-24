import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { MineMap3D } from './MineMap3D';
import { 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Flame, 
  Droplets,
  Box,
  Compass
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const MineMap = () => {
  const { roverState, survivorData, approvedRouteId, simulationScenario } = useMission();
  const [mapMode, setMapMode] = useState('3D'); // '3D' | '2D'
  const [zoom, setZoom] = useState(1);
  const [selectedSector, setSelectedSector] = useState(null);
  const [showHazards, setShowHazards] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Mine sectors definitions
  const sectors = [
    {
      id: 'ENTRANCE',
      name: 'Portal Alpha (Mine Entrance)',
      type: 'SAFE',
      description: 'Surface portal & Base Station control link. Telemetry 100% nominal. Surface altitude 0m.',
      ch4: '0.05% LEL',
      temp: '22.4°C',
      depth: '0m (Surface)',
      x: 100,
      y: 350
    },
    {
      id: 'TUNNEL_A',
      name: 'Tunnel A (North Incline)',
      type: simulationScenario === 'GAS_EMERGENCY' ? 'DANGER' : 'WARNING',
      description: simulationScenario === 'GAS_EMERGENCY' 
        ? 'CRITICAL HAZARD: Active methane accumulation (2.58% LEL). Fire & explosion risk.' 
        : 'Moderate ventilation flow. Minor gas accumulation.',
      ch4: simulationScenario === 'GAS_EMERGENCY' ? '2.58% LEL' : '0.98% LEL',
      temp: '31.2°C',
      depth: '-34m',
      x: 350,
      y: 130
    },
    {
      id: 'CROSSCUT_1',
      name: 'Crosscut 1 Junction',
      type: 'SAFE',
      description: 'Reinforced timber corridor. Clean airflow from intake ventilation fan. Strong Wi-Fi Mesh link.',
      ch4: '0.45% LEL',
      temp: '26.1°C',
      depth: '-28m',
      x: 350,
      y: 250
    },
    {
      id: 'TUNNEL_B',
      name: 'Tunnel B (Haulage Gallery)',
      type: survivorData.detected ? 'SURVIVOR_ZONE' : 'SAFE',
      description: 'Exploration target corridor. Track line intact. Potential survivor confirmed at Sector 04.',
      ch4: '0.62% LEL',
      temp: '27.8°C',
      depth: '-32m',
      x: 580,
      y: 250
    },
    {
      id: 'SOUTH_DRIFT',
      name: 'South Drift (Deep Unexplored)',
      type: 'UNEXPLORED',
      description: 'Unmapped gallery. High acoustic reverberation, partial rockfall obstruction, weak RF penetration.',
      ch4: 'UNKNOWN',
      temp: 'UNKNOWN',
      depth: '-55m',
      x: 350,
      y: 380
    }
  ];

  // If in 3D Mode, render the 3D SLAM mapping component
  if (mapMode === '3D') {
    return (
      <MineMap3D 
        onToggle2D={() => {
          soundManager.playClick();
          setMapMode('2D');
        }} 
      />
    );
  }

  // 2D Plan Grid View
  return (
    <div className="bg-mine-surface border border-mine-border rounded-lg overflow-hidden flex flex-col h-full shadow-md font-mono">
      {/* Map Header */}
      <div className="bg-mine-card px-3 py-2 border-b border-mine-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Navigation className="w-3.5 h-3.5" />
            <span>2D OCCUPANCY GRID (SLAM)</span>
          </div>
          <span className="text-mine-muted">|</span>
          <span className="text-emerald-400 font-semibold text-[11px]">RES: 5cm/px</span>
        </div>

        {/* Mode & Layer Toggles */}
        <div className="flex items-center gap-1.5 text-xs">
          {/* Switch to 3D */}
          <button
            onClick={() => {
              soundManager.playClick();
              setMapMode('3D');
            }}
            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 text-[11px] font-bold shadow transition"
            title="Switch to 3D Subterranean LiDAR SLAM Map"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D VIEW</span>
          </button>

          <div className="h-4 w-px bg-mine-border mx-0.5" />

          <button
            onClick={() => setShowHazards(!showHazards)}
            className={`px-2 py-0.5 rounded text-[11px] border transition ${
              showHazards ? 'bg-red-950/60 text-red-300 border-red-800 font-bold' : 'bg-mine-darkest text-mine-muted border-mine-border'
            }`}
          >
            HAZARDS
          </button>
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`px-2 py-0.5 rounded text-[11px] border transition ${
              showRoute ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 font-bold' : 'bg-mine-darkest text-mine-muted border-mine-border'
            }`}
          >
            ROUTE
          </button>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2 py-0.5 rounded text-[11px] border transition ${
              showLabels ? 'bg-mine-hover text-white border-mine-borderLight' : 'bg-mine-darkest text-mine-muted border-mine-border'
            }`}
          >
            LABELS
          </button>
        </div>
      </div>

      {/* Interactive 2D Map Canvas Container */}
      <div className="relative flex-1 min-h-[360px] bg-mine-darkest overflow-hidden flex items-center justify-center select-none grid-crosshair">
        {/* Subtle grid crosshairs background */}
        <div className="tactical-scanlines absolute inset-0 pointer-events-none opacity-40 z-10" />

        {/* SVG SLAM Map */}
        <svg 
          viewBox="0 0 800 500" 
          className="w-full h-full object-contain cursor-crosshair transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            <radialGradient id="gasHazardGrad2D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="waterPoolGrad2D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="survivorBeaconGrad2D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ================= TUNNEL NETWORK ================= */}
          {/* Unexplored South Drift */}
          <path
            d="M 330 310 L 330 460 L 410 460 L 410 310 Z"
            fill="#090e1c"
            stroke="#1b2844"
            strokeWidth="2"
            strokeDasharray="4 4"
            onClick={() => setSelectedSector(sectors[4])}
            className="hover:fill-[#0e162c] cursor-pointer transition"
          />

          {/* Explored Corridors */}
          {/* Corridor: Entrance to Main Junction */}
          <path
            d="M 60 310 L 330 310 L 330 190 L 410 190 L 410 310 L 60 310"
            fill="#0f192f"
            stroke="#1e335a"
            strokeWidth="3"
            onClick={() => setSelectedSector(sectors[0])}
            className="hover:fill-[#142342] cursor-pointer transition"
          />

          {/* Corridor: Main Haulage to Tunnel A (North branch) */}
          <path
            d="M 330 190 L 330 70 L 470 70 L 470 190 Z"
            fill="#121b30"
            stroke="#1e335a"
            strokeWidth="3"
            onClick={() => setSelectedSector(sectors[1])}
            className="hover:fill-[#16233e] cursor-pointer transition"
          />

          {/* Corridor: Crosscut 1 & Tunnel B (East branch) */}
          <path
            d="M 410 210 L 720 210 L 720 290 L 410 290 Z"
            fill="#0f192f"
            stroke="#1e335a"
            strokeWidth="3"
            onClick={() => setSelectedSector(sectors[3])}
            className="hover:fill-[#142342] cursor-pointer transition"
          />

          {/* Submap SLAM Point Clouds (Mock LiDAR dots) */}
          <g opacity="0.4" fill="#38bdf8">
            {Array.from({ length: 45 }).map((_, i) => (
              <circle key={i} cx={120 + (i * 12)} cy={310 + (i % 2 === 0 ? 3 : -3)} r="1.5" />
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <circle key={`t-${i}`} cx={330 + (i % 2 === 0 ? 3 : -3)} cy={80 + (i * 4)} r="1.5" />
            ))}
            {Array.from({ length: 50 }).map((_, i) => (
              <circle key={`b-${i}`} cx={420 + (i * 6)} cy={210 + (i % 2 === 0 ? 3 : -3)} r="1.5" />
            ))}
          </g>

          {/* ================= HAZARD OVERLAYS ================= */}
          {showHazards && (
            <>
              {/* Methane Gas Cloud in Tunnel A */}
              <circle 
                cx="400" 
                cy="130" 
                r={simulationScenario === 'GAS_EMERGENCY' ? "75" : "45"} 
                fill="url(#gasHazardGrad2D)" 
                className="animate-pulse"
              />
              <g transform="translate(385, 120)" className="pointer-events-none">
                <Flame className="w-6 h-6 text-red-400 opacity-90 animate-bounce" />
              </g>

              {/* Water Flooding in Crosscut East */}
              <ellipse cx="640" cy="250" rx="35" ry="20" fill="url(#waterPoolGrad2D)" />
              <g transform="translate(630, 240)" className="pointer-events-none opacity-80">
                <Droplets className="w-5 h-5 text-cyan-400" />
              </g>

              {/* Rubble Obstacle in South Incline */}
              <g transform="translate(360, 390)">
                <polygon points="0,15 15,0 30,12 25,25 5,20" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="20,18 35,5 45,18 35,30" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              </g>
            </>
          )}

          {/* ================= SAFE ROUTE (A* PATH) ================= */}
          {showRoute && (
            <g>
              {/* Recommended Route Line (Route B: Entrance -> Crosscut 1 -> Tunnel B) */}
              <polyline
                points="100,310 370,310 370,250 560,250"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
              {/* Waypoints */}
              <circle cx="100" cy="310" r="4" fill="#10b981" />
              <circle cx="370" cy="310" r="4" fill="#10b981" />
              <circle cx="370" cy="250" r="4" fill="#10b981" />
              <circle cx="560" cy="250" r="4" fill="#10b981" />

              {/* High Risk Route Line (Route A) */}
              {approvedRouteId === 'ROUTE_A' ? (
                <polyline
                  points="100,310 370,310 370,130"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                />
              ) : (
                <polyline
                  points="370,310 370,130"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                />
              )}
            </g>
          )}

          {/* ================= SURVIVOR BEACON ================= */}
          {survivorData.detected && (
            <g transform="translate(610, 250)">
              {/* Pulsing Aura */}
              <circle cx="0" cy="0" r="32" fill="url(#survivorBeaconGrad2D)" className="animate-ping-slow" />
              <circle cx="0" cy="0" r="14" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#f97316" />
              
              {/* Marker Tag */}
              <g transform="translate(-50, -42)">
                <rect width="100" height="24" rx="4" fill="#0b111e" stroke="#ea580c" strokeWidth="1.5" />
                <text x="50" y="16" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  SURVIVOR 96%
                </text>
              </g>
            </g>
          )}

          {/* ================= ROVER MARKER ================= */}
          <g transform="translate(480, 250)">
            <circle cx="0" cy="0" r="28" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" className="animate-spin" />
            <circle cx="0" cy="0" r="18" fill="#0284c7" fillOpacity="0.25" />
            <polygon points="0,-18 10,8 -10,8" fill="#38bdf8" />
            <circle cx="0" cy="0" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />

            <g transform="translate(-40, 20)">
              <rect width="80" height="18" rx="3" fill="#080e1a" stroke="#0284c7" strokeWidth="1" />
              <text x="40" y="13" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                NETRA-X (0.4 m/s)
              </text>
            </g>
          </g>

          {/* ================= LABELS & SECTOR NAMES ================= */}
          {showLabels && (
            <g fontFamily="monospace" fontSize="10" fontWeight="bold">
              <text x="90" y="295" fill="#94a3b8">PORTAL ALPHA</text>
              <text x="320" y="60" fill={simulationScenario === 'GAS_EMERGENCY' ? '#f87171' : '#f59e0b'}>
                TUNNEL A {simulationScenario === 'GAS_EMERGENCY' ? '[CH₄ CRITICAL]' : '[GAS ELEVATED]'}
              </text>
              <text x="385" y="275" fill="#38bdf8">CROSSCUT 1</text>
              <text x="560" y="200" fill="#34d399">TUNNEL B [SECTOR 04]</text>
              <text x="310" y="440" fill="#64748b">SOUTH DRIFT [UNEXPLORED]</text>
            </g>
          )}
        </svg>

        {/* Map Legend Overlay */}
        <div className="absolute left-3 bottom-3 bg-mine-darkest/95 border border-mine-border p-2.5 rounded-lg text-[10px] space-y-1.5 z-20 shadow-xl pointer-events-auto">
          <div className="text-mine-muted uppercase tracking-wider text-[9px] font-bold border-b border-mine-border pb-1">
            2D Map Legend
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
            <span>Rover Position (NETRA-X)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-4 h-1 rounded bg-emerald-400"></div>
            <span>Recommended Safe Route (A*)</span>
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <span>Hazard Zone (Gas &gt; 2%)</span>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
            <span>Potential Survivor Location</span>
          </div>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute right-3 top-3 bg-mine-darkest/90 border border-mine-border rounded-lg p-1 flex flex-col gap-1 z-20 shadow-md">
          <button
            onClick={() => setZoom(prev => Math.min(2.0, prev + 0.2))}
            className="p-1 text-cyan-400 hover:text-cyan-200 hover:bg-mine-card rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.8, prev - 0.2))}
            className="p-1 text-cyan-400 hover:text-cyan-200 hover:bg-mine-card rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 text-mine-muted hover:text-white hover:bg-mine-card rounded transition"
            title="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Sector Inspector Modal */}
        {selectedSector && (
          <div className="absolute right-3 bottom-3 max-w-xs bg-mine-surface border border-cyan-500/50 rounded-lg p-3 z-30 text-xs shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-mine-border pb-1">
              <span className="font-bold text-white">{selectedSector.name}</span>
              <button 
                onClick={() => setSelectedSector(null)}
                className="text-mine-muted hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-mine-subtext text-[11px] leading-relaxed">
              {selectedSector.description}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
              <div className="bg-mine-darkest p-1.5 rounded border border-mine-border">
                <span className="text-mine-muted">Gas Level:</span>
                <div className={`font-bold ${selectedSector.type === 'DANGER' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedSector.ch4}
                </div>
              </div>
              <div className="bg-mine-darkest p-1.5 rounded border border-mine-border">
                <span className="text-mine-muted">Depth:</span>
                <div className="font-bold text-cyan-300">{selectedSector.depth}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Bar */}
      <div className="bg-mine-card px-3 py-1.5 border-t border-mine-border flex items-center justify-between text-[11px] text-mine-subtext">
        <div className="flex items-center gap-3">
          <span>ROVER POSE: <strong>X: {roverState.x.toFixed(1)}m, Y: {roverState.y.toFixed(1)}m</strong></span>
          <span>•</span>
          <span>DEPTH: <strong>-30.5m</strong></span>
        </div>
        <div className="text-cyan-400">
          ODOMETRY: LIDAR + WHEEL FUSION (SLAM TOOLBOX)
        </div>
      </div>
    </div>
  );
};
