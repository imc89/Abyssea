// Importa la dependencia necesaria de React.
import React from 'react';

// Componente para mostrar el indicador de batería.
const BatteryDisplay = ({ battery }) => {
    // Calcula el porcentaje de batería.
    const batteryPercentage = Math.floor(battery);
    // Determina la clase CSS para la batería baja.
    let batteryClass = '';
    if (batteryPercentage < 20) {
        batteryClass = 'low-battery';
    }

    // Renderiza el componente.
    return (
        <div id="batteryDisplay" className={batteryClass}>
            Batería: {batteryPercentage}%
        </div>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación.
export default BatteryDisplay;
