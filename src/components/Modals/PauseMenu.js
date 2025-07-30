// Importa la dependencia necesaria de React.
import React from 'react';

// Componente para mostrar el menú de pausa.
const PauseMenu = ({ onResume, onBackToMenu }) => {
    // Renderiza el componente.
    return (
        <div id="pauseMenu" className="modal-overlay show">
            <div className="modal-content">
                <h2>Juego en Pausa</h2>
                <button id="resumeButton" onClick={onResume}>Reanudar</button>
                <button id="backToMenuButton" onClick={onBackToMenu}>Volver al Menú Principal</button>
            </div>
        </div>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación.
export default PauseMenu;
