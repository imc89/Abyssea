// Importa los iconos de volumen.
import { TiVolumeMute, TiVolumeDown } from 'react-icons/ti';

// Constantes del juego.
export const PIXELS_PER_METER = 10; // Píxeles por metro.
export const MAX_WORLD_DEPTH = 11000 * PIXELS_PER_METER; // Profundidad máxima del mundo.
export const SPOTLIGHT_MAX_BATTERY = 100; // Batería máxima del foco.
export const SPOTLIGHT_DRAIN_RATE = 0.01; // Tasa de consumo de batería del foco.
export const SPOTLIGHT_CHARGE_RATE = 0.03; // Tasa de recarga de batería del foco.
// --- Spotlight Position and Shape ---
// These constants control the position and shape of the submarine's spotlight.
// The origin of the light is relative to the submarine's dimensions.
export const SPOTLIGHT_HORIZONTAL_OFFSET = 0.8; // Horizontal position of the light source on the submarine. 0.8 means 80% from the left edge.
export const SPOTLIGHT_VERTICAL_OFFSET = 0.6; // Vertical position of the light source on the submarine. 0.6 means 60% from the top edge.
export const SPOTLIGHT_LENGTH = 350; // The length of the spotlight beam in pixels.
export const SPOTLIGHT_WIDTH_AT_END = 150; // The width of the spotlight beam at its end in pixels.
export const AMBIENT_LIGHT_RADIUS = 80; // Radio de la luz ambiental.
export const AMBIENT_LIGHT_MAX_OPACITY = 0.5; // Opacidad máxima de la luz ambiental.
export const SUBMARINE_IMAGE_URL = `${process.env.PUBLIC_URL}/img/submarine/submarine.gif`; // URL de la imagen del submarino.
export const SUBMARINE_STATIC_IMAGE_URL = `${process.env.PUBLIC_URL}/img/submarine/submarine-static.png`;
export const SUBMARINE_BASE_WIDTH = 120;
export const SUBMARINE_BASE_HEIGHT = 60;
export const SUBMARINE_SCALE_FACTOR = 0.85;
export const SUBMARINE_HORIZONTAL_SPEED = 5;
export const SUBMARINE_VERTICAL_SPEED = 3;

// Define la densidad de partículas para diferentes zonas de profundidad.
export const PARTICLE_DENSITY_ZONES = [
    { depth: 0, densityFactor: 2.5 },
    { depth: 200 * PIXELS_PER_METER, densityFactor: 2.5 },
    { depth: 1000 * PIXELS_PER_METER, densityFactor: 2.5 },
    { depth: 4000 * PIXELS_PER_METER, densityFactor: 2.5 }
];

// Define colores y niveles de oscuridad para diferentes zonas de profundidad.
export const ZONE_COLORS = [
    { depth: 0 * PIXELS_PER_METER, name: "Zona Epipelágica (Fótica)", r: 26, g: 58, b: 94, darknessLevel: 0.0 },
    { depth: 200 * PIXELS_PER_METER, name: "Zona Mesopelágica (Crepuscular)", r: 10, g: 30, b: 60, darknessLevel: 0.4 },
    { depth: 300 * PIXELS_PER_METER, name: "Zona de Transición Oscura", r: 5, g: 10, b: 20, darknessLevel: 0.95 },
    { depth: 1000 * PIXELS_PER_METER, name: "Zona Batipelágica (Oscura)", r: 5, g: 15, b: 30, darknessLevel: 0.98 },
    { depth: 4000 * PIXELS_PER_METER, name: "Zona Abisopelágica (Abisal)", r: 0, g: 0, b: 10, darknessLevel: 0.99 },
    { depth: 6000 * PIXELS_PER_METER, name: "Zona Hadopelágica (Fosas Oceánicas)", r: 0, g: 0, b: 0, darknessLevel: 1.0 }
];

// Define y exporta los iconos para que puedan ser utilizados en otros componentes.
export const MuteIcon = TiVolumeMute;
export const UnmuteIcon = TiVolumeDown;
