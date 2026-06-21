import { GameProvider, useGame } from './store/GameContext';
import { AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import Scene1 from './components/scenes/Scene1';
import Scene2 from './components/scenes/Scene2';
import Scene3 from './components/scenes/Scene3';
import Scene4 from './components/scenes/Scene4';
import Scene5 from './components/scenes/Scene5';

const SceneManager = () => {
  const { currentScene, isMuted, toggleMute } = useGame();

  const renderScene = () => {
    switch (currentScene) {
      case 1: return <Scene1 key="scene1" />;
      case 2: return <Scene2 key="scene2" />;
      case 3: return <Scene3 key="scene3" />;
      case 4: return <Scene4 key="scene4" />;
      case 5: return <Scene5 key="scene5" />;
      default: return <Scene1 key="scene1" />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-cream text-darkBrown font-sans">
      {/* Global Mute Button */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 p-3 bg-white/40 backdrop-blur-md rounded-full shadow-sm hover:bg-white/80 transition-all text-brown hover:scale-110"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Scene Transitions */}
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <SceneManager />
    </GameProvider>
  );
}

export default App;
