import React, { useState } from 'react';
import { useMission, THRESHOLDS } from '../../context/MissionContext';
import { 
  Flame, 
  Wind, 
  Thermometer, 
  Droplets, 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  Skull,
  Info,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';
import { soundManager } from '../../utils/audioAlert';

export const EnvironmentalPanel = () => {
  const { sensors, simulationScenario } = useMission();
  const [showStandardsModal, setShowStandardsModal] = useState(false);

  const sensorConfigs = [
    {
      id: 'ch4',
      name: 'Methane (CH₄)',
      data: sensors.ch4,
      thresholds: THRESHOLDS.CH4,
      icon: Flame,
      color: '#ef4444',
      safeRange: '< 1.0 % LEL',
      dangerRange: '> 2.0 % LEL',
      maxSafe: 1.0,
      maxDanger: 2.0,
      scaleMax: 3.5,
      note: 'Explosion hazard limit: 5-15% in air. DGMS mandatory cutoff at 1.25%.'
    },
    {
      id: 'co',
      name: 'Carbon Monoxide (CO)',
      data: sensors.co,
      thresholds: THRESHOLDS.CO,
      icon: Wind,
      color: '#f59e0b',
      safeRange: '< 25 ppm',
      dangerRange: '> 50 ppm',
      maxSafe: 25,
      maxDanger: 50,
      scaleMax: 100,
      note: 'Toxic asphyxiant produced by incomplete combustion/coal seam heating.'
    },
    {
      id: 'o2',
      name: 'Oxygen Level (O₂)',
      data: sensors.o2,
      thresholds: THRESHOLDS.O2,
      icon: CheckCircle2,
      color: '#10b981',
      safeRange: '19.5% – 23.5%',
      dangerRange: '< 16.0%',
      maxSafe: 23.5,
      maxDanger: 16.0,
      scaleMax: 25,
      isOxygen: true,
      note: 'Normal atmospheric air: 20.9%. Below 19.5% causes hypoxia.'
    },
    {
      id: 'h2s',
      name: 'Hydrogen Sulphide (H₂S)',
      data: sensors.h2s,
      thresholds: THRESHOLDS.H2S,
      icon: Skull,
      color: '#a855f7',
      safeRange: '< 5 ppm',
      dangerRange: '> 10 ppm',
      maxSafe: 5,
      maxDanger: 10,
      scaleMax: 20,
      note: 'Stinkdamp gas released from stagnant underground water fissures.'
    },
    {
      id: 'temperature',
      name: 'Ambient Temperature',
      data: sensors.temperature,
      thresholds: THRESHOLDS.TEMP,
      icon: Thermometer,
      color: '#06b6d4',
      safeRange: '< 38 °C',
      dangerRange: '> 45 °C',
      maxSafe: 38,
      maxDanger: 45,
      scaleMax: 60,
      note: 'Deep mine strata heat and humidity causes severe thermal heat stroke.'
    },
    {
      id: 'humidity',
      name: 'Relative Humidity',
      data: sensors.humidity,
      thresholds: THRESHOLDS.HUMIDITY,
      icon: Droplets,
      color: '#3b82f6',
      safeRange: '40% – 85%',
      dangerRange: '> 95%',
      maxSafe: 85,
      maxDanger: 95,
      scaleMax: 100,
      note: 'High humidity impairs sweat evaporation and reduces optical visibility.'
    },
    {
      id: 'waterLevel',
      name: 'Standing Water Depth',
      data: sensors.waterLevel,
      thresholds: THRESHOLDS.WATER,
      icon: Waves,
      color: '#0284c7',
      safeRange: '< 0.3 m',
      dangerRange: '> 0.6 m',
      maxSafe: 0.3,
      maxDanger: 0.6,
      scaleMax: 1.2,
      note: 'Track clearance limit: 0.35m. Flooding risk for rover electronics.'
    }
  ];

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-3 sm:p-4 shadow-md flex flex-col gap-3 font-mono select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Atmospheric Telemetry &amp; Gas Safety Matrix
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowStandardsModal(true);
            }}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-mine-card hover:bg-mine-hover border border-mine-border text-mine-subtext hover:text-white transition"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Safety Guidelines</span>
          </button>
          <span className="text-[11px] text-mine-muted hidden md:inline">
            7-SENSOR NDIR/ELECTROCHEMICAL BUS • 1 Hz
          </span>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {sensorConfigs.map((sensor) => {
          const Icon = sensor.icon;
          const status = sensor.data.status;
          
          let badgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80';
          let borderGlow = 'border-mine-border hover:border-mine-borderLight';
          if (status === 'WARNING') {
            badgeColor = 'bg-amber-950/80 text-amber-300 border-amber-600/80 animate-pulse';
            borderGlow = 'border-amber-600/70 bg-amber-950/20';
          } else if (status === 'DANGER' || status === 'CRITICAL') {
            badgeColor = 'bg-red-950 text-red-300 border-red-600 animate-pulse font-black';
            borderGlow = 'border-red-600 bg-red-950/30';
          }

          // Calculate percentage for progress bar
          let pct = 0;
          if (sensor.isOxygen) {
            pct = Math.min(100, Math.max(0, (sensor.data.value / 25) * 100));
          } else {
            pct = Math.min(100, Math.max(0, (sensor.data.value / sensor.scaleMax) * 100));
          }

          return (
            <div 
              key={sensor.id}
              className={`bg-mine-card border rounded-xl p-3 flex flex-col justify-between transition-all ${borderGlow}`}
            >
              {/* Top: Icon, Name & Status Badge */}
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-[11px] text-mine-subtext font-semibold truncate" title={sensor.name}>
                    {sensor.name}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                    {status}
                  </span>
                </div>

                {/* Main Value Display */}
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className={`text-2xl font-black ${
                    status === 'CRITICAL' || status === 'DANGER' 
                      ? 'text-red-400' 
                      : status === 'WARNING' 
                      ? 'text-amber-400' 
                      : 'text-white'
                  }`}>
                    {sensor.data.value}
                  </span>
                  <span className="text-[11px] text-mine-muted font-bold">{sensor.data.unit}</span>
                </div>

                {/* Visual Level Gauge Bar */}
                <div className="w-full bg-mine-darkest h-2 rounded-full overflow-hidden my-1.5 border border-mine-border/60 relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      status === 'CRITICAL' || status === 'DANGER'
                        ? 'bg-red-500'
                        : status === 'WARNING'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Sparkline Trend Graph */}
              <div className="h-9 w-full my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensor.data.history}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#070b12', borderColor: '#1e293b', fontSize: '10px' }}
                      labelStyle={{ color: '#94a3b8' }}
                      itemStyle={{ color: sensor.color }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={status === 'CRITICAL' || status === 'DANGER' ? '#ef4444' : sensor.color} 
                      strokeWidth={1.8} 
                      dot={false} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Footnote Safe Limits */}
              <div className="pt-2 border-t border-mine-border/60 text-[9px] text-mine-muted flex items-center justify-between">
                <span>SAFE: {sensor.safeRange}</span>
                <Icon className="w-3.5 h-3.5 text-mine-subtext shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Standards Explanation Modal */}
      {showStandardsModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-mine-surface border border-mine-borderLight rounded-xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-mine-border pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Underground Mine Safety Atmosphere Thresholds (DGMS / OSHA)
                </h3>
              </div>
              <button
                onClick={() => setShowStandardsModal(false)}
                className="p-1 rounded hover:bg-mine-card text-mine-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-mine-subtext space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-2.5 rounded-lg bg-mine-card border border-mine-border">
                <strong className="text-red-400">Methane (CH₄):</strong> Coal mine firedamp. Highly explosive when mixed with air between 5% and 15% (LEL = Lower Explosive Limit = 5%). DGMS regulations mandate immediate power shutoff and personnel evacuation when concentrations exceed 1.25% (25% LEL).
              </div>
              <div className="p-2.5 rounded-lg bg-mine-card border border-mine-border">
                <strong className="text-amber-400">Carbon Monoxide (CO):</strong> Whitedamp. Odorless, toxic gas that binds to hemoglobin. Safe limit &lt;25 ppm. Fatal within 30 minutes at &gt;400 ppm.
              </div>
              <div className="p-2.5 rounded-lg bg-mine-card border border-mine-border">
                <strong className="text-emerald-400">Oxygen (O₂):</strong> Standard air contains 20.9% O₂. Below 19.5% is an oxygen-deficient atmosphere requiring self-contained breathing apparatus (SCBA). Below 16% causes rapid loss of consciousness.
              </div>
              <div className="p-2.5 rounded-lg bg-mine-card border border-mine-border">
                <strong className="text-purple-400">Hydrogen Sulphide (H₂S):</strong> Stinkdamp. Extremely toxic gas formed by pyrite decomposition. Causes olfactory fatigue above 10 ppm; paralyzes the respiratory center at 100 ppm.
              </div>
            </div>

            <div className="pt-2 border-t border-mine-border text-right">
              <button
                onClick={() => setShowStandardsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
