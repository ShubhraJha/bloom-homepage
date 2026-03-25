import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, ArrowRight, ArrowLeft } from 'lucide-react';
import introVideo from '@/assets/intro.mp4'; 

interface IntroVideoProps {
  onEnter: () => void;
}

export const IntroVideo = ({ onEnter }: IntroVideoProps) => {
  const [hasStarted, setHasStarted] = useState(false); // Track if user clicked Play
  const [videoEnded, setVideoEnded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayIntro = () => {
    if (videoRef.current) {
      setHasStarted(true);
      // Unmute and Play
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleEnterWebsite = () => {
    localStorage.setItem('hasVisited', 'true');
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans">
      
      {/* 1. VIDEO ELEMENT (Static First Frame initially) */}
      <video
        ref={videoRef}
        src={introVideo}
        className="absolute inset-0 w-full h-full object-contain md:object-cover bg-black"
        preload="auto" // Ensures the first frame loads immediately
        playsInline
        // Note: No 'autoPlay' here, so it shows the first frame
        onEnded={handleVideoEnd}
      />

      {/* 2. START SCREEN OVERLAY (Visible before playing) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
          
          {/* Dark overlay to make buttons readable against the video frame */}
          <div className="absolute inset-0 bg-black/50 -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 relative z-20"
          >
            <h1 className="text-white text-3xl md:text-5xl font-heading font-bold tracking-wider mb-8 drop-shadow-lg">
              JAL JIV RAKSHAK FOUNDATION
            </h1>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              {/* VIEW INTRO BUTTON */}
              <button
                onClick={handlePlayIntro}
                className="group relative px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold text-xl uppercase tracking-widest hover:bg-gold hover:text-black transition-all duration-300 rounded-lg flex items-center gap-3 shadow-lg"
              >
                <Play className="w-6 h-6 fill-current" />
                View Intro
              </button>

              {/* SKIP INTRO BUTTON - Always visible */}
              <button
                onClick={handleEnterWebsite}
                className="group px-8 py-4 bg-white/10 border-2 border-white/50 text-white font-bold text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-lg flex items-center gap-3 backdrop-blur-sm shadow-lg"
              >
                Skip Intro
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* BACK BUTTON (visible while video is playing) */}
      {hasStarted && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={handleEnterWebsite}
          className="absolute bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-gray-500/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-gray-400/50 hover:scale-110 hover:text-white transition-all duration-200 cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      )}

      {/* 3. "VISIT WEBSITE" BUTTON (Appears when video ends) */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // Positioned 15% from bottom
            className="absolute bottom-[15%] left-0 right-0 z-30 flex justify-center pointer-events-none"
          >
            <button
              onClick={handleEnterWebsite}
              className="pointer-events-auto bg-gold hover:bg-gold-dark text-ocean-deep font-heading font-bold text-2xl px-12 py-6 rounded-full shadow-2xl pulse-glow flex items-center gap-3 transition-transform hover:scale-105"
            >
              Enter Website <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};