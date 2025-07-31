// Importa las dependencias necesarias de React.
import React, { useState } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);
  // Estado para almacenar las criaturas descubiertas.
  const [discoveredCreatures, setDiscoveredCreatures] = useState({});
  // Estado para la criatura seleccionada en el modal.
  const [selectedCreature, setSelectedCreature] = useState(null);
  // Manejador para iniciar el juego.
  const handleStartGame = () => {
    setCurrentScreen('tutorial');
  };

  useEffect(() => {
    if (currentScreen === 'pause' || currentScreen === 'creatureModal') {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [currentScreen]);

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
    setCurrentScreen('pause');
  };

  // Manejador para reanudar el juego.
  const handleResumeGame = () => {
    setCurrentScreen('game');
  };

  // Manejador para volver al menú principal.
  const handleBackToMenu = () => {
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
    const gameComponent = (
      <Game
        onCreatureDiscovery={handleCreatureDiscovery}
        onGamePause={handleGamePause}
        onShowCreatureModal={handleShowCreatureModal}
        isPaused={isPaused}
      />
    );

    switch (currentScreen) {
      case 'mainMenu':
        return <MainMenu onStartGame={handleStartGame} onShowGallery={handleShowGallery} />;
      case 'tutorial':
        return <Tutorial onClose={handleCloseTutorial} />;
      case 'game':
        return gameComponent;
      case 'creatureModal':
        return (
          <>
            {gameComponent}
            <CreatureModal creature={selectedCreature} onClose={handleCloseCreatureModal} />
          </>
        );
      case 'pause':
        return (
          <>
            {gameComponent}
            <PauseMenu onResume={handleResumeGame} onBackToMenu={handleBackToMenu} />
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
