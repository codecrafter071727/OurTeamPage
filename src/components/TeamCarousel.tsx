import React, { useEffect, useRef, useState } from 'react';
import { motion } from '@motionone/react';
import { Lens } from '@/components/ui/lens';
import { Linkedin } from 'lucide-react';
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
        "flex-shrink-0 w-80 h-[450px] rounded-2xl bg-gradient-to-b from-zinc-800/80 to-black/80 border border-purple-500/20 backdrop-blur-sm p-6 mx-3 overflow-hidden transition-all duration-500",
        isActive ? "scale-105 border-purple-500/50" : "scale-95 opacity-70"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative w-full h-72 mb-6 rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] group"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex justify-between items-start">
        <div className="text-left">
          <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
          <p className="text-purple-300 text-sm">{member.role}</p>
        </div>
        <a 
          href={member.linkedin} 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-purple-600/20 rounded-full hover:bg-purple-600/50 transition-colors duration-300"
        >
          <Linkedin className="w-5 h-5 text-white" />
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

  const scrollToNextCard = () => {
    if (containerRef.current) {
      const nextIndex = (activeIndex + 1) % teamMembers.length;
      setActiveIndex(nextIndex);
      
      const cardWidth = 344; // 320px + 24px margin
      const targetScroll = nextIndex * cardWidth;
      
      if (nextIndex === 0) {
        containerRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        containerRef.current.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        scrollToNextCard();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    if (containerRef.current) {
      const cardWidth = 344;
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
    
    const cardWidth = 344;
    const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <motion.div 
      className="w-full relative z-10 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-none scroll 0 0 0 0 smooth pb-8 pt-4 px-4 max-w-[90vw] mx-auto"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {teamMembers.concat(teamMembers.slice(0, 3)).map((member, index) => (
          <div 
            key={`${member.id}-${index}`}
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

      <div className="flex justify-center mt-8 space-x-2">
        {teamMembers.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'bg-purple-500 scale-110' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => {
              setActiveIndex(index);
              containerRef.current?.scrollTo({
                left: index * 344,
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
