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

const CreateMatch: React.FC<CreateMatchProps> = ({ players, onSaveState, initialState }) => {
  const [step, setStep] = useState<MatchState['step']>(initialState.step);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialState.selectedPlayerIds));
  const [captainA, setCaptainA] = useState<string | null>(initialState.captainAId);
  const [captainB, setCaptainB] = useState<string | null>(initialState.captainBId);
  const [teams, setTeams] = useState<GeneratedTeams | null>(initialState.lastGeneratedTeams);
  const [showToss, setShowToss] = useState(false);

  useEffect(() => {
    onSaveState({
      step,
      selectedPlayerIds: Array.from(selectedIds),
      captainAId: captainA,
      captainBId: captainB,
      lastGeneratedTeams: teams,
    });
  }, [step, selectedIds, captainA, captainB, teams, onSaveState]);

  const togglePlayer = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
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

  const generateTeams = () => {
    if (!captainA || !captainB) return;

    const selectedPlayers = players.filter(p => selectedIds.has(p.id));
    const pool = selectedPlayers.filter(p => p.id !== captainA && p.id !== captainB);
    
    // Group players by role
    const batsmen = pool.filter(p => p.role === 'Batsman').sort(() => Math.random() - 0.5);
    const bowlers = pool.filter(p => p.role === 'Bowler').sort(() => Math.random() - 0.5);
    const allrounders = pool.filter(p => p.role === 'All-rounder').sort(() => Math.random() - 0.5);
    const noRole = pool.filter(p => !p.role).sort(() => Math.random() - 0.5);

    const teamAPlayers: Player[] = [];
    const teamBPlayers: Player[] = [];

    // Distribute players while maintaining equal team sizes and role balance
    const allRoleGroups = [batsmen, bowlers, allrounders, noRole];
    
    allRoleGroups.forEach(roleGroup => {
      roleGroup.forEach((player, index) => {
        // Alternate players to keep teams balanced
        if (teamAPlayers.length <= teamBPlayers.length) {
          teamAPlayers.push(player);
        } else {
          teamBPlayers.push(player);
        }
      });
    });

    let common: Player | null = null;
    // If teams are unequal, move the last player from the larger team to common
    if (teamAPlayers.length > teamBPlayers.length) {
      common = teamAPlayers.pop() || null;
    } else if (teamBPlayers.length > teamAPlayers.length) {
      common = teamBPlayers.pop() || null;
    }

    const capAObj = players.find(p => p.id === captainA) || null;
    const capBObj = players.find(p => p.id === captainB) || null;

    setTeams({
      teamA: capAObj ? [capAObj, ...teamAPlayers] : teamAPlayers,
      teamB: capBObj ? [capBObj, ...teamBPlayers] : teamBPlayers,
      captainA: capAObj,
      captainB: capBObj,
      commonPlayer: common,
      timestamp: Date.now()
    });

    setStep('view-teams');
  };

  if (step === 'select-players') {
    return (
      <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
        <div className="flex-none p-4 bg-slate-900 shadow-lg border-b border-blue-500/20 z-20">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-white tracking-wide">Select Players</h2>
            <span className="bg-blue-900/50 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold shadow-neon-blue">
              {selectedIds.size} Selected
            </span>
          </div>
          <button 
            onClick={toggleSelectAll} 
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
          >
            {selectedIds.size === players.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 no-scrollbar">
          {players.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                <Users className="w-16 h-16 mb-4 text-slate-700 opacity-50"/>
                <p className="text-lg font-medium">No players in master list.</p>
                <p className="text-sm">Go to "Add Player" to get started.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-24">
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
                    <div className="flex flex-col">
                      <span className={`font-medium tracking-wide ${isSelected ? 'text-blue-200' : 'text-slate-300 group-hover:text-white'}`}>{player.fullName}</span>
                      {player.role && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-400' : 'text-slate-500'}`}>
                          {player.role}
                        </span>
                      )}
                    </div>
                    {isSelected && <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-none px-4 py-3 md:py-4 bg-slate-900/95 backdrop-blur-md border-t border-blue-500/20 z-50 fixed bottom-0 left-0 right-0 safe-area-inset-bottom">
           <Button 
             fullWidth 
             onClick={() => setStep('select-captains')}
             disabled={selectedIds.size < 2}
             className="shadow-neon-blue py-3 md:py-4 text-base md:text-lg"
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
      <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 pb-24">
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

            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-blue-500/30 space-y-8 relative overflow-hidden mb-10">
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
                        <option value="" className="bg-slate-900 text-slate-500">Select Captain A</option>
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
                        <option value="" className="bg-slate-900 text-slate-500">Select Captain B</option>
                        {selectedList.filter(p => p.id !== captainA).map(p => (
                            <option key={p.id} value={p.id} className="bg-slate-900">{p.fullName}</option>
                        ))}
                    </select>
                </div>
            </div>
          </div>
        </div>

        <div className="flex-none px-4 py-3 md:py-4 bg-slate-900/95 backdrop-blur-md border-t border-blue-500/20 z-50 fixed bottom-0 left-0 right-0 safe-area-inset-bottom">
            <Button 
                fullWidth 
                onClick={generateTeams}
                disabled={!captainA || !captainB}
                className="py-3 md:py-4 text-base md:text-lg shadow-neon-blue"
            >
                <Shuffle className="w-5 h-5 mr-2" />
                GENERATE TEAMS
            </Button>
        </div>
      </div>
    );
  }

  if (step === 'view-teams' && teams) {
    return (
      <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
         <div className="flex-none p-4 md:p-6 bg-slate-900 border-b border-blue-500/20 sticky top-0 z-20 flex justify-between items-center shadow-lg">
             <button onClick={() => setStep('select-captains')} className="text-slate-400 hover:text-white text-sm flex items-center font-medium transition-colors">
                 <ChevronLeft className="w-4 h-4 mr-1"/> Edit
             </button>
             <h2 className="font-bold text-white tracking-widest text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">MATCH TEAMS</h2>
             <button onClick={() => setShowToss(true)} className="text-sm font-bold text-yellow-400 bg-yellow-900/30 border border-yellow-500/30 px-3 py-1.5 rounded-full hover:bg-yellow-900/50 hover:shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all flex items-center">
                 <Crown className="w-4 h-4 mr-1" /> Toss
             </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 min-h-0">
            {teams.commonPlayer && (
                <div className="bg-purple-900/30 border border-purple-500/50 p-3 rounded-lg flex items-center justify-center text-purple-200 text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Info className="w-4 h-4 mr-2 text-purple-400" />
                    Common Player: {teams.commonPlayer.fullName}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 pb-20 md:pb-6">
                <div className="bg-slate-900 rounded-2xl shadow-neon-blue border border-blue-500/50 overflow-hidden flex flex-col h-full relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
                    <div className="bg-blue-900/40 p-5 backdrop-blur-sm border-b border-blue-500/30">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-black text-xl text-blue-100 tracking-wider italic uppercase">TEAM A</h3>
                          <span className="text-xs bg-blue-600/80 text-white px-3 py-1 rounded-full font-bold shadow-md">{teams.teamA.length} Players</span>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold">
                          <span className="bg-blue-900/60 text-blue-300 px-2 py-1 rounded">
                            🏏 {teams.teamA.filter(p => p.role === 'Batsman').length} Batsmen
                          </span>
                          <span className="bg-blue-900/60 text-blue-300 px-2 py-1 rounded">
                            ⚾ {teams.teamA.filter(p => p.role === 'Bowler').length} Bowlers
                          </span>
                          <span className="bg-blue-900/60 text-blue-300 px-2 py-1 rounded">
                            🌟 {teams.teamA.filter(p => p.role === 'All-rounder').length} All-rounders
                          </span>
                        </div>
                    </div>
                    <ul className="divide-y divide-slate-800 p-2 flex-1 bg-slate-900/50">
                        {teams.teamA.map(p => (
                            <li key={p.id} className="p-3 flex items-center justify-between hover:bg-white/5 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    {p.id === teams.captainA?.id && <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 drop-shadow-md" />}
                                    {p.id === teams.commonPlayer?.id && <span className="bg-purple-900 text-purple-300 border border-purple-500 text-[10px] uppercase font-bold px-1.5 rounded flex-shrink-0">Common</span>}
                                    <span className={`${p.id === teams.captainA?.id ? "font-bold text-yellow-100" : "text-slate-300"} tracking-wide`}>{p.fullName}</span>
                                </div>
                                {p.role && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider opacity-60">{p.role}</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-900 rounded-2xl shadow-neon-cyan border border-cyan-500/50 overflow-hidden flex flex-col h-full relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>
                    <div className="bg-cyan-900/40 p-5 backdrop-blur-sm border-b border-cyan-500/30">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-black text-xl text-cyan-100 tracking-wider italic uppercase">TEAM B</h3>
                          <span className="text-xs bg-cyan-600/80 text-white px-3 py-1 rounded-full font-bold shadow-md">{teams.teamB.length} Players</span>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold">
                          <span className="bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded">
                            🏏 {teams.teamB.filter(p => p.role === 'Batsman').length} Batsmen
                          </span>
                          <span className="bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded">
                            ⚾ {teams.teamB.filter(p => p.role === 'Bowler').length} Bowlers
                          </span>
                          <span className="bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded">
                            🌟 {teams.teamB.filter(p => p.role === 'All-rounder').length} All-rounders
                          </span>
                        </div>
                    </div>
                    <ul className="divide-y divide-slate-800 p-2 flex-1 bg-slate-900/50">
                        {teams.teamB.map(p => (
                            <li key={p.id} className="p-3 flex items-center justify-between hover:bg-white/5 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    {p.id === teams.captainB?.id && <Crown className="w-4 h-4 text-cyan-400 fill-cyan-400 flex-shrink-0 drop-shadow-md" />}
                                    {p.id === teams.commonPlayer?.id && <span className="bg-purple-900 text-purple-300 border border-purple-500 text-[10px] uppercase font-bold px-1.5 rounded flex-shrink-0">Common</span>}
                                    <span className={`${p.id === teams.captainB?.id ? "font-bold text-cyan-100" : "text-slate-300"} tracking-wide`}>{p.fullName}</span>
                                </div>
                                {p.role && <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider opacity-60">{p.role}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
         </div>

         <div className="flex-none px-4 py-3 md:py-4 bg-slate-900/95 backdrop-blur-md border-t border-blue-500/20 z-50 fixed bottom-0 left-0 right-0 safe-area-inset-bottom">
             <Button variant="outline" fullWidth onClick={generateTeams} className="border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-white py-3 md:py-4">
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

export default CreateMatch;