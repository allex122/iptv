export interface StreamServer {
  id: string;
  name: string;
  url: string;
  type: 'hls' | 'iframe';
  isGlobal: boolean;
  status: 'ONLINE' | 'OFFLINE';
}

export interface Match {
  id: string;
  sport: string;       // e.g., "football", "basketball", "cricket", "wwe", "tennis"
  league: string;      // e.g., "Premier League", "NBA", "IPL", "WWE Raw"
  leagueBadge: string; // e.g., "🏆" or "🇬🇧"
  homeTeam: string;
  homeLogo: string;    // SVG or text abbreviation fallback
  awayTeam: string;
  awayLogo: string;    // SVG or text abbreviation fallback
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  time: string;        // e.g., "75'", "10:30 PM", "FT"
  date: string;        // ISO Date YYYY-MM-DD (e.g., "2026-06-29")
  scores?: {
    home: number;
    away: number;
  };
  venue: string;
  round: string;
  servers: StreamServer[];
}
