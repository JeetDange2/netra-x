import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  RotateCw, 
  Sliders,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const RiskPlanner = () => {
  const { 
    routes, 
    selectedRouteId, 
    setSelectedRouteId, 
    approvedRouteId, 
    setApprovedRouteId,
    addLog
  } = useMission();

  const [customWeights, setCustomWeights] = useState({
    gas: 35,
    obstacle: 20,
    comm: 15,
    env: 15,
    energy: 15
  });

  const [showConfig, setShowConfig] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[1];

  const handleApprove = (routeId) => {
    setApprovedRouteId(routeId);
    const r = routes.find(rt => rt.id === routeId);
    addLog('NAVIGATION', `Operator approved path: ${r.name} (Risk score: ${r.totalRisk}/100)`);
  };

  const handleRecalculate = () => {
    setRecalculating(true);
    addLog('NAVIGATION', 'Mission planner dynamic re-evaluation triggered across all candidate paths.');
    setTimeout(() => {
      setRecalculating(false);
    }, 800);
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-lg p-3 shadow-md flex flex-col gap-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Risk-Aware Mission Planner &amp; Route Evaluator
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-mine-card hover:bg-mine-hover border border-mine-border text-mine-subtext hover:text-white transition"
          >
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
            <span>Risk Weights</span>
          </button>
          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
          >
            <RotateCw className={`w-3 h-3 ${recalculating ? 'animate-spin' : ''}`} />
            <span>{recalculating ? 'Computing...' : 'Recalculate'}</span>
          </button>
        </div>
      </div>

      {/* Config Weights Drawer if open */}
      {showConfig && (
        <div className="p-2.5 bg-mine-darkest rounded-lg border border-mine-border text-xs space-y-2">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            Configurable Mission Risk Weight Coefficients (rules.md Section 4.13)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
            <div>
              <span className="text-mine-muted">Gas Risk (35%):</span>
              <input type="range" min="10" max="60" value={customWeights.gas} readOnly className="w-full h-1 bg-mine-border rounded" />
              <span className="text-cyan-300 font-bold">{customWeights.gas}%</span>
            </div>
            <div>
              <span className="text-mine-muted">Obstacle (20%):</span>
              <input type="range" min="10" max="40" value={customWeights.obstacle} readOnly className="w-full h-1 bg-mine-border rounded" />
              <span className="text-cyan-300 font-bold">{customWeights.obstacle}%</span>
            </div>
            <div>
              <span className="text-mine-muted">Comms Link (15%):</span>
              <input type="range" min="5" max="30" value={customWeights.comm} readOnly className="w-full h-1 bg-mine-border rounded" />
              <span className="text-cyan-300 font-bold">{customWeights.comm}%</span>
            </div>
            <div>
              <span className="text-mine-muted">Environment (15%):</span>
              <input type="range" min="5" max="30" value={customWeights.env} readOnly className="w-full h-1 bg-mine-border rounded" />
              <span className="text-cyan-300 font-bold">{customWeights.env}%</span>
            </div>
            <div>
              <span className="text-mine-muted">Energy Return (15%):</span>
              <input type="range" min="5" max="30" value={customWeights.energy} readOnly className="w-full h-1 bg-mine-border rounded" />
              <span className="text-cyan-300 font-bold">{customWeights.energy}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Routes Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isApproved = approvedRouteId === route.id;
          const isHighRisk = route.totalRisk > 70;
          const isLowRisk = route.totalRisk <= 35;

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`border rounded-lg p-3 flex flex-col justify-between cursor-pointer transition relative ${
                isSelected 
                  ? 'border-cyan-500 bg-mine-card ring-1 ring-cyan-500/40 shadow-lg' 
                  : 'border-mine-border bg-mine-card/60 hover:bg-mine-card hover:border-mine-borderLight'
              }`}
            >
              {/* Recommended Badge / Approved Badge */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">{route.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  {route.isRecommended && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                      RECOMMENDED
                    </span>
                  )}
                  {isApproved && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Waypoint description */}
              <div className="text-[11px] text-mine-muted mb-2">{route.via} ({route.distance}m)</div>

              {/* Risk Score Gauge */}
              <div className="bg-mine-darkest/80 p-2 rounded border border-mine-border mb-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-mine-muted uppercase">Mission Risk Score:</span>
                  <span className={`text-base font-black ${
                    isHighRisk ? 'text-red-400' : isLowRisk ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {route.totalRisk} <span className="text-[10px] font-normal text-mine-muted">/ 100</span>
                  </span>
                </div>

                <div className="w-full bg-mine-surface h-1.5 rounded-full overflow-hidden mt-1 border border-mine-border/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isHighRisk ? 'bg-red-500' : isLowRisk ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${route.totalRisk}%` }}
                  />
                </div>
              </div>

              {/* Detailed Breakdown Bars */}
              <div className="space-y-1 text-[10px] text-mine-subtext border-t border-mine-border pt-2">
                <div className="flex justify-between">
                  <span>Gas Risk:</span>
                  <span className={`font-semibold ${route.gasRisk > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {route.gasRisk}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Obstacle Risk:</span>
                  <span className={`font-semibold ${route.obstacleRisk > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {route.obstacleRisk}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>RF Comm Link:</span>
                  <span className={`font-semibold ${route.commRisk > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {route.commRisk}%
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-mine-muted italic leading-snug">
                {route.details}
              </div>

              {/* Action Buttons in card */}
              <div className="mt-3 pt-2 border-t border-mine-border flex items-center gap-2">
                {isApproved ? (
                  <div className="w-full py-1 text-center text-[10px] font-bold text-emerald-400 bg-emerald-950/50 rounded border border-emerald-800 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>APPROVED ROUTE</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(route.id);
                    }}
                    className={`w-full py-1 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 border ${
                      isHighRisk
                        ? 'bg-red-950/70 hover:bg-red-900 text-red-300 border-red-800'
                        : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    <span>{isHighRisk ? 'OVERRIDE & SELECT' : 'APPROVE ROUTE'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Human In The Loop Principle Statement per rules.md Section 2.4 */}
      <div className="bg-mine-darkest/60 border border-mine-border rounded-lg p-2.5 text-[11px] text-mine-muted flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Human-in-the-Loop Safe Architecture:</strong> The rover uses deterministic A* costmaps with sensor weightings. Autonomous suggestions can be verified or manually overridden by the surface incident commander before rover entry into critical zones.
        </div>
      </div>
    </div>
  );
};
