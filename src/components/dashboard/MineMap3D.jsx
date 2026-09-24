import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { 
  Eye, 
  Compass, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Flame, 
  Droplets, 
  ShieldAlert, 
  UserCheck, 
  Radio, 
  Maximize2,
  Navigation,
  Crosshair,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const MineMap3D = ({ onToggle2D }) => {
  const containerRef = useRef(null);
  const { roverState, survivorData, approvedRouteId, simulationScenario, setRoverState } = useMission();

  // View state & layer toggles
  const [activeCameraView, setActiveCameraView] = useState('ISOMETRIC'); // 'ISOMETRIC' | 'ROVER_CHASE' | 'TOP_DOWN' | 'ELEVATION' | 'SURVIVOR'
  const [showPointCloud, setShowPointCloud] = useState(true);
  const [showTunnelMesh, setShowTunnelMesh] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [showDepthRulers, setShowDepthRulers] = useState(true);
  const [selectedSectorInfo, setSelectedSectorInfo] = useState(null);
  const [pointCloudDensity, setPointCloudDensity] = useState(3200);

  // References to three objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const roverGroupRef = useRef(null);
  const lidarTurretRef = useRef(null);
  const lidarSweepRef = useRef(null);
  const gasHazardMeshRef = useRef(null);
  const survivorBeaconRef = useRef(null);
  const pointsRef = useRef(null);
  const routeSplineRef = useRef(null);
  const targetCamPosRef = useRef(new THREE.Vector3(50, 45, 60));
  const targetLookAtRef = useRef(new THREE.Vector3(10, -15, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(10, -15, 0));

  // Mouse interaction state for orbital controls
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 85, theta: Math.PI / 4, phi: Math.PI / 3 });

  // Camera preset positions
  const setCameraPreset = useCallback((preset) => {
    setActiveCameraView(preset);
    soundManager.playClick();

    if (preset === 'ISOMETRIC') {
      targetCamPosRef.current.set(55, 45, 65);
      targetLookAtRef.current.set(10, -18, 0);
    } else if (preset === 'ROVER_CHASE') {
      // Behind rover
      const rx = (roverState.x - 42) * 0.8;
      const ry = -28;
      const rz = (roverState.y - 58) * 0.6;
      targetCamPosRef.current.set(rx - 14, ry + 7, rz);
      targetLookAtRef.current.set(rx + 15, ry, rz);
    } else if (preset === 'TOP_DOWN') {
      // Orthographic bird's-eye SLAM plan view
      targetCamPosRef.current.set(12, 105, 0.1);
      targetLookAtRef.current.set(12, -25, 0);
    } else if (preset === 'ELEVATION') {
      // Side longitudinal profile showing underground depth
      targetCamPosRef.current.set(10, -20, 110);
      targetLookAtRef.current.set(10, -20, 0);
    } else if (preset === 'SURVIVOR') {
      // Focused on Sector 04 survivor zone
      targetCamPosRef.current.set(40, -18, -10);
      targetLookAtRef.current.set(38, -30, -20);
    }
  }, [roverState.x, roverState.y]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.FogExp2(0x060a14, 0.011);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.5, 500);
    camera.position.copy(targetCamPosRef.current);
    camera.lookAt(targetLookAtRef.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight.position.set(40, 80, 50);
    scene.add(dirLight);

    const entranceLight = new THREE.PointLight(0x38bdf8, 1.8, 45);
    entranceLight.position.set(-35, 2, 0);
    scene.add(entranceLight);

    const junctionLight = new THREE.PointLight(0x0284c7, 1.5, 40);
    junctionLight.position.set(10, -28, 0);
    scene.add(junctionLight);

    // Hazard Red Light at Tunnel A
    const hazardLight = new THREE.PointLight(0xef4444, 2.2, 35);
    hazardLight.position.set(22, -32, 28);
    scene.add(hazardLight);

    // Survivor Amber Beacon Light in Tunnel B
    const survivorLight = new THREE.PointLight(0xf97316, 2.5, 35);
    survivorLight.position.set(38, -30, -22);
    scene.add(survivorLight);

    // ==========================================
    // 5. Ground Surface & Depth Grid Levels
    // ==========================================
    // Ground level grid (Surface Portal)
    const surfaceGrid = new THREE.GridHelper(140, 28, 0x1e2d4d, 0x0f172a);
    surfaceGrid.position.y = 0;
    scene.add(surfaceGrid);

    // Underground depth elevation reference planes & labels
    const depths = [-20, -40, -60];
    depths.forEach((d) => {
      const subGrid = new THREE.GridHelper(100, 20, 0x141e34, 0x0a0f1d);
      subGrid.position.y = d;
      scene.add(subGrid);
    });

    // Vertical shaft depth guides (Corner markers)
    const verticalLineMat = new THREE.LineDashedMaterial({ color: 0x22d3ee, dashSize: 2, gapSize: 2, opacity: 0.35, transparent: true });
    [[-45, 0], [45, 0], [10, 35], [10, -35]].forEach(([x, z]) => {
      const points = [new THREE.Vector3(x, 2, z), new THREE.Vector3(x, -65, z)];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, verticalLineMat);
      line.computeLineDistances();
      scene.add(line);
    });

    // ==========================================
    // 6. Underground Tunnel Mesh Network
    // ==========================================
    const tunnelGroup = new THREE.Group();
    tunnelGroup.name = 'tunnelGroup';

    // Helper to create arch-profile tunnel segments
    const createTunnelSegment = (p1, p2, width, height, color = 0x0d1a33) => {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

      const shape = new THREE.Shape();
      // Arched horseshoe mine tunnel cross-section
      const w = width / 2;
      const h = height;
      shape.moveTo(-w, 0);
      shape.lineTo(w, 0);
      shape.lineTo(w, h * 0.65);
      shape.quadraticCurveTo(w, h, 0, h);
      shape.quadraticCurveTo(-w, h, -w, h * 0.65);
      shape.closePath();

      const extrudeSettings = {
        steps: 4,
        depth: len,
        bevelEnabled: false
      };

      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geom.center();

      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.85,
        metalness: 0.2,
        side: THREE.BackSide, // Visible inside the tunnel!
        wireframe: false,
        transparent: true,
        opacity: 0.88
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());

      // Timber Arch Support Rigs along tunnel
      const archMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const archCount = Math.floor(len / 8);
      for (let i = 0; i <= archCount; i++) {
        const archGeom = new THREE.TorusGeometry(w * 0.95, 0.25, 4, 16, Math.PI);
        const archMesh = new THREE.Mesh(archGeom, archMat);
        archMesh.rotation.x = Math.PI / 2;
        archMesh.position.set(0, h * 0.5, -len / 2 + (i * 8));
        mesh.add(archMesh);
      }

      // Rails along floor
      const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
      [-w * 0.45, w * 0.45].forEach((rx) => {
        const railGeom = new THREE.BoxGeometry(0.2, 0.25, len);
        const railMesh = new THREE.Mesh(railGeom, railMat);
        railMesh.position.set(rx, 0.15, 0);
        mesh.add(railMesh);
      });

      tunnelGroup.add(mesh);
      return mesh;
    };

    // Tunnel 1: Portal Alpha Entrance descending to Main Crosscut Junction
    // Elevation: 0m down to -28m
    createTunnelSegment(
      new THREE.Vector3(-42, 0, 0),
      new THREE.Vector3(10, -28, 0),
      7.5,
      6.2,
      0x0e1b36
    );

    // Tunnel 2: Tunnel A (North Incline - Hazardous Gas Drift)
    // Slopes toward high methane cavern: (10, -28, 0) -> (25, -34, 30)
    createTunnelSegment(
      new THREE.Vector3(10, -28, 0),
      new THREE.Vector3(26, -34, 30),
      6.8,
      5.8,
      0x1a1226
    );

    // Tunnel 3: Crosscut 1 Corridor (Safe Detour linking North & East)
    createTunnelSegment(
      new THREE.Vector3(10, -28, 0),
      new THREE.Vector3(18, -30, -10),
      7.0,
      6.0,
      0x0e1f38
    );

    // Tunnel 4: Tunnel B (Haulage Gallery - Survivor Zone)
    // Extends to (45, -32, -24)
    createTunnelSegment(
      new THREE.Vector3(18, -30, -10),
      new THREE.Vector3(45, -32, -24),
      7.2,
      6.0,
      0x0e243d
    );

    // Tunnel 5: South Drift (Deep Unexplored Section - Blocked by Rubble)
    // Slopes down into the depths: (10, -28, 0) -> (10, -52, -2)
    createTunnelSegment(
      new THREE.Vector3(10, -28, 0),
      new THREE.Vector3(10, -52, -2),
      6.0,
      5.2,
      0x090e1c
    );

    scene.add(tunnelGroup);

    // ==========================================
    // 7. SLAM LiDAR Point Cloud Particles
    // ==========================================
    const pointCount = 3800;
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);

    const colCyan = new THREE.Color(0x38bdf8);
    const colTeal = new THREE.Color(0x14b8a6);
    const colAmber = new THREE.Color(0xf59e0b);
    const colRed = new THREE.Color(0xef4444);

    let pIdx = 0;
    // Generate LiDAR points along tunnel boundaries
    const addTunnelPoints = (p1, p2, radius, count, baseColor) => {
      for (let i = 0; i < count; i++) {
        const t = Math.random();
        const center = new THREE.Vector3().lerpVectors(p1, p2, t);
        const angle = Math.random() * Math.PI * 2;
        const r = radius * (0.85 + Math.random() * 0.3);
        const x = center.x + (Math.random() - 0.5) * 1.5;
        const y = center.y + Math.sin(angle) * (r * 0.6) + (r * 0.4);
        const z = center.z + Math.cos(angle) * r;

        pointPositions[pIdx * 3] = x;
        pointPositions[pIdx * 3 + 1] = y;
        pointPositions[pIdx * 3 + 2] = z;

        // Depth / Zone color gradient
        let c = baseColor.clone();
        if (z > 15) {
          c = colRed; // Gas hazard zone
        } else if (z < -12 && x > 25) {
          c = colAmber; // Survivor zone
        } else if (y < -20) {
          c = colTeal;
        }

        pointColors[pIdx * 3] = c.r;
        pointColors[pIdx * 3 + 1] = c.g;
        pointColors[pIdx * 3 + 2] = c.b;

        pIdx++;
      }
    };

    addTunnelPoints(new THREE.Vector3(-42, 0, 0), new THREE.Vector3(10, -28, 0), 3.6, 1200, colCyan);
    addTunnelPoints(new THREE.Vector3(10, -28, 0), new THREE.Vector3(26, -34, 30), 3.2, 800, colRed);
    addTunnelPoints(new THREE.Vector3(10, -28, 0), new THREE.Vector3(18, -30, -10), 3.4, 500, colCyan);
    addTunnelPoints(new THREE.Vector3(18, -30, -10), new THREE.Vector3(45, -32, -24), 3.4, 800, colAmber);
    addTunnelPoints(new THREE.Vector3(10, -28, 0), new THREE.Vector3(10, -52, -2), 2.8, 500, new THREE.Color(0x475569));

    const pointGeom = new THREE.BufferGeometry();
    pointGeom.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointGeom.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 0.48,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const pointCloud = new THREE.Points(pointGeom, pointMat);
    scene.add(pointCloud);
    pointsRef.current = pointCloud;

    // ==========================================
    // 8. Procedural 3D NETRA-X Rover Model
    // ==========================================
    const roverGroup = new THREE.Group();
    roverGroupRef.current = roverGroup;

    // Main Chassis
    const chassisGeom = new THREE.BoxGeometry(3.6, 1.4, 2.4);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.65,
      roughness: 0.35
    });
    const chassisMesh = new THREE.Mesh(chassisGeom, chassisMat);
    chassisMesh.position.y = 1.0;
    roverGroup.add(chassisMesh);

    // Hazard Stripes & Protective Roll Cage
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 });
    const cageGeom = new THREE.TorusGeometry(1.4, 0.1, 4, 8);
    const cage1 = new THREE.Mesh(cageGeom, cageMat);
    cage1.position.set(0, 1.7, 0);
    roverGroup.add(cage1);

    // Tracks (Left & Right)
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    [-1.35, 1.35].forEach((tz) => {
      const trackGeom = new THREE.BoxGeometry(3.9, 0.8, 0.6);
      const track = new THREE.Mesh(trackGeom, trackMat);
      track.position.set(0, 0.5, tz);
      roverGroup.add(track);

      // Sprocket wheels
      [-1.4, 0, 1.4].forEach((wx) => {
        const wheelGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.65, 12);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 });
        const wheel = new THREE.Mesh(wheelGeom, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.5, tz);
        roverGroup.add(wheel);
      });
    });

    // 360° Rotating LiDAR Turret
    const lidarPuck = new THREE.Group();
    const lidarBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.5, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
    );
    const lidarSensor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6 })
    );
    lidarSensor.position.y = 0.35;
    lidarPuck.add(lidarBase);
    lidarPuck.add(lidarSensor);
    lidarPuck.position.set(0.6, 1.8, 0);
    roverGroup.add(lidarPuck);
    lidarTurretRef.current = lidarPuck;

    // Active LiDAR Fan Beam Sweep (Visual Laser Radar)
    const sweepGeom = new THREE.ConeGeometry(9.0, 0.05, 16, 1, true, 0, Math.PI * 0.45);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const lidarSweep = new THREE.Mesh(sweepGeom, sweepMat);
    lidarSweep.rotation.x = Math.PI / 2;
    lidarSweep.position.y = 0.35;
    lidarPuck.add(lidarSweep);
    lidarSweepRef.current = lidarSweep;

    // Dual High-Power Headlights with real spotlight cones
    [-0.6, 0.6].forEach((hz) => {
      const headlight = new THREE.SpotLight(0xf8fafc, 3.5, 38, Math.PI * 0.25, 0.4, 1.2);
      headlight.position.set(1.9, 1.2, hz);
      headlight.target.position.set(20, 0, hz);
      roverGroup.add(headlight);
      roverGroup.add(headlight.target);

      // Visual lens bulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
      );
      bulb.position.set(1.85, 1.2, hz);
      roverGroup.add(bulb);
    });

    // Rear Telemetry Antenna with Blinking Beacon
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    antenna.position.set(-1.4, 2.2, 0.8);
    roverGroup.add(antenna);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    beacon.position.set(-1.4, 3.1, 0.8);
    roverGroup.add(beacon);

    // Initial rover position in Tunnel B
    roverGroup.position.set(24, -30.5, -14);
    roverGroup.rotation.y = -Math.PI * 0.15;
    scene.add(roverGroup);

    // ==========================================
    // 9. Volumetric Methane Hazard Cloud in Tunnel A
    // ==========================================
    const gasGroup = new THREE.Group();
    gasGroup.position.set(24, -33, 28);

    const gasCoreGeom = new THREE.SphereGeometry(6.5, 16, 16);
    const gasCoreMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.35,
      roughness: 1.0
    });
    const gasCoreMesh = new THREE.Mesh(gasCoreGeom, gasCoreMat);
    gasGroup.add(gasCoreMesh);
    gasHazardMeshRef.current = gasCoreMesh;

    // Outer hazy gas cloud ring
    const gasAuraGeom = new THREE.SphereGeometry(9.0, 16, 16);
    const gasAuraMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.14,
      wireframe: true
    });
    const gasAuraMesh = new THREE.Mesh(gasAuraGeom, gasAuraMat);
    gasGroup.add(gasAuraMesh);

    scene.add(gasGroup);

    // ==========================================
    // 10. Water Flooding in Crosscut Dip
    // ==========================================
    const waterGeom = new THREE.PlaneGeometry(16, 5);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.72
    });
    const waterMesh = new THREE.Mesh(waterGeom, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(32, -31.9, -18);
    scene.add(waterMesh);

    // ==========================================
    // 11. Survivor 3D Beacon at Sector 04
    // ==========================================
    const survivorGroup = new THREE.Group();
    survivorGroup.position.set(38, -31, -22);

    // Amber Human thermal avatar mesh
    const humanBodyGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.4, 8);
    const humanHeadGeom = new THREE.SphereGeometry(0.35, 8, 8);
    const humanMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xe11d48,
      emissiveIntensity: 0.8
    });
    const bodyMesh = new THREE.Mesh(humanBodyGeom, humanMat);
    bodyMesh.position.y = 0.7;
    const headMesh = new THREE.Mesh(humanHeadGeom, humanMat);
    headMesh.position.y = 1.7;
    survivorGroup.add(bodyMesh);
    survivorGroup.add(headMesh);

    // Pulsing Beacon Floor Rings
    const beaconRingGeom = new THREE.RingGeometry(1.0, 1.4, 24);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const beaconRing = new THREE.Mesh(beaconRingGeom, beaconRingMat);
    beaconRing.rotation.x = -Math.PI / 2;
    beaconRing.position.y = 0.1;
    survivorGroup.add(beaconRing);
    survivorBeaconRef.current = beaconRing;

    // Laser distance line connecting Rover to Survivor
    const distanceLineMat = new THREE.LineDashedMaterial({
      color: 0xf97316,
      dashSize: 1.2,
      gapSize: 0.8,
      opacity: 0.75,
      transparent: true
    });
    const distanceLineGeom = new THREE.BufferGeometry().setFromPoints([
      roverGroup.position,
      survivorGroup.position
    ]);
    const distanceLine = new THREE.Line(distanceLineGeom, distanceLineMat);
    distanceLine.computeLineDistances();
    scene.add(distanceLine);

    scene.add(survivorGroup);

    // ==========================================
    // 12. 3D Safe Route (A* Navigation Path)
    // ==========================================
    const waypoints = [
      new THREE.Vector3(-40, 0.3, 0),
      new THREE.Vector3(-15, -12, 0),
      new THREE.Vector3(10, -27.8, 0),
      new THREE.Vector3(18, -29.8, -10),
      new THREE.Vector3(26, -30.8, -16),
      new THREE.Vector3(38, -31.8, -22)
    ];

    const curve = new THREE.CatmullRomCurve3(waypoints);
    const tubeGeom = new THREE.TubeGeometry(curve, 48, 0.28, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const routeTube = new THREE.Mesh(tubeGeom, tubeMat);
    scene.add(routeTube);
    routeSplineRef.current = routeTube;

    // Add glowing waypoint pins
    waypoints.forEach((wp, idx) => {
      const pinGeom = new THREE.SphereGeometry(0.55, 12, 12);
      const pinMat = new THREE.MeshStandardMaterial({
        color: idx === waypoints.length - 1 ? 0xf97316 : 0x10b981,
        emissive: idx === waypoints.length - 1 ? 0xf97316 : 0x10b981,
        emissiveIntensity: 0.7
      });
      const pin = new THREE.Mesh(pinGeom, pinMat);
      pin.position.copy(wp);
      scene.add(pin);
    });

    // ==========================================
    // 13. Animation & Render Loop
    // ==========================================
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation toward target
      camera.position.lerp(targetCamPosRef.current, 0.05);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.05);
      camera.lookAt(currentLookAtRef.current);

      // Rotate LiDAR Puck & Sweep
      if (lidarTurretRef.current) {
        lidarTurretRef.current.rotation.y += 0.05;
      }
      if (lidarSweepRef.current) {
        lidarSweepRef.current.material.opacity = 0.15 + Math.sin(elapsedTime * 6) * 0.1;
      }

      // Pulsing Gas Hazard Cloud
      if (gasHazardMeshRef.current) {
        const pulse = 1.0 + Math.sin(elapsedTime * 3) * 0.15;
        gasHazardMeshRef.current.scale.set(pulse, pulse, pulse);
        hazardLight.intensity = 1.5 + Math.sin(elapsedTime * 4) * 0.8;
      }

      // Pulsing Survivor Beacon
      if (survivorBeaconRef.current) {
        const ringScale = 1.0 + (elapsedTime % 1.5) * 1.8;
        survivorBeaconRef.current.scale.set(ringScale, ringScale, ringScale);
        survivorBeaconRef.current.material.opacity = Math.max(0, 1.0 - (elapsedTime % 1.5) / 1.5);
      }

      // Animate Route glow
      if (routeSplineRef.current) {
        routeSplineRef.current.material.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 4) * 0.3;
      }

      // Dynamic Rover Position update from state
      if (roverGroupRef.current) {
        // Map 2D coordinates (42, 58) to 3D tunnel coordinates
        const targetX = (roverState.x - 30) * 0.8;
        const targetZ = -(roverState.y - 45) * 0.7;
        const targetY = -28 - (targetX * 0.15);

        roverGroupRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08);
        roverGroupRef.current.rotation.y = THREE.MathUtils.degToRad(-roverState.heading);

        // Update dynamic distance laser range line
        distanceLine.geometry.setFromPoints([
          roverGroupRef.current.position,
          survivorGroup.position
        ]);
        distanceLine.computeLineDistances();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync hazard state when simulation scenario changes
  useEffect(() => {
    if (!gasHazardMeshRef.current) return;
    if (simulationScenario === 'GAS_EMERGENCY') {
      gasHazardMeshRef.current.scale.set(1.45, 1.45, 1.45);
      gasHazardMeshRef.current.material.color.setHex(0xdc2626);
      gasHazardMeshRef.current.material.emissive.setHex(0xef4444);
      gasHazardMeshRef.current.material.opacity = 0.6;
    } else {
      gasHazardMeshRef.current.scale.set(1.0, 1.0, 1.0);
      gasHazardMeshRef.current.material.color.setHex(0xef4444);
      gasHazardMeshRef.current.material.emissive.setHex(0xd97706);
      gasHazardMeshRef.current.material.opacity = 0.35;
    }
  }, [simulationScenario]);

  // Sync layer toggles
  useEffect(() => {
    if (pointsRef.current) pointsRef.current.visible = showPointCloud;
  }, [showPointCloud]);

  useEffect(() => {
    if (sceneRef.current) {
      const tunnel = sceneRef.current.getObjectByName('tunnelGroup');
      if (tunnel) tunnel.visible = showTunnelMesh;
    }
  }, [showTunnelMesh]);

  useEffect(() => {
    if (gasHazardMeshRef.current) gasHazardMeshRef.current.visible = showHazards;
  }, [showHazards]);

  useEffect(() => {
    if (routeSplineRef.current) routeSplineRef.current.visible = showRoute;
  }, [showRoute]);

  // Mouse Orbital Interaction Controls
  const handleMouseDown = (e) => {
    if (e.button === 0) isDraggingRef.current = true;
    if (e.button === 2) isPanningRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current && !isPanningRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (isDraggingRef.current) {
      // Rotate camera around targetLookAt
      const sensitivity = 0.007;
      const offset = new THREE.Vector3().subVectors(targetCamPosRef.current, targetLookAtRef.current);
      const radius = offset.length();
      let theta = Math.atan2(offset.x, offset.z) - deltaX * sensitivity;
      let phi = Math.acos(Math.max(-0.99, Math.min(0.99, offset.y / radius))) - deltaY * sensitivity;
      phi = Math.max(0.1, Math.min(Math.PI / 2.05, phi)); // Keep above subterranean floor

      targetCamPosRef.current.x = targetLookAtRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCamPosRef.current.y = targetLookAtRef.current.y + radius * Math.cos(phi);
      targetCamPosRef.current.z = targetLookAtRef.current.z + radius * Math.sin(phi) * Math.cos(theta);
    } else if (isPanningRef.current) {
      // Pan camera & target together
      const panSpeed = 0.08;
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraRef.current.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cameraRef.current.quaternion);

      const move = right.multiplyScalar(-deltaX * panSpeed).add(up.multiplyScalar(deltaY * panSpeed));
      targetCamPosRef.current.add(move);
      targetLookAtRef.current.add(move);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.06;
    const dir = new THREE.Vector3().subVectors(targetCamPosRef.current, targetLookAtRef.current).normalize();
    const currentDist = targetCamPosRef.current.distanceTo(targetLookAtRef.current);
    const newDist = Math.max(12, Math.min(180, currentDist + zoomFactor));
    targetCamPosRef.current.copy(targetLookAtRef.current).add(dir.multiplyScalar(newDist));
  };

  // Zoom buttons
  const handleZoom = (inOut) => {
    soundManager.playClick();
    const factor = inOut ? -15 : 15;
    const dir = new THREE.Vector3().subVectors(targetCamPosRef.current, targetLookAtRef.current).normalize();
    const currentDist = targetCamPosRef.current.distanceTo(targetLookAtRef.current);
    const newDist = Math.max(15, Math.min(170, currentDist + factor));
    targetCamPosRef.current.copy(targetLookAtRef.current).add(dir.multiplyScalar(newDist));
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-mine-surface border border-mine-border rounded-lg overflow-hidden shadow-xl select-none">
      {/* 3D Map Tactical Header */}
      <div className="bg-mine-card/90 px-3 py-2 border-b border-mine-border flex flex-wrap items-center justify-between gap-2 z-20 backdrop-blur">
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>3D SUBTERRANEAN SLAM</span>
          </div>
          <span className="text-mine-muted hidden sm:inline">|</span>
          <span className="text-white font-semibold hidden sm:inline">DEPTH: -32m (SECTOR 04)</span>
          <span className="text-mine-muted hidden md:inline">|</span>
          <span className="text-emerald-400 font-medium hidden md:inline">RESOLUTION: 3.5cm VOXEL</span>
        </div>

        {/* View Mode & Preset Controls */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {/* Switch to 2D Plan Grid */}
          <button
            onClick={onToggle2D}
            className="px-2 py-1 rounded bg-mine-darkest hover:bg-cyan-950 text-cyan-400 border border-cyan-800/80 flex items-center gap-1 text-[11px] font-bold transition"
            title="Switch back to 2D Plan Occupancy Grid"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D VIEW</span>
          </button>

          <div className="h-4 w-px bg-mine-border mx-0.5" />

          {/* Camera View Angle Selector */}
          <div className="flex items-center bg-mine-darkest p-0.5 rounded border border-mine-border text-[11px]">
            {[
              { id: 'ISOMETRIC', label: '3D ISO' },
              { id: 'ROVER_CHASE', label: 'CHASE' },
              { id: 'TOP_DOWN', label: 'TOP-DOWN' },
              { id: 'ELEVATION', label: 'PROFILE' },
              { id: 'SURVIVOR', label: 'SURVIVOR' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setCameraPreset(v.id)}
                className={`px-2 py-0.5 rounded transition ${
                  activeCameraView === v.id
                    ? 'bg-cyan-600 text-white font-bold shadow'
                    : 'text-mine-subtext hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex-1 w-full min-h-[360px] bg-[#060a14] cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Subtle HUD crosshair watermark */}
        <div className="absolute inset-0 pointer-events-none tactical-scanlines opacity-25 z-10" />

        {/* 3D Floating HUD Telemetry Badge (Top Left) */}
        <div className="absolute left-3 top-3 z-20 bg-mine-darkest/85 border border-mine-border/90 rounded-lg p-2.5 font-mono text-[11px] text-white shadow-xl backdrop-blur max-w-xs space-y-1">
          <div className="flex items-center justify-between border-b border-mine-border pb-1">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              NETRA-X POSE [3D SLAM]
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">ODOMETRY: 98.6%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-0.5 text-[10px]">
            <div>
              <span className="text-mine-muted">X:</span>{' '}
              <strong className="text-white">{roverState.x.toFixed(1)}m</strong>
            </div>
            <div>
              <span className="text-mine-muted">Y:</span>{' '}
              <strong className="text-white">{roverState.y.toFixed(1)}m</strong>
            </div>
            <div>
              <span className="text-mine-muted">Z (Depth):</span>{' '}
              <strong className="text-cyan-300">-30.5m</strong>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-mine-border/50 text-mine-subtext">
            <span>PITCH: <strong className="text-amber-300">-6.8°</strong></span>
            <span>ROLL: <strong className="text-white">1.2°</strong></span>
            <span>HEADING: <strong className="text-cyan-300">{roverState.heading}°</strong></span>
          </div>
        </div>

        {/* Live Survivor Range Target HUD (Top Center) */}
        {survivorData.detected && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-orange-950/85 border border-orange-600/90 rounded-lg px-3 py-1.5 font-mono text-xs text-orange-200 shadow-2xl backdrop-blur flex items-center gap-2.5 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
            <div>
              <span className="font-bold text-orange-400">SURVIVOR BEACON:</span>{' '}
              <span className="text-white font-semibold">14.8m Range</span>
              <span className="text-orange-300 ml-2">| 37.1°C Body Temp</span>
            </div>
          </div>
        )}

        {/* 3D Map Layer Toggles & Zoom Controls (Right Side) */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          {/* Zoom controls */}
          <div className="bg-mine-darkest/90 border border-mine-border rounded-lg p-1 flex flex-col gap-1 shadow-lg">
            <button
              onClick={() => handleZoom(true)}
              className="p-1.5 text-cyan-400 hover:text-cyan-200 hover:bg-mine-card rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(false)}
              className="p-1.5 text-cyan-400 hover:text-cyan-200 hover:bg-mine-card rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraPreset('ISOMETRIC')}
              className="p-1.5 text-mine-muted hover:text-white hover:bg-mine-card rounded transition"
              title="Reset 3D Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Layer toggles */}
          <div className="bg-mine-darkest/90 border border-mine-border rounded-lg p-1.5 flex flex-col gap-1 text-[10px] font-mono shadow-lg">
            <button
              onClick={() => setShowPointCloud(!showPointCloud)}
              className={`px-2 py-1 rounded text-left transition ${
                showPointCloud ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-mine-muted hover:text-white'
              }`}
            >
              ● LiDAR (3.8k pts)
            </button>
            <button
              onClick={() => setShowTunnelMesh(!showTunnelMesh)}
              className={`px-2 py-1 rounded text-left transition ${
                showTunnelMesh ? 'bg-blue-950 text-blue-300 font-bold border border-blue-800' : 'text-mine-muted hover:text-white'
              }`}
            >
              ■ 3D Rock Walls
            </button>
            <button
              onClick={() => setShowHazards(!showHazards)}
              className={`px-2 py-1 rounded text-left transition ${
                showHazards ? 'bg-red-950 text-red-300 font-bold border border-red-800' : 'text-mine-muted hover:text-white'
              }`}
            >
              ▲ Hazard Volumes
            </button>
            <button
              onClick={() => setShowRoute(!showRoute)}
              className={`px-2 py-1 rounded text-left transition ${
                showRoute ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-mine-muted hover:text-white'
              }`}
            >
              ► A* Safe Path
            </button>
          </div>
        </div>

        {/* 3D Map Legend & Navigation Compass (Bottom Left) */}
        <div className="absolute left-3 bottom-3 z-20 bg-mine-darkest/90 border border-mine-border/80 rounded-lg p-2.5 font-mono text-[10px] space-y-1.5 shadow-xl backdrop-blur max-w-xs">
          <div className="text-mine-muted uppercase tracking-wider text-[9px] font-bold border-b border-mine-border pb-1 flex items-center justify-between">
            <span>3D Legend &amp; Strata</span>
            <span className="text-cyan-400">Controls: Orbit / Pan / Scroll</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-500/40"></div>
            <span>NETRA-X Rover with Active Spotlights</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-4 h-1 rounded bg-emerald-400"></div>
            <span>3D A* Safe Navigation Corridor</span>
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <span>Methane Hazard Volume (Tunnel A &gt;2.5%)</span>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-500/50"></div>
            <span>Survivor Heat Avatar (Sector 04, 37.1°C)</span>
          </div>
          <div className="flex items-center gap-2 text-sky-400">
            <div className="w-2.5 h-2.5 rounded bg-sky-600"></div>
            <span>Standing Water Pool (Crosscut East)</span>
          </div>
        </div>

        {/* Subterranean Depth Profile Indicator (Bottom Right) */}
        <div className="absolute right-3 bottom-3 z-20 bg-mine-darkest/90 border border-mine-border/80 rounded-lg p-2 font-mono text-[10px] text-white shadow-xl backdrop-blur flex items-center gap-3">
          <div className="flex flex-col items-end text-mine-subtext text-[9px]">
            <span>SURFACE (0m)</span>
            <span className="text-cyan-400 font-bold">SHAFT 1 (-15m)</span>
            <span className="text-emerald-400 font-bold">ROVER (-30.5m)</span>
            <span className="text-mine-muted">DEEP SECTOR (-60m)</span>
          </div>
          <div className="h-14 w-2 bg-gradient-to-b from-cyan-400 via-emerald-400 to-slate-700 rounded-full" />
        </div>
      </div>

      {/* 3D Map Footer Telemetry Bar */}
      <div className="bg-mine-card/90 px-3 py-1.5 border-t border-mine-border flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-mine-subtext z-20">
        <div className="flex items-center gap-3">
          <span>ACTIVE SECTOR: <strong className="text-white">Tunnel B (Sector 04 Target Corridor)</strong></span>
          <span>•</span>
          <span>STRATA CLEARANCE: <strong className="text-emerald-400">2.8m Overhead Nom.</strong></span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400">
          <span>LiDAR: 32-BEAM VOLUMETRIC SLAM</span>
          <span>•</span>
          <span className="text-white">ORBIT: LEFT-CLICK + DRAG</span>
        </div>
      </div>
    </div>
  );
};
