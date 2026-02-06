import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { PlayerList } from './views/PlayerList';
import { AddPlayer } from './views/AddPlayer';
import { CreateMatch } from './views/CreateMatch';
import { Player, MatchState } from './types';
import { getStoredPlayers, savePlayer, deletePlayer, clearAllData } from './services/storage';

type View = 'create-match' | 'add-player' | 'player-list';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('create-match');
  const [players, setPlayers] = useState<Player[]>([]);
  
  // Persist match state so users don't lose progress if they navigate to "Add Player"
  const [matchState, setMatchState] = useState<MatchState>({
    step: 'select-players',
    selectedPlayerIds: [],
    captainAId: null,
    captainBId: null,
    lastGeneratedTeams: null,
    tossResult: null
  });

  // Load initial data
  useEffect(() => {
    setPlayers(getStoredPlayers());
  }, []);

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      fullName: name
    };
    const updated = savePlayer(newPlayer);
    setPlayers(updated);
    // Optionally alert user or just navigation happens
    alert('Player added successfully!');
  };

  const handleDeletePlayer = (id: string) => {
    const updated = deletePlayer(id);
    setPlayers(updated);
    
    // Also remove from match selection if present
    setMatchState(prev => ({
        ...prev,
        selectedPlayerIds: prev.selectedPlayerIds.filter(pid => pid !== id),
        captainAId: prev.captainAId === id ? null : prev.captainAId,
        captainBId: prev.captainBId === id ? null : prev.captainBId,
    }));
  };

  const handleResetAll = () => {
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
        />
      )}
    </Layout>
  );
};

export default App;
