# NETRA-X — Development Rules

This document defines the engineering rules, coding standards, technology choices, and project-structure conventions for the NETRA-X Mine Safety and Rescue Rover project.

The goal is to keep the system understandable, maintainable, testable, and safe as the project grows.

---

# 1. Development Rules

## 1.1 Build for Safety First

NETRA-X is a rescue-oriented system. Safety-critical behavior must never depend only on AI, cloud services, or a single sensor.

Examples of safety-critical functions:

- Emergency stop
- Critical gas warning
- Obstacle stop
- Low-battery behavior
- Communication-loss handling
- Manual operator override

These functions should use deterministic logic wherever possible.

---

## 1.2 Separate AI From Safety Logic

AI is used mainly for perception and assistance.

Examples:

- YOLO -> person detection
- Thermal processing -> heat-signature confirmation
- Sensor fusion -> combined confidence
- Hazard analysis -> risk evaluation

Do not use AI as the only decision-maker for critical emergency actions.

Example:

```text
YOLO detects person
        +
Thermal confirms heat
        ↓
Potential Survivor Alert
        ↓
Ground operator sees alert
```

Do not claim:

```text
AI decides medical condition
```

unless such a system is actually developed and validated.

---

## 1.3 Prefer Explainable Logic

For the MVP, use:

- Threshold-based hazard classification
- Weighted sensor fusion
- Weighted mission-risk scoring
- A* route planning
- Rule-based fail-safe behavior

Avoid unnecessary black-box models when a simpler approach is easier to validate.

---

## 1.4 Keep Rover and Ground Station Independent

The rover should continue basic safe operation even if the control station disconnects.

The rover must locally support:

- Stop
- Obstacle avoidance
- Sensor monitoring
- Communication retry
- Low-battery action
- Fail-safe mode

The ground station should provide:

- Monitoring
- Visualization
- Mission planning
- Operator commands
- Alerts
- Mission logs

---

## 1.5 Never Depend on Internet Connectivity

Core rescue functionality must work on a local network.

Cloud services may be used only for:

- Post-mission analysis
- Remote backups
- Model training
- Historical reports

The rover must not require cloud access to move safely or detect critical hazards.

---

## 1.6 Use Mock Data Correctly

Mock data is acceptable for development and demonstrations.

However:

- Keep mock data clearly separated from real sensor data.
- Do not present simulated readings as real measurements.
- Provide a visible simulation mode in the dashboard.
- Keep sensor interfaces compatible with future real hardware.

Example:

```text
MODE: SIMULATION
```

or

```text
MODE: LIVE ROVER
```

---

## 1.7 Do Not Overclaim AI Features

Only claim what is actually implemented.

Examples:

Correct:

- Pre-trained YOLO is used for person detection.
- SLAM is used for mapping and localization.
- Hazard classification uses sensor thresholds.
- Risk-aware navigation uses weighted cost logic.

Avoid unsupported claims such as:

- AI predicts every mine collapse.
- AI guarantees survivor detection.
- System is 100% accurate.
- Rover is fully autonomous in every mine condition.

---

## 1.8 Fail Gracefully

Every hardware or software module must handle failure safely.

Examples:

```text
Sensor unavailable
→ Mark sensor unhealthy
→ Notify operator
→ Continue using remaining valid sensors
```

```text
Communication lost
→ Stop or enter safe mode
→ Retry connection
→ Return toward last reliable communication point if configured
```

```text
AI model fails
→ Keep manual camera feed
→ Keep thermal feed
→ Keep environmental monitoring active
```

---

# 2. General Principles

## 2.1 Keep It Modular

Do not build one giant program.

Use separate modules for:

- Sensors
- Motor control
- AI
- Mapping
- Navigation
- Communication
- Backend
- Dashboard

Each module should have one clear responsibility.

---

## 2.2 Keep Hardware Abstraction Separate

Sensor-reading code should not be mixed directly with business logic.

Bad:

```python
if read_gpio_pin(5) > 700:
    mission_risk += 50
```

Better:

```python
methane = gas_sensor.read_methane()
risk = hazard_engine.evaluate_methane(methane)
```

This makes hardware replacement easier.

---

## 2.3 Single Source of Truth

Important values should be defined in one place.

Examples:

- Sensor thresholds
- MQTT topics
- API base URL
- Risk-score weights
- Serial ports
- Model paths
- Feature flags

Do not repeat configuration values across multiple files.

Use configuration files or environment variables.

---

## 2.4 Human-in-the-Loop

High-risk decisions should remain visible to the surface team.

Examples:

