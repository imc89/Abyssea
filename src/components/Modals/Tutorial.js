// Importa la dependencia necesaria de React.
import React from 'react';

// Componente para mostrar el tutorial.
const Tutorial = ({ onClose }) => {
    // Renderiza el componente.
    return (
        <div id="tutorialMessage" className="show">
            <p>¡Bienvenido, explorador! Usa las <strong>flechas</strong> o <strong>W/A/S/D</strong> para mover tu
                submarino.
            </p>
            <p>Presiona <strong>ESPACIO</strong> para encender/apagar el foco. ¡La batería se agota!</p>
            <p>Cuando veas una criatura en tu foco, presiona <strong>ENTER</strong> para inspeccionarla y añadirla a tu
                galería.</p>
            <p>Presiona <strong>M</strong> para silenciar/reactivar el sonido.</p>
            <p>Presiona <strong>ESC</strong> en cualquier momento para pausar el juego y acceder al menú.</p>
            <button id="closeTutorialBtn" onClick={onClose}>¡Entendido!</button>
        </div>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación.
export default Tutorial;
