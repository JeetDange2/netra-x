# NETRA-X — Product Requirements Document

## 1. Product Overview

**Product Name:** NETRA-X  
**Product Type:** AI-Powered Mine Safety and Rescue Rover  
**Primary Use Case:** Underground mine monitoring, hazard detection, survivor detection, mapping, and rescue support.

NETRA-X is a rugged robotic rover designed to enter hazardous underground mine environments before human rescue personnel. It collects real-time environmental data, detects possible survivors, maps underground tunnels, identifies hazardous zones, and sends critical information to a surface control team.

The system combines environmental sensors, RGB and thermal cameras, LiDAR, AI-based person detection, SLAM-based mapping, risk assessment, and wireless communication. A surface dashboard allows rescue teams to monitor rover status, mine conditions, survivor detections, hazard alerts, and recommended safe routes.

The goal is to reduce the risk faced by human rescuers and improve the speed and quality of decision-making during mine emergencies.

---

## 2. Problem Statement

Underground coal mines can become extremely dangerous during emergencies due to:

- Toxic gas leaks such as methane, carbon monoxide, and hydrogen sulphide
- Reduced oxygen levels
- Tunnel collapses and blocked passages
- Flooding and water accumulation
- Poor visibility caused by darkness, dust, and smoke
- Loss of communication with workers underground
- Difficulty locating trapped or injured miners
- Lack of real-time information about underground conditions

Rescue teams often need to enter dangerous areas with incomplete information, increasing response time and exposing rescuers to additional risk.

A system is required that can enter hazardous mine sections, collect real-time data, identify dangers, locate possible survivors, build a live map of the underground environment, and transmit this information to the surface before rescue personnel enter.

---

## 3. Goals

### Primary Goals

- Reduce the need for rescuers to enter unknown hazardous areas without prior information.
- Provide real-time environmental monitoring inside underground mines.
- Detect possible trapped workers using RGB and thermal sensing.
- Create a live underground mine map without relying on GPS.
- Identify and mark hazardous areas on the map.
- Recommend safer exploration and rescue routes.
- Maintain reliable communication between the rover and the surface control team.
- Provide rescuers with a simple dashboard for monitoring mission-critical information.

### Technical Goals

- Use a lightweight AI model such as YOLO for person detection.
- Use LiDAR, IMU, and SLAM for underground mapping and rover localization.
- Combine environmental, visual, thermal, and navigation data through sensor fusion.
- Implement risk-aware route planning instead of only shortest-path navigation.
- Support autonomous operation with manual override from the surface team.
- Keep safety-critical functions available locally on the rover even if internet connectivity is unavailable.

---

## 4. Targeted Users

### Primary Users

**Mine Rescue Teams**  
Use NETRA-X during emergencies to assess underground conditions before entering dangerous areas.

**Surface Control Operators**  
Monitor rover location, environmental readings, live camera information, alerts, survivor detections, and mission status through the control dashboard.

**Mine Safety Officers**  
Use collected hazard information and mission logs to support emergency planning and safety decisions.

### Secondary Users

**Mine Operators and Supervisors**  
Use the rover for inspection of difficult or dangerous mine sections.

**Emergency Response Authorities**  
Use live situational information during large-scale rescue operations.

**Maintenance and Inspection Teams**  
Use NETRA-X for inspection of underground tunnels, obstacles, environmental conditions, and inaccessible areas.

---

## 5. Core Features

### 5.1 Real-Time Environmental Monitoring

The rover continuously monitors:

- Methane (CH₄)
- Carbon monoxide (CO)
- Oxygen (O₂)
- Hydrogen sulphide (H₂S)
- Temperature
- Humidity
- Water level

The system classifies readings into states such as **Safe, Warning, Danger, and Critical**.

### 5.2 AI-Based Survivor Detection

NETRA-X uses an RGB camera with a lightweight pre-trained YOLO model to detect people. Thermal imaging acts as an additional confirmation layer when visibility is poor.

The system can provide:

- Person detection
- Detection confidence
- Thermal confirmation
- Approximate location
- Potential-survivor alert

### 5.3 Multi-Sensor Fusion

The system combines information from multiple sources instead of relying on a single sensor, including RGB camera detection, thermal detection, environmental readings, LiDAR, IMU data, and communication strength.

### 5.4 SLAM-Based Mine Mapping

NETRA-X uses LiDAR and IMU data with SLAM to:

- Build a live map of underground tunnels
- Estimate the rover's position
- Detect walls and obstacles
- Track explored and unexplored areas

This enables operation where GPS is unavailable.

### 5.5 AI Hazard Mapping

Environmental and navigation data is associated with the rover's position on the SLAM map. The system can mark:

- Safe zones
- High-gas zones
- Flooded areas
- Obstacles or blocked passages
- Weak-communication areas
- Potential survivor locations

### 5.6 Risk-Aware Mission Planner

Instead of simply choosing the shortest path, NETRA-X evaluates the risk of available routes using factors such as gas concentration, temperature, flooding, obstacles, communication strength, battery level, distance, survivor probability, and exploration value.

Each route receives a **Mission Risk Score**, and the rover can recommend or select a safer high-value route and dynamically re-plan when mine conditions change.

### 5.7 Obstacle Detection and Self-Recovery

The rover detects obstacles using LiDAR and distance sensors. If it becomes stuck, it can attempt a recovery sequence:

1. Stop
2. Reverse
3. Change direction
4. Re-plan the route
5. Retry movement

If recovery fails, the system alerts the surface operator.

### 5.8 Rover-to-Surface Communication

NETRA-X supports communication between the rover and surface team using:

- LoRa for low-bandwidth telemetry and alerts
- Wi-Fi or mesh networking for higher-bandwidth data
- MQTT for structured real-time telemetry
- WebSocket for live dashboard updates

The system transmits sensor readings, rover status, battery level, location, hazard alerts, survivor alerts, map data, and risk scores.

### 5.9 Surface Control Dashboard

The control dashboard provides a single interface showing:

- Live rover status
- Battery level
- Communication strength
- Environmental sensor readings
- Live mine map
- Rover position
- Hazard locations
- Survivor detection status
- RGB / thermal camera view
- Mission Risk Score
- Recommended route
- Mission alerts and logs

### 5.10 Autonomous and Manual Control

NETRA-X supports:

- Autonomous exploration
- Assisted navigation
- Manual remote control
- Emergency stop
- Return-to-base command

The operator can override autonomous decisions when required.

### 5.11 Local Safety and Fail-Safe Behaviour

Safety-critical functions remain available locally on the rover, including:

- Emergency stop
- Critical gas response
- Low-battery return
- Communication-loss handling
- Obstacle avoidance
- Mission re-routing

The rover should not depend completely on cloud or internet connectivity for core safety functions.
