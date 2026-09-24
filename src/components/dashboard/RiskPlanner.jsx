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
  SlidersHorizontal,
  ChevronRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const RiskPlanner = () => {
  const { 
    routes, 
    selectedRouteId, 
    setSelectedRouteId, 
    approvedRouteId, 
    setApprovedRouteId,
    addLog
  } = useMission();

  // Fully interactive Risk Weights
  const [weights, setWeights] = useState({
    gas: 35,
    obstacle: 20,
    comm: 15,
    env: 15,
    energy: 15
  });

  const [showConfig, setShowConfig] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  // Apply custom weights calculation dynamically
  const calculateDynamicRisk = (route) => {
    const totalW = weights.gas + weights.obstacle + weights.comm + weights.env + weights.energy;
    if (totalW === 0) return route.totalRisk;

    const computed = Math.round(
      (route.gasRisk * weights.gas +
       route.obstacleRisk * weights.obstacle +
       route.commRisk * weights.comm +
       route.envRisk * weights.env +
       route.energyRisk * weights.energy) / totalW
    );
    return computed;
  };

  const handleWeightChange = (key, value) => {
    setWeights(prev => ({ ...prev, [key]: Number(value) }));
  };

  const setPresetProfile = (profile) => {
    soundManager.playClick();
    if (profile === 'GAS_CAUTION') {
      setWeights({ gas: 50, obstacle: 15, comm: 10, env: 15, energy: 10 });
    } else if (profile === 'COMMS_PRIORITY') {
      setWeights({ gas: 25, obstacle: 20, comm: 35, env: 10, energy: 10 });
    } else {
      setWeights({ gas: 35, obstacle: 20, comm: 15, env: 15, energy: 15 });
    }
  };

  const handleApprove = (routeId) => {
    soundManager.playSuccess();
    setApprovedRouteId(routeId);
    const r = routes.find(rt => rt.id === routeId);
    const computedScore = calculateDynamicRisk(r);
    addLog('NAVIGATION', `Surface commander authorized route: ${r.name} (Calculated Risk: ${computedScore}/100)`);
  };

  const handleRecalculate = () => {
    soundManager.playClick();
    setRecalculating(true);
    addLog('NAVIGATION', 'Mission planner dynamic costmap re-evaluation triggered across all candidate paths.');
    setTimeout(() => {
      setRecalculating(false);
      soundManager.playSuccess();
    }, 600);
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-3 sm:p-4 shadow-md flex flex-col gap-3 font-mono select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Risk-Aware Mission Route Planner (A* Costmap)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowConfig(!showConfig);
            }}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition ${
              showConfig 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold' 
                : 'bg-mine-card hover:bg-mine-hover border-mine-border text-mine-subtext hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customize Weights</span>
          </button>

          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-sm"
          >
            <RotateCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
            <span>{recalculating ? 'Evaluating...' : 'Recalculate'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Weight Adjustment Panel */}
      {showConfig && (
        <div className="p-3 bg-mine-darkest rounded-xl border border-cyan-900/50 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mine-border pb-1.5">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Adjust Risk Coefficients (Live Dynamic Weighting)
            </span>

            {/* Presets */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-mine-muted">Presets:</span>
              <button
                onClick={() => setPresetProfile('BALANCED')}
                className="px-2 py-0.5 rounded bg-mine-card hover:bg-mine-hover text-white border border-mine-border"
              >
                Standard (Nominal)
              </button>
              <button
                onClick={() => setPresetProfile('GAS_CAUTION')}
                className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800"
              >
                High Gas Caution
              </button>
              <button
                onClick={() => setPresetProfile('COMMS_PRIORITY')}
                className="px-2 py-0.5 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800"
              >
                Comms Priority
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-mine-muted text-[11px] mb-1">
                <span>Gas Risk Weight:</span>
                <span className="text-red-400 font-bold">{weights.gas}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="60" 
                value={weights.gas} 
                onChange={(e) => handleWeightChange('gas', e.target.value)} 
                className="w-full h-1.5 bg-mine-surface rounded cursor-pointer accent-red-500" 
              />
            </div>

            <div>
              <div className="flex justify-between text-mine-muted text-[11px] mb-1">
                <span>Obstacles Weight:</span>
                <span className="text-amber-400 font-bold">{weights.obstacle}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={weights.obstacle} 
                onChange={(e) => handleWeightChange('obstacle', e.target.value)} 
                className="w-full h-1.5 bg-mine-surface rounded cursor-pointer accent-amber-500" 
              />
            </div>

            <div>
              <div className="flex justify-between text-mine-muted text-[11px] mb-1">
                <span>Comms Link Weight:</span>
                <span className="text-cyan-400 font-bold">{weights.comm}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                value={weights.comm} 
                onChange={(e) => handleWeightChange('comm', e.target.value)} 
                className="w-full h-1.5 bg-mine-surface rounded cursor-pointer accent-cyan-400" 
              />
            </div>

            <div>
              <div className="flex justify-between text-mine-muted text-[11px] mb-1">
                <span>Environment Weight:</span>
                <span className="text-purple-400 font-bold">{weights.env}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                value={weights.env} 
                onChange={(e) => handleWeightChange('env', e.target.value)} 
                className="w-full h-1.5 bg-mine-surface rounded cursor-pointer accent-purple-400" 
              />
            </div>

            <div>
              <div className="flex justify-between text-mine-muted text-[11px] mb-1">
                <span>Energy Return Weight:</span>
                <span className="text-emerald-400 font-bold">{weights.energy}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                value={weights.energy} 
                onChange={(e) => handleWeightChange('energy', e.target.value)} 
                className="w-full h-1.5 bg-mine-surface rounded cursor-pointer accent-emerald-400" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Routes Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isApproved = approvedRouteId === route.id;
          const computedRisk = calculateDynamicRisk(route);
          const isHighRisk = computedRisk > 65;
          const isLowRisk = computedRisk <= 35;

          return (
            <div
              key={route.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedRouteId(route.id);
              }}
              className={`border rounded-xl p-3 flex flex-col justify-between cursor-pointer transition relative ${
                isSelected 
                  ? 'border-cyan-500 bg-mine-card ring-1 ring-cyan-500/50 shadow-xl' 
                  : 'border-mine-border bg-mine-card/70 hover:bg-mine-card hover:border-mine-borderLight'
              }`}
            >
              {/* Header Badges */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-bold text-white text-xs sm:text-sm">{route.name}</span>

                  <div className="flex items-center gap-1">
                    {route.isRecommended && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold shadow-sm">
                        AI RECOMMENDED
                      </span>
                    )}
                    {isApproved && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold shadow-sm">
                        ACTIVE ROUTE
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-mine-muted mb-2">{route.via} • {route.distance}m traversal</div>

                {/* Risk Score Gauge */}
                <div className="bg-mine-darkest/90 p-2.5 rounded-lg border border-mine-border mb-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-mine-muted uppercase font-semibold">Total Risk Score:</span>
                    <span className={`text-lg font-black ${
                      isHighRisk ? 'text-red-400' : isLowRisk ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {computedRisk} <span className="text-[11px] font-normal text-mine-muted">/100</span>
                    </span>
                  </div>

                  <div className="w-full bg-mine-surface h-2 rounded-full overflow-hidden mt-1.5 border border-mine-border/50">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isHighRisk ? 'bg-red-500' : isLowRisk ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${computedRisk}%` }}
                    />
                  </div>
                </div>

                {/* Sub-Risk Breakdown */}
                <div className="space-y-1 text-[11px] text-mine-subtext border-t border-mine-border/70 pt-2 font-mono">
                  <div className="flex justify-between">
                    <span>Methane Gas Hazard:</span>
                    <span className={`font-semibold ${route.gasRisk > 40 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {route.gasRisk}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Structural Obstacles:</span>
                    <span className={`font-semibold ${route.obstacleRisk > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {route.obstacleRisk}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>RF Mesh Comm Link:</span>
                    <span className={`font-semibold ${route.commRisk > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {route.commRisk}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-mine-muted leading-relaxed italic">
                  {route.details}
                </div>
              </div>

              {/* Action Approval Button */}
              <div className="mt-3 pt-2.5 border-t border-mine-border">
                {isApproved ? (
                  <div className="w-full py-1.5 text-center text-xs font-bold text-emerald-400 bg-emerald-950/60 rounded-lg border border-emerald-800 flex items-center justify-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>APPROVED &amp; ACTIVE</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(route.id);
                    }}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border shadow-sm ${
                      isHighRisk
                        ? 'bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800'
                        : 'bg-emerald-950/90 hover:bg-emerald-800 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    <span>{isHighRisk ? 'OVERRIDE HAZARD & SELECT' : 'APPROVE & DISPATCH PATH'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Human In The Loop Explanatory Principle */}
      <div className="bg-mine-darkest/75 border border-mine-border rounded-xl p-3 text-xs text-mine-subtext flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">Human-in-the-Loop Mission Governance:</strong> NETRA-X uses multi-factor deterministic A* costmaps. Autonomous navigation suggestions are presented to the surface safety officer with an explainable risk breakdown. Rescue personnel retain complete operational override authority before entry into high-risk mine sections.
        </div>
      </div>
    </div>
  );
};
