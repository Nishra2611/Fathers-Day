import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../store/GameContext';

const TARGET_LETTERS = ['P', 'A', 'P', 'P', 'A', 'A'];

const LETTER_DEFS = [
  {
    letter: 'P',
    nodes: [{ x: 0, y: 0 }, { x: 0, y: 15 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4]]
  },
  {
    letter: 'A',
    nodes: [{ x: 0, y: 0 }, { x: -6, y: 15 }, { x: 6, y: 15 }, { x: -3, y: 7.5 }, { x: 3, y: 7.5 }],
    lines: [[0, 1], [0, 2], [3, 4]]
  },
  {
    letter: 'P',
    nodes: [{ x: 0, y: 0 }, { x: 0, y: 15 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4]]
  },
  {
    letter: 'P',
    nodes: [{ x: 0, y: 0 }, { x: 0, y: 15 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4]]
  },
  {
    letter: 'A',
    nodes: [{ x: 0, y: 0 }, { x: -6, y: 15 }, { x: 6, y: 15 }, { x: -3, y: 7.5 }, { x: 3, y: 7.5 }],
    lines: [[0, 1], [0, 2], [3, 4]]
  },
  {
    letter: 'A',
    nodes: [{ x: 0, y: 0 }, { x: -6, y: 15 }, { x: 6, y: 15 }, { x: -3, y: 7.5 }, { x: 3, y: 7.5 }],
    lines: [[0, 1], [0, 2], [3, 4]]
  }
];

const MEMORY_SNIPPETS = [
  { type: 'text', content: 'I love you 5000...' },
  { type: 'text', content: 'Fresh Rotlo and Oroo Incoming... Careful, its hot!...' },
  { type: 'voice', content: 'Nishra is the best..' },
  { type: 'text', content: 'Naisha is second best...' }
];

