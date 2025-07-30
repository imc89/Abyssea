// Importa la dependencia necesaria de React.
import React from 'react';

// Componente para mostrar el menú principal.
const MainMenu = ({ onStartGame, onShowGallery }) => {
    // Renderiza el componente.
    return (
        <div id="mainMenu">
            <h1>Explorador de Abismos Marinos</h1>
            <button id="startButton" onClick={onStartGame}>Comenzar Aventura</button>
            <button id="galleryButton" onClick={onShowGallery}>Galería de Criaturas</button>
        </div>
    );
};

// Exporta el componente para su uso en otras partes de la aplicación.
export default MainMenu;
