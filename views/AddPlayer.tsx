import React, { useState } from 'react';
import { UserPlus, Save } from 'lucide-react';
import { Button } from '../components/Button';
import { Player } from '../types';

interface AddPlayerProps {
  players: Player[];
  onAdd: (name: string) => void;
  onDone: () => void;
}

export const AddPlayer: React.FC<AddPlayerProps> = ({ players, onAdd, onDone }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    
    if (!trimmed) {
      setError('Player name cannot be empty');
      return;
    }

    if (players.some(p => p.fullName.toLowerCase() === trimmed.toLowerCase())) {
      setError('Player already exists');
      return;
    }

    onAdd(trimmed);
    setName('');
    setError('');
  };

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto w-full">
      <div className="bg-slate-900 rounded-2xl shadow-neon-blue border border-blue-500/30 p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border-2 border-blue-500 shadow-neon-blue">
             <UserPlus className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wider">NEW PLAYER</h2>
          <p className="text-slate-400 text-sm mt-1">Add to your master roster</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div>
            <label htmlFor="playerName" className="block text-sm font-bold text-blue-300 mb-2 uppercase tracking-wide">
              Full Name
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-4 rounded-xl bg-slate-950 border-2 ${error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'border-slate-700 focus:border-blue-500 focus:shadow-neon-blue'} text-white placeholder-slate-600 outline-none transition-all duration-200`}
              placeholder="e.g. MS Dhoni"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 font-medium flex items-center"><span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>{error}</p>}
          </div>

          <Button type="submit" fullWidth disabled={!name.trim()} className="py-4">
            <Save className="w-5 h-5 mr-2" />
            SAVE PLAYER
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center relative">
            <button 
                onClick={onDone}
                className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-wide transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};