export interface Player {
  id: string;
  fullName: string;
  isSelected?: boolean; // UI state helper
}

export interface GeneratedTeams {
  teamA: Player[];
  teamB: Player[];
  captainA: Player | null;
  captainB: Player | null;
  commonPlayer: Player | null;
  timestamp: number;
}

export interface MatchState {
  step: 'select-players' | 'select-captains' | 'view-teams';
  selectedPlayerIds: string[];
  captainAId: string | null;
  captainBId: string | null;
  lastGeneratedTeams: GeneratedTeams | null;
  tossResult: 'Heads' | 'Tails' | null;
}
