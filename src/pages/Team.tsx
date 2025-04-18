
import React, { useEffect, useRef } from 'react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import TeamCarousel from '@/components/TeamCarousel';
import { motion } from '@motionone/react';

const Team: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-black overflow-hidden relative">
      {/* Animated dotted background */}
      <AnimatedBackground />
      
      {/* Purple gradient effects */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] z-0" />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Our Team
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-xl">
            Meet the talented individuals who make our vision a reality.
            Passionate experts committed to excellence and innovation.
          </p>
        </motion.div>
        
        {/* Team carousel with parallax effect */}
        <TeamCarousel />
      </div>
    </div>
  );
};

export default Team;
