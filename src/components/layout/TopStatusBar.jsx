import React, { useState, useEffect, useRef } from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  AlertOctagon, 
  Wifi, 
  Radio, 
  Clock, 
  Flame, 
  UserCheck, 
  RotateCcw, 
  AlertTriangle,
  Play,
  Sliders,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Layers,
  Shield,
  Activity,
  Compass
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const TopStatusBar = () => {
  const {
    missionTime,
    missionStatus,
    roverState,
    simulationScenario,
    isEmergencyStopped,
    triggerGasEmergency,
    triggerSurvivorDetection,
    triggerStuckRover,
    triggerCommLoss,
    resetSimulation,
    triggerEmergencyStop,
    resumeFromEmergencyStop,
  } = useMission();

  const [showSimMenu, setShowSimMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const simMenuRef = useRef(null);

  // Close sim dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (simMenuRef.current && !simMenuRef.current.contains(event.target)) {
        setShowSimMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) soundManager.playClick();
  };

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Format seconds into HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <header className="bg-mine-surface border-b border-mine-border px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-40 shadow-lg select-none">
      {/* Brand & Mission Identification */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-900 border border-cyan-400/40 shadow-lg shadow-cyan-950/50">
          <span className="font-mono font-black text-base sm:text-lg text-white tracking-tighter">NX</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-white flex items-center gap-1.5 font-mono">
              NETRA-X
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 shadow-sm">
                SURFACE COMMAND
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-mine-subtext font-mono">
            <span>MISSION: <strong className="text-cyan-300">SEARCH-RESCUE-01</strong></span>
            <span className="text-mine-muted">•</span>
            <span className="flex items-center gap-1">
              STATUS: 
              <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] sm:text-[11px] ${
                isEmergencyStopped 
                  ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' 
                  : simulationScenario === 'GAS_EMERGENCY'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
              }`}>
                {isEmergencyStopped ? 'E-STOPPED' : simulationScenario === 'GAS_EMERGENCY' ? 'GAS HAZARD' : 'ACTIVE PATROL'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Center Mission Stats */}
      <div className="hidden lg:flex items-center gap-4 xl:gap-6 font-mono text-xs bg-mine-darkest/75 px-3.5 py-1.5 rounded-lg border border-mine-border/90 shadow-inner">
        {/* Mission Clock */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-mine-muted text-[11px]">TIME:</span>
          <span className="text-white font-bold text-sm tracking-wider">{formatTime(missionTime)}</span>
        </div>

        <div className="h-4 w-px bg-mine-border" />

        {/* Comms Link */}
        <div className="flex items-center gap-2">
          {roverState.commType === 'WIFI_MESH' ? (
            <Wifi className={`w-3.5 h-3.5 ${roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'}`} />
          ) : (
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          )}
          <span className="text-mine-muted text-[11px]">LINK:</span>
          <span className={`font-semibold ${roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {roverState.commType === 'WIFI_MESH' ? '5.8GHz MESH' : 'LoRa 868MHz (FALLBACK)'}
          </span>
          <span className="text-mine-muted text-[10px]">({roverState.latency}ms)</span>
        </div>

        <div className="h-4 w-px bg-mine-border" />

        {/* Depth & Zone */}
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-mine-muted text-[11px]">DEPTH:</span>
          <span className="text-cyan-300 font-bold">-30.5m</span>
          <span className="text-mine-muted text-[10px]">({roverState.currentSector})</span>
        </div>
      </div>

      {/* Right Controls: Sound, Fullscreen, Simulation Suite & Emergency Stop */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          className={`p-1.5 sm:p-2 rounded-lg border transition ${
            isMuted 
              ? 'bg-mine-darkest text-mine-muted border-mine-border' 
              : 'bg-mine-card hover:bg-mine-hover text-cyan-400 border-mine-border'
          }`}
          title={isMuted ? 'Unmute Tactical Audio Alerts' : 'Mute Audio Alerts'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-1.5 sm:p-2 rounded-lg bg-mine-card hover:bg-mine-hover text-mine-subtext hover:text-white border border-mine-border transition"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Simulation Controls Toggle / Dropdown */}
        <div className="relative" ref={simMenuRef}>
          <button
            onClick={() => {
              soundManager.playClick();
              setShowSimMenu(!showSimMenu);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all border shadow-sm ${
              simulationScenario !== 'NOMINAL'
                ? 'bg-amber-950/80 text-amber-300 border-amber-600/80 shadow-amber-950/40 animate-pulse'
                : 'bg-mine-card hover:bg-mine-hover text-mine-subtext hover:text-white border-mine-border'
            }`}
            title="Open Mission Simulation Triggers"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">SIM:</span>
            <strong className="text-white text-[11px] sm:text-xs">{simulationScenario}</strong>
          </button>

          {showSimMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-mine-surface border border-mine-borderLight rounded-xl shadow-2xl p-3 z-50 font-mono text-xs space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between pb-1.5 border-b border-mine-border">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Mission Scenario Sandbox
                </span>
                <span className="text-[10px] text-mine-muted">SIH 2026 AUDIT DEMO</span>
              </div>
              
              <button
                onClick={() => { 
                  soundManager.playCriticalAlert(); 
                  triggerGasEmergency(); 
                  setShowSimMenu(false); 
                }}
                className="w-full text-left p-2 rounded-lg bg-red-950/30 hover:bg-red-950/70 text-red-200 border border-red-900/40 hover:border-red-600 flex items-center gap-2.5 transition"
              >
                <div className="p-1.5 rounded bg-red-950 border border-red-800 text-red-400 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-red-300 text-xs">1. Methane Gas Outbreak</div>
                  <div className="text-[10px] text-mine-subtext">Spikes CH₄ &gt;2.5% in Tunnel A; triggers 3D hazard volume &amp; auto-reroutes</div>
                </div>
              </button>

              <button
                onClick={() => { 
                  soundManager.playSurvivorPing(); 
                  triggerSurvivorDetection(); 
                  setShowSimMenu(false); 
                }}
                className="w-full text-left p-2 rounded-lg bg-orange-950/30 hover:bg-orange-950/70 text-orange-200 border border-orange-900/40 hover:border-orange-600 flex items-center gap-2.5 transition"
              >
                <div className="p-1.5 rounded bg-orange-950 border border-orange-800 text-orange-400 shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-orange-300 text-xs">2. Survivor Detection Match</div>
                  <div className="text-[10px] text-mine-subtext">YOLO Person (94%) + 37.1°C FLIR thermal hotspot in Sector 04</div>
                </div>
              </button>

              <button
                onClick={() => { 
                  soundManager.playClick(); 
                  triggerStuckRover(); 
                  setShowSimMenu(false); 
                }}
                className="w-full text-left p-2 rounded-lg bg-amber-950/30 hover:bg-amber-950/70 text-amber-200 border border-amber-900/40 hover:border-amber-600 flex items-center gap-2.5 transition"
              >
                <div className="p-1.5 rounded bg-amber-950 border border-amber-800 text-amber-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-amber-300 text-xs">3. Mobility Stall &amp; Self-Recovery</div>
                  <div className="text-[10px] text-mine-subtext">Executes autonomous 5-step reverse, pivot, and costmap bypass</div>
                </div>
              </button>

              <button
                onClick={() => { 
                  soundManager.playClick(); 
                  triggerCommLoss(); 
                  setShowSimMenu(false); 
                }}
                className="w-full text-left p-2 rounded-lg bg-yellow-950/30 hover:bg-yellow-950/70 text-yellow-200 border border-yellow-900/40 hover:border-yellow-600 flex items-center gap-2.5 transition"
              >
                <div className="p-1.5 rounded bg-yellow-950 border border-yellow-800 text-yellow-400 shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-yellow-300 text-xs">4. Wi-Fi Loss → LoRa Fallback</div>
                  <div className="text-[10px] text-mine-subtext">Degrades Wi-Fi; rover falls back to sub-GHz LoRa telemetry</div>
                </div>
              </button>

              <div className="pt-1.5 border-t border-mine-border">
                <button
                  onClick={() => { 
                    soundManager.playSuccess(); 
                    resetSimulation(); 
                    setShowSimMenu(false); 
                  }}
                  className="w-full text-center py-1.5 rounded-lg bg-mine-card hover:bg-cyan-950 hover:text-cyan-300 text-mine-subtext border border-mine-border flex items-center justify-center gap-1.5 transition text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All to Nominal Baseline</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Stop Button */}
        {isEmergencyStopped ? (
          <button
            onClick={() => {
              soundManager.playSuccess();
              resumeFromEmergencyStop();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-emerald-950/50 border border-emerald-400 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RESUME</span>
          </button>
        ) : (
          <button
            onClick={() => {
              soundManager.playCriticalAlert();
              triggerEmergencyStop();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-red-950/50 border border-red-400 transition animate-pulse"
            title="Immediate Hardware Cut-Off"
          >
            <AlertOctagon className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">EMERGENCY STOP</span>
            <span className="sm:hidden">E-STOP</span>
          </button>
        )}
      </div>
    </header>
  );
};