- Entering a critical gas zone
- Ignoring a safe-route recommendation
- Continuing with low battery
- Manual override
- Emergency stop reset

The operator should always understand why a recommendation was generated.

---

## 2.5 Keep the Mission Planner Explainable

For each route, the system should be able to show why a score was produced.

Example:

```text
ROUTE B

Gas Risk:            20
Obstacle Risk:       15
Communication Risk:  10
Energy Risk:         20

Mission Risk Score:  18 / 100
```

Do not return only:

```text
AI chose Route B
```

---

## 2.6 Timestamp Important Data

Every important message should include a timestamp.

Examples:

- Sensor readings
- AI detections
- Alerts
- Map updates
- Operator commands
- Route changes
- Connection loss
- Mission events

---

## 2.7 Log Important Events

Mission logs must record events such as:

- Rover start
- Rover stop
- Hazard detected
- Survivor detected
- Route changed
- Communication lost
- Communication restored
- Manual override
- Emergency stop
- Return-to-base command

---

# 3. Technologies

## 3.1 Embedded Systems

### ESP32

Responsibilities:

- Read environmental sensors
- Motor-driver control
- Wheel encoder reading
- Emergency stop
- Basic local fail-safe logic
- Serial communication with Raspberry Pi

Language:

```text
C / C++
```

Recommended development:

```text
PlatformIO
```

---

## 3.2 Edge Computer

### Raspberry Pi

Responsibilities:

- Camera handling
- AI inference where practical
- Communication
- ROS 2 nodes
- Mission logic
- Sensor aggregation
- Local logging

Primary language:

```text
Python
```

---

## 3.3 AI / Computer Vision

Use:

```text
YOLOv8n
Ultralytics
PyTorch
OpenCV
```

Responsibilities:

- Person detection
- Camera preprocessing
- Bounding-box visualization
- Thermal image processing
- Survivor-confidence generation

Do not treat OpenCV as an AI model.

---

## 3.4 Robotics

Use:

```text
ROS 2
SLAM Toolbox
Nav2
A*
```

Responsibilities:

- Robot software communication
- Mapping
- Localization
- Navigation
- Path planning
- Dynamic re-routing

SLAM is not an AI model.

---

## 3.5 Communication

Use:

```text
LoRa
Wi-Fi / Mesh
MQTT
WebSocket
UART / Serial
```

Guideline:

- LoRa -> telemetry and alerts
- Wi-Fi / Mesh -> video and larger data
- MQTT -> structured real-time messages
- WebSocket -> dashboard live updates
- UART -> ESP32 to Raspberry Pi

Do not attempt to stream video over LoRa.

---

## 3.6 Backend

Use:

```text
Python
FastAPI
SQLite
```

Responsibilities:

- APIs
- Mission state
- Alert handling
- Sensor-data access
- Mission logs
- WebSocket updates

Possible future database:

```text
PostgreSQL
```

---

## 3.7 Frontend

Use:

```text
React
Vite
Tailwind CSS
Lucide React
Recharts
```

Dashboard should prioritize:

- Fast readability
- Low visual clutter
- Clear severity colors
- Large critical alerts
- Simple controls

---

# 4. Coding Standards

## 4.1 Python

Follow PEP 8 where practical.

Use:

```python
snake_case
```

for:

- Variables
- Functions
- Module names

Example:

```python
mission_risk_score = calculate_risk(route_data)
```

Use:

```python
PascalCase
```

for classes.

Example:

```python
class HazardAnalyzer:
    pass
```

Constants should use:

```python
UPPER_SNAKE_CASE
```

Example:

```python
MAX_SAFE_TEMPERATURE = 45
```

---

## 4.2 JavaScript / React

Use:

```text
camelCase
```

for:

- Variables
- Functions

Example:

```javascript
const missionRisk = calculateMissionRisk();
```

Use:

```text
PascalCase
```

for React components.

Example:

```javascript
function SensorCard() {}
```

---

## 4.3 C / C++

Use clear names.

Preferred:

```cpp
readMethaneSensor();
stopMotors();
sendTelemetry();
```

Avoid:

```cpp
x1();
doThing();
temp2();
```

---

## 4.4 Function Rules

Functions should:

- Do one thing
- Be short where possible
- Have clear names
- Return predictable values
- Avoid hidden side effects

Bad:

```python
def process_everything():
    ...
```

Better:

```python
read_sensor_data()
calculate_hazard_score()
update_hazard_map()
send_telemetry()
```

---

## 4.5 Avoid Magic Numbers

Bad:

```python
if gas > 50:
    ...
```

Better:

