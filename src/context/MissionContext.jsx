import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Safety Thresholds from DOCS/rules.md and DOCS/prd.md
export const THRESHOLDS = {
  CH4: { warning: 1.0, danger: 2.0, unit: '% LEL', normal: 0.62 },
  CO: { warning: 25, danger: 50, unit: 'ppm', normal: 12 },
  O2: { warning: 19.5, danger: 16.0, unit: '%', normal: 20.9 }, // Below 19.5 is warning, below 16 is danger
  H2S: { warning: 5, danger: 10, unit: 'ppm', normal: 1.1 },
  TEMP: { warning: 38, danger: 45, unit: '°C', normal: 27.8 },
  HUMIDITY: { warning: 85, danger: 95, unit: '%', normal: 66 },
  WATER: { warning: 0.3, danger: 0.6, unit: 'm', normal: 0.12 }
};

const MissionContext = createContext(null);

export const MissionProvider = ({ children }) => {
  // Mission Clock & Control
  const [missionTime, setMissionTime] = useState(2262); // ~37:42 start
  const [missionStatus, setMissionStatus] = useState('ACTIVE'); // 'ACTIVE' | 'PAUSED' | 'EMERGENCY_STOP'
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | camera | map | environment | planner | control | logs | architecture

  // Rover Status
  const [roverState, setRoverState] = useState({
    id: 'NETRA-X-01',
    battery: 74,
    batteryVoltage: 24.2,
    speed: 0.42, // m/s
    distance: 148.6, // meters
    mode: 'AUTONOMOUS', // 'AUTONOMOUS' | 'ASSISTED' | 'MANUAL'
    currentSector: 'Tunnel B — Sector 03',
    signalStrength: 86, // %
    latency: 142, // ms
    packetSuccess: 99.1,
    commType: 'WIFI_MESH', // 'WIFI_MESH' | 'LORA_FALLBACK'
    commHealth: 'CONNECTED', // 'CONNECTED' | 'WEAK' | 'LOST'
    x: 42, // Coordinates for SLAM map
    y: 58,
    heading: 65, // degrees
  });

  // Environmental Telemetry with History (for sparklines/charts)
  const initialHistory = (val) => Array.from({ length: 15 }, (_, i) => ({
    time: `-${15 - i}s`,
    value: Number((val + (Math.random() * 0.1 - 0.05)).toFixed(2))
  }));

  const [sensors, setSensors] = useState({
    ch4: { value: 0.62, status: 'SAFE', unit: '% LEL', history: initialHistory(0.62) },
    co: { value: 12.0, status: 'SAFE', unit: 'ppm', history: initialHistory(12.0) },
    o2: { value: 20.9, status: 'SAFE', unit: '%', history: initialHistory(20.9) },
    h2s: { value: 1.1, status: 'SAFE', unit: 'ppm', history: initialHistory(1.1) },
    temperature: { value: 27.8, status: 'SAFE', unit: '°C', history: initialHistory(27.8) },
    humidity: { value: 66.0, status: 'SAFE', unit: '%', history: initialHistory(66.0) },
    waterLevel: { value: 0.12, status: 'SAFE', unit: 'm', history: initialHistory(0.12) },
  });

  // AI & Survivor Detection State
  const [survivorData, setSurvivorData] = useState({
    detected: true,
    yoloConfidence: 91,
    thermalConfirmed: true,
    thermalTemp: 36.8, // °C
    acousticScore: 24, // distress audio signal
    combinedConfidence: 94,
    location: 'Tunnel B — Sector 04',
    distance: 17.4, // m
    lastSeen: '12 sec ago',
    classification: 'HIGH_CONFIDENCE_POTENTIAL_SURVIVOR',
  });

  // Risk-Aware Mission Planner
  const [routes, setRoutes] = useState([
    {
      id: 'ROUTE_A',
      name: 'Route A (Direct Shaft)',
      via: 'Direct via Tunnel A',
      distance: 68,
      gasRisk: 25,
      obstacleRisk: 35,
      commRisk: 15,
      energyRisk: 15,
      envRisk: 20,
      totalRisk: 76,
      status: 'HIGH RISK',
      details: 'High methane accumulation detected near North Drift; not advised.'
    },
    {
      id: 'ROUTE_B',
      name: 'Route B (Crosscut Detour)',
      via: 'Crosscut 1 → Tunnel B bypass',
      distance: 92,
      gasRisk: 8,
      obstacleRisk: 12,
      commRisk: 10,
      energyRisk: 18,
      envRisk: 12,
      totalRisk: 24,
      status: 'LOW RISK',
      isRecommended: true,
      details: 'Clear structural clearance, stable ventilation, strong mesh repeater link.'
    },
    {
      id: 'ROUTE_C',
      name: 'Route C (Deep South Branch)',
      via: 'South Incline Corridor',
      distance: 135,
      gasRisk: 40,
      obstacleRisk: 65,
      commRisk: 75,
      energyRisk: 55,
      envRisk: 48,
      totalRisk: 62,
      status: 'MODERATE RISK',
      details: 'Partial rubble obstruction at Sector 06; weak RF penetration.'
    }
  ]);

  const [selectedRouteId, setSelectedRouteId] = useState('ROUTE_B');
  const [approvedRouteId, setApprovedRouteId] = useState('ROUTE_B');

  // Self-Recovery State
  const [recoveryState, setRecoveryState] = useState({
    isStuck: false,
    step: 0, // 0: Idle, 1: Stop, 2: Reverse, 3: Turn, 4: Re-plan, 5: Retry/Success
    stepDescription: 'Normal traction — 4-wheel drive nominal'
  });

  // Active Simulation Mode
  const [simulationScenario, setSimulationScenario] = useState('NOMINAL'); // 'NOMINAL' | 'GAS_EMERGENCY' | 'SURVIVOR_FOUND' | 'STUCK_ROVER' | 'COMM_LOSS'

  // Alerts Queue
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      time: '12:42:18',
      level: 'CRITICAL',
      title: 'Potential Survivor Detected',
      location: 'Tunnel B — Sector 04',
      details: 'YOLO (91%) + Thermal heat signature (36.8°C) confirmed at 17.4m.',
      acknowledged: false
    },
    {
      id: 2,
      time: '12:40:12',
      level: 'WARNING',
      title: 'Ventilation Drift Alert',
      location: 'Tunnel A — Sector 02',
      details: 'CH4 rising steadily past baseline (0.95% LEL).',
      acknowledged: true
    },
    {
      id: 3,
      time: '12:35:40',
      level: 'INFO',
      title: 'SLAM Submap Merged',
      location: 'Crosscut 1 Junction',
      details: 'LiDAR loop closure verified with 98.4% odometry confidence.',
      acknowledged: true
    }
  ]);

  // Mission Event Logs
  const [missionLogs, setMissionLogs] = useState([
    { id: 1, time: '12:42:18', category: 'SURVIVOR', text: 'Potential survivor detected in Tunnel B Sector 04 (Combined Confidence: 94%)' },
    { id: 2, time: '12:40:02', category: 'NAVIGATION', text: 'Risk planner recommended Route B (Risk score: 24/100)' },
    { id: 3, time: '12:38:44', category: 'OBSTACLE', text: 'Minor gravel debris detected at 2.3m — cleared by tracked chassis' },
    { id: 4, time: '12:35:10', category: 'SYSTEM', text: 'Surface communication link verified over 5.8GHz Mesh' },
    { id: 5, time: '12:34:00', category: 'MAPPING', text: 'SLAM point cloud updated — 240 sq meters mapped' },
    { id: 6, time: '12:31:00', category: 'MISSION', text: 'Rover dispatched through Mine Entrance Portal Alpha' },
  ]);

  // Helper to log event
  const addLog = useCallback((category, text) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setMissionLogs(prev => [
      { id: Date.now(), time: timeStr, category, text },
      ...prev.slice(0, 49) // Keep last 50
    ]);
  }, []);

  // Helper to add alert
  const addAlert = useCallback((level, title, location, details) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newAlert = {
      id: Date.now(),
      time: timeStr,
      level,
      title,
      location,
      details,
      acknowledged: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  // Live Timer Tick & Background Telemetry Drift
  useEffect(() => {
    if (missionStatus !== 'ACTIVE') return;

    const timer = setInterval(() => {
      setMissionTime(prev => prev + 1);

      // Jitter sensors realistically
      setSensors(prev => {
        const updateVal = (curr, normal, maxDelta, min, max, warn, dang) => {
          let delta = (Math.random() - 0.5) * maxDelta;
          let nextVal = Math.max(min, Math.min(max, curr.value + delta));
          let status = 'SAFE';
          if (nextVal >= dang) status = 'DANGER';
          else if (nextVal >= warn) status = 'WARNING';

          return {
            ...curr,
            value: Number(nextVal.toFixed(2)),
            status,
            history: [...curr.history.slice(1), { time: 'now', value: Number(nextVal.toFixed(2)) }]
          };
        };

        // If in gas emergency, keep CH4 elevated
        if (simulationScenario === 'GAS_EMERGENCY') {
          const highVal = Number((2.45 + (Math.random() * 0.2 - 0.1)).toFixed(2));
          return {
            ...prev,
            ch4: {
              ...prev.ch4,
              value: highVal,
              status: 'DANGER',
              history: [...prev.ch4.history.slice(1), { time: 'now', value: highVal }]
            }
          };
        }

        return {
          ch4: updateVal(prev.ch4, THRESHOLDS.CH4.normal, 0.02, 0.4, 3.5, THRESHOLDS.CH4.warning, THRESHOLDS.CH4.danger),
          co: updateVal(prev.co, THRESHOLDS.CO.normal, 0.4, 5, 80, THRESHOLDS.CO.warning, THRESHOLDS.CO.danger),
          o2: {
            ...prev.o2,
            value: Number((20.9 + (Math.random() * 0.1 - 0.05)).toFixed(2)),
            history: [...prev.o2.history.slice(1), { time: 'now', value: 20.9 }]
          },
          h2s: updateVal(prev.h2s, THRESHOLDS.H2S.normal, 0.05, 0.5, 15, THRESHOLDS.H2S.warning, THRESHOLDS.H2S.danger),
          temperature: updateVal(prev.temperature, THRESHOLDS.TEMP.normal, 0.1, 20, 50, THRESHOLDS.TEMP.warning, THRESHOLDS.TEMP.danger),
          humidity: updateVal(prev.humidity, THRESHOLDS.HUMIDITY.normal, 0.2, 40, 99, THRESHOLDS.HUMIDITY.warning, THRESHOLDS.HUMIDITY.danger),
          waterLevel: updateVal(prev.waterLevel, THRESHOLDS.WATER.normal, 0.01, 0, 1.5, THRESHOLDS.WATER.warning, THRESHOLDS.WATER.danger),
        };
      });

      // Slowly increment rover distance if moving
      if (roverState.mode === 'AUTONOMOUS' && !recoveryState.isStuck) {
        setRoverState(prev => ({
          ...prev,
          distance: Number((prev.distance + 0.04).toFixed(1)),
          // Slight pose motion along route
          x: Math.min(85, prev.x + 0.08),
          y: Math.min(85, prev.y + (Math.random() * 0.06 - 0.02)),
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [missionStatus, simulationScenario, recoveryState.isStuck, roverState.mode]);

  // Simulation Triggers (Section 20 of design.md)
  const triggerGasEmergency = useCallback(() => {
    setSimulationScenario('GAS_EMERGENCY');
    setSensors(prev => ({
      ...prev,
      ch4: {
        ...prev.ch4,
        value: 2.58,
        status: 'CRITICAL',
        history: [...prev.ch4.history.slice(1), { time: 'now', value: 2.58 }]
      }
    }));
    // Recalculate routes: Route A spikes into critical danger
    setRoutes(prev => prev.map(r => {
      if (r.id === 'ROUTE_A') {
        return { ...r, totalRisk: 94, status: 'CRITICAL HAZARD', details: 'CRITICAL METHANE POCKET (2.58% LEL) — EXPLOSION RISK!' };
      }
      return r;
    }));
    setSelectedRouteId('ROUTE_B');
    setApprovedRouteId('ROUTE_B');
    addAlert('CRITICAL', 'CRITICAL GAS SPIKE: Methane CH₄ > 2.5%', 'Tunnel A — North Incline', 'Methane level crossed 2.50% LEL danger threshold. Explosive atmosphere alert.');
    addLog('HAZARD', 'Emergency gas alert: CH₄ 2.58% in Tunnel A. Re-routing recommended to Route B.');
  }, [addAlert, addLog]);

  const triggerSurvivorDetection = useCallback(() => {
    setSimulationScenario('SURVIVOR_FOUND');
    setSurvivorData({
      detected: true,
      yoloConfidence: 94,
      thermalConfirmed: true,
      thermalTemp: 37.1,
      acousticScore: 82,
      combinedConfidence: 96,
      location: 'Tunnel B — Sector 04',
      distance: 14.8,
      lastSeen: 'Just now',
      classification: 'HIGH_CONFIDENCE_POTENTIAL_SURVIVOR',
    });
    addAlert('CRITICAL', 'POTENTIAL SURVIVOR LOCATED', 'Tunnel B — Sector 04', 'YOLO Person (94%) + Thermal body temp (37.1°C) + Acoustic distress confirmed.');
    addLog('SURVIVOR', 'High-confidence survivor detected at 14.8m in Tunnel B Sector 04. Location tagged on SLAM map.');
  }, [addAlert, addLog]);

  const triggerStuckRover = useCallback(() => {
    setSimulationScenario('STUCK_ROVER');
    setRecoveryState({
      isStuck: true,
      step: 1,
      stepDescription: 'Stall detected: Zero displacement reported by LiDAR/IMU while motors engaged'
    });
    addAlert('WARNING', 'Rover Mobility Impairment / Stuck', 'Tunnel B — Rubble Crosscut', 'Initiating 5-step autonomous self-recovery sequence...');
    addLog('ROBOTICS', 'Rover stuck detected at Sector 03. Initiating Recovery: Step 1 [Emergency Stop Motors].');

    // Sequence Step 2: Reverse (after 1.5s)
    setTimeout(() => {
      setRecoveryState({
        isStuck: true,
        step: 2,
        stepDescription: 'Step 2/5: Reversing tracks with differential torque (0.2 m/s)'
      });
      addLog('ROBOTICS', 'Self-Recovery Step 2: Reversing away from obstacle.');
    }, 1800);

    // Sequence Step 3: Turn direction (after 3.5s)
    setTimeout(() => {
      setRecoveryState({
        isStuck: true,
        step: 3,
        stepDescription: 'Step 3/5: Pivot turning 35° clockwise away from obstacle face'
      });
      addLog('ROBOTICS', 'Self-Recovery Step 3: Turning 35° clockwise to clear tracks.');
    }, 3600);

    // Sequence Step 4: Re-plan route (after 5.2s)
    setTimeout(() => {
      setRecoveryState({
        isStuck: true,
        step: 4,
        stepDescription: 'Step 4/5: Dynamic costmap update — Marking obstacle grid and recalculating local path'
      });
      addLog('NAVIGATION', 'Self-Recovery Step 4: Local Nav2 costmap updated with obstacle polygon.');
    }, 5400);

    // Sequence Step 5: Resume (after 7.0s)
    setTimeout(() => {
      setRecoveryState({
        isStuck: false,
        step: 5,
        stepDescription: 'Step 5/5: Recovery successful — Autonomous navigation resumed along bypass path'
      });
      addLog('ROBOTICS', 'Self-Recovery complete! Rover restored to nominal exploration.');
      addAlert('INFO', 'Rover Self-Recovery Completed', 'Tunnel B', 'Rover successfully freed from obstacle and resuming mission.');
    }, 7200);
  }, [addAlert, addLog]);

  const triggerCommLoss = useCallback(() => {
    setSimulationScenario('COMM_LOSS');
    setRoverState(prev => ({
      ...prev,
      signalStrength: 18,
      latency: 680,
      packetSuccess: 84.2,
      commType: 'LORA_FALLBACK',
      commHealth: 'WEAK'
    }));
    addAlert('WARNING', 'Weak Surface Signal / LoRa Fallback', 'Deep Gallery', 'Mesh Wi-Fi degraded. High-bandwidth video suspended; operating on LoRa telemetry.');
    addLog('COMMUNICATION', 'Wi-Fi mesh link dropped below 20%. Fallback to LoRa sub-GHz telemetry protocol active.');
  }, [addAlert, addLog]);

  const resetSimulation = useCallback(() => {
    setSimulationScenario('NOMINAL');
    setSensors({
      ch4: { value: 0.62, status: 'SAFE', unit: '% LEL', history: initialHistory(0.62) },
      co: { value: 12.0, status: 'SAFE', unit: 'ppm', history: initialHistory(12.0) },
      o2: { value: 20.9, status: 'SAFE', unit: '%', history: initialHistory(20.9) },
      h2s: { value: 1.1, status: 'SAFE', unit: 'ppm', history: initialHistory(1.1) },
      temperature: { value: 27.8, status: 'SAFE', unit: '°C', history: initialHistory(27.8) },
      humidity: { value: 66.0, status: 'SAFE', unit: '%', history: initialHistory(66.0) },
      waterLevel: { value: 0.12, status: 'SAFE', unit: 'm', history: initialHistory(0.12) },
    });
    setRoverState(prev => ({
      ...prev,
      signalStrength: 86,
      latency: 142,
      packetSuccess: 99.1,
      commType: 'WIFI_MESH',
      commHealth: 'CONNECTED',
      mode: 'AUTONOMOUS'
    }));
    setRecoveryState({
      isStuck: false,
      step: 0,
      stepDescription: 'Normal traction — 4-wheel drive nominal'
    });
    setRoutes(prev => prev.map(r => {
      if (r.id === 'ROUTE_A') {
        return { ...r, totalRisk: 76, status: 'HIGH RISK', details: 'High methane accumulation detected near North Drift; not advised.' };
      }
      return r;
    }));
    setSelectedRouteId('ROUTE_B');
    setApprovedRouteId('ROUTE_B');
    addLog('SYSTEM', 'Simulation reset to Nominal Mission Patrol baseline.');
  }, [addLog]);

  // Emergency Stop Handler
  const triggerEmergencyStop = useCallback(() => {
    setIsEmergencyStopped(true);
    setMissionStatus('EMERGENCY_STOP');
    setRoverState(prev => ({ ...prev, speed: 0 }));
    addAlert('CRITICAL', 'OPERATOR EMERGENCY STOP ACTIVATED', 'All Sectors', 'All rover drive motors disabled. Safety brakes clamped. Telemetry remains active.');
    addLog('CRITICAL', 'EMERGENCY STOP manually triggered from Surface Station.');
  }, [addAlert, addLog]);

  const resumeFromEmergencyStop = useCallback(() => {
    setIsEmergencyStopped(false);
    setMissionStatus('ACTIVE');
    setRoverState(prev => ({ ...prev, speed: 0.42 }));
    addLog('SYSTEM', 'Emergency stop cleared by operator authorization. Mission resumed.');
  }, [addLog]);

  // Return to Base Command
  const triggerReturnToBase = useCallback(() => {
    setRoverState(prev => ({ ...prev, mode: 'ASSISTED' }));
    addAlert('INFO', 'Return-to-Base (RTB) Commanded', 'Mine Entrance', 'Autonomous back-tracking along reverse breadcrumb trail initiated.');
    addLog('NAVIGATION', 'Return-to-Base commanded by operator. Calculating shortest safe backtrack.');
  }, [addAlert, addLog]);

  // Teleoperation Drive
  const handleDrive = useCallback((direction) => {
    if (roverState.mode !== 'MANUAL') return;
    addLog('TELEOP', `Manual motor command: ${direction}`);
  }, [roverState.mode, addLog]);

  const acknowledgeAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  const value = {
    missionTime,
    missionStatus,
    activeTab,
    setActiveTab,
    roverState,
    setRoverState,
    sensors,
    survivorData,
    routes,
    selectedRouteId,
    setSelectedRouteId,
    approvedRouteId,
    setApprovedRouteId,
    recoveryState,
    simulationScenario,
    alerts,
    missionLogs,
    isEmergencyStopped,
    triggerGasEmergency,
    triggerSurvivorDetection,
    triggerStuckRover,
    triggerCommLoss,
    resetSimulation,
    triggerEmergencyStop,
    resumeFromEmergencyStop,
    triggerReturnToBase,
    handleDrive,
    acknowledgeAlert,
    addLog
  };

  return (
    <MissionContext.Provider value={value}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};
