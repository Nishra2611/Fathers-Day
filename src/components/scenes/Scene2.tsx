import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../store/GameContext';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const SPEED = 6;
const MAX_X = 2800;

import photo1 from '../../assets/photos/Small-Small.jpeg';
import photo2 from '../../assets/photos/2-march-2018.jpeg';
import photo3 from '../../assets/photos/21-march-2019.jpeg';
import photo4 from '../../assets/photos/31-jan-2020.jpeg';

const MEMORIES = [
  { id: 1, x: 600, y: 150, image: <img src={photo1} className="w-full h-full object-cover" />, title: 'Childhood', color: 'bg-white', date: 'Small Small' },
  { id: 2, x: 1200, y: 100, image: <img src={photo2} className="w-full h-full object-cover" />, title: 'Outing', color: 'bg-white', date: '2 March 2018' },
  { id: 3, x: 1800, y: 180, image: <img src={photo3} className="w-full h-full object-cover" />, title: 'Holi', color: 'bg-white', date: '21 March 2019' },
  { id: 4, x: 2300, y: 120, image: <img src={photo4} className="w-full h-full object-cover" />, title: 'Diwali Together', color: 'bg-white', date: '31 Jan 2020' },
];

const POWER_UPS = [
  { id: 1, type: 'chole', x: 400, y: 220, emoji: '🥘', desc: 'Chole Bhature! Jump Higher!' },
  { id: 2, type: 'tea', x: 1500, y: 220, emoji: '☕', desc: 'Tea Time! Move Faster!' },
];

const OBSTACLES = [
  { id: 1, type: 'bill', x: 900, y: 240, emoji: '🧾' },
  { id: 2, type: 'cable', x: 2000, y: 240, emoji: '🔌' },
];

