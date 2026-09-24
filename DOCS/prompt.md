Create a clean, professional, functional Surface Control Dashboard for my project:

PROJECT NAME: NETRA-X
PROJECT: AI-Powered Mine Safety & Rescue Rover

PURPOSE:
This dashboard will be used by a rescue team at the surface to monitor a robotic rover operating inside an underground coal mine.

The rover sends:
- Toxic gas readings
- Temperature and humidity
- Water/flood information
- Live RGB camera feed
- Thermal camera information
- Rover position
- SLAM mine map
- Obstacle information
- Survivor detections
- Battery level
- Communication strength
- Risk score
- Mission status
- Recommended route

IMPORTANT DESIGN DIRECTION:
Do NOT make it look like a generic AI SaaS dashboard.

The interface should feel like:
- Industrial emergency command centre
- Mining control room
- Robotics mission-control software
- Professional engineering system

Use a dark charcoal / black / deep navy interface with:
- White text
- Cyan/blue for normal active systems
- Green for SAFE
- Yellow/amber for WARNING
- Red for DANGER / CRITICAL

Keep the UI clean and easy to understand during emergencies.

Do not overcrowd the dashboard.

TECH STACK:
- React.js
- Vite
- Tailwind CSS
- Lucide React icons
- Recharts only where charts are useful
- Component-based architecture
- No backend required initially
- Use realistic simulated/mock rover data
- Update some mock sensor values automatically every few seconds

--------------------------------------------------
MAIN DASHBOARD LAYOUT
--------------------------------------------------

Create a desktop dashboard with:

LEFT SIDEBAR
TOP STATUS BAR
MAIN MONITORING AREA
RIGHT ALERT PANEL

--------------------------------------------------
1. LEFT SIDEBAR
--------------------------------------------------

Show NETRA-X branding at the top.

Navigation:

Dashboard
Live Mission
Mine Map
Survivor Detection
Environment
Mission Planner
Rover Control
Mission Logs
Settings

Use simple icons.

Highlight "Dashboard" as active.

At bottom show:

SYSTEM STATUS
● Rover Connected
● Sensors Online
● AI System Active

--------------------------------------------------
2. TOP STATUS BAR
--------------------------------------------------

Show:

NETRA-X MINE RESCUE CONTROL

Mission:
RESCUE-01

Status badge:
MISSION ACTIVE

Also display:

Mission Time
00:37:42

Connection:
CONNECTED

Last Update:
2 sec ago

Emergency Stop button on far right.

The Emergency Stop button should be red but not excessively large.

--------------------------------------------------
3. ROVER STATUS SECTION
--------------------------------------------------

Create compact status cards for:

Battery
72%

Communication
86%

Rover Speed
0.8 m/s

Distance Travelled
438 m

Current Mode
AUTONOMOUS

Mission Risk
24 / 100
LOW RISK

Use icons and small progress indicators.

--------------------------------------------------
4. ENVIRONMENT MONITORING
--------------------------------------------------

Create cards for:

Methane CH₄
0.62%
SAFE

Carbon Monoxide CO
18 ppm
SAFE

Oxygen O₂
20.1%
SAFE

Hydrogen Sulphide H₂S
3 ppm
SAFE

Temperature
34°C

Humidity
81%

Water Level
6 cm

Each environmental card should automatically change appearance based on status:

SAFE = green
WARNING = amber
DANGER = red

Include small mini trend graphs for methane and CO.

Do not make these charts oversized.

--------------------------------------------------
5. LIVE CAMERA
--------------------------------------------------

Create a large LIVE ROVER CAMERA panel.

Since there is no actual camera feed, create a realistic placeholder area labelled:

LIVE RGB CAMERA

Add:

● LIVE

CAM-01

FPS: 18

Resolution: 720p

Provide three buttons below:

RGB
THERMAL
NIGHT VISION

Selecting each button should visually change the placeholder mode.

THERMAL mode can use a thermal-style gradient visualization.

Do not use an external camera API.

--------------------------------------------------
6. AI SURVIVOR DETECTION
--------------------------------------------------

Create a Survivor Detection panel.

Example state:

