import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../../store/GameContext';
import { useMicrophoneVolume } from '../../hooks/useMicrophone';

const Scene1 = () => {
  const { setScene, addBadge, isMuted } = useGame();
  const { isBlowing, hasPermission } = useMicrophoneVolume(40);
  const [candlesOut, setCandlesOut] = useState(false);
  const [choleClicks, setCholeClicks] = useState(0);
  const [photoShake, setPhotoShake] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [teaMessage, setTeaMessage] = useState(false);
  
  // Handle Blowing
  useEffect(() => {
    if (isBlowing && !candlesOut) {
      setCandlesOut(true);
      if (!isMuted) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFDAB9', '#A0522D']
      });
      setTimeout(() => setDoorOpen(true), 2000);
    }
  }, [isBlowing, candlesOut, isMuted]);

  const handleCholeClick = () => {
    const newCount = choleClicks + 1;
    setCholeClicks(newCount);
    if (newCount === 3) {
      addBadge('King of Chole Bhature');
      confetti({ particleCount: 50, spread: 40, origin: { x: 0.3, y: 0.7 }, colors: ['#D2691E', '#F4A460'] });
    }
  };

  const handlePhotoClick = () => {
    setPhotoShake(true);
    setTimeout(() => setPhotoShake(false), 500);
  };

  const handleTeaClick = () => {
    addBadge('Tea Lover');
    setTeaMessage(true);
    setTimeout(() => setTeaMessage(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
      className={`relative flex flex-col items-center justify-center w-full h-full transition-colors duration-1000 overflow-hidden ${candlesOut ? 'bg-[#2A1B12]' : 'bg-cream'}`}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              x: Math.sin(i) * 10,
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2
            }}
            className="absolute bg-white rounded-full blur-[1px]"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-4xl">
        
        {/* Magic Door */}
        <AnimatePresence>
          {doorOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="absolute top-10 flex flex-col items-center z-30"
            >
              <div 
                className="w-40 h-56 bg-gradient-to-t from-gold to-softOrange rounded-t-full shadow-[0_0_80px_rgba(244,185,66,0.6)] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform border-4 border-yellow-200"
                onClick={() => setScene(2)}
              >
                <div className="text-darkBrown font-black text-center text-xl uppercase tracking-widest drop-shadow-md">
                  Level 1<br/>Unlocked
                </div>
                <div className="mt-4 animate-pulse bg-white/30 px-4 py-1 rounded-full text-sm font-bold text-darkBrown">
                  Enter
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Area */}
        <motion.div 
          animate={candlesOut ? { scale: 0.85, y: 150, opacity: 0.5 } : { scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="relative w-full max-w-3xl h-64 mt-32 flex flex-col justify-end"
        >
          {/* Items on Table Container */}
          <div className="relative flex items-end justify-between w-full px-12 z-20 translate-y-4">
            
            {/* Left: Chole Bhature */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCholeClick}
              className="relative cursor-pointer group flex-shrink-0 mb-4"
            >
              <div className="w-40 h-16 bg-orange-900/40 rounded-[100%] shadow-lg absolute -bottom-4 border-b-4 border-orange-900/60 blur-[2px]" />
              <div className="relative">
                {/* Bhatura Base */}
                <div className="w-28 h-28 bg-[radial-gradient(ellipse_at_center,_#ffcc80_0%,_#f59e3d_60%,_#d2691e_100%)] rounded-full absolute bottom-0 left-0 shadow-[inset_-8px_-8px_15px_rgba(139,69,19,0.5),_0_10px_15px_rgba(0,0,0,0.3)] border border-[#c67127] flex items-center justify-center overflow-hidden">
                  {/* Desi Ghee Shine */}
                  <div className="absolute top-2 left-4 w-12 h-6 bg-white/50 rounded-full blur-[4px] transform -rotate-45"></div>
                  {/* Texture spots */}
                  <div className="w-3 h-3 bg-orange-800/20 rounded-full absolute top-6 right-6 blur-[1px]"></div>
                  <div className="w-4 h-4 bg-orange-800/20 rounded-full absolute bottom-8 left-8 blur-[1px]"></div>
                </div>
                {/* Second Bhatura */}
                <div className="w-24 h-24 bg-[radial-gradient(ellipse_at_center,_#ffcc80_0%,_#ed9121_60%,_#cd6600_100%)] rounded-full absolute bottom-2 left-10 shadow-[inset_-6px_-6px_12px_rgba(139,69,19,0.4),_0_5px_10px_rgba(0,0,0,0.4)] opacity-95 border border-[#c67127]">
                  <div className="absolute top-2 left-2 w-10 h-4 bg-white/40 rounded-full blur-[3px] transform -rotate-30"></div>
                </div>
                
                {/* Bowl of Chole */}
                <div className="w-20 h-14 bg-gradient-to-b from-[#8B4513] to-[#3E2723] rounded-b-full absolute -bottom-2 -right-8 flex flex-col items-center shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-2 border-orange-900/80 overflow-hidden">
                  <div className="w-full h-4 bg-[#A0522D] rounded-t-full absolute top-0 border-b border-black/30"></div>
                  {/* Chole Gravy */}
                  <div className="w-16 h-8 bg-gradient-to-br from-[#5C4033] to-[#2E1605] rounded-full absolute top-1 blur-[1px] flex flex-wrap justify-center items-center pt-1 shadow-inner">
                    {/* Chickpeas (Chole) */}
                    <div className="w-3 h-3 bg-[#a0522d] rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.5)] m-px"></div>
                    <div className="w-3 h-3 bg-[#8b4513] rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.5)] m-px"></div>
                    <div className="w-3 h-3 bg-[#cd853f] rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.5)] m-px"></div>
                    <div className="w-3 h-3 bg-[#a0522d] rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.5)] m-px"></div>
                    <div className="w-3 h-3 bg-[#8b4513] rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.5)] m-px"></div>
                    {/* Coriander / Onion garnish */}
                    <div className="absolute top-2 right-4 w-2 h-2 bg-green-500 rounded-full blur-[0.5px]"></div>
                    <div className="absolute top-3 left-3 w-4 h-1 bg-purple-400 rounded-full blur-[0.5px] transform rotate-12"></div>
                  </div>
                </div>
              </div>
              {/* Steam */}
              <motion.div 
                animate={{ y: [-5, -25], opacity: [0, 0.6, 0], scale: [1, 2] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -top-8 left-12 w-6 h-14 bg-white/40 blur-xl rounded-full"
              />
            </motion.div>

            {/* Center: Cake */}
            <div className="relative flex flex-col items-center flex-shrink-0 z-10">
              <div className="w-56 h-28 bg-[#FFF5EE] rounded-2xl shadow-xl border-b-[12px] border-[#FFDAB9] flex items-center justify-center relative z-10">
                {/* Drips */}
                <div className="absolute top-0 left-6 w-5 h-12 bg-[#FF69B4] rounded-b-full shadow-sm" />
                <div className="absolute top-0 right-10 w-4 h-14 bg-[#FF69B4] rounded-b-full shadow-sm" />
                <div className="absolute top-0 left-20 w-6 h-8 bg-[#FF69B4] rounded-b-full shadow-sm" />
                <div className="absolute top-0 right-24 w-5 h-10 bg-[#FF69B4] rounded-b-full shadow-sm" />
                
                {/* Candles */}
                <div className="absolute -top-12 flex space-x-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative w-4 h-12 bg-[linear-gradient(45deg,#ff0000_25%,#ffffff_25%,#ffffff_50%,#ff0000_50%,#ff0000_75%,#ffffff_75%,#ffffff_100%)] bg-[length:10px_10px] rounded-t-md shadow-sm">
                      {/* Flame */}
                      <AnimatePresence>
                        {!candlesOut && (
                          <motion.div 
                            initial={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 1.15, 0.95, 1.1], rotate: [-3, 3, -2, 4] }}
                            transition={{ repeat: Infinity, duration: 0.15 }}
                            className="absolute -top-8 -left-1.5 w-7 h-9 bg-[#FF4500] rounded-full blur-[1px] shadow-[0_0_15px_#FFD700]"
                          >
                            <div className="absolute bottom-1 left-1.5 w-4 h-5 bg-[#FFD700] rounded-full" />
                            <div className="absolute bottom-2 left-2.5 w-2 h-3 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Smoke */}
                      <AnimatePresence>
                        {candlesOut && (
                          <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.6, 0], y: -60, scale: 2 }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            className="absolute -top-4 -left-2 w-6 h-6 bg-gray-300 rounded-full blur-md"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-72 h-8 bg-brown/20 rounded-[100%] absolute -bottom-4 blur-sm -z-10"></div>
            </div>

            {/* Right: Tea & Photo */}
            <div className="relative flex items-end space-x-6 flex-shrink-0 mb-4">
              {/* Tea */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTeaClick}
                className="relative cursor-pointer z-10"
              >
                <div className="w-20 h-6 bg-white rounded-[100%] absolute -bottom-2 -left-2 shadow-md border-b-2 border-gray-200" />
                <div className="w-16 h-16 bg-gradient-to-b from-white to-gray-100 rounded-b-2xl relative shadow-sm border-t-2 border-gray-100 flex items-center justify-center text-2xl z-10">
                  <div className="absolute -right-4 top-2 w-6 h-10 border-4 border-white rounded-r-full shadow-sm" />
                  <div className="w-12 h-2 bg-[#8B4513] absolute top-1 rounded-[100%] opacity-80 blur-[1px]"></div>
                </div>
                {/* Steam */}
                <motion.div 
                  animate={{ y: [-5, -20], x: [0, 8, -4, 0], opacity: [0, 0.5, 0], scale: [1, 1.5] }}
                  transition={{ repeat: Infinity, duration: 3.5 }}
                  className="absolute -top-6 left-4 w-4 h-12 bg-white/50 blur-md rounded-full"
                />
                <AnimatePresence>
                  {teaMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -40, scale: 1 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="absolute -top-10 -right-10 bg-white px-3 py-1 rounded-full shadow-lg text-brown font-bold text-sm"
                    >
                      Perfect!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Photo Frame */}
              <motion.div
                animate={photoShake ? { rotate: [-5, 5, -8, 6, -2, 0], scale: 1.05 } : {}}
                transition={{ duration: 0.4 }}
                onClick={handlePhotoClick}
                className="w-20 h-24 bg-brown border-8 border-[#CD853F] rounded shadow-xl cursor-pointer flex flex-col items-center justify-center bg-white relative translate-y-2 z-0"
              >
                <div className="w-full h-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                   <div className="w-8 h-8 rounded-full bg-gray-300 absolute -bottom-2 -left-2"></div>
                   <div className="w-10 h-10 rounded-full bg-gray-400 absolute -bottom-4 -right-2"></div>
                   <div className="w-6 h-6 rounded-full bg-[#FFDAB9] absolute top-2 right-2"></div>
                </div>
              </motion.div>
            </div>
            
          </div>
          
          {/* Table Top Surface */}
          <div className="absolute bottom-0 w-[120%] -left-[10%] h-48 bg-gradient-to-b from-[#A0522D] to-[#5C4033] rounded-[100%] -z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] border-t-4 border-[#CD853F]"></div>
        </motion.div>

        {/* Note */}
        <motion.div 
          animate={candlesOut ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          className="mt-16 bg-white p-8 rounded-sm shadow-xl max-w-md text-center transform -rotate-2 relative border border-gray-100"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500/20 rounded-full blur-sm"></div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-inner shadow-red-600"></div> {/* Pin */}
          <h2 className="text-3xl font-bold text-brown mb-3 font-serif italic tracking-wide">Happy Father's Day<br/>Pappaaaaa ❤️</h2>
          <p className="text-darkBrown font-medium text-lg font-serif">Love you till Pluto and back.</p>
        </motion.div>

        {/* Instructions */}
        <AnimatePresence>
          {!candlesOut && (
            <motion.div 
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-10 flex flex-col items-center space-y-3 z-50 px-4 w-full"
            >
              <div className="bg-white/95 backdrop-blur px-6 md:px-8 py-3 md:py-4 rounded-full shadow-2xl text-brown font-bold flex items-center justify-center space-x-3 animate-bounce border-2 border-softOrange text-center max-w-sm md:max-w-md">
                <span className="text-2xl">🎤</span>
                <span className="text-sm md:text-lg">Blow into the microphone to blow out the candles</span>
              </div>
              {hasPermission === false && (
                <p className="text-white bg-red-500 px-4 py-2 rounded-full font-bold shadow-lg text-sm text-center">
                  Microphone access required to continue!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Scene1;
