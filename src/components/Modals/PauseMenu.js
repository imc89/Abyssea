import React from 'react';

const PauseMenu = ({ onResume, onBackToMenu }) => {
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

export default PauseMenu;
