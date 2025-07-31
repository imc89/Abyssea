// Constantes del juego.
export const PIXELS_PER_METER = 10; // Píxeles por metro.
export const MAX_WORLD_DEPTH = 11000 * PIXELS_PER_METER; // Profundidad máxima del mundo.
export const SPOTLIGHT_MAX_BATTERY = 100; // Batería máxima del foco.
export const SPOTLIGHT_DRAIN_RATE = 0.01; // Tasa de consumo de batería del foco.
export const SPOTLIGHT_CHARGE_RATE = 0.03; // Tasa de recarga de batería del foco.
export const AMBIENT_LIGHT_RADIUS = 80; // Radio de la luz ambiental.
export const AMBIENT_LIGHT_MAX_OPACITY = 0.5; // Opacidad máxima de la luz ambiental.
export const SUBMARINE_IMAGE_URL = 'https://i.ibb.co/dwPyHB8L/submarine.gif'; // URL de la imagen del submarino.
export const SUBMARINE_STATIC_IMAGE_URL = 'https://i.ibb.co/ympgPXB0/submarine-static.png';

// Define colores y niveles de oscuridad para diferentes zonas de profundidad.
export const ZONE_COLORS = [
    { depth: 0 * PIXELS_PER_METER, name: "Zona Epipelágica (Fótica)", r: 26, g: 58, b: 94, darknessLevel: 0.0 },
    { depth: 200 * PIXELS_PER_METER, name: "Zona Mesopelágica (Crepuscular)", r: 10, g: 30, b: 60, darknessLevel: 0.4 },
    { depth: 300 * PIXELS_PER_METER, name: "Zona de Transición Oscura", r: 5, g: 10, b: 20, darknessLevel: 0.95 },
    { depth: 1000 * PIXELS_PER_METER, name: "Zona Batipelágica (Oscura)", r: 5, g: 15, b: 30, darknessLevel: 0.98 },
    { depth: 4000 * PIXELS_PER_METER, name: "Zona Abisopelágica (Abisal)", r: 0, g: 0, b: 10, darknessLevel: 0.99 },
    { depth: 6000 * PIXELS_PER_METER, name: "Zona Hadopelágica (Fosas Oceánicas)", r: 0, g: 0, b: 0, darknessLevel: 1.0 }
];

// Datos de las criaturas para el modal y la renderización.
export const creatureData = [
    {
        id: 'pezLinterna',
        imageSrc: 'https://i.pinimg.com/originals/bf/9f/48/bf9f48d1b7c0a9e4d41a2d87dac45eac.gif',
        name: 'Pez Linterna',
        description: 'El pez linterna es conocido por su bioluminiscencia, que utiliza para atraer presas y compañeros en las profundidades oscuras del océano. Su órgano luminoso, el fotóforo, es una adaptación fascinante a la vida en la zona batipelágica.',
        funFact: 'Algunas especies de peces linterna tienen fotóforos en sus ojos que les permiten ver en la oscuridad, ¡como si tuvieran gafas de visión nocturna naturales!',
        scale: 1.0,
    },
    {
        id: 'pezFantasma',
        imageSrc: 'https://cdna.artstation.com/p/assets/images/images/057/809/662/original/christophe-blanc-ezgif-2-f0adf33e1c.gif?1672735661',
        name: 'Pez Fantasma',
        description: 'El pez fantasma es una criatura etérea de las profundidades mesopelágicas y batipelágicas, con una apariencia translúcida que le ayuda a camuflarse en la penumbra. Se mueve lentamente, conservando energía en un entorno de recursos limitados.',
        funFact: 'Su cuerpo casi transparente es una forma de camuflaje perfecta en las zonas donde la luz es escasa, haciéndolos casi invisibles para los depredadores.',
        scale: 1.0,
        hasLight: true,
        lightColor: 'rgba(0, 200, 255, 0.9)',
        lightRadius: 8,
        lightOffsetY: -20
    },
    {
        id: 'calamarMesopelagico',
        imageSrc: 'https://i.pinimg.com/originals/09/9b/5e/099b5e681cc455ab232caef08a9a6d87.gif',
        name: 'Calamar Mesopelágico',
        description: 'Los calamares mesopelágicos son depredadores ágiles que habitan en la zona crepuscular del océano. Muchos tienen fotóforos para camuflarse o atraer presas, y son una parte vital de la cadena alimentaria en estas profundidades.',
        funFact: 'Algunos calamares de las profundidades pueden expulsar una "tinta" bioluminiscente en lugar de tinta oscura, para confundir a los atacantes en la oscuridad.',
        scale: 0.85,
    }
];
