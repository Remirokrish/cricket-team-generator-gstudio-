import React, { useMemo, useState } from 'react';
import { Trash2, Search, User } from 'lucide-react';
import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onDelete: (id: string) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, onDelete }) => {
  const [search, setSearch] = useState('');

  const filteredPlayers = useMemo(() => {
    return players.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()));
  }, [players, search]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto min-h-0">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">ROSTER ({players.length})</h2>
        
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search players..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-600 outline-none shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden mb-8">
          {players.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <User className="w-16 h-16 mx-auto text-slate-700 mb-4 opacity-50" />
              <p className="text-lg">No players added yet.</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p>No players found matching "{search}".</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {filteredPlayers.map((player) => (
                <li key={player.id} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-lg shadow-sm group-hover:border-blue-500 group-hover:text-blue-300 transition-colors">
                        {player.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-200 text-lg group-hover:text-white transition-colors">{player.fullName}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(player.id, player.fullName)}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Delete player"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};