# NETRA-X — System Architecture

## 1. High-Level Architecture

NETRA-X is designed as a distributed mine-rescue system with three main layers:

1. **Rover Layer**
2. **Communication Layer**
3. **Surface Control Layer**

The rover collects sensor and camera data, processes safety-critical information locally, builds a mine map, detects possible survivors, and sends mission data to the surface control team.

### High-Level Flow

```text
ENVIRONMENTAL SENSORS
CH4 / CO / O2 / H2S
Temperature / Humidity / Water
          |
          v
        ESP32
Sensor acquisition + motor control
          |
          v
RASPBERRY PI / EDGE COMPUTER
          |
   +------+------+----------------+
   |             |                |
   v             v                v
RGB Camera   Thermal Camera   LiDAR + IMU
   |             |                |
   v             v                v
OpenCV        Thermal          ROS 2
+ YOLO        Processing       + SLAM
   |             |                |
   +-------> SENSOR FUSION <------+
                  |
                  v
           HAZARD ANALYSIS
                  |
                  v
            RISK-AWARE MAP
                  |
                  v
       RISK-AWARE MISSION PLANNER
                  |
                  v
        NAVIGATION / ROVER CONTROL
                  |
                  v
        LoRa / Wi-Fi / MQTT
                  |
                  v
          SURFACE CONTROL STATION
                  |
      +-----------+------------+
      |           |            |
      v           v            v
 LIVE MAP      ALERTS      CAMERA FEED
      |
      v
 RESCUE TEAM
```

### Rover Layer

The rover handles:

- Environmental monitoring
- Motor control
- Camera capture
- Thermal sensing
- LiDAR scanning
- Local AI inference
- SLAM-based mapping
- Obstacle detection
- Hazard analysis
- Risk-aware route selection
- Fail-safe behavior

The **ESP32** handles low-level real-time tasks such as sensor reading and motor control.

The **Raspberry Pi / edge computer** handles high-level processing such as AI, communication, mapping, and navigation.

### Communication Layer

The communication system transfers data between the rover and the surface team.

#### LoRa

Used for low-bandwidth mission-critical data such as:

- Gas readings
- Battery level
- Rover status
- Risk alerts
- Survivor alerts
- Position data

#### Wi-Fi / Mesh

Used for higher-bandwidth data such as:

- RGB camera stream
- Thermal camera stream
- Map updates
- Large mission data

#### MQTT

Used as the lightweight telemetry messaging layer.

Example topics:

```text
/netrax/sensors/gas
/netrax/sensors/environment
/netrax/rover/status
/netrax/rover/location
/netrax/alerts
/netrax/survivor
/netrax/mission/risk
```

### Surface Control Layer

The surface control application receives rover data and displays:

- Live mine map
- Rover position
- Environmental readings
- Hazard zones
- Survivor detections
- Camera feeds
- Mission Risk Score
- Recommended route
- Battery level
- Communication strength
- Alerts and mission logs

The operator can also send commands back to the rover.

### Safety Principle

Safety-critical functions should remain local to the rover.

Examples:

- Emergency stop
- Obstacle avoidance
- Critical gas response
- Low-battery behavior
- Communication-loss recovery

The rover should not depend on cloud connectivity for basic safety.

---

## 2. Tech Stack

### Embedded / Rover Control

| Technology | Purpose |
|---|---|
| **ESP32** | Sensor acquisition and motor control |
| **C/C++** | ESP32 firmware |
| **Raspberry Pi** | Edge processing and rover coordination |
| **Python** | AI, data processing, communication, backend logic |

### AI / Computer Vision

| Technology | Purpose |
|---|---|
| **YOLOv8n** | Person / potential-survivor detection |
| **Ultralytics** | YOLO inference and training |
| **PyTorch** | Deep-learning framework used by YOLO |
| **OpenCV** | Camera capture, preprocessing, image handling and visualization |
| **Thermal Processing** | Heat-signature confirmation |

### Robotics / Navigation

| Technology | Purpose |
|---|---|
| **ROS 2** | Communication between robotics software modules |
| **SLAM Toolbox** | Underground mapping and localization |
| **LiDAR** | Distance scanning and obstacle mapping |
| **IMU** | Orientation and motion estimation |
| **Nav2** | Navigation stack |
| **A\*** | Route planning |
| **Risk-Aware Costmap** | Adds hazard cost to navigation map |

### Hazard & Decision Logic

| Technology | Purpose |
|---|---|
| **Python** | Hazard scoring and mission logic |
| **Rule-Based Thresholds** | Safe / warning / danger classification |
| **Weighted Sensor Fusion** | Combines multiple sensor inputs |
| **Mission Risk Score** | Evaluates candidate routes |
| **Dynamic Re-routing** | Recalculates route when conditions change |

### Communication

| Technology | Purpose |
|---|---|
| **LoRa** | Long-range low-bandwidth telemetry |
| **Wi-Fi / Mesh** | Video and higher-bandwidth data |
| **MQTT** | Real-time publish/subscribe telemetry |
| **WebSocket** | Live dashboard updates |
| **UART / Serial** | ESP32 to Raspberry Pi communication |

### Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | Rover-to-dashboard API layer |
| **Python** | Backend logic |
| **SQLite** | Prototype mission-data storage |

Possible future production database:

- PostgreSQL

### Frontend

| Technology | Purpose |
|---|---|
| **React.js** | Surface control dashboard |
| **Vite** | Frontend build tool |
| **Tailwind CSS** | Dashboard styling |
| **Recharts** | Small sensor trend graphs |
| **Lucide React** | UI icons |

---

## 3. Folder Structure

A clean project structure can separate embedded code, rover software, AI, robotics, backend, and dashboard code.

```text
netra-x/
|
|-- README.md
|-- prd.md
|-- architecture.md
|
|-- firmware/
|   |
|   |-- esp32/
|       |-- src/
|       |   |-- main.cpp
|       |   |-- sensors.cpp
|       |   |-- motors.cpp
|       |   |-- communication.cpp
|       |
|       |-- include/
|       |   |-- sensors.h
|       |   |-- motors.h
|       |   |-- communication.h
|       |
|       |-- platformio.ini
|
|-- rover/
|   |
|   |-- main.py
|   |
|   |-- sensors/
|   |   |-- gas_reader.py
|   |   |-- environment_reader.py
|   |   |-- battery_monitor.py
|   |
|   |-- control/
|   |   |-- motor_controller.py
|   |   |-- emergency_stop.py
|   |   |-- recovery_controller.py
|   |
|   |-- communication/
|       |-- mqtt_client.py
|       |-- lora_interface.py
|       |-- serial_bridge.py
|
|-- ai/
|   |
|   |-- survivor_detection/
|   |   |-- yolo_detector.py
|   |   |-- model/
|   |   |-- inference.py
|   |
|   |-- thermal/
|   |   |-- thermal_processor.py
|   |
|   |-- sensor_fusion/
|   |   |-- fusion_engine.py
|   |
|   |-- hazard/
|       |-- hazard_classifier.py
|       |-- risk_score.py
|
|-- robotics/
|   |
|   |-- ros2_ws/
|       |
|       |-- src/
|           |
|           |-- netrax_sensors/
|           |-- netrax_slam/
|           |-- netrax_navigation/
|           |-- netrax_mission_planner/
|           |-- netrax_rover_control/
|
|-- mission_planner/
|   |
|   |-- risk_engine.py
|   |-- route_evaluator.py
|   |-- costmap_manager.py
|   |-- dynamic_replanner.py
|   |-- mission_value.py
|
|-- backend/
|   |
|   |-- app/
|       |-- main.py
|       |
|       |-- api/
|       |   |-- rover.py
|       |   |-- sensors.py
|       |   |-- alerts.py
|       |   |-- missions.py
|       |
|       |-- services/
|       |   |-- mqtt_service.py
|       |   |-- websocket_service.py
|       |   |-- mission_service.py
|       |
|       |-- database/
|           |-- models.py
|           |-- database.py
|
|-- dashboard/
|   |
|   |-- src/
|   |   |
|   |   |-- components/
|   |   |   |-- SensorCard.jsx
|   |   |   |-- RoverStatus.jsx
|   |   |   |-- MineMap.jsx
|   |   |   |-- CameraPanel.jsx
|   |   |   |-- AlertPanel.jsx
|   |   |   |-- RiskPlanner.jsx
|   |   |
|   |   |-- pages/
|   |   |   |-- Dashboard.jsx
|   |   |   |-- Mission.jsx
|   |   |   |-- Logs.jsx
|   |   |
|   |   |-- services/
|   |   |   |-- api.js
|   |   |   |-- websocket.js
|   |   |
|   |   |-- mock/
|   |       |-- roverData.js
|   |
|   |-- package.json
|   |-- vite.config.js
|
|-- data/
|   |
|   |-- training/
|   |-- validation/
|   |-- test/
|   |-- mission_logs/
|
|-- tests/
|   |
|   |-- test_hazard_logic.py
|   |-- test_risk_engine.py
|   |-- test_sensor_fusion.py
|   |-- test_api.py
|
|-- docs/
    |
    |-- system_flow.md
    |-- sensor_list.md
    |-- communication.md
    |-- ai_model.md
```

### Folder Responsibilities

#### `firmware/`

Contains low-level ESP32 code.

#### `rover/`

Contains Raspberry Pi-side rover control, sensors, and communication code.

#### `ai/`

Contains AI and perception modules such as YOLO, thermal processing, sensor fusion, and hazard analysis.

#### `robotics/`

Contains ROS 2 packages for SLAM, navigation, and rover control.

#### `mission_planner/`

Contains the Risk-Aware Mission Planner and route-scoring logic.

#### `backend/`

Contains FastAPI, MQTT, WebSocket, database, and mission APIs.

#### `dashboard/`

Contains the React-based Surface Control Dashboard.

#### `data/`

Contains AI training data and mission logs.

#### `tests/`

Contains tests for safety logic, risk scoring, sensor fusion, and APIs.

#### `docs/`

Contains technical documentation for the team.