POSSIBLE SURVIVOR DETECTED

AI Detection:
Person detected

YOLO Confidence:
91%

Thermal Confirmation:
Detected

Combined Confidence:
94%

Approximate Distance:
17.4 m

Location:
Tunnel B / Sector 04

Show:

HIGH CONFIDENCE

Use a human/person icon.

Also add:

VIEW LOCATION

button.

Clearly state that this is a "Potential Survivor" rather than making medical claims.

--------------------------------------------------
7. LIVE MINE MAP
--------------------------------------------------

Create a large schematic mine map.

Do not use Google Maps.

This is an underground SLAM-style map.

Show tunnel paths using lines/corridors.

Show:

Mine Entrance
Current Rover Position
Explored Tunnel
Unexplored Tunnel
Detected Obstacles
Hazard Areas
Potential Survivor

Use markers:

Blue = rover
Green = safe route
Yellow = caution area
Red = dangerous area
Orange = potential survivor

Add a legend.

Show:

SLAM MAP
LIVE

Example map structure:

Entrance
    |
Tunnel A -------- Tunnel B
                     |
                  Rover
                     |
               Survivor

Make the map visually attractive but schematic.

--------------------------------------------------
8. AI HAZARD MAP
--------------------------------------------------

Add hazard overlays on the mine map.

Example:

Tunnel A
SAFE

Tunnel B
CAUTION

Tunnel C
HIGH CH₄

Sector 04
POTENTIAL SURVIVOR

Use transparent green / yellow / red regions or markers.

--------------------------------------------------
9. RISK-AWARE MISSION PLANNER
--------------------------------------------------

This is an important innovation.

Create a section:

RISK-AWARE MISSION PLANNER

Show two possible routes.

ROUTE A — LEFT TUNNEL

Gas Risk:
82

Obstacle Risk:
45

Communication:
Weak

Temperature:
High

Mission Risk Score:
76 / 100

Status:
HIGH RISK


ROUTE B — RIGHT TUNNEL

Gas Risk:
18

Obstacle Risk:
20

Communication:
Strong

Temperature:
Normal

Mission Risk Score:
24 / 100

Status:
LOW RISK


Highlight:

AI RECOMMENDATION
EXPLORE ROUTE B

Explain briefly:

"Route B provides lower environmental and communication risk."

Add:

APPROVE ROUTE

MANUAL OVERRIDE

buttons.

Keep human decision-making available.

--------------------------------------------------
10. ALERTS PANEL
--------------------------------------------------

Right-side panel:

LIVE ALERTS

Show timestamped alerts.

Examples:

12:42:18
Potential survivor detected
Tunnel B – Sector 04

12:41:03
Methane concentration increasing
Tunnel A

12:38:44
Obstacle detected
Distance: 2.3 m

12:35:10
Communication signal decreased

Use:

Info
Warning
Critical

severity levels.

Critical alerts = red.
Warnings = amber.
Normal information = blue.

--------------------------------------------------
11. COMMUNICATION PANEL
--------------------------------------------------

Show:

ROVER ↔ CONTROL ROOM

Telemetry Link:
LoRa
CONNECTED

Video Link:
Wi-Fi Mesh
CONNECTED

Signal Strength:
86%

Latency:
142 ms

Packets:
98.7% received

Last Contact:
1 sec ago

If communication strength drops below a simulated threshold, show:

WEAK COMMUNICATION

and generate an alert.

--------------------------------------------------
12. ROVER CONTROL
--------------------------------------------------

Create a compact manual-control panel.

Buttons:

Forward
Left
Stop
Right
Reverse

Also:

AUTONOMOUS MODE
MANUAL MODE

Default should be:

AUTONOMOUS

Manual controls should visually activate only when Manual Mode is selected.

Add:

RETURN TO BASE

button.

Emergency Stop should remain separate.

--------------------------------------------------
13. SELF-RECOVERY STATUS
--------------------------------------------------

Small card:

SELF-RECOVERY SYSTEM

Status:
READY

Monitor:

Wheel Movement
IMU Motion
Obstacle Distance

Show normal message:

No mobility issue detected.