```python
if gas > CH4_WARNING_THRESHOLD:
    ...
```

Thresholds should come from configuration.

---

## 4.6 Use Type Hints in Python

Example:

```python
def calculate_risk(gas_risk: float, obstacle_risk: float) -> float:
    return gas_risk * 0.6 + obstacle_risk * 0.4
```

---

## 4.7 Validate External Data

Never trust incoming sensor or network data automatically.

Validate:

- Type
- Range
- Timestamp
- Missing values
- Connection state

Example:

```python
if methane is None:
    mark_sensor_unavailable()
```

---

## 4.8 Use Structured Messages

MQTT and WebSocket messages should use JSON.

Example:

```json
{
  "timestamp": "2026-09-20T12:00:00Z",
  "rover_id": "NETRA-X-01",
  "battery": 72,
  "risk_score": 24,
  "status": "EXPLORING"
}
```

Keep field names stable.

---

## 4.9 Error Handling

Do not silently ignore failures.

Bad:

```python
try:
    read_sensor()
except:
    pass
```

Better:

```python
try:
    reading = read_sensor()
except SensorError as error:
    logger.error("Gas sensor failure: %s", error)
    mark_sensor_unhealthy()
```

---

## 4.10 Logging

Use clear levels:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

Examples:

```text
INFO      Rover mission started
WARNING   Communication signal weak
ERROR     LiDAR connection lost
CRITICAL  Emergency stop activated
```

---

## 4.11 Comments

Comments should explain why, not repeat obvious code.

Bad:

```python
# Add 1
count += 1
```

Better:

```python
# Require three consecutive detections to reduce single-frame false positives.
detection_count += 1
```

---

## 4.12 Naming

Avoid vague names:

```text
data
thing
temp
value2
abc
```

Prefer:

```text
methane_reading
rover_position
survivor_confidence
communication_risk
mission_status
```

---

## 4.13 Configuration

Keep configuration outside core logic.

Recommended:

```text
config/
  rover.yaml
  sensors.yaml
  risk_weights.yaml
  communication.yaml
```

Examples:

```yaml
mission_risk:
  gas_weight: 0.35
  obstacle_weight: 0.20
  communication_weight: 0.15
  environment_weight: 0.15
  energy_weight: 0.15
```

---

## 4.14 Secrets

Never commit:

- Wi-Fi passwords
- API keys
- Private broker credentials
- Tokens

Use:

```text
.env
```

and include:

```text
.env
```

in `.gitignore`.

Provide:

```text
.env.example
```

with placeholder values.

---

# 5. AI Development Standards

## 5.1 Model Versioning

Always record:

- Model name
- Model version
- Training date
- Dataset version
- Confidence threshold
- Evaluation metrics

Example:

```text
Model: YOLOv8n
Version: survivor-v1
Dataset: mine-survivor-dataset-v1
```

---

## 5.2 Dataset Separation

Keep:

```text
training/
validation/
test/
```

separate.

Never evaluate only on training images.

---

## 5.3 Evaluation

For person detection track:

- Precision
- Recall
- mAP
- False positives
- False negatives

For rescue detection, recall is especially important.

---

## 5.4 Do Not Hide Confidence

Dashboard should show:

```text
Person Detection: 91%
Thermal Confirmation: Yes
Combined Confidence: 94%
```

not simply:

```text
Survivor Found
```

---

## 5.5 Keep AI Optional for Critical Control

If YOLO crashes, the rover should still be able to:

- Stop
- Move manually
- Read sensors
- Stream camera if possible
- Communicate alerts

---

# 6. API and Communication Standards

## 6.1 MQTT Topic Convention

Use:

```text
netrax/<rover_id>/<category>/<name>
```

Examples:

```text
netrax/rover01/sensors/ch4
netrax/rover01/sensors/o2
netrax/rover01/status/battery
netrax/rover01/status/location
netrax/rover01/alerts/hazard
netrax/rover01/alerts/survivor
```

---

## 6.2 API Route Convention

Use nouns and predictable paths.

Example:

```text
GET  /api/rover/status
GET  /api/sensors
GET  /api/alerts
GET  /api/mission
POST /api/rover/command
POST /api/mission/route
```

---

## 6.3 Command Safety

Every remote movement command should include:

- Command ID
- Timestamp
- Source
- Rover ID

Example:

```json
{
  "command_id": "cmd-1042",
  "rover_id": "NETRA-X-01",
  "command": "STOP",
  "source": "surface-control",
  "timestamp": "2026-09-20T12:00:00Z"
}
```

---

# 7. Git and Version Control Rules

