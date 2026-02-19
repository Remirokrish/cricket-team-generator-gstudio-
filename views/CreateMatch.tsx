import React, { useState, useEffect } from 'react';
import { Check, Users, Shuffle, RefreshCw, Crown, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { Player, GeneratedTeams, MatchState } from '../types';
import { Button } from '../components/Button';
import { CoinToss } from '../components/CoinToss';

interface CreateMatchProps {
  players: Player[];
  onSaveState: (state: Partial<MatchState>) => void;
  initialState: MatchState;
}

export const CreateMatch: React.FC<CreateMatchProps> = ({ players, onSaveState, initialState }) => {
  const [step, setStep] = useState<MatchState['step']>(initialState.step);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialState.selectedPlayerIds));
  const [captainA, setCaptainA] = useState<string | null>(initialState.captainAId);
  const [captainB, setCaptainB] = useState<string | null>(initialState.captainBId);
  const [teams, setTeams] = useState<GeneratedTeams | null>(initialState.lastGeneratedTeams);
  const [showToss, setShowToss] = useState(false);

  useEffect(() => {
    // Sync state back to parent for persistence
    onSaveState({
      step,
      selectedPlayerIds: Array.from(selectedIds),
      captainAId: captainA,
      captainBId: captainB,
      lastGeneratedTeams: teams,
    });
  }, [step, selectedIds, captainA, captainB, teams, onSaveState]);

  // Step 1 Helpers
  const togglePlayer = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      // Deselect as captain if removed
      if (captainA === id) setCaptainA(null);
      if (captainB === id) setCaptainB(null);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === players.length) {
      setSelectedIds(new Set());
      setCaptainA(null);
      setCaptainB(null);
    } else {
      setSelectedIds(new Set(players.map(p => p.id)));
    }
  };

  // Step 3 Logic: Generate Teams
  const generateTeams = () => {
    if (!captainA || !captainB) return;

    const selectedPlayers = players.filter(p => selectedIds.has(p.id));
    // Exclude captains from pool
    const pool = selectedPlayers.filter(p => p.id !== captainA && p.id !== captainB);
    
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    
    let common: Player | null = null;
    
    // Handle odd number logic
    if (shuffled.length % 2 !== 0) {
        common = shuffled.pop() || null;
    }

    const mid = Math.floor(shuffled.length / 2);
    const poolA = shuffled.slice(0, mid);
    const poolB = shuffled.slice(mid);

    const capAObj = players.find(p => p.id === captainA) || null;
    const capBObj = players.find(p => p.id === captainB) || null;

    setTeams({
      teamA: capAObj ? [capAObj, ...poolA] : poolA,
      teamB: capBObj ? [capBObj, ...poolB] : poolB,
      captainA: capAObj,
      captainB: capBObj,
      commonPlayer: common,
      timestamp: Date.now()
    });

    setStep('view-teams');
  };

  // Render Steps
  if (step === 'select-players') {
    return (
      <div className="flex flex-col h-full bg-slate-950">
        <div className="p-4 bg-slate-900 shadow-lg sticky top-0 z-20 border-b border-blue-500/20">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-white tracking-wide">Select Players</h2>
            <span className="bg-blue-900/50 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold shadow-neon-blue">
              {selectedIds.size} Selected
            </span>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={toggleSelectAll} 
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
              >
                {selectedIds.size === players.length ? 'Deselect All' : 'Select All'}
              </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {players.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                <Users className="w-16 h-16 mb-4 text-slate-700 opacity-50"/>
                <p className="text-lg font-medium">No players in master list.</p>
                <p className="text-sm">Go to "Add Player" to get started.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
              {players.map(player => {
                const isSelected = selectedIds.has(player.id);
                return (
                  <div 
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none relative overflow-hidden group
                      ${isSelected 
                        ? 'bg-blue-900/20 border-blue-500 shadow-neon-blue' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'}
                    `}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-800'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`font-medium tracking-wide ${isSelected ? 'text-blue-200' : 'text-slate-300 group-hover:text-white'}`}>{player.fullName}</span>
                    {isSelected && <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky Footer - Always at bottom */}
        <div className="p-4 bg-slate-900/90 backdrop-blur-md border-t border-blue-500/20 sticky bottom-0 z-20">
           <Button 
             fullWidth 
             onClick={() => setStep('select-captains')}
             disabled={selectedIds.size < 2}
             className="shadow-neon-blue"
           >
             Next: Captains
             <ChevronRight className="w-4 h-4 ml-2" />
           </Button>
        </div>
      </div>
    );
  }

  if (step === 'select-captains') {
    const selectedList = players.filter(p => selectedIds.has(p.id));
    return (
      <div className="flex flex-col h-full bg-slate-950">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            <button 
                onClick={() => setStep('select-players')} 
                className="text-slate-400 hover:text-white flex items-center mb-6 text-sm font-medium transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1"/> Back to Players
            </button>

            <h2 className="text-2xl font-bold mb-8 text-white tracking-wider drop-shadow-lg text-center">
               CHOOSE <span className="text-blue-500">CAPTAINS</span>
            </h2>

            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-blue-500/30 space-y-8 relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative">
                    <label className="block text-sm font-bold text-blue-300 mb-2 flex items-center gap-2 uppercase tracking-wide">
                        <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-md" /> Captain Team A
                    </label>
                    <select 
                        value={captainA || ''} 
                        onChange={(e) => setCaptainA(e.target.value)}
                        className="w-full p-4 border-2 border-slate-700 bg-slate-950 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-inner"
                    >
                        <option value="" className="bg-slate-900">Select Captain A</option>
                        {selectedList.filter(p => p.id !== captainB).map(p => (
                            <option key={p.id} value={p.id} className="bg-slate-900">{p.fullName}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-center">
                    <div className="h-px bg-slate-700 w-full"></div>
                    <span className="px-4 text-slate-500 font-bold text-xs uppercase">VS</span>
                    <div className="h-px bg-slate-700 w-full"></div>
                </div>

                <div className="relative">
                    <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2 uppercase tracking-wide">
                        <Crown className="w-5 h-5 text-cyan-500 fill-cyan-500 drop-shadow-md" /> Captain Team B
                    </label>
                    <select 
                        value={captainB || ''} 
                        onChange={(e) => setCaptainB(e.target.value)}
                        className="w-full p-4 border-2 border-slate-700 bg-slate-950 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-inner"
                    >
                        <option value="" className="bg-slate-900">Select Captain B</option>
                        {selectedList.filter(p => p.id !== captainA).map(p => (
                            <option key={p.id} value={p.id} className="bg-slate-900">{p.fullName}</option>
                        ))}
                    </select>
                </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 backdrop-blur-md border-t border-blue-500/20 sticky bottom-0 z-20">
            <Button 
                fullWidth 
                onClick={generateTeams}
                disabled={!captainA || !captainB}
                className="py-4 text-lg shadow-neon-blue"
            >
                <Shuffle className="w-5 h-5 mr-2" />
                GENERATE TEAMS
            </Button>
        </div>
      </div>
    );
  }

  // View Teams
  if (step === 'view-teams' && teams) {
    return (
      <div className="flex flex-col h-full bg-slate-950">
         <div className="p-4 md:p-6 bg-slate-900 border-b border-blue-500/20 sticky top-0 z-20 flex justify-between items-center shadow-lg">
             <button onClick={() => setStep('select-captains')} className="text-slate-400 hover:text-white text-sm flex items-center font-medium transition-colors">
                 <ChevronLeft className="w-4 h-4 mr-1"/> Edit
             </button>
             <h2 className="font-bold text-white tracking-widest text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">MATCH TEAMS</h2>
             <button onClick={() => setShowToss(true)} className="text-sm font-bold text-yellow-400 bg-yellow-900/30 border border-yellow-500/30 px-3 py-1.5 rounded-full hover:bg-yellow-900/50 hover:shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all flex items-center">
                 <Crown className="w-4 h-4 mr-1" /> Toss
             </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {teams.commonPlayer && (
                <div className="bg-purple-900/30 border border-purple-500/50 p-3 rounded-lg flex items-center justify-center text-purple-200 text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Info className="w-4 h-4 mr-2 text-purple-400" />
                    Common Player: {teams.commonPlayer.fullName}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Team A */}
                <div className="bg-slate-900 rounded-2xl shadow-neon-blue border border-blue-500/50 overflow-hidden flex flex-col h-full relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
                    <div className="bg-blue-900/40 p-5 backdrop-blur-sm border-b border-blue-500/30 flex justify-between items-center">
                        <h3 className="font-black text-xl text-blue-100 tracking-wider italic">TEAM A</h3>
                        <span className="text-xs bg-blue-600/80 text-white px-3 py-1 rounded-full font-bold shadow-md">{teams.teamA.length} Players</span>
                    </div>
                    <ul className="divide-y divide-slate-800 p-2 flex-1 bg-slate-900/50">
                        {teams.teamA.map(p => (
                            <li key={p.id} className="p-3 flex items-center gap-3 hover:bg-white/5 rounded-lg transition-colors">
                                {p.id === teams.captainA?.id && <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 drop-shadow-md" />}
                                {p.id === teams.commonPlayer?.id && <span className="bg-purple-900 text-purple-300 border border-purple-500 text-[10px] uppercase font-bold px-1.5 rounded flex-shrink-0">Common</span>}
                                <span className={`${p.id === teams.captainA?.id ? "font-bold text-yellow-100" : "text-slate-300"} tracking-wide`}>{p.fullName}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Team B */}
                <div className="bg-slate-900 rounded-2xl shadow-neon-cyan border border-cyan-500/50 overflow-hidden flex flex-col h-full relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>
                    <div className="bg-cyan-900/40 p-5 backdrop-blur-sm border-b border-cyan-500/30 flex justify-between items-center">
                        <h3 className="font-black text-xl text-cyan-100 tracking-wider italic">TEAM B</h3>
                        <span className="text-xs bg-cyan-600/80 text-white px-3 py-1 rounded-full font-bold shadow-md">{teams.teamB.length} Players</span>
                    </div>
                    <ul className="divide-y divide-slate-800 p-2 flex-1 bg-slate-900/50">
                        {teams.teamB.map(p => (
                            <li key={p.id} className="p-3 flex items-center gap-3 hover:bg-white/5 rounded-lg transition-colors">
                                {p.id === teams.captainB?.id && <Crown className="w-4 h-4 text-cyan-400 fill-cyan-400 flex-shrink-0 drop-shadow-md" />}
                                {p.id === teams.commonPlayer?.id && <span className="bg-purple-900 text-purple-300 border border-purple-500 text-[10px] uppercase font-bold px-1.5 rounded flex-shrink-0">Common</span>}
                                <span className={`${p.id === teams.captainB?.id ? "font-bold text-cyan-100" : "text-slate-300"} tracking-wide`}>{p.fullName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
         </div>

         <div className="p-4 bg-slate-900/90 backdrop-blur-md border-t border-blue-500/20 sticky bottom-0 z-20">
             <Button variant="outline" fullWidth onClick={generateTeams} className="border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-white">
                 <RefreshCw className="w-4 h-4 mr-2" />
                 RESHUFFLE TEAMS
             </Button>
         </div>

         <CoinToss isOpen={showToss} onClose={() => setShowToss(false)} />
      </div>
    );
  }

  return null;
};