Also create a simulated state option such as:

ROVER STUCK

Then show recovery stages:

Stop
Reverse
Turn
Re-plan

--------------------------------------------------
14. SYSTEM / AI STATUS
--------------------------------------------------

Create a small panel showing:

YOLO Survivor Detection
ACTIVE

Thermal Analysis
ACTIVE

Sensor Fusion
ACTIVE

SLAM
ACTIVE

Hazard Analysis
ACTIVE

Risk-Aware Mission Planner
ACTIVE

Do not claim that SLAM itself is AI.

--------------------------------------------------
15. SENSOR FUSION VISUALIZATION
--------------------------------------------------

Create a small clear visualization:

RGB CAMERA
91%

+

THERMAL
Detected

+

AUDIO
No Signal

↓

SURVIVOR CONFIDENCE
94%

Label it:

MULTI-SENSOR FUSION

--------------------------------------------------
16. MISSION LOG
--------------------------------------------------

At bottom include a compact mission event log.

Example:

12:31 Rover entered Tunnel A
12:34 SLAM map updated
12:35 Weak communication detected
12:38 Obstacle detected
12:40 Route recalculated
12:42 Potential survivor detected

--------------------------------------------------
INTERACTION REQUIREMENTS
--------------------------------------------------

Make this a functional frontend prototype.

Include simulated live data.

Every 2–5 seconds:
- Slightly change gas readings
- Change temperature slightly
- Update signal strength
- Update mission time
- Update rover status

Do not generate random unrealistic values.

Keep values inside reasonable demonstration ranges.

Provide a button:

SIMULATE EMERGENCY

When clicked:
- Methane level increases
- Hazard status changes to red
- Alert appears
- Mission risk increases
- Current tunnel becomes dangerous on the map
- Risk-Aware Mission Planner recommends another route

Also provide:

SIMULATE SURVIVOR

When clicked:
- Person detection becomes active
- Thermal confirmation becomes active
- Survivor marker appears on map
- Alert is generated
- Combined confidence appears

Add:

RESET SIMULATION

--------------------------------------------------
IMPORTANT TECHNICAL REPRESENTATION
--------------------------------------------------

Represent the software architecture correctly:

Physical sensors detect gases and environmental conditions.

YOLO handles RGB person detection.

OpenCV handles image processing.

Thermal processing confirms heat signatures.

Sensor fusion combines different detections.

LiDAR + IMU provide data for SLAM.

SLAM creates the underground map and rover localization.

Hazard-analysis logic associates sensor readings with map locations.

Risk-aware path planning selects safer routes.

MQTT / LoRa / Wi-Fi send data between rover and surface station.

Do not label every algorithm as AI.

--------------------------------------------------
VISUAL STYLE
--------------------------------------------------

Use:
- Dark industrial control-room aesthetic
- Rounded but not overly soft cards
- Thin borders
- Minimal shadows
- Clean typography
- Excellent spacing
- High information readability
- Professional engineering feel

Avoid:
- Excessive gradients
- Glassmorphism everywhere
- Huge headings
- Decorative 3D objects
- Generic stock illustrations
- Excessive animation
- Excessive neon
- Too many colors

Use small meaningful animations such as:
- Live indicator pulse
- Updating values
- Map rover movement
- Alert appearance

Make it look realistic enough to show to Smart India Hackathon judges.

--------------------------------------------------
RESPONSIVENESS
--------------------------------------------------

Prioritize:
1920×1080 laptop/desktop control-room view.

Also make it usable on:
1366×768 laptops.

On smaller screens, stack panels logically.

--------------------------------------------------
CODE QUALITY
--------------------------------------------------

Create reusable components such as:

Sidebar
TopStatusBar
StatusCard
SensorCard
CameraPanel
MineMap
SurvivorPanel
RiskPlanner
AlertPanel
CommunicationStatus
RoverControls
MissionLog

Keep mock data in a separate data structure.

Keep code organized and easy to later connect to:
- MQTT
- FastAPI
- WebSocket
- Real rover sensor data

Do not hard-code the entire UI into one giant component.

Deliver a complete runnable frontend.