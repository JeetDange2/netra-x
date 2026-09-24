import React from 'react';
import { MissionProvider, useMission } from './context/MissionContext';
import { TopStatusBar } from './components/layout/TopStatusBar';
import { Sidebar } from './components/layout/Sidebar';
import { RoverStatusCards } from './components/dashboard/RoverStatusCards';
import { CameraPanel } from './components/dashboard/CameraPanel';
import { MineMap } from './components/dashboard/MineMap';
import { EnvironmentalPanel } from './components/dashboard/EnvironmentalPanel';
import { SurvivorPanel } from './components/dashboard/SurvivorPanel';
import { RiskPlanner } from './components/dashboard/RiskPlanner';
import { RoverControls } from './components/dashboard/RoverControls';
import { AlertsPanel } from './components/dashboard/AlertsPanel';
import { MissionLog } from './components/dashboard/MissionLog';
import { ArchitectureViewer } from './components/docs/ArchitectureViewer';

const DashboardContent = () => {
  const { activeTab } = useMission();

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 max-w-[1920px] mx-auto w-full">
      {/* 1. Command Overview Tab */}
      {activeTab === 'dashboard' && (
        <>
          {/* Top Status Cards */}
          <RoverStatusCards />

          {/* Primary Viewports Grid: Camera on Left, 3D/2D SLAM Map on Right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
            <div className="xl:col-span-6 min-h-[440px] h-[480px] lg:h-[520px]">
              <CameraPanel />
            </div>
            <div className="xl:col-span-6 min-h-[440px] h-[480px] lg:h-[520px]">
              <MineMap />
            </div>
          </div>

          {/* Environmental Telemetry */}
          <EnvironmentalPanel />

          {/* Survivor Detection & Risk Planner Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
            <div className="xl:col-span-5">
              <SurvivorPanel />
            </div>
            <div className="xl:col-span-7">
              <RiskPlanner />
            </div>
          </div>

          {/* Rover Teleoperation Controls & Mission Log / Alerts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
            <div className="xl:col-span-6">
              <RoverControls />
            </div>
            <div className="xl:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <AlertsPanel />
              <MissionLog />
            </div>
          </div>
        </>
      )}

      {/* 2. Expanded Camera & Vision Tab */}
      {activeTab === 'camera' && (
        <div className="space-y-4">
          <div className="h-[640px] lg:h-[700px]">
            <CameraPanel />
          </div>
          <SurvivorPanel />
        </div>
      )}

      {/* 3. Expanded 3D SLAM Mine Map Tab */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="h-[680px] lg:h-[750px]">
            <MineMap />
          </div>
          <RiskPlanner />
        </div>
      )}

      {/* 4. Expanded Environmental Tab */}
      {activeTab === 'environment' && (
        <div className="space-y-4">
          <EnvironmentalPanel />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[480px]">
              <MineMap />
            </div>
            <div className="h-[480px]">
              <AlertsPanel />
            </div>
          </div>
        </div>
      )}

      {/* 5. Expanded Risk Planner Tab */}
      {activeTab === 'planner' && (
        <div className="space-y-4">
          <RiskPlanner />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[480px]">
              <MineMap />
            </div>
            <RoverControls />
          </div>
        </div>
      )}

      {/* 6. Expanded Teleoperation Tab */}
      {activeTab === 'control' && (
        <div className="space-y-4">
          <RoverControls />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="h-[480px]"><CameraPanel /></div>
            <div className="h-[480px]"><MineMap /></div>
          </div>
        </div>
      )}

      {/* 7. Expanded Alerts & Logs Tab */}
      {activeTab === 'logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[640px]">
          <AlertsPanel />
          <MissionLog />
        </div>
      )}

      {/* 8. System Architecture Tab */}
      {activeTab === 'architecture' && (
        <ArchitectureViewer />
      )}
    </div>
  );
};

export default function App() {
  return (
    <MissionProvider>
      <div className="min-h-screen bg-mine-darkest text-mine-text flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <TopStatusBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden bg-mine-bg">
            <DashboardContent />
          </main>
        </div>
      </div>
    </MissionProvider>
  );
}
