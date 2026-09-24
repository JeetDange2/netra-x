import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  Check, 
  CheckCircle2,
  CheckCheck
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const AlertsPanel = () => {
  const { alerts, acknowledgeAlert } = useMission();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.level === filter;
  });

  const unackCount = alerts.filter(a => !a.acknowledged).length;

  const handleAcknowledgeAll = () => {
    soundManager.playSuccess();
    alerts.forEach(a => {
      if (!a.acknowledged) acknowledgeAlert(a.id);
    });
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-3 sm:p-4 shadow-md flex flex-col h-full font-mono select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Live Tactical Alerts ({unackCount})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {unackCount > 0 && (
            <button
              onClick={handleAcknowledgeAll}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 transition"
              title="Acknowledge All Active Alerts"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Ack All</span>
            </button>
          )}

          {/* Filter Buttons */}
          <div className="flex items-center bg-mine-darkest p-0.5 rounded-lg border border-mine-border text-[10px]">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  soundManager.playClick();
                  setFilter(f);
                }}
                className={`px-2 py-0.5 rounded transition ${
                  filter === f
                    ? 'bg-cyan-600 text-white font-bold shadow'
                    : 'text-mine-muted hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto space-y-2 mt-2.5 pr-1 max-h-[380px]">
        {filteredAlerts.length === 0 ? (
          <div className="text-center text-mine-muted text-xs py-10 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
            <span>No alerts matching filter. All systems nominal.</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            let borderStyle = 'border-cyan-800/40 bg-cyan-950/20';
            let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
            let titleColor = 'text-cyan-300';

            if (alert.level === 'CRITICAL') {
              borderStyle = alert.acknowledged 
                ? 'border-red-900/60 bg-red-950/20' 
                : 'border-red-600 bg-red-950/60 shadow-lg shadow-red-950/40 animate-pulse';
              icon = <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />;
              titleColor = 'text-red-300';
            } else if (alert.level === 'WARNING') {
              borderStyle = 'border-amber-700/60 bg-amber-950/20';
              icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
              titleColor = 'text-amber-300';
            }

            return (
              <div
                key={alert.id}
                className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 transition ${borderStyle}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className={`text-xs font-bold ${titleColor}`}>{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-mine-muted shrink-0">
                    <span>{alert.time}</span>
                    {alert.acknowledged ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ACK
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          soundManager.playSuccess();
                          acknowledgeAlert(alert.id);
                        }}
                        className="px-2 py-0.5 rounded bg-mine-darkest hover:bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold transition shadow-sm"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-mine-subtext pl-5">
                  <div className="font-semibold text-white/95">{alert.location}</div>
                  <div className="text-mine-muted text-[10px] mt-0.5 leading-relaxed">{alert.details}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
