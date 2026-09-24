import React, { useState, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  Gamepad2, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Square, 
  RotateCcw, 
  AlertOctagon, 
  Play,
  RotateCw,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const RoverControls = () => {
  const { 
    roverState, 
    setRoverState, 
    handleDrive, 
    triggerReturnToBase, 
    triggerEmergencyStop,
    resumeFromEmergencyStop,
    isEmergencyStopped,
    recoveryState 
  } = useMission();

  const [targetSpeed, setTargetSpeed] = useState(0.42);
  const [activeDirection, setActiveDirection] = useState(null);

  // Keyboard driving controls when in MANUAL mode
  useEffect(() => {
    if (roverState.mode !== 'MANUAL') return;

    const handleKeyDown = (e) => {
      let dir = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dir = 'FORWARD';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dir = 'REVERSE';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dir = 'LEFT';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dir = 'RIGHT';
      else if (e.key === ' ') dir = 'STOP';

      if (dir) {
        e.preventDefault();
        setActiveDirection(dir);
        handleDrive(dir);
        soundManager.playClick();

        // Increment position in manual mode
        setRoverState(prev => {
          let nx = prev.x;
          let ny = prev.y;
          let nh = prev.heading;
          if (dir === 'FORWARD') nx = Math.min(85, prev.x + 0.3);
          if (dir === 'REVERSE') nx = Math.max(10, prev.x - 0.3);
          if (dir === 'LEFT') nh = (prev.heading - 5 + 360) % 360;
          if (dir === 'RIGHT') nh = (prev.heading + 5) % 360;
          return { ...prev, x: nx, y: ny, heading: nh, speed: dir === 'STOP' ? 0 : targetSpeed };
        });
      }
    };

    const handleKeyUp = () => {
      setActiveDirection(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [roverState.mode, handleDrive, targetSpeed, setRoverState]);

  const setMode = (mode) => {
    soundManager.playClick();
    setRoverState(prev => ({ ...prev, mode }));
  };

  const triggerDirectionalDrive = (dir) => {
    soundManager.playClick();
    setActiveDirection(dir);
    handleDrive(dir);
    setRoverState(prev => {
      let nx = prev.x;
      let ny = prev.y;
      let nh = prev.heading;
      if (dir === 'FORWARD') nx = Math.min(85, prev.x + 0.4);
      if (dir === 'REVERSE') nx = Math.max(10, prev.x - 0.4);
      if (dir === 'LEFT') nh = (prev.heading - 8 + 360) % 360;
      if (dir === 'RIGHT') nh = (prev.heading + 8) % 360;
      return { ...prev, x: nx, y: ny, heading: nh, speed: dir === 'STOP' ? 0 : targetSpeed };
    });
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-3 sm:p-4 shadow-md flex flex-col gap-3 font-mono select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Teleoperation Deck &amp; Drive Actuators
          </h2>
        </div>

        {/* Operating Mode Buttons */}
        <div className="flex items-center bg-mine-darkest p-0.5 rounded-lg border border-mine-border text-xs">
          <button
            onClick={() => setMode('AUTONOMOUS')}
            className={`px-3 py-1 rounded-md transition ${
              roverState.mode === 'AUTONOMOUS' 
                ? 'bg-cyan-600 text-white font-bold shadow' 
                : 'text-mine-subtext hover:text-white'
            }`}
          >
            AUTONOMOUS
          </button>
          <button
            onClick={() => setMode('ASSISTED')}
            className={`px-3 py-1 rounded-md transition ${
              roverState.mode === 'ASSISTED' 
                ? 'bg-amber-600 text-white font-bold shadow' 
                : 'text-mine-subtext hover:text-white'
            }`}
          >
            ASSISTED
          </button>
          <button
            onClick={() => setMode('MANUAL')}
            className={`px-3 py-1 rounded-md transition ${
              roverState.mode === 'MANUAL' 
                ? 'bg-rose-600 text-white font-bold shadow' 
                : 'text-mine-subtext hover:text-white'
            }`}
          >
            MANUAL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Direction Pad Column */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-3 flex flex-col items-center justify-between">
          <div className="text-[11px] text-mine-muted uppercase tracking-wider mb-2 flex items-center justify-between w-full">
            <span>Directional Pad</span>
            <span className={roverState.mode === 'MANUAL' ? 'text-emerald-400 font-bold' : 'text-mine-muted'}>
              {roverState.mode === 'MANUAL' ? 'ENABLED (W/A/S/D)' : 'DISABLED IN AUTO'}
            </span>
          </div>

          {/* D-Pad Buttons */}
          <div className="grid grid-cols-3 gap-2 w-48 my-2">
            <div></div>
            <button
              disabled={roverState.mode !== 'MANUAL' || isEmergencyStopped}
              onMouseDown={() => triggerDirectionalDrive('FORWARD')}
              onMouseUp={() => setActiveDirection(null)}
              className={`h-12 rounded-xl border flex items-center justify-center transition font-bold shadow ${
                activeDirection === 'FORWARD'
                  ? 'bg-cyan-600 text-white border-cyan-400'
                  : 'bg-mine-surface hover:bg-mine-hover text-white border-mine-border disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
              title="Drive Forward (W or Up Arrow)"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div></div>

            <button
              disabled={roverState.mode !== 'MANUAL' || isEmergencyStopped}
              onMouseDown={() => triggerDirectionalDrive('LEFT')}
              onMouseUp={() => setActiveDirection(null)}
              className={`h-12 rounded-xl border flex items-center justify-center transition font-bold shadow ${
                activeDirection === 'LEFT'
                  ? 'bg-cyan-600 text-white border-cyan-400'
                  : 'bg-mine-surface hover:bg-mine-hover text-white border-mine-border disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
              title="Pivot Left (A or Left Arrow)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              disabled={roverState.mode !== 'MANUAL' || isEmergencyStopped}
              onClick={() => triggerDirectionalDrive('STOP')}
              className="h-12 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 flex items-center justify-center transition font-bold shadow disabled:opacity-40 disabled:cursor-not-allowed"
              title="Halt Motors (Spacebar)"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            <button
              disabled={roverState.mode !== 'MANUAL' || isEmergencyStopped}
              onMouseDown={() => triggerDirectionalDrive('RIGHT')}
              onMouseUp={() => setActiveDirection(null)}
              className={`h-12 rounded-xl border flex items-center justify-center transition font-bold shadow ${
                activeDirection === 'RIGHT'
                  ? 'bg-cyan-600 text-white border-cyan-400'
                  : 'bg-mine-surface hover:bg-mine-hover text-white border-mine-border disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
              title="Pivot Right (D or Right Arrow)"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div></div>
            <button
              disabled={roverState.mode !== 'MANUAL' || isEmergencyStopped}
              onMouseDown={() => triggerDirectionalDrive('REVERSE')}
              onMouseUp={() => setActiveDirection(null)}
              className={`h-12 rounded-xl border flex items-center justify-center transition font-bold shadow ${
                activeDirection === 'REVERSE'
                  ? 'bg-cyan-600 text-white border-cyan-400'
                  : 'bg-mine-surface hover:bg-mine-hover text-white border-mine-border disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
              title="Reverse (S or Down Arrow)"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <div></div>
          </div>

          <div className="text-[10px] text-mine-muted text-center">
            {roverState.mode === 'MANUAL' ? 'Hold button or use keyboard keys' : 'Switch mode to MANUAL to steer'}
          </div>
        </div>

        {/* Speed Throttle Governor & Mission Actions */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-3 flex flex-col justify-between">
          <div>
            <div className="text-[11px] text-mine-muted uppercase tracking-wider mb-2">
              Throttle Speed Governor
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-mine-subtext">MAX TARGET SPEED:</span>
                <span className="text-cyan-400 font-bold text-sm">{targetSpeed} m/s</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.2"
                step="0.05"
                value={targetSpeed}
                onChange={(e) => setTargetSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-mine-darkest rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-mine-muted">
                <span>0.1 m/s (Crawl)</span>
                <span>0.6 m/s (Patrol)</span>
                <span>1.2 m/s (Dash)</span>
              </div>
            </div>

            {/* Motor Currents */}
            <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-mine-border text-[10px]">
              <div className="bg-mine-darkest p-1.5 rounded border border-mine-border">
                <span className="text-mine-muted">Track Left:</span>
                <div className="font-bold text-emerald-400">2.4 A (Nominal)</div>
              </div>
              <div className="bg-mine-darkest p-1.5 rounded border border-mine-border">
                <span className="text-mine-muted">Track Right:</span>
                <div className="font-bold text-emerald-400">2.6 A (Nominal)</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-3 border-t border-mine-border">
            <button
              onClick={() => {
                soundManager.playSuccess();
                triggerReturnToBase();
              }}
              className="w-full py-2 rounded-lg bg-mine-surface hover:bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center gap-2 transition text-xs font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RETURN TO BASE (RTB)</span>
            </button>

            {isEmergencyStopped ? (
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  resumeFromEmergencyStop();
                }}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 flex items-center justify-center gap-2 transition text-xs font-bold"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RELEASE EMERGENCY STOP</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playCriticalAlert();
                  triggerEmergencyStop();
                }}
                className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white border border-red-400 flex items-center justify-center gap-2 transition text-xs font-bold shadow-lg shadow-red-950/50 animate-pulse"
              >
                <AlertOctagon className="w-4 h-4 fill-current" />
                <span>EMERGENCY STOP (FAIL-SAFE)</span>
              </button>
            )}
          </div>
        </div>

        {/* Stuck Rover Autonomous Self-Recovery Monitor */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-mine-muted uppercase tracking-wider mb-2">
              <span>Autonomous Self-Recovery</span>
              {recoveryState.isStuck ? (
                <span className="text-[10px] text-amber-400 font-bold animate-pulse">RECOVERY RUNNING</span>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">NOMINAL TRACTION</span>
              )}
            </div>

            {/* 5-Step Progress */}
            <div className="space-y-1.5 text-[11px]">
              {[
                { step: 1, name: '1. Stop Motors (Halt wheel spin)' },
                { step: 2, name: '2. Reverse Tracks (0.2 m/s backoff)' },
                { step: 3, name: '3. Change Direction (Pivot 35°)' },
                { step: 4, name: '4. Re-plan Route (Costmap refresh)' },
                { step: 5, name: '5. Resume Navigation' }
              ].map((s) => {
                const isCurrent = recoveryState.step === s.step;
                const isPassed = recoveryState.step > s.step;
                return (
                  <div 
                    key={s.step} 
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition ${
                      isCurrent 
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-bold shadow-sm' 
                        : isPassed 
                        ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400' 
                        : 'bg-mine-darkest border-transparent text-mine-muted'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current shrink-0" />
                    <span>{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2.5 text-[10px] text-mine-subtext font-mono border-t border-mine-border pt-2 leading-relaxed">
            Status: <span className="text-white font-semibold">{recoveryState.stepDescription}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
