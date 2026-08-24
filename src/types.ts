export type RealmId = 'cyberpunk' | 'celestial' | 'abyss' | 'kinetic' | 'solaris';

export type CameraMode = 'orbit' | 'cinematic' | 'firstperson' | 'gyro';

export type LightingPreset = 'neon_midnight' | 'celestial_dawn' | 'bioluminescent' | 'solar_flare' | 'studio_chrome';

export interface RealmConfig {
  id: RealmId;
  name: string;
  subtitle: string;
  tagline: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  lore: string;
  audioPreset: string;
  structuresCount: number;
  particlesCount: number;
  cameraInitPos: [number, number, number];
  cameraTarget: [number, number, number];
  cinematicWaypoints: { pos: [number, number, number]; target: [number, number, number]; caption: string }[];
  highlightObjects: { id: string; name: string; description: string; type: string; pos: [number, number, number] }[];
}

export interface WorldSettings {
  speed: number;
  bloomIntensity: number;
  wireframe: boolean;
  particleDensity: number;
  distortion: number;
  colorGrade: 'vibrant' | 'synthwave' | 'emerald' | 'monochrome' | 'celestial';
  soundEnabled: boolean;
  soundVolume: number;
  droneSpeed: number;
  fov: number;
  autorotate: boolean;
}

export interface TelemetryData {
  fps: number;
  frameTime: number;
  geometries: number;
  triangles: number;
  drawCalls: number;
  textures: number;
}

export interface InteractiveNode {
  id: string;
  name: string;
  realmId: RealmId;
  category: string;
  description: string;
  meshType: string;
  material: string;
  energyLevel: number;
  position: [number, number, number];
  scale: [number, number, number];
}
