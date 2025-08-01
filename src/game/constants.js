// Constantes del juego.
export const PIXELS_PER_METER = 10; // Píxeles por metro.
export const MAX_WORLD_DEPTH = 11000 * PIXELS_PER_METER; // Profundidad máxima del mundo.
export const SPOTLIGHT_MAX_BATTERY = 100; // Batería máxima del foco.
export const SPOTLIGHT_DRAIN_RATE = 0.01; // Tasa de consumo de batería del foco.
export const SPOTLIGHT_CHARGE_RATE = 0.03; // Tasa de recarga de batería del foco.
export const SPOTLIGHT_HORIZONTAL_OFFSET = 0.8; // Desplazamiento horizontal del foco (0.8 para la derecha, 0.2 para la izquierda).
export const SPOTLIGHT_VERTICAL_OFFSET = 0.6; // Desplazamiento vertical del foco.
export const SPOTLIGHT_LENGTH = 200; // Longitud del haz de luz del foco.
export const SPOTLIGHT_WIDTH_AT_END = 80; // Ancho del haz de luz al final.
export const AMBIENT_LIGHT_RADIUS = 80; // Radio de la luz ambiental.
export const AMBIENT_LIGHT_MAX_OPACITY = 0.5; // Opacidad máxima de la luz ambiental.
export const SUBMARINE_IMAGE_URL = 'https://i.ibb.co/dwPyHB8L/submarine.gif'; // URL de la imagen del submarino.
export const SUBMARINE_STATIC_IMAGE_URL = 'https://i.ibb.co/ympgPXB0/submarine-static.png';
export const SUBMARINE_BASE_WIDTH = 120;
export const SUBMARINE_BASE_HEIGHT = 60;
export const SUBMARINE_SCALE_FACTOR = 1.5;
export const SUBMARINE_HORIZONTAL_SPEED = 5;
export const SUBMARINE_VERTICAL_SPEED = 3;
export const PARTICLE_DENSITY_FACTOR = 1.0;

// Define colores y niveles de oscuridad para diferentes zonas de profundidad.
export const ZONE_COLORS = [
    { depth: 0 * PIXELS_PER_METER, name: "Zona Epipelágica (Fótica)", r: 26, g: 58, b: 94, darknessLevel: 0.0 },
    { depth: 200 * PIXELS_PER_METER, name: "Zona Mesopelágica (Crepuscular)", r: 10, g: 30, b: 60, darknessLevel: 0.4 },
    { depth: 300 * PIXELS_PER_METER, name: "Zona de Transición Oscura", r: 5, g: 10, b: 20, darknessLevel: 0.95 },
    { depth: 1000 * PIXELS_PER_METER, name: "Zona Batipelágica (Oscura)", r: 5, g: 15, b: 30, darknessLevel: 0.98 },
    { depth: 4000 * PIXELS_PER_METER, name: "Zona Abisopelágica (Abisal)", r: 0, g: 0, b: 10, darknessLevel: 0.99 },
    { depth: 6000 * PIXELS_PER_METER, name: "Zona Hadopelágica (Fosas Oceánicas)", r: 0, g: 0, b: 0, darknessLevel: 1.0 }
];

