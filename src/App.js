// Importa las dependencias necesarias de React.
import React, { useState, useEffect, useCallback } from 'react';
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
  const handleCreatureDiscovery = useCallback((creatureId) => {
    setDiscoveredCreatures(prev => ({ ...prev, [creatureId]: true }));
  }, []);

  // Manejador para mostrar el modal de una criatura.
  const handleShowCreatureModal = useCallback((creature) => {
    setSelectedCreature(creature);
    setCurrentScreen('creatureModal');
  }, []);

  // Manejador para cerrar el modal de una criatura.
  const handleCloseCreatureModal = () => {
    setSelectedCreature(null);
    setCurrentScreen('game');
  };

  // Manejador para pausar el juego.
  const handleGamePause = useCallback(() => {
    setIsPaused(true);
    setCurrentScreen('pause');
  }, []);

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

  // Renderiza el componente.
  return (
    <div className="App">
      {currentScreen === 'mainMenu' && <MainMenu onStartGame={handleStartGame} onShowGallery={handleShowGallery} />}
      {currentScreen === 'tutorial' && <Tutorial onClose={handleCloseTutorial} />}
      {currentScreen === 'gallery' && (
        <GalleryModal
          discoveredCreatures={discoveredCreatures}
          onShowCreatureModal={handleShowCreatureModal}
          onClose={handleCloseGallery}
        />
      )}

      {(currentScreen === 'game' || currentScreen === 'creatureModal' || currentScreen === 'pause') && (
        <Game
          onCreatureDiscovery={handleCreatureDiscovery}
          onGamePause={handleGamePause}
          onShowCreatureModal={handleShowCreatureModal}
          isPaused={currentScreen === 'pause' || currentScreen === 'creatureModal'}
        />
      )}

      {currentScreen === 'creatureModal' && <CreatureModal creature={selectedCreature} onClose={handleCloseCreatureModal} />}
      {currentScreen === 'pause' && <PauseMenu onResume={handleResumeGame} onBackToMenu={handleBackToMenu} />}

      <audio id="backgroundMusic" loop>
        <source src="./assets/audio/JWG.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
}

// Exporta el componente para su uso en otras partes de la aplicación.
export default App;
