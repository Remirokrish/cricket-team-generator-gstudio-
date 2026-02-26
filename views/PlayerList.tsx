import React, { useMemo, useState } from 'react';
import { Trash2, Search, User, Edit2, Check, X } from 'lucide-react';
import { Player, PlayerRole } from '../types';

interface PlayerListProps {
  players: Player[];
  onDelete: (id: string) => void;
  onUpdate: (player: Player) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<PlayerRole | ''>('');

  const roles: PlayerRole[] = ['Batsman', 'Bowler', 'All-rounder'];

  const filteredPlayers = useMemo(() => {
    return players.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()));
  }, [players, search]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      onDelete(id);
    }
  };

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditRole(player.role || '');
  };

  const saveEdit = (player: Player) => {
    onUpdate({
      ...player,
      role: editRole || undefined
    });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto min-h-0 pb-4">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">ROSTER ({players.length})</h2>
        
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

        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden pb-24">
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
              {filteredPlayers.map((player) => {
                const isEditing = editingId === player.id;
                return (
                  <li key={player.id} className="flex flex-col p-4 hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-lg shadow-sm group-hover:border-blue-500 group-hover:text-blue-300 transition-colors">
                            {player.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-200 text-lg group-hover:text-white transition-colors">{player.fullName}</span>
                          {!isEditing && player.role && (
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{player.role}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button 
                              onClick={() => saveEdit(player)}
                              className="p-2 text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-all"
                              aria-label="Save role"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-all"
                              aria-label="Cancel editing"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditing(player)}
                              className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              aria-label="Edit role"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(player.id, player.fullName)}
                              className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              aria-label="Delete player"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="mt-4 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {roles.map((r) => (
                          <button
                            key={r}
                            onClick={() => setEditRole(editRole === r ? '' : r)}
                            className={`px-2 py-2 rounded-lg border text-[10px] font-bold transition-all ${
                              editRole === r
                                ? 'bg-blue-900/40 border-blue-500 text-blue-300'
                                : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                          >
                            {r.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;