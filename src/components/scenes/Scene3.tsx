import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../store/GameContext';
import confetti from 'canvas-confetti';

import rec1 from '../../assets/recordings/Recording.m4a';
import rec2 from '../../assets/recordings/Recording (2).m4a';
import rec3 from '../../assets/recordings/Recording (3).m4a';
import rec4  from '../../assets/recordings/Recording (4).m4a';

const VOICE_RECORDS = [rec1, rec2, rec3, rec4];

const BALLOON_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500',
  'bg-purple-500', 'bg-pink-500', 'bg-teal-400'
];

const REWARDS = [
  "You're the best dad in the universe!",
  "Advice: You can buy me Kinder joy anytime",
  "I love you 5000!",
  "Joke: I only know 25 letters of the alphabet. I don't know y.",
  "You are my hero and my role model!",
  "Fun Fact: You're my favorite superhero, even without a cape.",
  "Thank you for always being there for me.",
  "King of Chole Bhature officially crowned!"
];

const Scene3 = () => {
  const { setScene, isMuted } = useGame();
  const [balloons, setBalloons] = useState<any[]>([]);
  const [activeReward, setActiveReward] = useState<string | null>(null);

  useEffect(() => {
    const newBalloons = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      delay: Math.random() * 20,
      duration: Math.random() * 15 + 20, // 20-35 seconds to float up
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      isGolden: i === 44,
      popped: false,
    }));
    // Shuffle
    setBalloons(newBalloons.sort(() => Math.random() - 0.5));
  }, []);

  const popBalloon = (b: any, event: React.MouseEvent) => {
    if (b.popped) return;

    setBalloons(prev => prev.map(balloon => balloon.id === b.id ? { ...balloon, popped: true } : balloon));

    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/3141/3141-preview.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => { });

      if (!b.isGolden) {
        const randomRec = VOICE_RECORDS[Math.floor(Math.random() * VOICE_RECORDS.length)];
        const voiceAudio = new Audio(randomRec);
        voiceAudio.volume = 1.0;
        voiceAudio.play().catch(() => {});
      }
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    if (b.isGolden) {
      confetti({ particleCount: 200, spread: 100, origin: { x: originX, y: originY }, colors: ['#FFD700', '#FFFFFF', '#F4B942'] });
      setActiveReward("GOLDEN");
    } else {
      confetti({ particleCount: 40, spread: 60, origin: { x: originX, y: originY } });
      setActiveReward(REWARDS[Math.floor(Math.random() * REWARDS.length)]);
    }
  };

  const closeReward = () => {
    if (activeReward === "GOLDEN") {
      setScene(4);
    } else {
      setActiveReward(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.5 }}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#ff7e5f] to-[#feb47b]"
    >
      {/* Sun */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-full blur-[2px] opacity-90 shadow-[0_0_100px_#FFD700]"></div>

      {/* Clouds */}
      <motion.div
        animate={{ x: [0, 50, 0] }}
        transition={{ repeat: Infinity, duration: 20 }}
        className="absolute top-20 left-10 w-48 h-16 bg-white/30 rounded-full blur-md"
      />
      <motion.div
        animate={{ x: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 25 }}
        className="absolute top-40 right-20 w-64 h-20 bg-white/20 rounded-full blur-md"
      />

      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center pt-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg font-serif">Pop the Balloons!</h2>
        <p className="text-white/80 mt-2 font-medium">Find the Golden Balloon to continue.</p>
      </div>

      {/* Balloons Container */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {balloons.map((b) => (
          <AnimatePresence key={b.id}>
            {!b.popped && (
              <motion.div
                initial={{ y: '120vh' }}
                animate={{
                  y: '-20vh',
                  x: [0, Math.random() * 100 - 50, 0]
                }}
                transition={{
                  y: { duration: b.duration, repeat: Infinity, ease: "linear", delay: b.delay },
                  x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute pointer-events-auto"
                style={{ left: `${b.x}%` }}
                onClick={(e) => popBalloon(b, e)}
              >
                {/* Balloon Body */}
                <div
                  className={`w-16 h-20 rounded-[100%] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2)] cursor-pointer flex items-center justify-center hover:scale-110 transition-transform ${b.isGolden ? 'bg-gradient-to-br from-yellow-200 to-yellow-600 border-2 border-yellow-300 animate-pulse' : b.color}`}
                >
                  <div className="absolute top-2 left-3 w-4 h-6 bg-white/40 rounded-full blur-[2px] transform -rotate-45" />
                  {b.isGolden && <span className="text-2xl drop-shadow-md">⭐</span>}
                </div>
                {/* Balloon Knot & String */}
                <div className={`w-3 h-3 ${b.isGolden ? 'bg-yellow-600' : b.color} rotate-45 mx-auto -mt-1`} />
                <div className="w-px h-24 bg-white/50 mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {activeReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className={`p-8 rounded-2xl shadow-2xl max-w-md text-center w-full ${activeReward === 'GOLDEN' ? 'bg-gradient-to-br from-yellow-100 to-gold text-darkBrown border-4 border-white' : 'bg-white text-brown'}`}
            >
              {activeReward === "GOLDEN" ? (
                <>
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-3xl font-bold mb-4 font-serif">Golden Balloon Popped!</h3>
                  <p className="text-lg font-medium mb-8">You have uncovered the path to the Secret Family Treasure!</p>
                  <button
                    onClick={closeReward}
                    className="px-8 py-3 bg-white rounded-full shadow-md font-bold text-darkBrown hover:scale-105 transition-transform text-lg"
                  >
                    Enter Memory Galaxy ✨
                  </button>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">💌</div>
                  <p className="text-xl font-handwriting font-bold mb-8 leading-relaxed">"{activeReward}"</p>
                  <button
                    onClick={closeReward}
                    className="px-6 py-2 bg-softOrange rounded-full shadow-sm font-bold text-brown hover:bg-orange-300 transition-colors"
                  >
                    Keep Popping
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Scene3;
