
import React, { useEffect, useRef, useState } from 'react';
import { motion } from '@motionone/react';
import { Lens } from '@/components/ui/lens';
import { LinkedIn } from 'lucide-react';
import teamMembers from '@/data/team.json';
import { cn } from '@/lib/utils';

interface TeamCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    image: string;
    linkedin: string;
  };
  isActive: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, isActive }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div 
      className={cn(
        "flex-shrink-0 w-72 h-[400px] rounded-2xl bg-gradient-to-b from-zinc-800/80 to-black/80 border border-purple-500/20 backdrop-blur-sm p-5 mx-4 overflow-hidden transition-all duration-300",
        isActive ? "scale-105 border-purple-500/50" : "scale-95 opacity-70"
      )}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative w-full h-64 mb-4 rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Lens isStatic={!isActive} hovering={isHovering} setHovering={setIsHovering}>
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover"
          />
        </Lens>
      </div>
      <div className="flex justify-between items-start">
        <div className="text-left">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-purple-300 text-sm">{member.role}</p>
        </div>
        <a 
          href={member.linkedin} 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-purple-600/20 rounded-full hover:bg-purple-600/50 transition-colors duration-300"
        >
          <LinkedIn className="w-5 h-5 text-white" />
        </a>
      </div>
    </motion.div>
  );
};

const TeamCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      if (!isDragging && containerRef.current) {
        const nextIndex = (activeIndex + 1) % teamMembers.length;
        setActiveIndex(nextIndex);
        
        const cardWidth = 288; // 272px + 16px margin
        containerRef.current.scrollTo({
          left: nextIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }, 3000);

    return () => clearInterval(autoScrollInterval);
  }, [activeIndex, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    if (containerRef.current) {
      const cardWidth = 288;
      const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
      setActiveIndex(newIndex);
      
      containerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - dragStartX) * 2;
    
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleScroll = () => {
    if (isDragging || !containerRef.current) return;
    
    const cardWidth = 288;
    const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto px-4 relative z-10 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-none scroll-smooth pb-6 pt-8 px-4"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {teamMembers.map((member, index) => (
          <div 
            key={member.id}
            className="flex-shrink-0 scroll-snap-align-start"
            style={{ scrollSnapAlign: 'start' }}
          >
            <TeamCard 
              member={member} 
              isActive={index === activeIndex} 
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {teamMembers.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeIndex 
                ? 'bg-purple-500 scale-110' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => {
              setActiveIndex(index);
              containerRef.current?.scrollTo({
                left: index * 288,
                behavior: 'smooth'
              });
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TeamCarousel;
