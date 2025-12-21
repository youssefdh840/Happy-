
import React, { useState } from 'react';
import { CardType, CardContent } from '../types';
import { CARD_STYLES } from '../constants';

interface GameCardProps {
  content: CardContent;
  onClose: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ content, onClose }) => {
  const [revealed, setRevealed] = useState(false);
  const style = CARD_STYLES[content.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm h-[500px] perspective-1000">
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d cursor-pointer ${revealed ? 'rotate-y-180' : ''}`}
             onClick={() => !revealed && setRevealed(true)}>
          
          {/* Front - Card Back Design */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-slate-800 rounded-[2.5rem] border-4 border-slate-700 shadow-2xl p-8">
            <div className={`w-24 h-24 rounded-full ${style.color} flex items-center justify-center text-5xl mb-6 shadow-xl`}>
              {style.icon}
            </div>
            <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2">
              {content.type}
            </h2>
            <p className="text-slate-400 text-center font-medium">Tap to reveal your destiny</p>
          </div>

          {/* Back - Card Front Design */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col bg-gradient-to-br ${style.gradient} rounded-[2.5rem] shadow-2xl p-10 overflow-hidden`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-6 bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                {style.icon}
              </span>
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">
                {content.title}
              </h3>
              <p className="text-xl font-medium text-white/90 leading-relaxed">
                {content.description}
              </p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="relative mt-auto w-full bg-white/20 hover:bg-white/30 text-white font-bold py-4 rounded-2xl backdrop-blur-md border border-white/30 transition-all"
            >
              NEXT ROUND
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
