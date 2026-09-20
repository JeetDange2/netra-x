import React, { useState } from 'react';
import { Cpu, Layers, Radio, Shield, HelpCircle, Server, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

export const ArchitectureViewer = () => {
  const [activeSubTab, setActiveSubTab] = useState('FLOW'); // 'FLOW' | 'HARDWARE' | 'JUDGE_QA'

  const judgeQuestions = [
    {
      q: "Which AI model is used and why?",
      a: "YOLOv8n for person detection. It is lightweight, fast, and optimized for edge systems with low power consumption while maintaining solid mAP accuracy."
    },
    {
      q: "Does AI detect methane or toxic gases?",
      a: "No. Physical calibrated sensors (MQ/electrochemical/NDIR) detect gas concentrations. Deterministic rule-based hazard thresholds convert PPM/LEL values into safety classifications, which are then used by the AI risk planner."
    },
    {
      q: "What does SLAM do?",
      a: "Simultaneous Localization and Mapping (SLAM Toolbox with 2D LiDAR and IMU odometry) constructs the underground tunnel map in real-time and estimates the rover's position without relying on GPS."
    },
    {
      q: "What is Risk-Aware Navigation instead of standard shortest-path?",
      a: "Standard A* finds the shortest geometric distance. NETRA-X's Risk-Aware Mission Planner calculates a weighted Mission Risk Score incorporating gas concentration (35%), obstacles (20%), RF comms strength (15%), environmental heat/flooding (15%), and battery energy to return (15%). It selects the safest viable route."
    },
    {
      q: "What happens if AI or communications fail underground?",
      a: "Safety-critical functions remain 100% deterministic and local to the rover (ESP32/Pi): emergency stop, obstacle bumper stop, critical gas back-off, and communication-loss auto return-to-base along reverse breadcrumbs. The rover never depends on cloud connectivity for basic safety."
    },
    {
      q: "Can video stream over LoRa?",
      a: "No. LoRa provides long-range sub-GHz telemetry and alerts (~10-50 kbps). High-bandwidth video and point clouds use 5.8GHz Wi-Fi Mesh repeaters. If Wi-Fi fails, the rover falls back to LoRa telemetry automatically."
    }
  ];

  const [openQIndex, setOpenQIndex] = useState(0);

  return (
    <div className="bg-mine-surface border border-mine-border rounded-lg p-4 shadow-md flex flex-col gap-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-mine-border">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              NETRA-X System Architecture &amp; Engineering Specifications
            </h2>
            <p className="text-[11px] text-mine-muted">
              Official Technical Documentation &amp; Evaluation Reference (SIH 2026 Standards)
            </p>
          </div>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center gap-1 bg-mine-darkest p-1 rounded-lg border border-mine-border text-xs">
          <button
            onClick={() => setActiveSubTab('FLOW')}
            className={`px-3 py-1 rounded transition ${
              activeSubTab === 'FLOW' ? 'bg-cyan-600 text-white font-bold' : 'text-mine-subtext hover:text-white'
            }`}
          >
            SYSTEM FLOW
          </button>
          <button
            onClick={() => setActiveSubTab('HARDWARE')}
            className={`px-3 py-1 rounded transition ${
              activeSubTab === 'HARDWARE' ? 'bg-cyan-600 text-white font-bold' : 'text-mine-subtext hover:text-white'
            }`}
          >
            HARDWARE SPLIT
          </button>
          <button
            onClick={() => setActiveSubTab('JUDGE_QA')}
            className={`px-3 py-1 rounded transition ${
              activeSubTab === 'JUDGE_QA' ? 'bg-cyan-600 text-white font-bold' : 'text-mine-subtext hover:text-white'
            }`}
          >
            JUDGE / AUDIT Q&amp;A
          </button>
        </div>
      </div>

      {/* Tab 1: System Flow Diagram */}
      {activeSubTab === 'FLOW' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Layer 1 */}
            <div className="bg-mine-card border border-mine-border rounded-lg p-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-2">
                <Layers className="w-4 h-4" />
                <span>1. Rover Embedded Layer</span>
              </div>
              <ul className="text-xs text-mine-subtext space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong className="text-white">ESP32:</strong> High-frequency sensor polling (CH₄, CO, O₂, H₂S, Temp, Water), dual track motor drivers, encoders.</li>
                <li><strong className="text-white">Raspberry Pi:</strong> Camera stream capture, thermal processing, ROS 2 SLAM Toolbox localization, local telemetry hub.</li>
                <li><strong className="text-white">Local Safety Logic:</strong> Fail-safe obstacle stop, battery preservation, self-recovery sequence.</li>
              </ul>
            </div>

            {/* Layer 2 */}
            <div className="bg-mine-card border border-mine-border rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-2">
                <Radio className="w-4 h-4" />
                <span>2. Dual Communication Layer</span>
              </div>
              <ul className="text-xs text-mine-subtext space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong className="text-white">5.8GHz Mesh Wi-Fi:</strong> High-bandwidth video (RGB &amp; Thermal), dense LiDAR point clouds, real-time map sync.</li>
                <li><strong className="text-white">LoRa (868 MHz):</strong> Low-bandwidth, long-range emergency fallback for critical gas alerts, battery status, and GPS-denied position coordinates.</li>
                <li><strong className="text-white">MQTT Telemetry:</strong> Lightweight publish/subscribe topic broker.</li>
              </ul>
            </div>

            {/* Layer 3 */}
            <div className="bg-mine-card border border-mine-border rounded-lg p-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                <Server className="w-4 h-4" />
                <span>3. Surface Control Station</span>
              </div>
              <ul className="text-xs text-mine-subtext space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong className="text-white">React Command Center:</strong> Real-time situational dashboard with live feeds, SLAM vector map, and gas telemetry.</li>
                <li><strong className="text-white">Risk-Aware Planner:</strong> Evaluates route costs, presents explainable weight breakdowns, and requests operator approval.</li>
                <li><strong className="text-white">Survivor Fusion HUD:</strong> Multi-sensor verification (Visual + Thermal + Acoustic).</li>
              </ul>
            </div>
          </div>

          {/* Flowchart Schematic */}
          <div className="bg-mine-darkest p-4 rounded-lg border border-mine-border text-xs">
            <div className="text-mine-muted uppercase text-[10px] mb-2 font-bold">End-to-End Data Pipeline Flowchart</div>
            <pre className="text-cyan-300 overflow-x-auto text-[11px] leading-tight">
{`[ENVIRONMENT SENSORS]      [LIDAR + IMU]         [RGB + THERMAL CAM]
 CH4/CO/O2/H2S/Temp           Odometry                Dual Optics
         |                         |                       |
         v                         v                       v
      [ESP32] -------------> [RASPBERRY PI] --------> [AI / YOLOv8n]
 Low-level Drivers          ROS 2 + SLAM Toolbox    Person & Heat Match
         |                         |                       |
         +-------------------------+-----------------------+
                                   |
                                   v
                         [SENSOR FUSION ENGINE]
                       Multi-Modal Hazard Analysis
                                   |
                                   v
                     [RISK-AWARE MISSION PLANNER]
                      Evaluates Route A vs Route B
                                   |
                        (LoRa / Wi-Fi Mesh)
                                   |
                                   v
                   [SURFACE RESCUE COMMAND CENTER]
             Live Map • Thermal HUD • Mission Risk • E-Stop`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Hardware Split */}
      {activeSubTab === 'HARDWARE' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-mine-border rounded-lg overflow-hidden">
            <thead className="bg-mine-card text-white uppercase text-[11px] border-b border-mine-border">
              <tr>
                <th className="p-3">Subsystem</th>
                <th className="p-3">Hardware Platform</th>
                <th className="p-3">Primary Tech / Software</th>
                <th className="p-3">Responsibilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mine-border text-mine-subtext">
              <tr className="hover:bg-mine-card/40">
                <td className="p-3 font-bold text-white">Low-Level Rover Control</td>
                <td className="p-3 text-cyan-300">ESP32 Dual-Core MCU</td>
                <td className="p-3">C / C++ (PlatformIO)</td>
                <td className="p-3">Gas sensor reading, PWM motor driver signals, wheel encoder odometry, hardware fail-safe stop.</td>
              </tr>
              <tr className="hover:bg-mine-card/40">
                <td className="p-3 font-bold text-white">Edge Perception &amp; Navigation</td>
                <td className="p-3 text-cyan-300">Raspberry Pi 4 / Edge SBC</td>
                <td className="p-3">Python, ROS 2, SLAM Toolbox</td>
                <td className="p-3">Camera capture, LiDAR scan aggregation, 2D SLAM underground mapping, Nav2 costmap path generation.</td>
              </tr>
              <tr className="hover:bg-mine-card/40">
                <td className="p-3 font-bold text-white">AI Survivor Detection</td>
                <td className="p-3 text-orange-300">Edge / Surface Offload</td>
                <td className="p-3">YOLOv8n, OpenCV, PyTorch</td>
                <td className="p-3">Visual person class detection, bounding box tracking, thermal core hotspot comparison.</td>
              </tr>
              <tr className="hover:bg-mine-card/40">
                <td className="p-3 font-bold text-white">Surface Rescue Command</td>
                <td className="p-3 text-emerald-300">Rugged Surface Laptop</td>
                <td className="p-3">React.js, Vite, Tailwind CSS</td>
                <td className="p-3">Operator UI, multi-camera live switching, route approval workflow, audio-visual tactical alerts.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Judge & Audit Q&A */}
      {activeSubTab === 'JUDGE_QA' && (
        <div className="space-y-2">
          {judgeQuestions.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-mine-card border border-mine-border rounded-lg overflow-hidden transition"
            >
              <button
                onClick={() => setOpenQIndex(openQIndex === idx ? -1 : idx)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-mine-hover text-white text-xs font-bold transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px]">
                    Q{idx + 1}
                  </span>
                  <span>{item.q}</span>
                </div>
                {openQIndex === idx ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-mine-muted" />}
              </button>

              {openQIndex === idx && (
                <div className="p-3 pt-0 text-xs text-mine-subtext leading-relaxed border-t border-mine-border/50 bg-mine-darkest/40">
                  <div className="text-emerald-400 font-semibold mb-1">Answer / Technical Defense:</div>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
