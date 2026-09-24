import React from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  Battery, 
  BatteryCharging, 
  Wifi, 
  Gauge, 
  Milestone, 
  Cpu, 
  ShieldCheck, 
  ShieldAlert,
  Radio,
  Compass,
  ArrowUpRight,
  Zap,
  TrendingDown
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const RoverStatusCards = () => {
  const { roverState, routes, approvedRouteId, setActiveTab } = useMission();

  // Active route
  const activeRoute = routes.find(r => r.id === approvedRouteId) || routes[1];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 select-none">
      {/* 1. Battery Card */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-xl p-3 shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-mine-subtext mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Rover Battery</span>
            <Battery className={`w-4 h-4 ${roverState.battery < 25 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{roverState.battery}%</span>
            <span className="text-[11px] font-mono text-mine-muted">{roverState.batteryVoltage}V</span>
          </div>
        </div>

        <div>
          <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden mt-2 border border-mine-border/50">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                roverState.battery < 25 ? 'bg-red-500' : roverState.battery < 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${roverState.battery}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-mine-subtext font-mono mt-1.5">
            <span>Est. 4h 12m</span>
            <span className="text-emerald-400">29°C Cells</span>
          </div>
        </div>
      </div>

      {/* 2. Communication Link */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-xl p-3 shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-mine-subtext mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Telemetry Link</span>
            {roverState.commType === 'WIFI_MESH' ? (
              <Wifi className={`w-4 h-4 ${roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'}`} />
            ) : (
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{roverState.signalStrength}%</span>
            <span className={`text-[10px] font-mono uppercase font-bold ${
              roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {roverState.commHealth}
            </span>
          </div>
        </div>

        <div>
          <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden mt-2 border border-mine-border/50">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                roverState.signalStrength < 30 ? 'bg-red-500' : roverState.signalStrength < 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${roverState.signalStrength}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-mine-subtext font-mono mt-1.5">
            <span>{roverState.latency} ms ping</span>
            <span className="text-cyan-300">0.1% loss</span>
          </div>
        </div>
      </div>

      {/* 3. Rover Speed & Incline Tilt */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-xl p-3 shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-mine-subtext mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Speed &amp; Pitch</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{roverState.speed}</span>
            <span className="text-xs font-mono text-mine-subtext">m/s</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-1 border-t border-mine-border/60">
            <span className="text-mine-muted">INCLINE PITCH:</span>
            <span className="text-amber-300 font-bold">-6.8° Slope</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono mt-0.5">
            <span className="text-mine-muted">ROLL TILT:</span>
            <span className="text-emerald-400 font-bold">1.2° Stable</span>
          </div>
        </div>
      </div>

      {/* 4. Distance Travelled & RTB Buffer */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-xl p-3 shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-mine-subtext mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Odometer</span>
            <Milestone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{roverState.distance}</span>
            <span className="text-xs font-mono text-mine-subtext">m</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-cyan-300 font-mono mt-2 flex items-center justify-between">
            <span>From Portal Alpha</span>
            <span className="text-emerald-400 font-bold">100% Cleared</span>
          </div>
          <div className="text-[10px] text-mine-muted font-mono mt-0.5">
            RTB Buffer: 18% Bat.
          </div>
        </div>
      </div>

      {/* 5. Operating Mode */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-xl p-3 shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-mine-subtext mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Nav Controller</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold font-mono text-white truncate">{roverState.mode}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-cyan-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Nav2 DWB Controller
          </div>
          <div className="text-[10px] text-mine-subtext font-mono mt-0.5 truncate">
            Costmap: 3D SLAM Voxel
          </div>
        </div>
      </div>

      {/* 6. Mission Risk Score */}
      <div 
        onClick={() => {
          soundManager.playClick();
          setActiveTab('planner');
        }}
        className={`border rounded-xl p-3 shadow-md transition cursor-pointer flex flex-col justify-between ${
          activeRoute.totalRisk > 70 
            ? 'border-red-600/70 bg-red-950/30 hover:bg-red-950/50' 
            : activeRoute.totalRisk > 40 
            ? 'border-amber-600/70 bg-amber-950/30 hover:bg-amber-950/50' 
            : 'border-emerald-600/60 bg-emerald-950/20 hover:bg-emerald-950/40'
        }`}
        title="Click to open Risk Planner"
      >
        <div>
          <div className="flex items-center justify-between text-mine-subtext mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Mission Risk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl sm:text-2xl font-bold font-mono ${
              activeRoute.totalRisk > 70 ? 'text-red-400' : activeRoute.totalRisk > 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {activeRoute.totalRisk}
            </span>
            <span className="text-xs font-mono text-mine-muted">/100</span>
            <span className={`text-[10px] font-mono font-bold uppercase ml-auto ${
              activeRoute.totalRisk > 70 ? 'text-red-400' : activeRoute.totalRisk > 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {activeRoute.status}
            </span>
          </div>
        </div>

        <div>
          <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden mt-2 border border-mine-border/50">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                activeRoute.totalRisk > 70 ? 'bg-red-500' : activeRoute.totalRisk > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${activeRoute.totalRisk}%` }}
            />
          </div>
          <div className="text-[10px] text-mine-subtext font-mono mt-1.5 truncate">
            {activeRoute.name}
          </div>
        </div>
      </div>
    </div>
  );
};
