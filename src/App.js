// Importa las dependencias necesarias de React.
import React, { useState, useEffect } from 'react';
// Importa los estilos de la aplicación.
import './App.css';
// Importa los componentes del juego.
import Game from './components/Game/Game';
import MainMenu from './components/MainMenu/MainMenu';
import CreatureModal from './components/Modals/CreatureModal';
import GalleryModal from './components/Modals/GalleryModal';
import PauseMenu from './components/Modals/PauseMenu';
import Tutorial from './components/Modals/Tutorial';

// Componente principal de la aplicación.
function App() {
  // Estado para controlar la pantalla actual.
  const [currentScreen, setCurrentScreen] = useState('mainMenu');
  // Estado para almacenar las criaturas descubiertas.
  const [discoveredCreatures, setDiscoveredCreatures] = useState({});
  // Estado para la criatura seleccionada en el modal.
  const [selectedCreature, setSelectedCreature] = useState(null);
  // Estado para controlar si el juego está en pausa.
  const [isPaused, setIsPaused] = useState(false);

  // Manejador para iniciar el juego.
  const handleStartGame = () => {
    setCurrentScreen('tutorial');
  };

  // Manejador para mostrar la galería.
  const handleShowGallery = () => {
    setCurrentScreen('gallery');
  };

  // Manejador para registrar el descubrimiento de una criatura.
  const handleCreatureDiscovery = (creatureId) => {
    setDiscoveredCreatures(prev => ({ ...prev, [creatureId]: true }));
  };

  // Manejador para mostrar el modal de una criatura.
  const handleShowCreatureModal = (creature) => {
    setSelectedCreature(creature);
    setCurrentScreen('creatureModal');
  };

  // Manejador para cerrar el modal de una criatura.
  const handleCloseCreatureModal = () => {
    setSelectedCreature(null);
  };

  // Manejador para pausar el juego.
  const handleGamePause = () => {
    setIsPaused(true);
    setCurrentScreen('pause');
  };

  // Manejador para reanudar el juego.
  const handleResumeGame = () => {
    setIsPaused(false);
    setCurrentScreen('game');
  };

  // Manejador para volver al menú principal.
  const handleBackToMenu = () => {
    setIsPaused(false);
    setCurrentScreen('mainMenu');
  };

  // Manejador para cerrar la galería.
  const handleCloseGallery = () => {
    setCurrentScreen('mainMenu');
  };

  // Manejador para cerrar el tutorial.
  const handleCloseTutorial = () => {
    setCurrentScreen('game');
  };

  // Función para renderizar la pantalla actual.
  const renderScreen = () => {
    switch (currentScreen) {
      case 'mainMenu':
        return <MainMenu onStartGame={handleStartGame} onShowGallery={handleShowGallery} />;
      case 'tutorial':
        return <Tutorial onClose={handleCloseTutorial} />;
      case 'game':
      case 'creatureModal':
      case 'pause':
        return (
          <>
            <Game
              onCreatureDiscovery={handleCreatureDiscovery}
              onGamePause={handleGamePause}
              onShowCreatureModal={handleShowCreatureModal}
            />
            {currentScreen === 'creatureModal' && <CreatureModal creature={selectedCreature} onClose={handleCloseCreatureModal} />}
            {currentScreen === 'pause' && <PauseMenu onResume={handleResumeGame} onBackToMenu={handleBackToMenu} />}
          </>
        );
      case 'gallery':
        return (
          <GalleryModal
            discoveredCreatures={discoveredCreatures}
            onShowCreatureModal={handleShowCreatureModal}
            onClose={handleCloseGallery}
          />
        );
      default:
        return <MainMenu onStartGame={handleStartGame} onShowGallery={handleShowGallery} />;
    }
  };

  // Renderiza el componente.
  return (
    <div className="App">
      {renderScreen()}
      <audio id="backgroundMusic" loop>
        <source src="./assets/audio/JWG.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
}

// Exporta el componente para su uso en otras partes de la aplicación.
export default App;
