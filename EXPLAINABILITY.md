# EXPLAINABILITY: aethersphere-3d

> Comprehensive system explainability, operational mechanics, data usage, and architectural boundaries for the `aethersphere-3d` autonomous agent.

---

## 1. How Your Agent Operates

### 1.1 Core Architecture & Operational Objective
`aethersphere-3d` is an autonomous spatial computing and procedural 3D graphics agent built on the OpenGAP standard. Its primary objective is to procedurally design, calibrate, and orchestrate interactive 3D WebGL multiverses and spatial audio landscapes without reliance on bloated, static 3D model assets.

### 1.2 Decision-Making Workflow & Execution Pipeline
The agent operates through a deterministic, four-stage execution pipeline:

```
┌─────────────────────────┐       ┌─────────────────────────────┐       ┌──────────────────────────────┐       ┌───────────────────────────────┐
│ 1. Perception & Parsing │  ──►  │ 2. Procedural Synthesis     │  ──►  │ 3. Spatial Audio-Visual Sync │  ──►  │ 4. Telemetry & Governance     │
│ Ingest prompts & limits │       │ Geometries, Shaders & Paths │       │ Harmonize visual & soundscape│       │ Monitor 60 FPS, draw calls    │
└─────────────────────────┘       └─────────────────────────────┘       └──────────────────────────────┘       └───────────────────────────────┘
```

1. **Perception & Constraint Parsing**:
   - Parses incoming user directives (e.g., world style, lighting shifts, speed calibrations).
   - Ingests hardware profiles (WebGL 2.0 availability, GPU tier, display refresh rate).
   - Verifies operational rules against `RULES.md` and role separation in `DUTIES.md`.

2. **Procedural Geometry & Shader Synthesis**:
   - Generates mathematical parametric curves (Fibonacci star fields, Dyson collector spheres, non-Euclidean torus knots).
   - Synthesizes GLSL fragment and vertex shaders for real-time effects (plasma fields, caustics, auroras, bloom).
   - Utilizes `THREE.InstancedMesh` to batch repetitive elements into single draw calls.

3. **Spatial Audio-Visual Synchronization**:
   - Connects visual particle velocity, light intensity, and mesh deformations to the procedural Web Audio synthesizer.
   - Modulates biquad filter frequencies, oscillator waveforms, and stereo spatial panning based on camera position and flight speed.

4. **Telemetry Feedback & Adaptive Optimization**:
   - Continually monitors performance metrics (FPS, frame render times, draw calls, active geometries).
   - Automatically throttles particle counts or adjusts level-of-detail (LOD) if the frame rate drops below 55 FPS.

### 1.3 Step-by-Step Operation Flowchart
When given a user command such as "Transition to Abyssal Luminance and increase distortion":
- **Step 1**: Validates `realm_id: abyss` against the valid enum set in `tools/realm-configurator.yaml`.
- **Step 2**: Triggers the `architect` role to load the realm color palette (`#00f0ff`, `#001133`), ambient lighting, and cinematic waypoints.
- **Step 3**: Invokes the `renderer` role to compile custom bioluminescent ocean shaders and spawn glowing particulate fields.
- **Step 4**: Signals the Web Audio engine to switch to the deep-water sub-bass ambient drone preset.
- **Step 5**: Calls `.dispose()` on previous realm textures and buffers to eliminate memory leaks.
- **Step 6**: The `auditor` role confirms draw calls remain under 150 and frame rate maintains 60 FPS.

---

## 2. The Data It Uses

### 2.1 Input Data Sources
The agent strictly consumes deterministic and verifiable data streams:
- **User Directives & Natural Language Prompts**: High-level creative or technical instructions specifying environment themes, visual parameters, or camera trajectories.
- **Hardware Telemetry**: Client-side WebGL context information, GPU vendor strings, screen aspect ratio, device pixel ratio, and audio context sample rates.
- **Declarative Configuration State**: Structured JSON/YAML definitions specifying realm metadata, coordinate waypoints, and lighting matrices.

