import React from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  UserCheck, 
  Flame, 
  Volume2, 
  MapPin, 
  ShieldCheck, 
  Eye, 
  Crosshair, 
  AlertCircle 
} from 'lucide-react';

export const SurvivorPanel = () => {
  const { survivorData } = useMission();

  if (!survivorData.detected) {
    return (
      <div className="bg-mine-surface border border-mine-border rounded-lg p-4 shadow-md flex flex-col items-center justify-center text-center font-mono text-xs">
        <Eye className="w-8 h-8 text-cyan-400/60 mb-2 animate-pulse" />
        <span className="font-bold text-white uppercase tracking-wider">AI Perception Active</span>
        <span className="text-mine-muted text-[11px] mt-1">YOLOv8n person detector scanning RGB &amp; Thermal streams. No targets acquired.</span>
      </div>
    );
  }

  return (
    <div className="bg-mine-surface border border-orange-600/60 rounded-lg p-3 shadow-md flex flex-col gap-3 relative overflow-hidden">
      {/* Background soft orange beacon aura */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-mine-border font-mono">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping absolute"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          </div>
          <h2 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
            Potential Survivor Detection (AI Multi-Sensor Fusion)
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-700">
          PRIORITY 1 RESCUE TARGET
        </span>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 font-mono">
        {/* Combined Confidence */}
        <div className="bg-mine-card border border-orange-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[10px] text-mine-muted uppercase tracking-wider">Combined Fusion</span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-2xl font-black text-orange-400">{survivorData.combinedConfidence}%</span>
            <span className="text-[10px] text-orange-300 font-bold">HIGH CONFIDENCE</span>
          </div>
          <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden border border-mine-border/50">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${survivorData.combinedConfidence}%` }} />
          </div>
        </div>

        {/* YOLOv8n Detection */}
        <div className="bg-mine-card border border-mine-border rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[10px] text-mine-muted uppercase tracking-wider flex items-center justify-between">
            <span>Visual AI (YOLO)</span>
            <Eye className="w-3 h-3 text-cyan-400" />
          </span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-xl font-bold text-white">{survivorData.yoloConfidence}%</span>
            <span className="text-[10px] text-cyan-400 font-semibold">PERSON CLASS</span>
          </div>
          <span className="text-[10px] text-mine-subtext">Pretrained YOLOv8n @ 18 FPS</span>
        </div>

        {/* Thermal Confirmation */}
        <div className="bg-mine-card border border-mine-border rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[10px] text-mine-muted uppercase tracking-wider flex items-center justify-between">
            <span>Thermal FLIR</span>
            <Flame className="w-3 h-3 text-rose-400" />
          </span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-xl font-bold text-rose-400">{survivorData.thermalTemp}°C</span>
            <span className="text-[10px] text-emerald-400 font-semibold">CONFIRMED</span>
          </div>
          <span className="text-[10px] text-mine-subtext">Heat hotspot matching body core</span>
        </div>

        {/* Location & Distance */}
        <div className="bg-mine-card border border-mine-border rounded-lg p-2.5 flex flex-col justify-between">
          <span className="text-[10px] text-mine-muted uppercase tracking-wider flex items-center justify-between">
            <span>Est. Location</span>
            <MapPin className="w-3 h-3 text-cyan-400" />
          </span>
          <div className="text-sm font-bold text-white truncate my-0.5">
            {survivorData.location}
          </div>
          <div className="text-[10px] text-mine-subtext flex items-center justify-between">
            <span>Distance: <strong className="text-cyan-300">{survivorData.distance} m</strong></span>
            <span className="text-mine-muted">{survivorData.lastSeen}</span>
          </div>
        </div>
      </div>

      {/* Sensor Fusion Breakdown Bar per DOCS/design.md Section 17 */}
      <div className="bg-mine-darkest/70 border border-mine-border rounded-lg p-2.5 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-mine-muted mb-2">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Explainable Multi-Sensor Fusion Pipeline
          </span>
          <span className="text-[10px]">WEIGHTED SENSOR INTEGRATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-[11px]">
          <div className="bg-mine-surface p-1.5 rounded border border-mine-border">
            <span className="text-mine-muted text-[10px]">RGB Frame YOLO</span>
            <div className="font-bold text-cyan-400 mt-0.5">+50 pts (91%)</div>
          </div>
          <div className="bg-mine-surface p-1.5 rounded border border-mine-border">
            <span className="text-mine-muted text-[10px]">Thermal Signature</span>
            <div className="font-bold text-rose-400 mt-0.5">+35 pts (36.8°C)</div>
          </div>
          <div className="bg-mine-surface p-1.5 rounded border border-mine-border">
            <span className="text-mine-muted text-[10px]">Acoustic Distress</span>
            <div className="font-bold text-amber-400 mt-0.5">+{survivorData.acousticScore > 50 ? '15' : '09'} pts</div>
          </div>
          <div className="bg-orange-950/60 p-1.5 rounded border border-orange-600/70">
            <span className="text-orange-300 text-[10px] font-bold">Total Fusion Confidence</span>
            <div className="font-black text-orange-400 mt-0.5">{survivorData.combinedConfidence}% High Confidence</div>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-mine-muted flex items-center gap-1.5 italic">
          <AlertCircle className="w-3 h-3 text-mine-subtext shrink-0" />
          <span>Notice: Rover flags &quot;potential survivor&quot; as decision support; medical condition must be verified by human rescue teams upon arrival.</span>
        </div>
      </div>
    </div>
  );
};
