import React from 'react';
import { useMission, THRESHOLDS } from '../../context/MissionContext';
import { 
  Flame, 
  Wind, 
  Thermometer, 
  Droplets, 
  Waves, 
  AlertTriangle, 
  CheckCircle2,
  HelpCircle,
  Skull
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';

export const EnvironmentalPanel = () => {
  const { sensors, simulationScenario } = useMission();

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
      note: 'Explosion risk in confined drifts'
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
      note: 'Asphyxiant / incomplete combustion'
    },
    {
      id: 'o2',
      name: 'Oxygen Concentration (O₂)',
      data: sensors.o2,
      thresholds: THRESHOLDS.O2,
      icon: CheckCircle2,
      color: '#10b981',
      safeRange: '19.5% – 23.5%',
      dangerRange: '< 16.0%',
      note: 'Respirable mine atmosphere standard'
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
      note: 'Toxic gas released from water fissures'
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
      note: 'Strata heat & heat stress index'
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
      note: 'Condensation & thermal perception'
    },
    {
      id: 'waterLevel',
      name: 'Standing Water / Flood',
      data: sensors.waterLevel,
      thresholds: THRESHOLDS.WATER,
      icon: Waves,
      color: '#0284c7',
      safeRange: '< 0.3 m',
      dangerRange: '> 0.6 m',
      note: 'Flooding clearance for tracked chassis'
    }
  ];

  return (
    <div className="bg-mine-surface border border-mine-border rounded-lg p-3 shadow-md flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-mine-border font-mono">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Environmental Monitoring &amp; Atmosphere Telemetry
          </h2>
        </div>
        <div className="text-[11px] text-mine-muted">
          HARDWARE: ESP32 + INDUSTRIAL NDIR / ELECTROCHEMICAL SENSORS
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {sensorConfigs.map((sensor) => {
          const Icon = sensor.icon;
          const status = sensor.data.status;
          
          let badgeColor = 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80';
          let borderGlow = 'border-mine-border hover:border-mine-borderLight';
          if (status === 'WARNING') {
            badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-700/80 animate-pulse';
            borderGlow = 'border-amber-700/60 bg-amber-950/10';
          } else if (status === 'DANGER' || status === 'CRITICAL') {
            badgeColor = 'bg-red-950 text-red-300 border-red-700 animate-pulse font-black';
            borderGlow = 'border-red-600/80 bg-red-950/20';
          }

          return (
            <div 
              key={sensor.id}
              className={`bg-mine-card border rounded-lg p-2.5 flex flex-col justify-between transition-all ${borderGlow}`}
            >
              {/* Top Row: Icon, Name & Status Badge */}
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className="text-[11px] font-mono text-mine-subtext font-semibold truncate" title={sensor.name}>
                    {sensor.name}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${badgeColor}`}>
                    {status}
                  </span>
                </div>

                {/* Primary Reading Display */}
                <div className="flex items-baseline gap-1 my-1">
                  <span className={`text-2xl font-bold font-mono ${
                    status === 'CRITICAL' || status === 'DANGER' 
                      ? 'text-red-400' 
                      : status === 'WARNING' 
                      ? 'text-amber-400' 
                      : 'text-white'
                  }`}>
                    {sensor.data.value}
                  </span>
                  <span className="text-[10px] font-mono text-mine-muted">{sensor.data.unit}</span>
                </div>
              </div>

              {/* Sparkline Trend Graph using Recharts */}
              <div className="h-10 w-full my-1">
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

              {/* Footnote with Safe Limits */}
              <div className="pt-1.5 border-t border-mine-border/60 text-[9px] font-mono text-mine-muted flex items-center justify-between">
                <span>SAFE: {sensor.safeRange}</span>
                <Icon className="w-3 h-3 text-mine-subtext shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
