// Datos de las criaturas para el modal y la renderización.
export const creatureData = [
    {
        id: 'pezLinterna',
        imageSrc: 'https://i.pinimg.com/originals/bf/9f/48/bf9f48d1b7c0a9e4d41a2d87dac45eac.gif',
        name: 'Pez Linterna',
        description: 'El pez linterna es conocido por su bioluminiscencia, que utiliza para atraer presas y compañeros en las profundidades oscuras del océano. Su órgano luminoso, el fotóforo, es una adaptación fascinante a la vida en la zona batipelágica.',
        funFact: 'Algunas especies de peces linterna tienen fotóforos en sus ojos que les permiten ver en la oscuridad, ¡como si tuvieran gafas de visión nocturna naturales!',
        scale: 1.0,
        minDepth: 200,
        maxDepth: 4000,
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
        lightOffsetY: -20,
        minDepth: 200,
        maxDepth: 4000,
    },
    {
        id: 'calamarMesopelagico',
        imageSrc: 'https://i.pinimg.com/originals/09/9b/5e/099b5e681cc455ab232caef08a9a6d87.gif',
        name: 'Calamar Mesopelágico',
        description: 'Los calamares mesopelágicos son depredadores ágiles que habitan en la zona crepuscular del océano. Muchos tienen fotóforos para camuflarse o atraer presas, y son una parte vital de la cadena alimentaria en estas profundidades.',
        funFact: 'Algunos calamares de las profundidades pueden expulsar una "tinta" bioluminiscente en lugar de tinta oscura, para confundir a los atacantes en la oscuridad.',
        scale: 0.85,
        minDepth: 200,
        maxDepth: 1000,
    }
];
