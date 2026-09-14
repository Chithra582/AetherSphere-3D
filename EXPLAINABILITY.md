# EXPLAINABILITY: aethersphere-3d

Comprehensive system explainability, operational mechanics, data provenance, and architectural limitations for the `aethersphere-3d` autonomous agent, compliant with the OpenGAP v0.1.0 specification.

---

## How your agent operates

### Operational Purpose & Architecture
`aethersphere-3d` is an autonomous spatial computing and procedural 3D graphics agent. Its primary objective is to design, calibrate, and orchestrate interactive, multi-dimensional WebGL 2.0 and Three.js environments with real-time procedural audio synthesis, operating completely without dependency on heavy external 3D assets.

### Decision-Making Workflow & Execution Pipeline
The agent operates via a deterministic, multi-stage cognitive and execution pipeline:

```
[User Directive / Prompt] 
          │
          ▼
[Perception & Intent Parsing] ──► [Rule & Duty Validation (RULES.md / DUTIES.md)]
                                                │
                                                ▼
[Spatial Audio Harmonization] ◄── [Procedural Geometry & Shader Synthesis]
          │
          ▼
[Continuous Telemetry & Optimization Loop (60 FPS / Draw Call Guardrails)]
```

1. **Perception & Intent Parsing**:
   - Ingests natural language directives or structured configurations requesting realm transitions, lighting adjustments, camera trajectories, or shader mutations.
   - Evaluates client device hardware capabilities, GPU tier, available WebGL extensions, and display refresh rate.

2. **Rule & Governance Verification**:
   - Cross-checks requested actions against hard boundaries in `RULES.md` (e.g., maximum draw call limits $< 150$, instancing caps $< 50,000$).
   - Enforces segregation of duties defined in `DUTIES.md` across `architect`, `renderer`, and `auditor` roles.

3. **Procedural Geometry & Shader Generation**:
   - Synthesizes mathematical parametric structures (Fibonacci golden-spiral celestial distributions, non-Euclidean torus knots, Dyson megastructure orbits).
   - Generates and compiles GLSL fragment and vertex shaders for real-time volumetric plasma, bioluminescent caustics, and stellar flares.
   - Uses `THREE.InstancedMesh` to batch repetitive geometric primitives into single GPU draw calls.

4. **Spatial Audio Synchronization**:
   - Harmonizes visual particle velocity, light intensity, and mesh oscillations with Web Audio synthesizer nodes.
   - Dynamically modulates oscillator wave types, biquad filter cutoffs, and spatial panner positions in 3D space.

5. **Telemetry & Self-Optimization**:
   - Continuously audits real-time metrics (frames per second, frame delta time, active geometries, triangle count, draw calls).
   - Automatically throttles particle density or adjusts Level of Detail (LOD) if frame rate falls below 55 FPS.

---

## The data it uses

### Data Sources & Input Ingestion
The agent consumes clearly defined, transparent data streams:
- **User Directives**: Natural language prompts, creative design instructions, or explicit parameter adjustments.
- **Hardware & Environment Telemetry**: Real-time browser capabilities, WebGL 2.0 context parameters, GPU vendor identification, screen aspect ratio, device pixel ratio, and Web Audio context state.
- **Declarative Configuration State**: Version-controlled JSON and YAML schemas defining realm metadata, camera waypoints, color palettes, and lighting presets.

### Knowledge & Foundational Data
- **Algorithmic Mathematics**: Pre-programmed mathematical formulas for spherical Fibonacci lattices, parametric torus knots, fractal noise functions, and geometric transformations.
- **Specification Schemas**: OpenGAP v0.1.0 specifications (`agent.yaml`, `tools/realm-configurator.yaml`, `skills/procedural-generation/SKILL.md`).
- **Foundational LLM Weights**: Utilizes pretrained frontier models (Claude 3.7 Sonnet, GPT-4o) with strict system prompt boundaries defined in `SOUL.md`.

### Data Storage & Persistence Model
- **Git-Native Persistence**: The agent does not rely on opaque third-party databases. All persistent configurations, realm lore, and procedural presets are stored and versioned directly within the GitHub repository.
- **Ephemeral Session Memory**: Real-time rendering matrices, audio node buffers, and WebGL uniform values reside exclusively in volatile memory (RAM/VRAM) during an active browser session and are discarded upon termination.

### Data Privacy & Governance
- **Zero Personally Identifiable Information (PII)**: The agent collects, processes, and stores zero personal data, credentials, user tracking cookies, or browsing histories.
- **Client-Side Execution**: All mathematical calculations, procedural generation loops, and shader renderings are executed locally on the client's device, ensuring complete privacy.

---

## Its limitations

### Technical & Environmental Constraints
- **Hardware Dependency**: The agent requires a WebGL 2.0-compliant graphics context (OpenGL ES 3.0 equivalent). Devices with legacy or integrated GPUs without hardware float texture support will experience degraded visual fidelity or reduced particle counts.
- **Browser Autoplay Security Policies**: Modern web browsers enforce strict security restrictions prohibiting autonomous audio playback without a prior user gesture. The agent cannot initiate audio synthesis until an explicit user interaction occurs.
- **Performance Ceilings**: To maintain a consistent 60 FPS experience, total scene complexity is strictly constrained: maximum 50,000 instanced particles, maximum 150 draw calls per frame, and maximum 500,000 rendered triangles.

### Scope & Functional Boundaries
- **No External Network Execution**: The agent cannot make arbitrary outbound network requests, access private file systems outside the repository workspace, or execute arbitrary system shell commands.
- **Strictly Graphics & Spatial Audio Domain**: The agent is engineered specifically for procedural 3D scene construction, shader development, and real-time audio-visual synthesis; it is not designed for generalized administrative or database management tasks.

### Failure Modes & Graceful Degradation
- **WebGL Context Loss**: If the host operating system or GPU driver terminates the WebGL context, the agent catches the context loss event, halts rendering loops, releases GPU resource handles, and attempts automatic recovery without crashing the host application.
- **Input Parameter Out-of-Bounds**: Any requested parameter outside defined safe operational bounds (e.g., flight speed $> 35\text{ m/s}$, bloom intensity $> 3.0$, or invalid realm identifiers) is automatically clamped to safe threshold values specified in `tools/realm-configurator.yaml`.
- **API Disconnection & Rate Limits**: If external model API calls fail or experience rate limits, the agent falls back seamlessly to local procedural presets and default shader templates without interrupting active scene navigation.
