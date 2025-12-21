
import React, { useEffect, useRef, useState } from 'react';
import { Player } from '../types';

interface WheelProps {
  players: Player[];
  onFinished: (playerIndex: number) => void;
  isSpinning: boolean;
}

const COLORS = [
  '#f43f5e', '#3b82f6', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export const Wheel: React.FC<WheelProps> = ({ players, onFinished, isSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0);
  const spinningRef = useRef(false);
  const velocityRef = useRef(0);
  
  const drawWheel = (ctx: CanvasRenderingContext2D, currentAngle: number) => {
    const size = ctx.canvas.width;
    const center = size / 2;
    const radius = center - 10;
    const sliceAngle = (2 * Math.PI) / players.length;

    ctx.clearRect(0, 0, size, size);

    players.forEach((player, i) => {
      ctx.beginPath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, currentAngle + i * sliceAngle, currentAngle + (i + 1) * sliceAngle);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(currentAngle + i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px "Plus Jakarta Sans"';
      ctx.fillText(player.name, radius - 20, 5);
      ctx.restore();
    });

    // Center Hub
    ctx.beginPath();
    ctx.fillStyle = '#1e293b';
    ctx.arc(center, center, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize handling
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();
        const minDim = Math.min(rect.width, rect.height) * 0.9;
        canvas.width = minDim * dpr;
        canvas.height = minDim * dpr;
        canvas.style.width = `${minDim}px`;
        canvas.style.height = `${minDim}px`;
        ctx.scale(dpr, dpr);
        drawWheel(ctx, angle);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [players, angle]);

  useEffect(() => {
    if (isSpinning && !spinningRef.current) {
      spinningRef.current = true;
      velocityRef.current = 0.5 + Math.random() * 0.5;
      
      let lastTime = performance.now();
      const animate = (time: number) => {
        const delta = time - lastTime;
        lastTime = time;
        
        velocityRef.current *= 0.99; // Friction
        setAngle(prev => prev + velocityRef.current);
        
        if (velocityRef.current < 0.002) {
          spinningRef.current = false;
          // Calculate winner
          const normalizedAngle = (angle % (2 * Math.PI));
          const sliceAngle = (2 * Math.PI) / players.length;
          // Arrow points at 0 (3 o'clock position on circle)
          // We need to adjust based on circle start
          const winnerIndex = (players.length - Math.floor(normalizedAngle / sliceAngle)) % players.length;
          onFinished(winnerIndex);
        } else {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isSpinning]);

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-md mx-auto">
      <canvas ref={canvasRef} className="rounded-full shadow-2xl transition-transform" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white clip-path-arrow transform translate-x-2 drop-shadow-lg" 
           style={{ clipPath: 'polygon(100% 50%, 0 0, 0 100%)' }}></div>
    </div>
  );
};