### 2.2 Data Ingestion & State Schemas
The agent manipulates data structured through explicit TypeScript contracts (`src/types.ts`):
- **`RealmConfig`**: Contains theme colors, accent highlights, lore descriptions, particle density, initial camera vectors, and cinematic waypoints.
- **`WorldSettings`**: Dynamic properties including flight velocity ($0.1 - 35\text{ m/s}$), bloom intensity ($0.0 - 3.0$), distortion ($0.0 - 1.0$), wireframe mode, and color grading profiles (`vibrant`, `synthwave`, `emerald`, `monochrome`, `celestial`).
- **`TelemetryData`**: Diagnostic metrics including instantaneous FPS, frame render time (ms), active geometry count, triangle count, and draw call volume.

### 2.3 Data Storage & Persistence
- **Zero Database Dependency**: The agent operates entirely without centralized databases.
- **Git-Native Memory**: Persistent changes to realm configurations, shader presets, or agent capabilities are recorded as version-controlled commits in the GitHub repository.
- **Ephemeral Session State**: Real-time rendering uniforms and camera flight matrices reside only in volatile memory (RAM/VRAM) and are discarded upon session termination.

### 2.4 Data Privacy, PII & Governance
- **Zero Personally Identifiable Information (PII)**: The agent does not ingest, process, or persist usernames, emails, IP addresses, credentials, or personal telemetry.
- **Public Data Classification**: All data ingested and emitted by `aethersphere-3d` is classified as public open-source operational data.
- **Client-Side Processing**: All procedural algorithms and mathematical evaluations occur locally inside the client runtime or sandbox environment.

---

## 3. Its Limitations

### 3.1 Technical & Computational Constraints
1. **WebGL 2.0 & GPU Capability**:
   - The agent requires WebGL 2.0 (OpenGL ES 3.0 equivalent). Devices lacking float texture support or high-precision vertex shaders will fall back to degraded procedural geometries.
2. **Resource & Geometry Ceilings**:
   - While modern GPUs handle millions of triangles, mobile and integrated GPUs can suffer thermal throttling. The agent caps particle instancing at 50,000 instances and enforces a maximum draw call budget of 150.
3. **Browser Audio Autoplay Policies**:
   - Browsers prohibit Web Audio synthesis prior to a user gesture. The agent cannot initiate audio output autonomously without user interaction.

### 3.2 Non-Determinism & Creative Boundaries
1. **Model Variations**:
   - When generating complex custom GLSL shaders via LLM reasoning, code variations may occur across different model providers (e.g., Claude vs. GPT-4o). The agent validates shader syntax against a WebGL test canvas prior to applying it.
2. **No Physical World Interaction**:
   - The agent's actions are strictly confined to 3D graphics scenes, procedural audio nodes, and configuration files. It possesses no capability to interact with external networks or execute arbitrary shell commands.

### 3.3 Failure Modes & Graceful Degradation
- **WebGL Context Loss**: If the host device triggers a WebGL context loss event (due to memory pressure or driver reset), the agent automatically unbinds active render loops, releases all GPU handles, and displays a recovery notice.
- **Audio Context Suspension**: If the browser suspends the audio context due to background tab switching, the agent pauses oscillator scheduling to avoid buffer desynchronization.
- **Invalid Parameter Safeguards**: Any parameter supplied outside defined bounds (e.g., negative flight speed or bloom $> 3.0$) is clamped automatically to the nearest safe boundary defined in `tools/realm-configurator.yaml`.

---

## 4. Architectural Transparency & Auditability

### 4.1 Framework Portability
In compliance with OpenGAP standards, `aethersphere-3d` defines its entire operational logic via plain files (`agent.yaml`, `SOUL.md`, `RULES.md`, `DUTIES.md`, `AGENTS.md`), ensuring full portability across:
- **Claude Code**
- **OpenAI SDK**
- **CrewAI**
- **Lyzr Agent Framework**

### 4.2 Audit Trail
Every procedural realm modification, shader compilation, and configuration tuning can be traced back to explicit commits in git history, ensuring complete auditability and reproducibility.
