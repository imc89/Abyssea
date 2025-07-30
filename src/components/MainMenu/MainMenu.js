import React from 'react';

const MainMenu = ({ onStartGame, onShowGallery }) => {
    return (
        <div id="mainMenu">
            <h1>Explorador de Abismos Marinos</h1>
            <button id="startButton" onClick={onStartGame}>Comenzar Aventura</button>
            <button id="galleryButton" onClick={onShowGallery}>Galería de Criaturas</button>
        </div>
    );
};

export default MainMenu;
