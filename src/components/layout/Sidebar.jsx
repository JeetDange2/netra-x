import React from 'react';
import { useMission } from '../../context/MissionContext';
import { 
  LayoutDashboard, 
  Video, 
  Map, 
  Activity, 
  Compass, 
  Gamepad2, 
  ScrollText, 
  Cpu, 
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, alerts, isEmergencyStopped } = useMission();

  const navItems = [
    { id: 'dashboard', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'camera', label: 'Camera & Vision', icon: Video, badge: 'AI' },
    { id: 'map', label: 'SLAM Mine Map', icon: Map },
    { id: 'environment', label: 'Gas & Environment', icon: Activity },
    { id: 'planner', label: 'Risk Planner', icon: Compass },
    { id: 'control', label: 'Teleoperation', icon: Gamepad2 },
    { 
      id: 'logs', 
      label: 'Alerts & Logs', 
      icon: ScrollText, 
      count: alerts.filter(a => !a.acknowledged).length 
    },
    { id: 'architecture', label: 'System Architecture', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-mine-surface border-r border-mine-border flex flex-col justify-between shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-mine-muted">
          Navigation Deck
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 shadow-inner'
                    : 'text-mine-subtext hover:text-white hover:bg-mine-hover border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-mine-muted'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                    {item.badge}
                  </span>
                )}

                {item.count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 font-mono font-bold animate-pulse">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Fail-safe Emergency Warning Banner if Stopped */}
      {isEmergencyStopped && (
        <div className="mx-3 mb-2 p-2.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono flex items-start gap-2 animate-pulse">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">E-STOP ENGAGED</div>
            <div className="text-[10px] text-red-400/80">Motors cut off. Reset from top bar.</div>
          </div>
        </div>
      )}

      {/* System Status Indicators per DOCS/design.md Section 5 */}
      <div className="p-3 border-t border-mine-border bg-mine-darkest/40">
        <div className="text-[11px] font-mono uppercase tracking-wider text-mine-muted mb-2 px-1">
          System Modules
        </div>

        <div className="space-y-1.5 font-mono text-xs text-mine-subtext px-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Rover Hardware
            </span>
            <span className="text-emerald-400 text-[10px]">CONNECTED</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gas Sensors
            </span>
            <span className="text-emerald-400 text-[10px]">ONLINE (7/7)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              YOLOv8n AI
            </span>
            <span className="text-cyan-400 text-[10px]">INFERENCE ACTIVE</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LiDAR SLAM
            </span>
            <span className="text-cyan-400 text-[10px]">LOCALIZED</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-mine-border/50 text-[10px] text-mine-muted font-mono text-center">
          NETRA-X ROVER v1.0.4 • ROS 2 FOXY
        </div>
      </div>
    </aside>
  );
};
