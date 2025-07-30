// Importa la dependencia necesaria de React.
import React from 'react';

// Componente para mostrar el contador de profundidad.
const DepthCounter = ({ depth }) => {
    // Renderiza el componente.
    return (
        <div id="depthCounter">
            Profundidad: {depth} m
        </div>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación.
export default DepthCounter;
