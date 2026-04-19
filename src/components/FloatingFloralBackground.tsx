import React, { useMemo } from 'react';
import { motion } from 'motion/react';

const FlowerPetal = ({ color = 'currentColor' }: { color?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path
      d="M10 18C10 18 4 14 4 9C4 4 10 2 10 2C10 2 16 4 16 9C16 14 10 18 10 18Z"
      fill={color}
      fillOpacity="0.3"
    />
  </svg>
);

const Leaf = ({ color = 'currentColor' }: { color?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path
      d="M2 18C2 18 2 10 10 10C18 10 18 2 18 2C18 2 18 10 10 10C2 10 2 18 2 18Z"
      fill={color}
      fillOpacity="0.2"
    />
  </svg>
);

const DriftingElement = ({ children, delay, duration, startX, startY, endX, endY }: any) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      initial={{ 
        x: startX, 
        y: startY, 
        opacity: 0, 
        rotate: 0,
        scale: 0.5 
      }}
      animate={{ 
        x: endX, 
        y: endY, 
        opacity: [0, 0.15, 0.15, 0],
        rotate: 360,
        scale: [0.3, 0.6, 0.6, 0.3]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear"
      }}
      style={{ width: '60px', height: '60px' }}
    >
      {children}
    </motion.div>
  );
};

export const FloatingFloralBackground: React.FC = () => {
  const elements = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const type = i % 2 === 0 ? 'petal' : 'leaf';
      const duration = 20 + Math.random() * 20;
      const delay = Math.random() * -40; // Negative delay to start at different points
      
      // Start/End points (randomized but generally drifting across)
      const startX = Math.random() * 100 + 'vw';
      const startY = '-10vh';
      const endX = (Math.random() * 100 - 20) + 'vw';
      const endY = '110vh';

      return (
        <DriftingElement 
          key={i}
          delay={delay}
          duration={duration}
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
        >
          {type === 'petal' ? <FlowerPetal color="#8B8D72" /> : <Leaf color="#A2A584" />}
        </DriftingElement>
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
      {elements}
    </div>
  );
};
