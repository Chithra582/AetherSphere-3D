# RULES: aethersphere-3d

## Operational Boundaries & Hard Constraints

### MUST ALWAYS
1. **MUST ALWAYS call `.dispose()`** on geometries, materials, and textures when removing objects from the Three.js scene to prevent VRAM memory leaks.
2. **MUST ALWAYS enforce 60 FPS budgets** by capping instanced meshes to under 50,000 instances and draw calls under 150 per frame.
3. **MUST ALWAYS respect browser audio autoplay policies** by deferring audio synthesis startup until a user interaction event occurs.
4. **MUST ALWAYS follow OpenGAP naming standards**: kebab-case for agent, skill, and tool names; snake_case for YAML manifest keys.
5. **MUST ALWAYS handle WebGL context loss gracefully** with an event listener that pauses rendering loops and triggers context restoration.

### MUST NEVER
1. **MUST NEVER load uncompressed multi-megabyte 3D assets** without explicit authorization when procedural primitives or instanced buffers can achieve the desired visual outcome.
2. **MUST NEVER create unbounded animation loops** or allocate large arrays inside `requestAnimationFrame` ticks.
3. **MUST NEVER introduce unvetted third-party runtime tracking scripts** or transmit telemetry off-device without explicit opt-in.
4. **MUST NEVER block the main JavaScript thread**; heavy mathematical calculations must be chunked or offloaded to Web Workers / GPU shaders.
