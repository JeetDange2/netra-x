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
  AlertCircle,
  Activity,
  HeartPulse
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const SurvivorPanel = () => {
  const { survivorData } = useMission();

  if (!survivorData.detected) {
    return (
      <div className="bg-mine-surface border border-mine-border rounded-xl p-6 shadow-md flex flex-col items-center justify-center text-center font-mono text-xs select-none">
        <Eye className="w-10 h-10 text-cyan-400/60 mb-2.5 animate-pulse" />
        <span className="font-bold text-white uppercase tracking-wider text-sm">Edge AI Perception Active</span>
        <span className="text-mine-muted text-xs mt-1 max-w-md">
          YOLOv8n person detector scanning RGB and FLIR thermal video frames. No targets currently in line-of-sight.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-mine-surface border border-orange-600/70 rounded-xl p-3 sm:p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden font-mono select-none">
      {/* Background soft orange beacon aura */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping absolute"></span>
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Survivor Detection (Sensor Fusion)</span>
          </h2>
        </div>

        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-700 shadow-sm animate-pulse whitespace-nowrap">
          PRIORITY 1 RESCUE TARGET
        </span>
      </div>

      {/* Top Metrics Row - 2x2 on medium, 4-col on wide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Card 1: Combined Confidence */}
        <div className="bg-mine-card border border-orange-500/50 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between shadow-md min-h-[92px]">
          <div className="flex items-center justify-between gap-1 text-[10px] text-mine-muted uppercase tracking-wider font-semibold">
            <span className="truncate">Fusion Score</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-950 text-orange-300 border border-orange-700 font-bold shrink-0">
              CONFIRMED
            </span>
          </div>
          
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-orange-400 leading-none">
              {survivorData.combinedConfidence}%
            </span>
          </div>

          <div className="w-full bg-mine-darkest h-1.5 rounded-full overflow-hidden border border-mine-border/50 mt-auto">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
              style={{ width: `${survivorData.combinedConfidence}%` }} 
            />
          </div>
        </div>

        {/* Card 2: YOLOv8n Visual AI */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-2.5 sm:p-3 flex flex-col justify-between shadow-sm min-h-[92px]">
          <div className="flex items-center justify-between gap-1 text-[10px] text-mine-muted uppercase tracking-wider font-semibold">
            <span className="truncate">Visual (YOLO)</span>
            <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          </div>

          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white leading-none">
              {survivorData.yoloConfidence}%
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold truncate">
              Person
            </span>
          </div>

          <div className="text-[10px] text-mine-subtext truncate mt-auto">
            YOLOv8n • 18.4 FPS
          </div>
        </div>

        {/* Card 3: Thermal Confirmation */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-2.5 sm:p-3 flex flex-col justify-between shadow-sm min-h-[92px]">
          <div className="flex items-center justify-between gap-1 text-[10px] text-mine-muted uppercase tracking-wider font-semibold">
            <span className="truncate">Thermal FLIR</span>
            <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          </div>

          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-rose-400 leading-none">
              {survivorData.thermalTemp}°C
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold truncate">
              Heat Signature
            </span>
          </div>

          <div className="text-[10px] text-mine-subtext truncate mt-auto">
            Body Core Hotspot
          </div>
        </div>

        {/* Card 4: Location & Distance */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-2.5 sm:p-3 flex flex-col justify-between shadow-sm min-h-[92px]">
          <div className="flex items-center justify-between gap-1 text-[10px] text-mine-muted uppercase tracking-wider font-semibold">
            <span className="truncate">SLAM Location</span>
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          </div>

          <div className="my-1">
            <div className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
              Sector 04
            </div>
            <div className="text-[10px] text-mine-muted truncate">
              Tunnel B Gallery
            </div>
          </div>

          <div className="text-[10px] text-mine-subtext flex items-center justify-between border-t border-mine-border/50 pt-1 mt-auto">
            <span>Range: <strong className="text-cyan-300">{survivorData.distance}m</strong></span>
            <span className="text-mine-muted">{survivorData.lastSeen}</span>
          </div>
        </div>
      </div>

      {/* Sensor Fusion Breakdown Bar */}
      <div className="bg-mine-darkest/80 border border-mine-border rounded-xl p-3 text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-mine-muted pb-1 border-b border-mine-border">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Explainable Multi-Sensor Fusion Pipeline</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-semibold">
            WEIGHTED EVIDENCE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
          <div className="bg-mine-surface p-2 rounded-lg border border-mine-border flex flex-col justify-between min-h-[58px]">
            <span className="text-mine-muted text-[10px] leading-tight">1. RGB Frame YOLO</span>
            <div className="font-bold text-cyan-400 mt-1">+50 pts (Person 94%)</div>
          </div>

          <div className="bg-mine-surface p-2 rounded-lg border border-mine-border flex flex-col justify-between min-h-[58px]">
            <span className="text-mine-muted text-[10px] leading-tight">2. FLIR Thermal</span>
            <div className="font-bold text-rose-400 mt-1">+35 pts (37.1°C Body)</div>
          </div>

          <div className="bg-mine-surface p-2 rounded-lg border border-mine-border flex flex-col justify-between min-h-[58px]">
            <span className="text-mine-muted text-[10px] leading-tight">3. Acoustic Tapping</span>
            <div className="font-bold text-amber-400 mt-1">+15 pts (82 dB Audio)</div>
          </div>

          <div className="bg-orange-950/70 p-2 rounded-lg border border-orange-600/80 shadow-inner flex flex-col justify-between min-h-[58px]">
            <span className="text-orange-300 text-[10px] font-bold leading-tight">Total Fusion Score</span>
            <div className="font-black text-orange-400 mt-1">{survivorData.combinedConfidence}% Confirmed</div>
          </div>
        </div>

        <div className="pt-1 text-[10px] text-mine-muted flex items-start gap-1.5 italic">
          <AlertCircle className="w-3.5 h-3.5 text-mine-subtext shrink-0 mt-0.5" />
          <span>Notice: Rover flags &quot;potential survivor&quot; as decision support; medical condition must be verified by human rescue teams upon arrival.</span>
        </div>
      </div>
    </div>
  );
};
