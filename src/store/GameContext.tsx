import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface GameState {
  currentScene: number;
  setScene: (scene: number) => void;
  memories: string[];
  addMemory: (memory: string) => void;
  badges: string[];
  addBadge: (badge: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setScene] = useState(1);
  const [memories, setMemories] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const addMemory = (memory: string) => {
    if (!memories.includes(memory)) {
      setMemories(prev => [...prev, memory]);
    }
  };

  const addBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
    }
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <GameContext.Provider value={{
      currentScene,
      setScene,
      memories,
      addMemory,
      badges,
      addBadge,
      isMuted,
      toggleMute
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
