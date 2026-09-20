import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  Check, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export const AlertsPanel = () => {
  const { alerts, acknowledgeAlert } = useMission();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.level === filter;
  });

  return (
    <div className="bg-mine-surface border border-mine-border rounded-lg p-3 shadow-md flex flex-col h-full font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Tactical Alerts ({alerts.filter(a => !a.acknowledged).length})
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 text-[10px]">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-1.5 py-0.5 rounded transition ${
                filter === f
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-mine-muted hover:text-white bg-mine-darkest'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1 max-h-[360px]">
        {filteredAlerts.length === 0 ? (
          <div className="text-center text-mine-muted text-xs py-8">
            No alerts matching filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            let borderStyle = 'border-cyan-800/50 bg-cyan-950/20';
            let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
            let titleColor = 'text-cyan-300';

            if (alert.level === 'CRITICAL') {
              borderStyle = alert.acknowledged 
                ? 'border-red-900/60 bg-red-950/20' 
                : 'border-red-600 bg-red-950/60 shadow-lg shadow-red-900/30 animate-pulse';
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
                className={`p-2.5 rounded-lg border flex flex-col justify-between gap-1 transition ${borderStyle}`}
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
                        <CheckCircle2 className="w-3 h-3" /> ACK
                      </span>
                    ) : (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-1.5 py-0.2 rounded bg-mine-darkest hover:bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-mine-subtext pl-5">
                  <div className="font-medium text-white/90">{alert.location}</div>
                  <div className="text-mine-muted text-[10px] mt-0.5">{alert.details}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
