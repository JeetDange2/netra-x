# NETRA-X — Dashboard Design Guidelines

This document defines the basic visual and interaction design for the NETRA-X Surface Control Dashboard.

The dashboard is intended for mine rescue teams operating the rover from the surface. The design should prioritize **clarity, speed, safety, and real-time situational awareness**.

---

# 1. Design Objective

The dashboard should help the surface control team quickly answer:

- Where is the rover?
- Is the rover connected?
- Are environmental conditions safe or dangerous?
- Has a possible survivor been detected?
- What route is currently recommended?
- What alerts require immediate action?
- What is the rover battery and communication status?
- What is happening inside the mine right now?

The dashboard should feel like an **industrial rescue command center**, not a generic SaaS dashboard.

---

# 2. Visual Style

Use a professional dark control-room theme.

## Base Colors

- **Background:** Dark charcoal / deep navy
- **Primary Text:** White
- **Secondary Text:** Light grey
- **Borders:** Subtle grey-blue
- **Accent Blue:** System status, active modules, rover location

## Safety Colors

- **Green:** Safe / Normal
- **Yellow / Amber:** Warning / Caution
- **Red:** Danger / Critical
- **Orange:** Survivor / mission-priority event
- **Blue:** Rover / navigation / active system

Avoid excessive neon effects.

Use color only when it communicates status or priority.

---

# 3. Typography

Use clean, highly readable sans-serif fonts.

Recommended:

```text
Inter
Roboto
Manrope
```

## Typography Hierarchy

### Page Title
Large and bold.

Example:

```text
NETRA-X MINE RESCUE CONTROL
```

### Section Headings
Medium-weight uppercase or semi-bold.

Example:

```text
ENVIRONMENT MONITORING
LIVE MINE MAP
SURVIVOR DETECTION
```

### Sensor Values
Large enough to read quickly.

Example:

```text
CH₄
0.62%
SAFE
```

### Supporting Text
Small but readable.

Avoid very small text because the dashboard may be viewed from a distance during demonstrations or rescue operations.

---

# 4. Dashboard Layout

Recommended desktop layout:

```text
┌──────────────┬──────────────────────────────────┬──────────────┐
│              │                                  │              │
│   SIDEBAR    │          MAIN CONTENT            │ LIVE ALERTS  │
│              │                                  │              │
│              │                                  │              │
└──────────────┴──────────────────────────────────┴──────────────┘
```

The main content area should contain:

```text
TOP STATUS BAR

ROVER STATUS CARDS

LIVE CAMERA        MINE MAP

ENVIRONMENT        SURVIVOR DETECTION

RISK-AWARE MISSION PLANNER

MISSION LOG
```

---

# 5. Sidebar

The sidebar should remain simple and compact.

Suggested navigation:

- Dashboard
- Live Mission
- Mine Map
- Survivor Detection
- Environment
- Mission Planner
- Rover Control
- Mission Logs
- Settings

At the bottom display:

```text
SYSTEM STATUS

● Rover Connected
● Sensors Online
● AI Active
```

The active page should be clearly highlighted.

---

# 6. Top Status Bar

Display the most important mission information.

Example:

```text
NETRA-X MINE RESCUE CONTROL

Mission: RESCUE-01
Status: MISSION ACTIVE

Mission Time: 00:37:42
Connection: CONNECTED
Last Update: 2 sec ago

[ EMERGENCY STOP ]
```

Emergency Stop should always remain visible.

Use red only for the emergency action.

---

# 7. Status Cards

Use small compact cards for key rover information.

Recommended cards:

- Battery
- Communication Signal
- Rover Speed
- Distance Travelled
- Operating Mode
- Mission Risk Score

Example:

```text
BATTERY
72%
```

Cards should include:

- Icon
- Label
- Main value
- Status indicator
- Optional small progress bar

Do not make status cards too large.

---

# 8. Environmental Monitoring

Environmental data should be shown using separate sensor cards.

Recommended sensors:

- Methane CH₄
- Carbon Monoxide CO
- Oxygen O₂
- Hydrogen Sulphide H₂S
- Temperature
- Humidity
- Water Level

Each card should display:

```text
CH₄

0.62%

SAFE
```

Status colors:

```text
SAFE     -> Green
WARNING  -> Amber
DANGER   -> Red
CRITICAL -> Red + stronger emphasis
```

Optional mini trend graphs can be used for important gases such as CH₄ and CO.

---

# 9. Live Camera Panel

The camera panel should be one of the largest sections.

Display:

- RGB camera feed
- Thermal mode
- Night vision mode

Controls:

```text
[ RGB ] [ THERMAL ] [ NIGHT VISION ]
```

Also show:

```text
● LIVE
CAM-01
FPS: 18
720p
```

If a real camera is unavailable, show a clear placeholder instead of a broken feed.

---

# 10. Mine Map Design

The map should be a schematic underground mine map, not a geographic map.

Show:

- Mine entrance
- Rover location
- Explored tunnel
- Unexplored tunnel
- Safe areas
- Hazard areas
- Obstacles
- Survivor location
- Recommended route

Suggested colors:

```text
Blue   -> Rover
Green  -> Safe route
Yellow -> Warning area
Red    -> Dangerous area
Orange -> Potential survivor
Grey   -> Unknown / unexplored area
```

Include a small legend.

The map should remain visually simple and readable.

---

# 11. Survivor Detection Panel

The panel should clearly distinguish between:

```text
POSSIBLE SURVIVOR
```

and

```text
HIGH CONFIDENCE DETECTION
```

Display:

