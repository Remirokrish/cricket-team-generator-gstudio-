import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import PlayerList from './views/PlayerList';
import AddPlayer from './views/AddPlayer';
import CreateMatch from './views/CreateMatch';
import { Player, MatchState, PlayerRole } from './types';
import { getStoredPlayers, savePlayer, deletePlayer, clearAllData, updatePlayer } from './services/storage';

type View = 'create-match' | 'add-player' | 'player-list';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('create-match');
  const [players, setPlayers] = useState<Player[]>([]);
  
  const [matchState, setMatchState] = useState<MatchState>({
    step: 'select-players',
    selectedPlayerIds: [],
    captainAId: null,
    captainBId: null,
    lastGeneratedTeams: null,
    tossResult: null
  });

  useEffect(() => {
    setPlayers(getStoredPlayers());
  }, []);

  const handleAddPlayer = (name: string, role?: PlayerRole) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      fullName: name,
      role
    };
    const updated = savePlayer(newPlayer);
    setPlayers(updated);
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    const updated = updatePlayer(updatedPlayer);
    setPlayers(updated);
  };

  const handleDeletePlayer = (id: string) => {
    const updated = deletePlayer(id);
    setPlayers(updated);
    
    setMatchState(prev => ({
        ...prev,
        selectedPlayerIds: prev.selectedPlayerIds.filter(pid => pid !== id),
        captainAId: prev.captainAId === id ? null : prev.captainAId,
        captainBId: prev.captainBId === id ? null : prev.captainBId,
    }));
  };

  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset all data? This will delete all players and match history.")) {
      clearAllData();
      setPlayers([]);
      setMatchState({
          step: 'select-players',
          selectedPlayerIds: [],
          captainAId: null,
          captainBId: null,
          lastGeneratedTeams: null,
          tossResult: null
      });
      setCurrentView('create-match');
    }
  };

  const handleMatchStateChange = useCallback((newState: Partial<MatchState>) => {
    setMatchState(prev => ({ ...prev, ...newState }));
  }, []);

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView} 
      onReset={handleResetAll}
    >
      {currentView === 'create-match' && (
        <CreateMatch 
          players={players} 
          initialState={matchState}
          onSaveState={handleMatchStateChange}
        />
      )}
      
      {currentView === 'add-player' && (
        <AddPlayer 
          players={players} 
          onAdd={handleAddPlayer} 
          onDone={() => setCurrentView('create-match')}
        />
      )}
      
      {currentView === 'player-list' && (
        <PlayerList 
          players={players} 
          onDelete={handleDeletePlayer} 
          onUpdate={handleUpdatePlayer}
        />
      )}
    </Layout>
  );
};

export default App;