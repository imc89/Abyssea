// Importa los iconos de volumen.
import { TiVolumeMute, TiVolumeDown } from 'react-icons/ti';

// Constantes del juego.
export const PIXELS_PER_METER = 10; // Píxeles por metro.
export const MAX_WORLD_DEPTH = 11000 * PIXELS_PER_METER; // Profundidad máxima del mundo.
export const SPOTLIGHT_MAX_BATTERY = 100; // Batería máxima del foco.
export const SPOTLIGHT_DRAIN_RATE = 0.01; // Tasa de consumo de batería del foco.
export const SPOTLIGHT_CHARGE_RATE = 0.03; // Tasa de recarga de batería del foco.
// --- Posición y forma del foco ---
// Estas constantes controlan la posición y la forma del foco del submarino.
// El origen de la luz es relativo a las dimensiones del submarino.
export const SPOTLIGHT_HORIZONTAL_OFFSET = 0.8; // Posición horizontal de la fuente de luz en el submarino. 0.8 significa 80% desde el borde izquierdo.
export const SPOTLIGHT_VERTICAL_OFFSET = 0.6; // Posición vertical de la fuente de luz en el submarino. 0.6 significa 60% desde el borde superior.
export const SPOTLIGHT_LENGTH = 350; // La longitud del haz de luz del foco en píxeles.
export const SPOTLIGHT_WIDTH_AT_END = 150; // El ancho del haz de luz del foco en su extremo en píxeles.
export const AMBIENT_LIGHT_RADIUS = 120; // Radio de la luz ambiental.
export const AMBIENT_LIGHT_MAX_OPACITY = 0.5; // Opacidad máxima de la luz ambiental.
export const SUBMARINE_IMAGE_URL = `${process.env.PUBLIC_URL}/img/submarine/submarine.gif`; // URL de la imagen del submarino.
export const SUBMARINE_STATIC_IMAGE_URL = `${process.env.PUBLIC_URL}/img/submarine/submarine-static.png`; // URL de la imagen estática del submarino.
export const SUBMARINE_BASE_WIDTH = 120; // Ancho base del submarino.
export const SUBMARINE_BASE_HEIGHT = 60; // Altura base del submarino.
export const SUBMARINE_SCALE_FACTOR = 0.85; // Factor de escala del submarino.
export const SUBMARINE_HORIZONTAL_SPEED = 5; // Velocidad horizontal del submarino.
export const SUBMARINE_VERTICAL_SPEED = 3; // Velocidad vertical del submarino.
export const SUBMARINE_FADE_START_DEPTH = 450; // Profundidad a la que el submarino comienza a desvanecerse.
export const SUBMARINE_FADE_END_DEPTH = 600; // Profundidad a la que el submarino se desvanece por completo.
export const SUBMARINE_MIN_OPACITY = 0.1; // Opacidad mínima del submarino.

export const MUSIC_VOLUME = 0.9; // Volumen de la música de fondo.

// Define la densidad de partículas para diferentes zonas de profundidad.
export const PARTICLE_DENSITY_ZONES = [
    { depth: 0, densityFactor: 2.5 }, // Zona de superficie
    { depth: 300 * PIXELS_PER_METER, densityFactor: 4.5 }, // Zona de crepúsculo
    { depth: 1000 * PIXELS_PER_METER, densityFactor: 2.5 }, // Zona de medianoche
    { depth: 4000 * PIXELS_PER_METER, densityFactor: 2.5 } // Zona abisal
];

// Define colores y niveles de oscuridad para diferentes zonas de profundidad.
export const ZONE_COLORS = [
    { depth: 0 * PIXELS_PER_METER, name: "Zona Epipelágica (Fótica)", r: 26, g: 58, b: 94, darknessLevel: 0.0 }, // Zona epipelágica (luz solar)
    { depth: 200 * PIXELS_PER_METER, name: "Zona Mesopelágica (Crepuscular)", r: 10, g: 30, b: 60, darknessLevel: 0.4 }, // Zona mesopelágica (crepúsculo)
    { depth: 300 * PIXELS_PER_METER, name: "Zona de Transición Oscura", r: 5, g: 10, b: 20, darknessLevel: 0.95 }, // Zona de transición oscura
    { depth: 1000 * PIXELS_PER_METER, name: "Zona Batipelágica (Oscura)", r: 5, g: 15, b: 30, darknessLevel: 0.98 }, // Zona batipelágica (oscuridad)
    { depth: 4000 * PIXELS_PER_METER, name: "Zona Abisopelágica (Abisal)", r: 0, g: 0, b: 10, darknessLevel: 0.99 }, // Zona abisopelágica (abisal)
    { depth: 6000 * PIXELS_PER_METER, name: "Zona Hadopelágica (Fosas Oceánicas)", r: 0, g: 0, b: 0, darknessLevel: 1.0 } // Zona hadopelágica (fosas oceánicas)
];

// Define y exporta los iconos para que puedan ser utilizados en otros componentes.
export const MuteIcon = TiVolumeMute; // Icono de silencio.
export const UnmuteIcon = TiVolumeDown; // Icono de sonido.
