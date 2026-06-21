import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../store/GameContext';
import confetti from 'canvas-confetti';
import { Trophy, Gift, Heart } from 'lucide-react';

const FINAL_MESSAGE = "Pappaaaa I love you till infinity and beyond. And I wish you to be my father in every life of mine. You are the best dad in this world, and I'm the luckiest daughter in this world. . Wishing you the happiest Father's Day. We love you forever. ❤️";

const Scene5 = () => {
  const { setScene, badges, isMuted } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showTrophy, setShowTrophy] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");

  const handleOpenChest = () => {
    if (isOpen) return;
    setIsOpen(true);

    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); // magical sparkle or opening sound
      audio.volume = 0.5;
      audio.play().catch(() => { });
    }

    // Fireworks
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);

    // Sequence
    setTimeout(() => setShowLetter(true), 1500);
  };

  // Typewriter effect
  useEffect(() => {
    if (showLetter) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < FINAL_MESSAGE.length) {
          setTypewriterText(FINAL_MESSAGE.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setShowTrophy(true), 1000);
        }
      }, 50); // Speed of typing
      return () => clearInterval(typingInterval);
    }
  }, [showLetter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-2000 ${isOpen ? 'bg-cream' : 'bg-[#1a1a2e]'}`}
    >
      {/* Closed State / Chest */}
      <AnimatePresence>
        {!showLetter && (
          <motion.div
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="absolute flex flex-col items-center justify-center z-20 cursor-pointer group"
            onClick={handleOpenChest}
          >
            {/* Glowing Aura */}
            <div className="absolute w-64 h-64 bg-gold rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>

            {/* The Chest (CSS Drawing) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-64 h-48 mt-10"
            >
              {/* Chest Body */}
              <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-[#8B5A2B] to-[#5C4033] rounded-sm border-4 border-[#3E2723] shadow-2xl overflow-hidden">
                {/* Planks */}
                <div className="w-full h-px bg-[#3E2723] mt-8 opacity-50"></div>
                <div className="w-full h-px bg-[#3E2723] mt-8 opacity-50"></div>
                <div className="w-full h-px bg-[#3E2723] mt-8 opacity-50"></div>
                {/* Lock */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-12 bg-gold rounded-b-full border-2 border-yellow-600 flex items-center justify-center shadow-md">
                  <div className="w-2 h-4 bg-yellow-800 rounded-sm"></div>
                </div>
              </div>

              {/* Chest Lid */}
              <motion.div
                animate={isOpen ? { rotateX: 110, y: -20 } : { rotateX: 0, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ transformOrigin: "bottom" }}
                className="absolute bottom-32 w-full h-16 bg-gradient-to-b from-[#A0522D] to-[#8B5A2B] rounded-t-[100px] border-4 border-[#3E2723] shadow-lg z-10"
              >
                {/* Metal bands */}
                <div className="absolute top-0 left-8 w-4 h-full bg-gray-400 border-x border-gray-600"></div>
                <div className="absolute top-0 right-8 w-4 h-full bg-gray-400 border-x border-gray-600"></div>
              </motion.div>

              {/* Light rays from inside */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-t from-white via-gold to-transparent rounded-t-full blur-xl z-0"
                ></motion.div>
              )}
            </motion.div>

            {!isOpen && (
              <p className="mt-12 text-gold font-serif text-xl tracking-widest animate-bounce">Click to open the Treasure</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opened State / Letter & Finale */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-8 z-30 overflow-y-auto"
          >

            {/* Letter */}
            <div className="w-full max-w-lg bg-white p-10 md:p-14 shadow-2xl rounded-sm transform -rotate-1 relative mb-10 md:mb-0 md:mr-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-red-800/20 shadow-sm blur-[1px] transform -rotate-3"></div> {/* Tape */}

              <h2 className="text-3xl font-bold text-brown mb-6 font-serif border-b border-gray-200 pb-4">Dear Papa,</h2>

              <p className="text-xl text-darkBrown font-serif leading-relaxed min-h-[200px]">
                {typewriterText}
                {!showTrophy && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {/* Right Side / Badges & Trophy */}
            <div className="w-full max-w-sm flex flex-col items-center space-y-8">

              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="w-full bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-orange-100"
              >
                <h3 className="text-brown font-bold text-xl mb-4 text-center border-b border-orange-200 pb-2 flex items-center justify-center gap-2">
                  <Gift size={20} /> Your Achievements
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="bg-gradient-to-r from-gold to-yellow-400 px-4 py-2 rounded-full shadow-sm text-sm font-bold text-darkBrown flex items-center gap-2">
                    <Heart size={16} /> World's Best Dad
                  </div>
                  {badges.map((badge, idx) => (
                    <div key={idx} className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-bold text-brown">
                      {badge}
                    </div>
                  ))}
                  {badges.length === 0 && (
                    <div className="text-sm text-gray-500 italic text-center w-full">The journey was the reward.</div>
                  )}
                </div>
              </motion.div>

              {/* Final Trophy */}
              <AnimatePresence>
                {showTrophy && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6, duration: 1.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold blur-[40px] opacity-50 rounded-full animate-pulse"></div>
                      <Trophy size={120} className="text-gold drop-shadow-[0_10px_20px_rgba(255,215,0,0.5)]" strokeWidth={1.5} />
                    </div>
                    <div className="mt-6 text-center">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Mission Complete</div>
                      <h1 className="text-4xl font-black text-brown font-serif">World's Best Dad</h1>
                    </div>

                    <button
                      onClick={() => setScene(1)}
                      className="mt-10 px-8 py-3 bg-white border-2 border-brown rounded-full font-bold text-brown hover:bg-brown hover:text-white transition-colors shadow-md"
                    >
                      Play Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Scene5;