const Scene2 = () => {
  const { setScene, addMemory } = useGame();

  const [player, setPlayer] = useState({ x: 50, y: 200, vy: 0, direction: 1 });
  const [keys, setKeys] = useState({ left: false, right: false, up: false, down: false });
  const [activePolaroid, setActivePolaroid] = useState<any>(null);

  const [collectedMemories, setCollectedMemories] = useState<number[]>([]);
  const [collectedPowerUps, setCollectedPowerUps] = useState<number[]>([]);

  const [jumpPower, setJumpPower] = useState(JUMP_FORCE);
  const [speedPower, setSpeedPower] = useState(SPEED);
  const [powerUpMessage, setPowerUpMessage] = useState('');

  const requestRef = useRef<number>(0);
  const playerRef = useRef(player);
  playerRef.current = player;

  const keysRef = useRef(keys);
  keysRef.current = keys;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (activePolaroid) return;
    if (e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: true }));
    if (e.code === 'ArrowRight') setKeys(k => ({ ...k, right: true }));
    if (e.code === 'ArrowUp' || e.code === 'Space') setKeys(k => ({ ...k, up: true }));
    if (e.code === 'ArrowDown') setKeys(k => ({ ...k, down: true }));
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: false }));
    if (e.code === 'ArrowRight') setKeys(k => ({ ...k, right: false }));
    if (e.code === 'ArrowUp' || e.code === 'Space') setKeys(k => ({ ...k, up: false }));
    if (e.code === 'ArrowDown') setKeys(k => ({ ...k, down: false }));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activePolaroid]);

  const gameLoop = () => {
    if (activePolaroid) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    let { x, y, vy, direction } = playerRef.current;
    const currentKeys = keysRef.current;

    // Movement
    if (currentKeys.left) { x -= speedPower; direction = -1; }
    if (currentKeys.right) { x += speedPower; direction = 1; }

    // Gravity & Jump
    vy += GRAVITY;
    y += vy;

    // Ground collision
    const groundY = 240;
    if (y > groundY) {
      y = groundY;
      vy = 0;
      if (currentKeys.up) {
        vy = jumpPower;
      }
    }

    // Bounds
    if (x < 0) x = 0;
    if (x > MAX_X + 200) x = MAX_X + 200;

    // Check Gate collision
    if (x > MAX_X) {
      setScene(3);
      return;
    }

    setPlayer({ x, y, vy, direction });

    // Check Memory collision
    MEMORIES.forEach(m => {
      if (!collectedMemories.includes(m.id)) {
        if (Math.abs(x - m.x) < 40 && Math.abs(y - m.y) < 40) {
          setCollectedMemories(prev => [...prev, m.id]);
          setActivePolaroid(m);
          addMemory(m.title);
          confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
        }
      }
    });

    // Check Powerup collision
    POWER_UPS.forEach(p => {
      if (!collectedPowerUps.includes(p.id)) {
        if (Math.abs(x - p.x) < 40 && Math.abs(y - p.y) < 40) {
          setCollectedPowerUps(prev => [...prev, p.id]);
          setPowerUpMessage(p.desc);
          setTimeout(() => setPowerUpMessage(''), 3000);
          if (p.type === 'chole') setJumpPower(JUMP_FORCE * 1.4);
          if (p.type === 'tea') setSpeedPower(SPEED * 1.5);
          confetti({ particleCount: 20, spread: 20, colors: ['#00ff00'] });
        }
      }
    });

    // Check Obstacle collision (Push back)
    OBSTACLES.forEach(o => {
      if (Math.abs(x - o.x) < 40 && Math.abs(y - o.y) < 40) {
        // Push back 150px
        x -= 150;
        if (x < 0) x = 0;
        // Optionally show message
        setPowerUpMessage('Ouch! Obstacle hit!');
        setTimeout(() => setPowerUpMessage(''), 1000);
      }
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [collectedMemories, collectedPowerUps, jumpPower, speedPower, activePolaroid]);

  // Mobile Controls
  const handleTouchStart = (action: string) => {
    if (action === 'left') setKeys(k => ({ ...k, left: true }));
    if (action === 'right') setKeys(k => ({ ...k, right: true }));
    if (action === 'up') setKeys(k => ({ ...k, up: true }));
    if (action === 'down') setKeys(k => ({ ...k, down: true }));
  };

  const handleTouchEnd = (action: string) => {
    if (action === 'left') setKeys(k => ({ ...k, left: false }));
    if (action === 'right') setKeys(k => ({ ...k, right: false }));
    if (action === 'up') setKeys(k => ({ ...k, up: false }));
    if (action === 'down') setKeys(k => ({ ...k, down: false }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center w-full h-full bg-blue-50 overflow-hidden"
    >
      {/* Background Parallax Layer */}
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{ transform: `translateX(${-player.x * 0.1}px)` }}
      >
        <div className="absolute top-10 left-40 w-32 h-16 bg-white rounded-full blur-xl opacity-70" />
        <div className="absolute top-20 left-[800px] w-48 h-20 bg-white rounded-full blur-xl opacity-80" />
        <div className="absolute top-12 left-[1600px] w-32 h-16 bg-white rounded-full blur-xl opacity-60" />
        <div className="absolute top-32 left-[2400px] w-64 h-24 bg-white rounded-full blur-xl opacity-90" />
      </div>

      {/* Game World Container */}
      <div className="relative w-full h-[55vh] md:h-[400px] max-w-4xl border-b-8 border-[#8B5A2B] bg-gradient-to-b from-blue-100 to-green-100 overflow-hidden shadow-2xl rounded-t-3xl border-x-4">

        {/* Scrolling World */}
        <div
          className={`absolute inset-0 transition-transform duration-75 ${keys.left || keys.right ? 'blur-[1px]' : ''}`}
          style={{ transform: `translateX(${-player.x + 300}px)` }} // Camera offset
        >
          {/* Ground */}
          <div className="absolute bottom-0 w-[4000px] h-10 bg-[#228B22]" />
          <div className="absolute bottom-6 w-[4000px] h-4 bg-[#32CD32] rounded-t-full opacity-50" />

          {/* Mountains / Scenery */}
          <div className="absolute bottom-10 left-[400px] w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[150px] border-b-green-800 opacity-20" />
          <div className="absolute bottom-10 left-[1200px] w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[200px] border-b-green-900 opacity-20" />

          {/* Gate */}
          <div className="absolute bottom-10" style={{ left: MAX_X }}>
            <div className="w-24 h-40 bg-gradient-to-t from-gold to-white rounded-t-full shadow-[0_0_50px_#F4B942] animate-pulse flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <div className="absolute -bottom-8 -left-4 w-32 text-center text-brown font-bold text-xl">Next Area</div>
          </div>

          {/* Memories */}
          {MEMORIES.map(m => (
            !collectedMemories.includes(m.id) && (
              <motion.div
                key={`mem-${m.id}`}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute w-12 h-14 bg-white border-4 border-gray-200 shadow-md rounded-sm flex items-center justify-center text-2xl"
                style={{ left: m.x, top: m.y }}
              >
                {m.image}
              </motion.div>
            )
          ))}

          {/* Power Ups */}
          {POWER_UPS.map(p => (
            !collectedPowerUps.includes(p.id) && (
              <motion.div
                key={`pow-${p.id}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute w-10 h-10 flex items-center justify-center text-3xl drop-shadow-md"
                style={{ left: p.x, top: p.y }}
              >
                {p.emoji}
              </motion.div>
            )
          ))}

          {/* Obstacles */}
          {OBSTACLES.map(o => (
            <div
              key={`obs-${o.id}`}
              className="absolute w-10 h-10 flex items-center justify-center text-3xl opacity-80"
              style={{ left: o.x, top: o.y }}
            >
              {o.emoji}
            </div>
          ))}

          {/* Player */}
          <div
            className="absolute w-12 h-16 transition-transform duration-75"
            style={{ left: player.x, top: player.y }}
          >
            <motion.div
              animate={{
                rotate: player.direction === 1 ? [0, 5, -5, 0] : [0, -5, 5, 0],
                y: keys.left || keys.right ? [0, -4, 0] : 0,
                scaleY: keys.down ? 0.7 : 1, // Ducking visual effect when down is pressed
                transformOrigin: 'bottom'
              }}
              transition={{ repeat: keys.down ? 0 : Infinity, duration: 0.3 }}
              className={`w-full h-full flex flex-col items-center transform ${player.direction === -1 ? '-scale-x-100' : ''}`}
            >
              {/* Head */}
              <div className="w-8 h-8 bg-[#FFE4C4] rounded-full border-2 border-brown flex items-center justify-center relative z-10">
                {/* Glasses */}
                <div className="absolute top-2 w-6 h-2 border-b-2 border-gray-800 rounded-full"></div>
                {/* Smile */}
                <div className="absolute bottom-1 w-3 h-1 border-b-2 border-red-400 rounded-full"></div>
                {/* Hair */}
                <div className="absolute -top-1 w-8 h-3 bg-gray-600 rounded-t-full"></div>
              </div>
              {/* Body */}
              <div className="w-6 h-6 bg-blue-600 rounded-md border border-blue-800 -mt-1 relative z-0"></div>
              {/* Legs */}
              <div className="flex space-x-1 mt-0">
                <div className="w-2 h-3 bg-gray-800 rounded-full"></div>
                <div className="w-2 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 flex space-x-4">
        <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full font-bold text-brown shadow-sm border border-orange-100">
          Memories: {collectedMemories.length} / {MEMORIES.length}
        </div>
      </div>

      <AnimatePresence>
        {powerUpMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-20 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
          >
            {powerUpMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Directional Controls for Both PC and Mobile */}
      <div className="absolute bottom-6 right-6 flex flex-col items-center z-50 pointer-events-none scale-90 md:scale-100 opacity-80 hover:opacity-100 transition-opacity">
        <button
          onMouseDown={(e) => { e.preventDefault(); handleTouchStart('up'); }}
          onMouseUp={(e) => { e.preventDefault(); handleTouchEnd('up'); }}
          onMouseLeave={(e) => { e.preventDefault(); handleTouchEnd('up'); }}
          onTouchStart={(e) => { e.preventDefault(); handleTouchStart('up'); }}
          onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('up'); }}
          className="w-14 h-14 bg-white/90 rounded-xl shadow-xl flex items-center justify-center text-brown border-2 border-orange-200 active:bg-orange-100 pointer-events-auto mb-2"
        >
          <ArrowUp size={32} />
        </button>
        <div className="flex space-x-2 pointer-events-auto">
          <button
            onMouseDown={(e) => { e.preventDefault(); handleTouchStart('left'); }}
            onMouseUp={(e) => { e.preventDefault(); handleTouchEnd('left'); }}
            onMouseLeave={(e) => { e.preventDefault(); handleTouchEnd('left'); }}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('left'); }}
            className="w-14 h-14 bg-white/90 rounded-xl shadow-xl flex items-center justify-center text-brown border-2 border-orange-200 active:bg-orange-100"
          >
            <ArrowLeft size={32} />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); handleTouchStart('down'); }}
            onMouseUp={(e) => { e.preventDefault(); handleTouchEnd('down'); }}
            onMouseLeave={(e) => { e.preventDefault(); handleTouchEnd('down'); }}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart('down'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('down'); }}
            className="w-14 h-14 bg-white/90 rounded-xl shadow-xl flex items-center justify-center text-brown border-2 border-orange-200 active:bg-orange-100"
          >
            <ArrowDown size={32} />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); handleTouchStart('right'); }}
            onMouseUp={(e) => { e.preventDefault(); handleTouchEnd('right'); }}
            onMouseLeave={(e) => { e.preventDefault(); handleTouchEnd('right'); }}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('right'); }}
            className="w-14 h-14 bg-white/90 rounded-xl shadow-xl flex items-center justify-center text-brown border-2 border-orange-200 active:bg-orange-100"
          >
            <ArrowRight size={32} />
          </button>
        </div>
      </div>

      {/* Polaroid Modal */}
      <AnimatePresence>
        {activePolaroid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white p-4 pb-6 rounded-sm shadow-2xl w-80 flex flex-col items-center"
            >
              <div className={`w-full h-64 ${activePolaroid.color} flex items-center justify-center text-6xl shadow-inner border border-gray-100 overflow-hidden`}>
                {activePolaroid.image}
              </div>
              <p className="font-handwriting text-3xl mt-6 text-gray-800 font-bold text-center leading-tight">{activePolaroid.title}</p>
              {activePolaroid.date && <p className="font-serif text-sm text-gray-500 mt-1">{activePolaroid.date}</p>}

              <button
                onClick={() => setActivePolaroid(null)}
                className="mt-6 px-6 py-2 bg-softOrange rounded-full shadow-lg font-bold text-brown hover:bg-gold transition-colors"
              >
                Continue Adventure
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Scene2;
