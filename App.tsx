
import React, { useState, useEffect, useCallback } from 'react';
import { Player, Intensity, GameMode, CardType, GameState, CardContent, Difficulty } from './types';
import { PlayerSetup } from './components/PlayerSetup';
import { Wheel } from './components/Wheel';
import { GameCard } from './components/GameCard';
import { Settings } from './components/Settings';
import { FALLBACK_CARDS, CARD_STYLES } from './constants';
import { generateCardPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(() => {
    const savedTheme = localStorage.getItem('spin_reveal_theme');
    const isDarkMode = savedTheme ? JSON.parse(savedTheme) : true;
    
    return {
      players: [],
      selectedIntensity: Intensity.CASUAL,
      selectedDifficulty: Difficulty.EASY,
      currentPlayerIndex: null,
      history: [],
      mode: GameMode.SETUP,
      language: 'en',
      useAI: true,
      isDarkMode
    };
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [activeCard, setActiveCard] = useState<CardContent | null>(null);
  const [loadingCard, setLoadingCard] = useState(false);
  const [lastMode, setLastMode] = useState<GameMode>(GameMode.SETUP);

  useEffect(() => {
    localStorage.setItem('spin_reveal_theme', JSON.stringify(state.isDarkMode));
  }, [state.isDarkMode]);

  const handleStart = (players: Player[], intensity: Intensity) => {
    setState(prev => ({
      ...prev,
      players,
      selectedIntensity: intensity,
      mode: GameMode.SPINNING
    }));
  };

  const onSpinFinished = (index: number) => {
    setIsSpinning(false);
    setState(prev => ({
      ...prev,
      currentPlayerIndex: index,
      mode: GameMode.CATEGORY_SELECT
    }));
  };

  const selectCategory = async (type: CardType) => {
    if (state.currentPlayerIndex === null) return;
    
    setLoadingCard(true);
    const selectedPlayer = state.players[state.currentPlayerIndex];
    
    let content: CardContent;
    
    if (state.useAI) {
      const aiResult = await generateCardPrompt(
        type, 
        state.selectedIntensity,
        state.selectedDifficulty,
        selectedPlayer, 
        state.players,
        state.language
      );
      if (aiResult) {
        content = { type, difficulty: state.selectedDifficulty, ...aiResult };
      } else {
        content = getFallback(type);
      }
    } else {
      content = getFallback(type);
    }

    setActiveCard(content);
    setLoadingCard(false);
    setState(prev => ({ ...prev, mode: GameMode.REVEAL }));
  };

  const getFallback = (type: CardType): CardContent => {
    const diffPool = FALLBACK_CARDS[state.selectedDifficulty] || FALLBACK_CARDS[Difficulty.EASY];
    const pool = diffPool[state.selectedIntensity][type];
    const text = pool[Math.floor(Math.random() * pool.length)];
    return {
      type,
      title: type,
      description: text,
      difficulty: state.selectedDifficulty
    };
  };

  const openSettings = () => {
    setLastMode(state.mode);
    setState(prev => ({ ...prev, mode: GameMode.SETTINGS }));
  };

  const updateSettings = (updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const themeClasses = state.isDarkMode 
    ? "bg-slate-950 text-white" 
    : "bg-slate-50 text-slate-900";

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden relative p-4 sm:p-8 transition-colors duration-500 ${themeClasses}`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${state.isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${state.isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'}`}></div>
      </div>

      {state.mode === GameMode.SETTINGS && (
        <Settings 
          state={state} 
          onUpdate={updateSettings} 
          onClose={() => setState(prev => ({ ...prev, mode: lastMode }))} 
        />
      )}

      {state.mode === GameMode.SETUP && (
        <PlayerSetup onStart={handleStart} isDarkMode={state.isDarkMode} />
      )}

      {(state.mode === GameMode.SPINNING || state.mode === GameMode.CATEGORY_SELECT) && (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          <header className="relative flex items-center justify-between mb-10 w-full px-4">
            <div className="w-10"></div>
            <div className="text-center">
              <h1 className={`text-3xl bangers tracking-widest ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                SPIN & REVEAL
              </h1>
              <p className={`${state.isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-bold uppercase text-[10px] tracking-tighter`}>
                Intensity: <span className="text-emerald-500">{state.selectedIntensity}</span> | Mode: <span className="text-emerald-500">{state.selectedDifficulty}</span> | AI: <span className={state.useAI ? 'text-emerald-500' : 'text-rose-500'}>{state.useAI ? 'ON' : 'OFF'}</span>
              </p>
            </div>
            <button 
              onClick={openSettings}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-lg active:scale-90 ${state.isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM227,152.05l-20,3.31a88,88,0,0,1-13.84,33.43l11,17a12,12,0,0,1-1.78,15l-19.14,19.14a12,12,0,0,1-15,1.78l-17-11a88,88,0,0,1-33.43,13.84l-3.31,20a12,12,0,0,1-11.85,10H79.35a12,12,0,0,1-11.85-10l-3.31-20a88,88,0,0,1-33.43-13.84l-17,11a12,12,0,0,1-15-1.78L-10.39,219.86a12,12,0,0,1-1.78-15l11-17A88,88,0,0,1-15,154.43l-20-3.31a12,12,0,0,1-10-11.85V112.72a12,12,0,0,1,10-11.85l20-3.31a88,88,0,0,1,13.84-33.43l-11-17a12,12,0,0,1,1.78-15l19.14-19.14a12,12,0,0,1,15-1.78l17,11a88,88,0,0,1,33.43-13.84l3.31-20a12,12,0,0,1,11.85-10h24.65a12,12,0,0,1,11.85,10l3.31,20a88,88,0,0,1,33.43,13.84l17-11a12,12,0,0,1,15,1.78l19.14,19.14a12,12,0,0,1,1.78,15l-11,17A88,88,0,0,1,215,101.57l20,3.31a12,12,0,0,1,10,11.85v23.47A12,12,0,0,1,227,152.05Z" opacity="0.2"></path><path d="M239.11,108l-23.71-3.95A79.52,79.52,0,0,0,203,76.51l13-20a16,16,0,0,0-2.37-20l-19.14-19.14a16,16,0,0,0-20-2.37l-20,13A79.52,79.52,0,0,0,128.32,16.89L124.37-6.82A16,16,0,0,0,108.52-20.82H83.87a16,16,0,0,0-15.85,14L64.07,16.89A79.52,79.52,0,0,0,36.51,29.89l-20-13a16,16,0,0,0-20,2.37L-22.63,38.4a16,16,0,0,0-2.37,20l13,20A79.52,79.52,0,0,0-25,108.43l-23.71,4a16,16,0,0,0-14,15.85v24.65a16,16,0,0,0,14,15.85l23.71,4A79.52,79.52,0,0,0-12,203l-13,20a16,16,0,0,0,2.37,20l19.14,19.14a16,16,0,0,0,20,2.37l20-13a79.52,79.52,0,0,0,27.56,13l3.95,23.71a16,16,0,0,0,15.85,14h24.65a16,16,0,0,0,15.85-14l3.95-23.71A79.52,79.52,0,0,0,176,252.63l20,13a16,16,0,0,0,20-2.37l19.14-19.14a16,16,0,0,0,2.37-20l-13-20a79.52,79.52,0,0,0,13-27.56l23.71-4a16,16,0,0,0,14-15.85V123.85A16,16,0,0,0,239.11,108ZM236,148.5,212.29,152.46a8,8,0,0,0-6.52,6.52,95.5,95.5,0,0,1-15.06,36.33,8,8,0,0,0,1,9.08l13.11,20.21L185.64,243.78,165.43,230.67a8,8,0,0,0-9.08-1,95.5,95.5,0,0,1-36.33,15.06,8,8,0,0,0-6.52,6.52L109.54,275H82.85l-4-23.71a8,8,0,0,0-6.52-6.52,95.5,95.5,0,0,1-36.33-15.06,8,8,0,0,0-9.08,1L2.73,243.78-16.41,224.64l13.11-20.21a8,8,0,0,0,1-9.08A95.5,95.5,0,0,1-17.36,159a8,8,0,0,0-6.52-6.52L-47.59,148.5V121.8l23.71-4a8,8,0,0,0,6.52-6.52,95.5,95.5,0,0,1,15.06-36.33,8,8,0,0,0-1-9.08L-16.41,45.65,2.73,26.51l20.21,13.11a8,8,0,0,0,9.08-1,95.5,95.5,0,0,1,36.33-15.06,8,8,0,0,0,6.52-6.52L78.83-6.68h26.69l4,23.71a8,8,0,0,0,6.52,6.52,95.5,95.5,0,0,1,36.33,15.06,8,8,0,0,0,9.08-1l20.21-13.11,19.14,19.14-13.11,20.21a8,8,0,0,0-1,9.08,95.5,95.5,0,0,1,15.06,36.33,8,8,0,0,0,6.52,6.52l23.71,4ZM128.32,88.39a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128.32,88.39Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128.32,184.39Z"></path></svg>
            </button>
          </header>

          <div className="flex-1 flex flex-col justify-center gap-12">
            {state.mode === GameMode.SPINNING && (
              <div className="flex flex-col items-center">
                <Wheel 
                  players={state.players} 
                  isSpinning={isSpinning} 
                  onFinished={onSpinFinished} 
                />
                <button
                  disabled={isSpinning}
                  onClick={() => setIsSpinning(true)}
                  className={`mt-12 px-12 py-5 rounded-full bangers text-3xl tracking-widest shadow-2xl transition-all ${
                    isSpinning 
                      ? 'bg-slate-800 text-slate-500' 
                      : (state.isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') + ' hover:scale-105 active:scale-95'
                  }`}
                >
                  {isSpinning ? 'SPINNING...' : 'TAP TO SPIN'}
                </button>
              </div>
            )}

            {state.mode === GameMode.CATEGORY_SELECT && state.currentPlayerIndex !== null && (
              <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center px-4">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold shadow-emerald-500/50 shadow-2xl mb-4 text-white">
                    {state.players[state.currentPlayerIndex].name.charAt(0)}
                  </div>
                  <h2 className={`text-4xl font-black mb-2 ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {state.players[state.currentPlayerIndex].name}
                  </h2>
                  <p className={`${state.isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-bold uppercase tracking-widest text-sm`}>Choose Your Challenge</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {(Object.keys(CARD_STYLES) as CardType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => !loadingCard && selectCategory(type)}
                      className={`group relative overflow-hidden p-6 rounded-3xl transition-all border-2 border-transparent hover:border-white/20 active:scale-95 flex flex-col items-center ${CARD_STYLES[type].color}`}
                    >
                      <span className="text-4xl mb-2 drop-shadow-lg group-hover:scale-110 transition-transform">{CARD_STYLES[type].icon}</span>
                      <span className="font-black text-white text-lg">{type}</span>
                      {loadingCard && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-10">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {state.mode === GameMode.REVEAL && activeCard && (
        <GameCard 
          content={activeCard} 
          onClose={() => {
            setActiveCard(null);
            setState(prev => ({ ...prev, mode: GameMode.SPINNING }));
          }} 
        />
      )}

      {/* Footer controls */}
      {state.mode !== GameMode.SETUP && state.mode !== GameMode.SETTINGS && (
        <div className="mt-auto flex justify-center py-4">
          <button 
            onClick={() => setState(prev => ({ ...prev, mode: GameMode.SETUP }))}
            className={`${state.isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'} font-bold text-xs uppercase tracking-widest flex items-center gap-2`}
          >
            ← Reset Players
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
