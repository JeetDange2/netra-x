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
  Radio
} from 'lucide-react';

export const RoverStatusCards = () => {
  const { roverState, routes, approvedRouteId } = useMission();

  // Find active route risk
  const activeRoute = routes.find(r => r.id === approvedRouteId) || routes[1];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Battery Card */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-lg p-3 shadow-sm transition">
        <div className="flex items-center justify-between text-mine-subtext mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Rover Battery</span>
          <Battery className={`w-4 h-4 ${roverState.battery < 25 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-white">{roverState.battery}%</span>
          <span className="text-[10px] font-mono text-mine-muted">{roverState.batteryVoltage}V</span>
        </div>
        <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden mt-2 border border-mine-border/50">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              roverState.battery < 25 ? 'bg-red-500' : roverState.battery < 50 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${roverState.battery}%` }}
          />
        </div>
        <div className="text-[10px] text-mine-subtext font-mono mt-1">Est. 4h 12m runtime</div>
      </div>

      {/* 2. Communication Link */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-lg p-3 shadow-sm transition">
        <div className="flex items-center justify-between text-mine-subtext mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Comm Link</span>
          {roverState.commType === 'WIFI_MESH' ? (
            <Wifi className={`w-4 h-4 ${roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'}`} />
          ) : (
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-white">{roverState.signalStrength}%</span>
          <span className={`text-[10px] font-mono uppercase font-semibold ${
            roverState.commHealth === 'WEAK' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {roverState.commHealth}
          </span>
        </div>
        <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden mt-2 border border-mine-border/50">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              roverState.signalStrength < 30 ? 'bg-red-500' : roverState.signalStrength < 60 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${roverState.signalStrength}%` }}
          />
        </div>
        <div className="text-[10px] text-mine-subtext font-mono mt-1">Latency: {roverState.latency} ms</div>
      </div>

      {/* 3. Rover Speed */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-lg p-3 shadow-sm transition">
        <div className="flex items-center justify-between text-mine-subtext mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Ground Speed</span>
          <Gauge className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-white">{roverState.speed}</span>
          <span className="text-xs font-mono text-mine-subtext">m/s</span>
        </div>
        <div className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Tracks Engaged
        </div>
        <div className="text-[10px] text-mine-subtext font-mono mt-0.5">Differential Track Drive</div>
      </div>

      {/* 4. Distance Travelled */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-lg p-3 shadow-sm transition">
        <div className="flex items-center justify-between text-mine-subtext mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Odometer</span>
          <Milestone className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-white">{roverState.distance}</span>
          <span className="text-xs font-mono text-mine-subtext">m</span>
        </div>
        <div className="text-[10px] text-cyan-300 font-mono mt-2">From Entry Portal</div>
        <div className="text-[10px] text-mine-subtext font-mono mt-0.5">Return Path: 100% Cleared</div>
      </div>

      {/* 5. Operating Mode */}
      <div className="bg-mine-surface border border-mine-border hover:border-mine-borderLight rounded-lg p-3 shadow-sm transition">
        <div className="flex items-center justify-between text-mine-subtext mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Control Mode</span>
          <Cpu className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold font-mono text-white truncate">{roverState.mode}</span>
        </div>
        <div className="text-[10px] font-mono text-cyan-400 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Nav2 + A* Active
        </div>
        <div className="text-[10px] text-mine-subtext font-mono mt-0.5">Semi-Autonomous Assist</div>
      </div>

      {/* 6. Mission Risk Score */}
      <div className={`bg-mine-surface border rounded-lg p-3 shadow-sm transition ${
        activeRoute.totalRisk > 70 
          ? 'border-red-600/70 bg-red-950/20' 
          : activeRoute.totalRisk > 40 
          ? 'border-amber-600/70 bg-amber-950/20' 
          : 'border-emerald-600/60 bg-emerald-950/10'
      }`}>
        <div className="flex items-center justify-between text-mine-subtext mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Mission Risk</span>
          {activeRoute.totalRisk > 50 ? (
            <ShieldAlert className="w-4 h-4 text-red-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-xl font-bold font-mono ${
            activeRoute.totalRisk > 70 ? 'text-red-400' : activeRoute.totalRisk > 40 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {activeRoute.totalRisk}
          </span>
          <span className="text-xs font-mono text-mine-muted">/ 100</span>
          <span className={`text-[10px] font-mono font-bold uppercase ml-auto ${
            activeRoute.totalRisk > 70 ? 'text-red-400' : activeRoute.totalRisk > 40 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {activeRoute.status}
          </span>
        </div>
        <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden mt-2 border border-mine-border/50">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              activeRoute.totalRisk > 70 ? 'bg-red-500' : activeRoute.totalRisk > 40 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${activeRoute.totalRisk}%` }}
          />
        </div>
        <div className="text-[10px] text-mine-subtext font-mono mt-1 truncate">{activeRoute.name}</div>
      </div>
    </div>
  );
};
