import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game/Game';
import MainMenu from './components/MainMenu/MainMenu';
import CreatureModal from './components/Modals/CreatureModal';
import GalleryModal from './components/Modals/GalleryModal';
import PauseMenu from './components/Modals/PauseMenu';
import Tutorial from './components/Modals/Tutorial';

function App() {
  const [currentScreen, setCurrentScreen] = useState('mainMenu');
  const [discoveredCreatures, setDiscoveredCreatures] = useState({});
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleStartGame = () => {
    setCurrentScreen('tutorial');
  };

  const handleShowGallery = () => {
    setCurrentScreen('gallery');
  };

  const handleCreatureDiscovery = (creatureId) => {
    setDiscoveredCreatures(prev => ({ ...prev, [creatureId]: true }));
  };

  const handleShowCreatureModal = (creature) => {
    setSelectedCreature(creature);
    setCurrentScreen('creatureModal');
  };

  const handleCloseCreatureModal = () => {
    setSelectedCreature(null);
    setCurrentScreen('game');
  };

  const handleGamePause = () => {
    setIsPaused(true);
    setCurrentScreen('pause');
  };

  const handleResumeGame = () => {
    setIsPaused(false);
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setIsPaused(false);
    setCurrentScreen('mainMenu');
  };

  const handleCloseGallery = () => {
    setCurrentScreen('mainMenu');
  };

  const handleCloseTutorial = () => {
    setCurrentScreen('game');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'mainMenu':
        return <MainMenu onStartGame={handleStartGame} onShowGallery={handleShowGallery} />;
      case 'tutorial':
        return <Tutorial onClose={handleCloseTutorial} />;
      case 'game':
        return (
          <Game
            onCreatureDiscovery={handleCreatureDiscovery}
            onGamePause={handleGamePause}
            onShowCreatureModal={handleShowCreatureModal}
          />
        );
      case 'gallery':
        return (
          <GalleryModal
            discoveredCreatures={discoveredCreatures}
            onShowCreatureModal={handleShowCreatureModal}
            onClose={handleCloseGallery}
          />
        );
      case 'creatureModal':
        return <CreatureModal creature={selectedCreature} onClose={handleCloseCreatureModal} />;
      case 'pause':
        return <PauseMenu onResume={handleResumeGame} onBackToMenu={handleBackToMenu} />;
      default:
        return <MainMenu onStartGame={handleStartGame} onShowGallery={handleShowGallery} />;
    }
  };

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

export default App;
