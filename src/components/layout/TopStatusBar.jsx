import React, { useState } from 'react';
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
  Pause,
  Sliders
} from 'lucide-react';

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

  // Format seconds into HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <header className="bg-mine-surface border-b border-mine-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-md">
      {/* Brand & Mission Identification */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-800 border border-cyan-400/40 shadow-lg shadow-cyan-900/30">
          <span className="font-mono font-black text-lg text-white tracking-tighter">NX</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-wider text-white flex items-center gap-1.5 font-mono">
              NETRA-X
              <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                SURFACE COMMAND
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-mine-subtext font-mono">
            <span>MISSION: <strong className="text-cyan-300">RESCUE-01</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              STATUS: 
              <span className={`px-1.5 py-0.2 rounded font-bold ${
                isEmergencyStopped 
                  ? 'bg-red-950 text-red-400 border border-red-800' 
                  : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
              }`}>
                {isEmergencyStopped ? 'E-STOPPED' : 'MISSION ACTIVE'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Center Mission Stats */}
      <div className="hidden lg:flex items-center gap-6 font-mono text-xs bg-mine-darkest/60 px-4 py-1.5 rounded-lg border border-mine-border/80">
        {/* Mission Clock */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-mine-muted">MISSION TIME:</span>
          <span className="text-white font-bold text-sm tracking-wider">{formatTime(missionTime)}</span>
        </div>

        <div className="h-4 w-px bg-mine-border" />

        {/* Comms Link */}
        <div className="flex items-center gap-2">
          {roverState.commType === 'WIFI_MESH' ? (
            <Wifi className={`w-4 h-4 ${roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'}`} />
          ) : (
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          )}
          <span className="text-mine-muted">LINK:</span>
          <span className={`font-semibold ${roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {roverState.commType === 'WIFI_MESH' ? '5.8GHz MESH' : 'LoRa 868MHz (FALLBACK)'}
          </span>
          <span className="text-mine-subtext">({roverState.latency}ms)</span>
        </div>

        <div className="h-4 w-px bg-mine-border" />

        {/* Sector */}
        <div className="flex items-center gap-2">
          <span className="text-mine-muted">ZONE:</span>
          <span className="text-cyan-300 font-medium">{roverState.currentSector}</span>
        </div>
      </div>

      {/* Right Controls: Simulation Suite & Emergency Stop */}
      <div className="flex items-center gap-2.5">
        {/* Simulation Controls Toggle / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSimMenu(!showSimMenu)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all border ${
              simulationScenario !== 'NOMINAL'
                ? 'bg-amber-950/60 text-amber-300 border-amber-600/60 animate-pulse'
                : 'bg-mine-card hover:bg-mine-hover text-mine-subtext hover:text-white border-mine-border'
            }`}
            title="Open Mission Simulation Triggers"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>SIMULATION: <strong className="text-white">{simulationScenario}</strong></span>
          </button>

          {showSimMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-mine-surface border border-mine-borderLight rounded-lg shadow-2xl p-2.5 z-50 font-mono text-xs space-y-1.5">
              <div className="text-[11px] font-semibold text-mine-muted uppercase tracking-wider pb-1 border-b border-mine-border">
                Demo Scenario Triggers
              </div>
              
              <button
                onClick={() => { triggerGasEmergency(); setShowSimMenu(false); }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-red-950/50 hover:text-red-300 border border-transparent hover:border-red-800/60 flex items-center gap-2 transition"
              >
                <Flame className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <div className="font-bold text-red-400">1. Gas Leak Emergency</div>
                  <div className="text-[10px] text-mine-muted">Spikes CH₄ &gt; 2.5%, re-plans route</div>
                </div>
              </button>

              <button
                onClick={() => { triggerSurvivorDetection(); setShowSimMenu(false); }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-orange-950/50 hover:text-orange-300 border border-transparent hover:border-orange-800/60 flex items-center gap-2 transition"
              >
                <UserCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <div className="font-bold text-orange-400">2. Survivor Detection</div>
                  <div className="text-[10px] text-mine-muted">YOLO + Thermal 36.8°C match</div>
                </div>
              </button>

              <button
                onClick={() => { triggerStuckRover(); setShowSimMenu(false); }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-amber-950/50 hover:text-amber-300 border border-transparent hover:border-amber-800/60 flex items-center gap-2 transition"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-amber-400">3. Stuck Rover Recovery</div>
                  <div className="text-[10px] text-mine-muted">Runs 5-step self-recovery logic</div>
                </div>
              </button>

              <button
                onClick={() => { triggerCommLoss(); setShowSimMenu(false); }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-yellow-950/50 hover:text-yellow-300 border border-transparent hover:border-yellow-800/60 flex items-center gap-2 transition"
              >
                <Radio className="w-4 h-4 text-yellow-400 shrink-0" />
                <div>
                  <div className="font-bold text-yellow-400">4. Weak Comms Fallback</div>
                  <div className="text-[10px] text-mine-muted">Simulate LoRa telemetry fallback</div>
                </div>
              </button>

              <div className="pt-1 border-t border-mine-border">
                <button
                  onClick={() => { resetSimulation(); setShowSimMenu(false); }}
                  className="w-full text-center px-2.5 py-1.5 rounded bg-mine-card hover:bg-cyan-950 hover:text-cyan-300 text-mine-subtext border border-mine-border flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Baseline (Nominal)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Stop Button (Always visible per design.md Section 6) */}
        {isEmergencyStopped ? (
          <button
            onClick={resumeFromEmergencyStop}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-md shadow-lg shadow-emerald-900/40 border border-emerald-400 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME MISSION</span>
          </button>
        ) : (
          <button
            onClick={triggerEmergencyStop}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-md shadow-lg shadow-red-900/50 border border-red-400 transition animate-pulse"
            title="Immediate Fail-Safe Rover Halt"
          >
            <AlertOctagon className="w-4 h-4 fill-current" />
            <span>EMERGENCY STOP</span>
          </button>
        )}
      </div>
    </header>
  );
};