## 7.1 Branches

Recommended:

```text
main
develop
feature/*
fix/*
```

Examples:

```text
feature/survivor-detection
feature/risk-planner
feature/dashboard-map
fix/mqtt-reconnect
```

---

## 7.2 Commits

Write clear commit messages.

Good:

```text
feat: add methane alert handling
fix: reconnect MQTT after signal loss
refactor: separate risk scoring from navigation
docs: update mission planner architecture
```

Avoid:

```text
update
changes
final
final2
working
```

---

## 7.3 Never Commit Generated or Sensitive Files

Do not commit:

- `.env`
- Large model checkpoints unless intentionally versioned
- Temporary videos
- Build folders
- Cache files
- Local databases containing test data

---

# 8. Testing Rules

## 8.1 Unit Tests

Test modules individually.

Examples:

- Risk-score calculation
- Hazard classification
- Sensor validation
- Sensor fusion
- Route evaluation

---

## 8.2 Integration Tests

Test communication between modules.

Examples:

```text
ESP32 → Raspberry Pi
Raspberry Pi → MQTT
MQTT → Backend
Backend → Dashboard
LiDAR → SLAM → Map
YOLO → Survivor Alert
```

---

## 8.3 Safety Tests

Test conditions such as:

- Sensor disconnected
- Wi-Fi disconnected
- LoRa disconnected
- Battery low
- Rover stuck
- Obstacle suddenly appears
- AI model unavailable
- Dashboard disconnected
- Emergency stop pressed

---

# 9. Project Structure

Use this structure:

```text
netra-x/
|
|-- README.md
|-- prd.md
|-- architecture.md
|-- rules.md
|
|-- config/
|   |-- rover.yaml
|   |-- sensors.yaml
|   |-- risk_weights.yaml
|   |-- communication.yaml
|
|-- firmware/
|   |
|   |-- esp32/
|       |-- src/
|       |-- include/
|       |-- platformio.ini
|
|-- rover/
|   |
|   |-- main.py
|   |
|   |-- sensors/
|   |-- control/
|   |-- communication/
|   |-- safety/
|
|-- ai/
|   |
|   |-- survivor_detection/
|   |-- thermal/
|   |-- sensor_fusion/
|   |-- hazard/
|
|-- robotics/
|   |
|   |-- ros2_ws/
|       |-- src/
|           |-- netrax_sensors/
|           |-- netrax_slam/
|           |-- netrax_navigation/
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
|       |-- api/
|       |-- services/
|       |-- database/
|
|-- dashboard/
|   |
|   |-- src/
|       |-- components/
|       |-- pages/
|       |-- services/
|       |-- hooks/
|       |-- mock/
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
|   |-- unit/
|   |-- integration/
|   |-- safety/
|
|-- docs/
|   |
|   |-- ai_model.md
|   |-- communication.md
|   |-- sensors.md
|   |-- mission_planner.md
|
|-- scripts/
|   |-- start_rover.sh
|   |-- start_backend.sh
|   |-- start_dashboard.sh
|
|-- .env.example
|-- .gitignore
```

---

# 10. Project Structure Rules

## `firmware/`

Only ESP32 and low-level embedded code.

Do not place frontend or backend code here.

---

## `rover/`

Raspberry Pi-level hardware integration and rover coordination.

---

## `ai/`

Only AI, vision, thermal, hazard, and sensor-fusion logic.

---

## `robotics/`

ROS 2 packages for mapping, localization, and navigation.

---

## `mission_planner/`

Risk-aware exploration and route-decision logic.

Keep this separate from raw navigation.

---

## `backend/`

Surface-control APIs, MQTT handling, mission state, database, and WebSocket logic.

---

## `dashboard/`

React interface only.

The frontend must not contain critical safety logic.

---

## `data/`

Datasets and local mission logs.

Do not mix code with datasets.

---

## `tests/`

All automated tests.

Safety tests should remain separate from normal unit tests.

---

## `docs/`

Technical documentation only.

Keep implementation details updated whenever architecture changes.

---

# 11. Final Development Principle

Every NETRA-X feature should answer four questions:

1. **What data does it receive?**
2. **What processing does it perform?**
3. **What output does it produce?**
4. **What happens if it fails?**

Example:

```text
YOLO Survivor Detection

Input:
RGB camera frame

Processing:
Pre-trained YOLOv8n inference

Output:
Person bounding box + confidence

Failure:
Continue camera stream and thermal monitoring;
notify operator that AI detection is unavailable.
```

If every module follows this pattern, the system will remain easier to explain, test, debug, and present.
