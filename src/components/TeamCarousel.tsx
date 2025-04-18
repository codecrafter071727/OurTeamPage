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
        "relative flex-shrink-0 w-[400px] h-[500px] rounded-[30px] overflow-hidden mx-4",
        "bg-gradient-to-br from-purple-900/50 via-black/80 to-black/90",
        "border border-purple-500/10 backdrop-blur-lg shadow-2xl",
        "transform transition-all duration-500",
        isActive ? "scale-100" : "scale-95 opacity-75"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative w-full h-[350px] overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Lens isStatic={!isActive} hovering={isHovering} setHovering={setIsHovering}>
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </Lens>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {member.name}
            </h3>
            <p className="text-purple-300 text-lg font-medium">{member.role}</p>
          </div>
          <a 
            href={member.linkedin} 
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-purple-600/20 rounded-full hover:bg-purple-600/50 transition-colors duration-300 transform hover:scale-110"
          >
            <Linkedin className="w-6 h-6 text-purple-300" />
          </a>
        </div>
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
      
      const cardWidth = 416; // 400px + 16px margin
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
      const cardWidth = 416;
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
    
    const cardWidth = 416;
    const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <motion.div 
      className="w-full relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-none pb-8 pt-4 px-4 max-w-[95vw] mx-auto scroll-smooth"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {teamMembers.concat(teamMembers.slice(0, 3)).map((member, index) => (
          <div 
            key={`${member.id}-${index}`}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <TeamCard 
              member={member} 
              isActive={index === activeIndex} 
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TeamCarousel;
