import React, { useState } from 'react';
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
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Server,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const Sidebar = () => {
  const { activeTab, setActiveTab, alerts, isEmergencyStopped } = useMission();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'camera', label: 'Camera & Vision', icon: Video, badge: 'AI' },
    { id: 'map', label: '3D SLAM Mine Map', icon: Map, badge: '3D' },
    { id: 'environment', label: 'Gas & Atmosphere', icon: Activity },
    { id: 'planner', label: 'Risk Planner', icon: Compass },
    { id: 'control', label: 'Teleoperation', icon: Gamepad2 },
    { 
      id: 'logs', 
      label: 'Alerts & Logs', 
      icon: ScrollText, 
      count: alerts.filter(a => !a.acknowledged).length 
    },
    { id: 'architecture', label: 'System Specs & QA', icon: Cpu },
  ];

  return (
    <aside className={`bg-mine-surface border-r border-mine-border flex flex-col justify-between shrink-0 transition-all duration-300 h-[calc(100vh-57px)] sticky top-[57px] select-none ${
      collapsed ? 'w-16' : 'w-60 lg:w-64'
    }`}>
      {/* Navigation Links */}
      <div className="p-2 sm:p-3 space-y-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-mine-muted">
          {!collapsed && <span>Operations Deck</span>}
          <button
            onClick={() => {
              soundManager.playClick();
              setCollapsed(!collapsed);
            }}
            className="p-1 rounded hover:bg-mine-card text-mine-muted hover:text-white transition ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(item.id);
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 shadow-inner'
                    : 'text-mine-subtext hover:text-white hover:bg-mine-card border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-mine-muted'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold">
                        {item.badge}
                      </span>
                    )}

                    {item.count > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 font-mono font-bold animate-pulse">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Fail-safe Emergency Warning Banner if Stopped */}
      {isEmergencyStopped && (
        <div className={`mx-2 mb-2 p-2 rounded-lg bg-red-950/90 border border-red-700 text-red-300 text-xs font-mono flex items-center ${collapsed ? 'justify-center' : 'gap-2'} animate-pulse`}>
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          {!collapsed && (
            <div>
              <div className="font-bold text-[11px]">E-STOP ENGAGED</div>
              <div className="text-[9px] text-red-400/80">Drive cut off</div>
            </div>
          )}
        </div>
      )}

      {/* System Hardware Status Indicators */}
      <div className="p-2 sm:p-3 border-t border-mine-border bg-mine-darkest/50">
        {!collapsed ? (
          <>
            <div className="text-[10px] font-mono uppercase tracking-wider text-mine-muted mb-2 px-1 flex items-center justify-between">
              <span>Hardware Modules</span>
              <span className="text-emerald-400">NOMINAL</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs text-mine-subtext px-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Sensors Array
                </span>
                <span className="text-emerald-400 text-[10px] font-semibold">7/7 OK</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  YOLOv8n Edge
                </span>
                <span className="text-cyan-400 text-[10px] font-semibold">18 FPS</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LiDAR 3D SLAM
                </span>
                <span className="text-emerald-400 text-[10px] font-semibold">LOCKED</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-mine-border/60 text-[9px] text-mine-muted font-mono text-center">
              ROS 2 FOXY • NAV2 • SLAM TOOLBOX
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="All Hardware Modules Nominal" />
            <span className="text-[9px] font-mono text-mine-muted">v1.0</span>
          </div>
        )}
      </div>
    </aside>
  );
};
