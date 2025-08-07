// Datos de las criaturas para el modal y la renderización.
export const creatureData = [
    {
        id: 'pezLinterna', // Identificador único de la criatura.
        imageSrc: 'https://i.pinimg.com/originals/bf/9f/48/bf9f48d1b7c0a9e4d41a2d87dac45eac.gif', // URL de la imagen de la criatura.
        name: 'Pez Linterna', // Nombre de la criatura.
        description: 'El pez linterna es conocido por su bioluminiscencia, que utiliza para atraer presas y compañeros en las profundidades oscuras del océano. Su órgano luminoso, el fotóforo, es una adaptación fascinante a la vida en la zona batipelágica.', // Descripción de la criatura.
        funFact: 'Algunas especies de peces linterna tienen fotóforos en sus ojos que les permiten ver en la oscuridad, ¡como si tuvieran gafas de visión nocturna naturales!', // Dato curioso sobre la criatura.
        scale: 1.0, // Factor de escala de la criatura.
        minDepth: 10, // Profundidad mínima en la que aparece la criatura.
        maxDepth: 50, // Profundidad máxima en la que aparece la criatura.
        numInstances: 15, // Número de instancias de la criatura.
        flees: true, // Si la criatura huye del submarino.
        movementChangeFrequency: 4, // Frecuencia con la que la criatura cambia de dirección.
        isSchooling: true, // Si la criatura se mueve en cardumen.
        schoolingSeparation: 3, // Distancia de separación entre las criaturas del cardumen.
    },
    {
        id: 'pezFantasma', // Identificador único de la criatura.
        imageSrc: 'https://cdna.artstation.com/p/assets/images/images/057/809/662/original/christophe-blanc-ezgif-2-f0adf33e1c.gif?1672735661', // URL de la imagen de la criatura.
        name: 'Pez Fantasma', // Nombre de la criatura.
        description: 'El pez fantasma es una criatura etérea de las profundidades mesopelágicas y batipelágicas, con una apariencia translúcida que le ayuda a camuflarse en la penumbra. Se mueve lentamente, conservando energía en un entorno de recursos limitados.', // Descripción de la criatura.
        funFact: 'Su cuerpo casi transparente es una forma de camuflaje perfecta en las zonas donde la luz es escasa, haciéndolos casi invisibles para los depredadores.', // Dato curioso sobre la criatura.
        scale: 1.0, // Factor de escala de la criatura.
        hasLight: true, // Si la criatura tiene luz propia.
        lightColor: 'rgba(0, 200, 255, 0.9)', // Color de la luz de la criatura.
        lightRadius: 8, // Radio de la luz de la criatura.
        lightOffsetY: -20, // Desplazamiento vertical de la luz de la criatura.
        minDepth: 200, // Profundidad mínima en la que aparece la criatura.
        maxDepth: 400, // Profundidad máxima en la que aparece la criatura.
        numInstances: 5, // Número de instancias de la criatura.
        flees: true, // Si la criatura huye del submarino.
        movementChangeFrequency: 1, // Frecuencia con la que la criatura cambia de dirección.
        isSchooling: false, // Si la criatura se mueve en cardumen.
        schoolingSeparation: 3, // Distancia de separación entre las criaturas del cardumen.
    },
    {
        id: 'calamarMesopelagico', // Identificador único de la criatura.
        imageSrc: 'https://i.pinimg.com/originals/09/9b/5e/099b5e681cc455ab232caef08a9a6d87.gif', // URL de la imagen de la criatura.
        name: 'Calamar Mesopelágico', // Nombre de la criatura.
        description: 'Los calamares mesopelágicos son depredadores ágiles que habitan en la zona crepuscular del océano. Muchos tienen fotóforos para camuflarse o atraer presas, y son una parte vital de la cadena alimentaria en estas profundidades.', // Descripción de la criatura.
        funFact: 'Algunos calamares de las profundidades pueden expulsar una "tinta" bioluminiscente en lugar de tinta oscura, para confundir a los atacantes en la oscuridad.', // Dato curioso sobre la criatura.
        scale: 0.85, // Factor de escala de la criatura.
        minDepth: 120, // Profundidad mínima en la que aparece la criatura.
        maxDepth: 1000, // Profundidad máxima en la que aparece la criatura.
        numInstances: 5, // Número de instancias de la criatura.
        flees: false, // Si la criatura huye del submarino.
        movementChangeFrequency: 5, // Frecuencia con la que la criatura cambia de dirección.
        isSchooling: false, // Si la criatura se mueve en cardumen.
        schoolingSeparation: 2, // Distancia de separación entre las criaturas del cardumen.
    },
    {
        id: 'anoplogaster', // Identificador único de la criatura.
        imageSrc: `${process.env.PUBLIC_URL}/img/creatures/ANOPLOGASTER/anoplogaster.gif`, // URL de la imagen de la criatura.
        name: 'anoplogaster Mesopelágico', // Nombre de la criatura.
        description: 'Los anoplogaster mesopelágicos son depredadores ágiles que habitan en la zona crepuscular del océano. Muchos tienen fotóforos para camuflarse o atraer presas, y son una parte vital de la cadena alimentaria en estas profundidades.', // Descripción de la criatura.
        funFact: 'Algunos anoplogaster de las profundidades pueden expulsar una "tinta" bioluminiscente en lugar de tinta oscura, para confundir a los atacantes en la oscuridad.', // Dato curioso sobre la criatura.
        scale: 0.8, // Factor de escala de la criatura.
        minDepth: 400, // Profundidad mínima en la que aparece la criatura.
        maxDepth: 410, // Profundidad máxima en la que aparece la criatura.
        numInstances: 1, // Número de instancias de la criatura.
        flees: false, // Si la criatura huye del submarino.
        movementChangeFrequency: 2, // Frecuencia con la que la criatura cambia de dirección.
        isSchooling: false, // Si la criatura se mueve en cardumen.
        schoolingSeparation: 2, // Distancia de separación entre las criaturas del cardumen.
    }
];
