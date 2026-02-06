import React, { useState, useEffect } from 'react';
import { X, Coins } from 'lucide-react';
import { Button } from './Button';

interface CoinTossProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinToss: React.FC<CoinTossProps> = ({ isOpen, onClose }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'Heads' | 'Tails' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setIsFlipping(false);
    }
  }, [isOpen]);

  const flipCoin = () => {
    setIsFlipping(true);
    setResult(null);
    
    // Simulate animation delay
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'Heads' : 'Tails';
      setResult(outcome);
      setIsFlipping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-yellow-500/20 w-full max-w-sm overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl relative z-10">
          <h3 className="text-lg font-bold text-yellow-500 flex items-center gap-2 uppercase tracking-wide drop-shadow-sm">
            <Coins className="w-5 h-5" />
            Coin Toss
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center min-h-[240px] relative z-10">
          {isFlipping ? (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-yellow-200 flex items-center justify-center mb-6 animate-spin shadow-[0_0_30px_rgba(234,179,8,0.6)]">
                <span className="text-3xl font-bold text-yellow-800">$</span>
              </div>
              <p className="text-lg font-bold text-yellow-200 tracking-wider">FLIPPING...</p>
            </div>
          ) : result ? (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
               <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 border-4 border-yellow-200 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(234,179,8,0.5)] transform hover:scale-105 transition-transform">
                <span className="text-3xl font-black text-yellow-900 uppercase drop-shadow-md">{result}</span>
              </div>
              <p className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">It's {result}!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center group cursor-pointer" onClick={flipCoin}>
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-6 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300">
                 <Coins className="w-12 h-12 text-slate-600 group-hover:text-yellow-500 transition-colors" />
              </div>
              <p className="text-slate-400 font-medium group-hover:text-yellow-200 transition-colors">Tap 'Flip Coin' to start</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3 relative z-10">
          <Button variant="outline" onClick={onClose} fullWidth className="border-slate-700 text-slate-400 hover:text-white hover:border-slate-500">Close</Button>
          <Button onClick={flipCoin} disabled={isFlipping} fullWidth className="bg-yellow-600 hover:bg-yellow-500 text-black border-none shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            {result ? 'Flip Again' : 'Flip Coin'}
          </Button>
        </div>
      </div>
    </div>
  );
};