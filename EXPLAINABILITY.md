# EXPLAINABILITY — AetherSphere 3D

> **Admissibility & Transparency Report for OpenGAP / Agent Passport**  
> *Agent Name:* AetherSphere 3D (`aethersphere-3d`)  
> *Specification:* OpenGAP v0.1.0  
> *Domain:* Developer Tools / 3D Graphics & Spatial Computing  

---

## 1. Overview & Architectural Purpose

AetherSphere 3D is an autonomous spatial computing, procedural 3D multiverse architect, and WebGL shader synthesis agent. Its purpose is to transcend conventional 2D flat web design by procedurally generating, calibrating, and orchestrating interactive 3D WebGL 2.0 / Three.js environments, dynamic camera flight physics, and real-time spatial audio synthesis without reliance on heavy static 3D model files.

AetherSphere 3D parses user directives and environmental constraints, computes deterministic mathematical manifolds (Fibonacci celestial swarms, parametric non-Euclidean torus knots, Dyson structures), compiles custom GLSL fragment and vertex shaders, harmonizes spatial audio frequencies, and continuously monitors runtime GPU telemetry to maintain an unwavering 60 FPS performance budget.

---

## 2. How the Agent Decides (Decision-Making Logic)

AetherSphere 3D operates across a deterministic, multi-stage decision pipeline:

```
[User Directive / Realm Request] ──> [Perception & Shader Grammar Parsing] ──> [Complexity & Resource Analysis]
                                                                                            │
                                                                                            ▼
[Spatial Audio & Telemetry Loop] <── [GPU Buffer & Material Compilation] <── [Procedural Geometry Synthesis]
```

### 2.1 Scene Parameter & Aesthetic Interpretation
- **Decision:** Determines geometric topology, lighting presets, color palettes, and cinematic camera waypoints based on requested realm archetypes (`cyberpunk`, `celestial`, `abyss`, `kinetic`, `solaris`).
- **Model:** Leverages Claude 3.7 Sonnet and GPT-4o with structured JSON schema enforcement (`tools/realm-configurator.yaml`) to output strictly validated, executable configuration objects.

### 2.2 Algorithmic Geometry & Manifold Synthesis
- **Decision:** Selects and evaluates mathematical formulations for spatial distribution, preventing static asset asset bloat and long download times.
- **Rules:**
  - Utilize spherical Fibonacci lattices for uniform celestial starfields and orbital Dyson collectors: $y_i = 1 - \frac{2i}{N-1}, \quad r_i = \sqrt{1 - y_i^2}, \quad \theta_i = 2\pi i \cdot \phi^{-1}$.
  - Compute parametric $(p,q)$-torus curves for kinetic non-Euclidean structures: $x(\phi) = (\cos(q\phi)+2)\cos(p\phi)$.
  - Mandate `THREE.InstancedMesh` for any repeated geometric element exceeding 50 units to consolidate GPU draw calls into a single invocation.

### 2.3 Audio-Visual Frequency Harmonization
- **Decision:** Dynamically binds visual movement, particle speed, and shader wave distortion to Web Audio procedural synthesis parameters.
- **Rationale:** Ensures auditory feedback directly matches visual dynamics; flight velocity exponentially scales oscillator frequencies ($f(v) = f_{\text{base}} \cdot 2^{\frac{v - v_{\text{min}}}{v_{\text{max}} - v_{\text{min}}} \cdot n_{\text{octaves}}}$) while camera position drives 3D spatial panning.

### 2.4 Resource Budgeting & Autonomous Optimization
- **Decision:** Evaluates real-time telemetry (FPS, frame render delta in milliseconds, triangle count, and draw call volume) against predefined guardrail thresholds.
- **Feedback:** If frame rates drop below 55 FPS or draw calls exceed 150, the agent automatically downscales particle densities, activates level-of-detail (LOD) downgrades, and triggers garbage collection.

---

## 3. Data Sources & Inputs Used

| Data Input | Source | Purpose | Data Handling & Privacy |
|---|---|---|---|
| **User Directives** | Natural language prompts / UI controls | Defines target realm, camera speed, bloom, distortion, and aesthetic profile | Processed ephemerally in memory; not stored externally or used for retraining |
| **Hardware & GPU Telemetry** | Browser WebGL context (`WEBGL_debug_renderer_info`) | Adapts particle counts, float texture precision, and shader complexity to client hardware | Inspected client-side only; zero telemetry transmitted off-device |
| **Realm & World Settings** | Git-native configuration files (`src/types.ts`, `agent.yaml`) | Parameterizes rendering uniforms, waypoints, and physics constants | Version-controlled in public git repository; completely reproducible |
| **Runtime Performance Metrics** | Three.js internal renderer statistics | Tracks instantaneous FPS, triangle count, and draw calls per frame | Real-time monitoring loop in volatile client memory; zero PII logged |

AetherSphere 3D complies with privacy-by-design standards:
- **No PII collection:** No usernames, IP addresses, browsing histories, or personal identifiers are ever collected, parsed, or transmitted.
- **Stateless execution:** Procedural generation and WebGL rendering occur entirely client-side in the browser's isolated JavaScript sandbox.

---

## 4. Known Limitations & Failure Modes

Reviewers and engineers should be aware of the following system boundaries:

1. **WebGL 2.0 Hardware Compatibility:**
   - *Limitation:* Devices lacking WebGL 2.0 (OpenGL ES 3.0 support) or hardware float texture support cannot execute custom volumetric fragment shaders.
   - *Mitigation:* The agent detects unsupported WebGL capabilities during context initialization and gracefully falls back to basic unlit materials and standard Three.js mesh primitives.

2. **Browser Autoplay Security Constraints:**
   - *Limitation:* Web browsers strictly block procedural Web Audio generation until a physical user interaction (click or keypress) occurs.
   - *Mitigation:* Audio contexts initialize in a `'suspended'` state; visual rendering proceeds immediately at 60 FPS while audio smoothly fades in upon the user's first input interaction.

3. **GPU Thermal & Instancing Ceilings:**
   - *Limitation:* On lower-end mobile devices, extreme particle counts ($> 50,000$) can induce GPU thermal throttling and frame drops.
   - *Mitigation:* Hard constraints in `RULES.md` clamp particle density at 50,000 maximum and cap draw calls at 150, automatically reducing resolution scale on high-DPI mobile screens.

4. **WebGL Context Loss & VRAM Leaks:**
   - *Limitation:* Rapidly switching between complex 3D environments without explicit memory disposal will trigger browser WebGL context termination.
   - *Mitigation:* The agent mandates explicit `.dispose()` calls on all geometries, textures, and custom shader materials during every realm transition, supplemented by an automated `webglcontextlost` recovery listener.

---

## 5. Verification, Safety & Human Oversight

- **Real-Time Telemetry HUD:** Users and developers can continuously inspect live rendering telemetry (FPS, frame duration in ms, geometry count, triangle count, draw calls) displayed in the active HUD overlay.
- **Segregation of Duties (SOD):** Critical operations adhere to `DUTIES.md` role boundaries (`architect`, `renderer`, `auditor`), preventing unvetted scene mutations from bypassing performance auditing.
- **Git-Native Auditability:** Every configuration schema, shader routine, and skill definition is tracked via git commits, ensuring deterministic replayability and comprehensive peer review through standard pull requests.