- YOLO person detection
- Detection confidence
- Thermal confirmation
- Combined confidence
- Approximate distance
- Mine location

Example:

```text
POTENTIAL SURVIVOR DETECTED

YOLO Confidence: 91%
Thermal: Confirmed
Combined Confidence: 94%

Tunnel B - Sector 04
Distance: 17.4 m
```

Use orange for survivor-related events.

Avoid using language that claims medical condition.

---

# 12. Risk-Aware Mission Planner

This section should compare possible routes clearly.

Example:

```text
ROUTE A

Gas Risk:           High
Obstacle Risk:      Medium
Communication:      Weak
Mission Risk:       76 / 100

HIGH RISK
```

```text
ROUTE B

Gas Risk:           Low
Obstacle Risk:      Low
Communication:      Strong
Mission Risk:       24 / 100

LOW RISK
```

Then show:

```text
RECOMMENDED ROUTE

ROUTE B
```

Buttons:

```text
[ APPROVE ROUTE ]

[ MANUAL OVERRIDE ]
```

Keep the operator in control.

---

# 13. Alerts Panel

Alerts should remain visible on the right side of the dashboard.

Use three levels:

```text
INFO
WARNING
CRITICAL
```

Examples:

```text
12:42:18
Potential survivor detected
Tunnel B - Sector 04
```

```text
12:41:03
Methane concentration increasing
Tunnel A
```

```text
12:38:44
Obstacle detected
Distance: 2.3 m
```

Critical alerts should be visually dominant.

Do not use excessive animation.

---

# 14. Communication Status

Show communication health clearly.

Example:

```text
ROVER ↔ CONTROL ROOM

Telemetry: CONNECTED
Video Link: CONNECTED

Signal: 86%
Latency: 142 ms
Packets: 98.7%
Last Contact: 1 sec ago
```

If connection quality becomes weak, show:

```text
WEAK COMMUNICATION
```

in amber.

If connection is lost:

```text
CONNECTION LOST
```

in red.

---

# 15. Rover Control Panel

Manual controls should only become active in manual mode.

Modes:

```text
AUTONOMOUS
MANUAL
```

Controls:

```text
        FORWARD

LEFT     STOP     RIGHT

        REVERSE
```

Additional controls:

```text
RETURN TO BASE

EMERGENCY STOP
```

The Emergency Stop should be visually separate from normal controls.

---

# 16. AI / System Status

Keep AI status compact.

Example:

```text
SYSTEM MODULES

YOLO Detection       ACTIVE
Thermal Analysis     ACTIVE
Sensor Fusion        ACTIVE
SLAM                  ACTIVE
Hazard Analysis      ACTIVE
Mission Planner      ACTIVE
```

Do not label SLAM as an AI model.

---

# 17. Sensor Fusion Visualization

Keep this simple.

Example:

```text
RGB Camera
91%
     +
Thermal
Confirmed
     +
Audio
No Signal
     ↓
Combined Confidence
94%
```

This should visually show that multiple sensor sources contribute to one decision.

---

# 18. Mission Log

Mission logs should be chronological.

Example:

```text
12:31  Rover entered Tunnel A
12:34  SLAM map updated
12:35  Weak signal detected
12:38  Obstacle detected
12:40  Route recalculated
12:42  Potential survivor detected
```

Use simple rows with timestamps.

---

# 19. Interaction Design

The dashboard should support a clear operator workflow.

Typical flow:

```text
Monitor Rover
      ↓
Receive Alert
      ↓
Inspect Map / Camera
      ↓
Review Risk Score
      ↓
Approve Route / Override
      ↓
Continue Mission
```

Do not hide critical controls inside menus.

---

# 20. Simulation Controls

For demonstrations, provide:

```text
SIMULATE EMERGENCY

SIMULATE SURVIVOR

RESET SIMULATION
```

Simulation actions should update:

- Sensor values
- Alert panel
- Mission Risk Score
- Hazard map
- Survivor panel
- Route recommendation

Clearly indicate when the system is in simulation mode.

---

# 21. Responsive Design

Primary target:

```text
1920 × 1080
```

Also support:

```text
1366 × 768
```

On smaller displays:

- Stack panels vertically
- Keep alerts visible
- Preserve important status cards
- Avoid horizontal scrolling where possible

The dashboard is desktop-first.

---

# 22. UI Component Guidelines

Recommended reusable components:

```text
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
```

Each component should have one clear responsibility.

---

# 23. Animation Guidelines

Use animation only to communicate activity.

Good examples:

- Live-dot pulse
- Sensor value update
- Alert appearance
- Rover movement on map
- Loading state

Avoid:

- Excessive glowing
- Constant moving backgrounds
- Decorative animation
- Large transitions

The interface should feel stable during emergencies.

---

# 24. Accessibility and Readability

Important information must not depend only on color.

Example:

Bad:

```text
Red card only
```

Better:

```text
DANGER
Red status
Warning icon
```

Use:

- High contrast
- Clear text labels
- Meaningful icons
- Large clickable controls
- Consistent status terminology

---

# 25. Basic Dashboard Design Principle

Every dashboard section should answer one important question.

```text
Rover Status
-> Is the rover healthy?

Environment
-> Is the mine safe?

Camera
-> What can the rover see?

Mine Map
-> Where is the rover?

Survivor Detection
-> Has a potential survivor been found?

Risk Planner
-> Where should the rover go?

Alerts
-> What needs attention now?

Controls
-> What action can the operator take?
```

If a UI element does not help answer one of these questions, it probably does not need to be on the main dashboard.
