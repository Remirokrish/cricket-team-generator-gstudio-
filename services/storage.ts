import { Player } from '../types';

const STORAGE_KEY_PLAYERS = 'ctg_players';
const STORAGE_KEY_MATCH_STATE = 'ctg_match_state';

export const getStoredPlayers = (): Player[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load players', error);
    return [];
  }
};

export const savePlayer = (player: Player): Player[] => {
  const current = getStoredPlayers();
  const updated = [...current, player];
  localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(updated));
  return updated;
};

export const deletePlayer = (id: string): Player[] => {
  const current = getStoredPlayers();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(updated));
  return updated;
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY_PLAYERS);
  localStorage.removeItem(STORAGE_KEY_MATCH_STATE);
};
