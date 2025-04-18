
import React, { useEffect, useRef } from 'react';

interface DotProps {
  size: number;
  x: number;
  y: number;
  opacity: number;
  velocity: { x: number; y: number };
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<DotProps[]>([]);
  const animationFrameRef = useRef<number>(0);

  const createDots = (width: number, height: number): DotProps[] => {
    const dots: DotProps[] = [];
    const count = Math.floor((width * height) / 10000); // Adjust for desired density
    
    for (let i = 0; i < count; i++) {
      dots.push({
        size: Math.random() * 2 + 1,
        x: Math.random() * width,
        y: Math.random() * height,
        opacity: Math.random() * 0.5 + 0.1,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5
        }
      });
    }
    
    return dots;
  };

  const updateDots = (width: number, height: number) => {
    dotsRef.current.forEach(dot => {
      // Update position
      dot.x += dot.velocity.x;
      dot.y += dot.velocity.y;
      
      // Boundary check with wrap-around
      if (dot.x < 0) dot.x = width;
      if (dot.x > width) dot.x = 0;
      if (dot.y < 0) dot.y = height;
      if (dot.y > height) dot.y = 0;
    });
  };

  const drawDots = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dotsRef.current.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
      ctx.fill();
    });
  };

  const animate = () => {
    if (!canvasRef.current) return;
    
    updateDots(canvasRef.current.width, canvasRef.current.height);
    drawDots();
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dotsRef.current = createDots(canvas.width, canvas.height);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 opacity-70"
    />
  );
};

export default AnimatedBackground;