const Scene4 = () => {
  const { setScene, isMuted } = useGame();
  const [stars, setStars] = useState<any[]>([]);
  const [brightStars, setBrightStars] = useState<any[]>([]);

  const [revealedConstellations, setRevealedConstellations] = useState<any[]>([]);
  const [activeSnippet, setActiveSnippet] = useState<any>(null);

  const [isAssembling, setIsAssembling] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    // Generate ~200 background stars
    const newStars = Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      blinkDelay: Math.random() * 5,
    }));
    setStars(newStars);

    // Generate 15 bright interactive stars
    const bStars = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70, // Keep away from extreme bottom
      clicked: false
    }));
    setBrightStars(bStars);
  }, []);

  const handleBrightStarClick = (starId: number) => {
    if (isComplete || isAssembling) return;

    const star = brightStars.find(s => s.id === starId);
    if (star?.clicked) return;

    setBrightStars(prev => prev.map(s => s.id === starId ? { ...s, clicked: true } : s));

    // Magic sound effect
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    }

    const currentCount = revealedConstellations.length;
    if (currentCount < TARGET_LETTERS.length) {
      const def = LETTER_DEFS[currentCount];

      setRevealedConstellations(prev => [...prev, {
        id: currentCount,
        letter: def.letter,
        def: def,
        x: star.x,
        y: star.y
      }]);

      // Show memory snippet occasionally
      if (currentCount % 2 === 1) {
        setActiveSnippet(MEMORY_SNIPPETS[Math.floor(Math.random() * MEMORY_SNIPPETS.length)]);
        setTimeout(() => setActiveSnippet(null), 3000);
      }

      // Check for completion
      if (currentCount + 1 === TARGET_LETTERS.length) {
        setTimeout(() => {
          setIsAssembling(true);

          if (!isMuted) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });
          }

          setTimeout(() => {
            setShowHeart(true);
            setTimeout(() => {
              setIsComplete(true);
            }, 1000);
          }, 3000); // Wait for assembly to finish
        }, 1500); // Pause before assembling
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className={`relative w-full h-full bg-[#050B14] overflow-hidden ${isAssembling ? 'scale-110' : 'scale-100'} transition-transform duration-[4000ms] ease-out`}
    >
      {/* Background Aurora */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none z-0">
        <motion.div
          animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-gradient-to-b from-[#00ff88] to-transparent rounded-[100%] blur-[100px]"
        />
        <motion.div
          animate={{ x: [50, -50, 50], y: [20, -20, 20] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[20%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-b from-[#8800ff] to-transparent rounded-[100%] blur-[120px] opacity-60"
        />
      </div>

      {/* Tiny Background Stars */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {stars.map(star => (
          <motion.div
            key={`bg-${star.id}`}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 + star.blinkDelay, delay: star.blinkDelay }}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              boxShadow: '0 0 2px #fff',
            }}
          />
        ))}
      </div>

      {/* Interactive Bright Stars */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {brightStars.map((star) => (
          !star.clicked && (
            <motion.div
              key={`bright-${star.id}`}
              onClick={() => handleBrightStarClick(star.id)}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, delay: Math.random() }}
              className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center cursor-pointer hover:scale-150 transition-transform"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]" />
            </motion.div>
          )
        ))}
      </div>

      {/* Constellations & Text Assembly */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {revealedConstellations.map((constellation, i) => {
          // Assembly Target Calculation
          const letterSpacing = window.innerWidth < 768 ? 14 : 10; // Responsive spacing: 14vw on mobile, 10vw on desktop
          const totalWidth = TARGET_LETTERS.length * letterSpacing;
          const startX = 50 - (totalWidth / 2) + (letterSpacing / 2);
          const finalX = startX + i * letterSpacing;
          const finalY = 50;

          return (
            <motion.div
              key={`constellation-${constellation.id}`}
              initial={{ x: `${constellation.x}vw`, y: `${constellation.y}vh` }}
              animate={isAssembling ? {
                x: `${finalX}vw`,
                y: `${finalY}vh`,
                scale: 1.5
              } : {
                x: `${constellation.x}vw`,
                y: `${constellation.y}vh`,
                scale: 1
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="absolute top-0 left-0"
              style={{ width: 0, height: 0 }}
            >
              {/* SVG Constellation Lines */}
              <motion.svg
                className="absolute top-0 left-0 overflow-visible"
                animate={{ opacity: isAssembling ? 0 : 1 }}
                transition={{ duration: 1.5 }}
              >
                {/* Draw Lines */}
                {constellation.def.lines.map((line: number[], idx: number) => {
                  const p1 = constellation.def.nodes[line[0]];
                  const p2 = constellation.def.nodes[line[1]];
                  return (
                    <motion.line
                      key={`line-${idx}`}
                      x1={`${p1.x}vw`} y1={`${p1.y}vh`}
                      x2={`${p2.x}vw`} y2={`${p2.y}vh`}
                      stroke="rgba(255, 255, 255, 0.8)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}
                    />
                  );
                })}
                {/* Draw Nodes */}
                {constellation.def.nodes.map((node: any, idx: number) => (
                  <motion.circle
                    key={`node-${idx}`}
                    cx={`${node.x}vw`} cy={`${node.y}vh`}
                    r="3"
                    fill="#FFF"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    style={{ filter: 'drop-shadow(0 0 6px #FFF)' }}
                  />
                ))}
              </motion.svg>

              {/* Text Letter (Hidden initially, fades in during assembly) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAssembling ? 1 : 0 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute -translate-x-1/2 -translate-y-[20%] text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gold to-yellow-600 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]"
              >
                {constellation.letter}
              </motion.div>
            </motion.div>
          );
        })}

        {/* The Heart ❤️ */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: showHeart ? 1 : 0, scale: showHeart ? 1.5 : 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="absolute top-1/2 -translate-y-[20%] text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]"
          style={{
            left: `calc(50vw + ${(TARGET_LETTERS.length * (window.innerWidth < 768 ? 14 : 10)) / 2}vw)`
          }}
        >
          ❤️
        </motion.div>
      </div>

      {/* Instructions */}
      <AnimatePresence>
        {!isAssembling && revealedConstellations.length === 0 && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute top-[15%] w-full text-center pointer-events-none z-30"
          >
            <h2 className="text-white/80 font-serif text-2xl tracking-widest animate-pulse px-4">Seek the brighter stars to map our journey...</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Snippet Popup */}
      <AnimatePresence>
        {activeSnippet && !isAssembling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, y: -20, x: '-50%' }}
            className="absolute bottom-[20%] left-1/2 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-white text-center pointer-events-none z-50 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <p className="font-serif text-xl md:text-2xl italic tracking-wide">{activeSnippet.content}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fireworks / Stardust on Completion */}
      {isAssembling && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              initial={{
                x: '50vw', y: '50vh',
                scale: 0, opacity: 1
              }}
              animate={{
                x: `${50 + (Math.random() * 100 - 50)}vw`,
                y: `${50 + (Math.random() * 100 - 50)}vh`,
                scale: Math.random() * 2,
                opacity: 0
              }}
              transition={{ duration: 2 + Math.random() * 2, ease: "easeOut", delay: 2.5 }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: Math.random() > 0.5 ? '#FFD700' : '#FFF',
                boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.5)'
              }}
            />
          ))}
        </div>
      )}

      {/* Continue Button */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-20 left-0 w-full flex justify-center z-50 pointer-events-auto"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setScene(5); }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/40 rounded-full text-white font-bold text-xl hover:bg-white/20 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] cursor-pointer"
            >
              Open the Treasure Box 🎁
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Scene4;
