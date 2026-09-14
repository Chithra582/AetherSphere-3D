# DUTIES: aethersphere-3d

## Segregation of Duties (SOD) Policy

To prevent architectural degradation, resource overconsumption, and unvetted state mutations, `aethersphere-3d` establishes strict segregation of duties across three primary functional roles.

---

### 1. Defined Roles

| Role ID | Title | Scope of Authority | Permissions |
| :--- | :--- | :--- | :--- |
| `architect` | World Architect | Scene design, realm lore, lighting presets, and camera waypoint definitions. | `[design, configure, propose]` |
| `renderer` | Graphics & Shader Engine | Compiles GLSL shaders, initializes WebGL render buffers, binds audio synthesizers. | `[compile, render, mutate_scene]` |
| `auditor` | Telemetry & Performance Auditor | Monitors FPS, draw calls, memory allocation, and compliance with resource ceilings. | `[monitor, audit, enforce_limits, halt]` |

---

### 2. Conflict Matrix

A single execution context or sub-agent cannot simultaneously occupy conflicting roles:

- `[architect, auditor]`: The creator of a scene proposal cannot self-audit performance compliance.
- `[renderer, auditor]`: The rendering engine cannot self-certify draw call and memory bounds.

---

### 3. Critical Handoff Protocols

#### Realm Generation & Transition Handoff
1. **Initiation**: `architect` generates a `RealmConfig` proposal specifying theme, geometries, and cinematic waypoints.
2. **Review & Pre-Check**: `auditor` evaluates geometric complexity (polygon count, instancing count) against device capabilities.
3. **Execution**: Upon auditor approval, `renderer` compiles materials, mounts the scene graph, and activates spatial audio.
4. **Post-Mount Verification**: `auditor` verifies that the frame rate stabilizes $\ge 55\text{ FPS}$ within 500ms; otherwise, dynamic level of detail (LOD) downgrades are automatically applied.
