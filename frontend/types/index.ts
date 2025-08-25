export interface Team {
  teamId: number;
  name: string;
  short_name: string;
  players?: Player[];
}

export interface Player {
  playerId: number;
  name: string;
  short_name: string;
  role: string;
  teams: Team[];
}

export interface Toss {
  winner: Team;
  decision: string;
}

export interface Match {
  matchId: number;
  teams: Team[];
  toss: Toss;
  status: string;
}

export interface Commentary {
  commentaryId: number;
  match: Match;
  team: Team;
  striker: Player;
  non_striker: Player;
  bowler: Player;
  inning: number;
  over: number;
  ball: number;
  eventType: string;
}

export interface MatchDetail {
  match: Match;
  commentaries: Commentary[];
}

export interface ServerToClientEvents {
  "new-commentary": (commentary: Commentary) => void;
  "update-match": (match: Match) => void;
}

export interface ClientToServerEvents {
  "subscribe-to-match": (matchId: string) => void;
}