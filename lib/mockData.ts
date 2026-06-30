import { Match, StreamServer } from '../types/match';

export const liveMatchStreams: StreamServer[] = [
  // Prioritized T Sports HD as Server 1 (Default loaded source)
  {
    id: "local-tsports-1",
    name: "Server 1 - T Sports HD (Subcontinent Server)",
    url: "http://10.45.45.254:8082/T-SPORTS-HD/tracks-v1a1/mono.m3u8?token=95956d581dd92f6c0c316a175507b966d19515e7-5a84e0a8c786f1a966e53be8e0ed09c6-1782770269-1782759469",
    type: "hls",
    isGlobal: false,
    status: "ONLINE"
  },
  {
    id: "secure-sony-2",
    name: "Server 2 - Sony Sports 1 (Global HD)",
    url: "https://vcp.myplaytv.com/sonysports1/mono.m3u8",
    type: "hls",
    isGlobal: true,
    status: "ONLINE"
  },
  {
    id: "secure-star-3",
    name: "Server 3 - Star Sports Select 1 (Global)",
    url: "https://bpprod6linear.akamaized.net/bpk-tv/irdeto_com_Channel_255/index.m3u8",
    type: "hls",
    isGlobal: true,
    status: "ONLINE"
  },
  {
    id: "secure-cbc-4",
    name: "Server 4 - CBC Sport HD (UCL Feed)",
    url: "https://mn-nl.mncdn.com/cbcsports_live/cbcsports/playlist.m3u8",
    type: "hls",
    isGlobal: true,
    status: "ONLINE"
  },
  {
    id: "secure-cctv-5",
    name: "Server 5 - CCTV-5 HD (World Cup Feed)",
    url: "https://node1.olelive.com:6443/live/CCTV5HD/hls.m3u8",
    type: "hls",
    isGlobal: true,
    status: "ONLINE"
  },
  {
    id: "secure-orf-6",
    name: "Server 6 - ORF Sport + (Europe HD)",
    url: "https://orfs.mdn.ors.at/out/u/orfs/q8c/manifest.m3u8",
    type: "hls",
    isGlobal: true,
    status: "ONLINE"
  },
  {
    id: "secure-iframe-backup-7",
    name: "Server 7 - Backup Livescore Feed (Iframe)",
    url: "https://www.scorebat.com/embed/livescore/",
    type: "iframe",
    isGlobal: true,
    status: "ONLINE"
  },
  {
    id: "global-hd-8",
    name: "Server 8 - Global High-Speed Feed (Recommended)",
    url: "http://198.195.239.50:8095/somoyTv/tracks-v1a1/mono.m3u8",
    type: "hls",
    isGlobal: true,
    status: "ONLINE"
  },
  {
    id: "global-fifa-9",
    name: "Server 9 - FIFA Arena Direct Stream",
    url: "http://198.195.239.50:8095/Fifa-1/video.m3u8",
    type: "hls",
    isGlobal: true,
    status: "ONLINE"
  }
];

export const mockMatches: Match[] = [
  // FOOTBALL MATCHES
  {
    id: 'fifa-2026-final',
    sport: 'football',
    league: 'FIFA World Cup 2026',
    leagueBadge: '🏆',
    homeTeam: 'Argentina',
    homeLogo: 'ARG',
    awayTeam: 'Brazil',
    awayLogo: 'BRA',
    status: 'LIVE',
    time: '88\'',
    date: '2026-06-29',
    scores: { home: 2, away: 1 },
    venue: 'MetLife Stadium, New York/New Jersey',
    round: 'Final',
    servers: liveMatchStreams
  },
  {
    id: 'fifa-2026-semi1',
    sport: 'football',
    league: 'FIFA World Cup 2026',
    leagueBadge: '🏆',
    homeTeam: 'France',
    homeLogo: 'FRA',
    awayTeam: 'Spain',
    awayLogo: 'ESP',
    status: 'LIVE',
    time: '12\'',
    date: '2026-06-29',
    scores: { home: 0, away: 0 },
    venue: 'AT&T Stadium, Dallas',
    round: 'Semi-Finals',
    servers: liveMatchStreams
  },
  {
    id: 'fifa-2026-semi2',
    sport: 'football',
    league: 'FIFA World Cup 2026',
    leagueBadge: '🏆',
    homeTeam: 'England',
    homeLogo: 'ENG',
    awayTeam: 'Portugal',
    awayLogo: 'POR',
    status: 'UPCOMING',
    time: '09:00 PM',
    date: '2026-06-29',
    venue: 'Mercedes-Benz Stadium, Atlanta',
    round: 'Semi-Finals',
    servers: liveMatchStreams
  },
  {
    id: 'f1',
    sport: 'football',
    league: 'UEFA Champions League',
    leagueBadge: '🏆',
    homeTeam: 'Real Madrid',
    homeLogo: 'RM',
    awayTeam: 'Manchester City',
    awayLogo: 'MC',
    status: 'LIVE',
    time: '78\'',
    date: '2026-06-29',
    scores: { home: 2, away: 1 },
    venue: 'Santiago Bernabéu, Madrid',
    round: 'Semi-Finals - Leg 2',
    servers: liveMatchStreams
  },
  {
    id: 'f2',
    sport: 'football',
    league: 'Premier League',
    leagueBadge: '⚽',
    homeTeam: 'Arsenal',
    homeLogo: 'ARS',
    awayTeam: 'Chelsea',
    awayLogo: 'CHE',
    status: 'LIVE',
    time: '34\'',
    date: '2026-06-29',
    scores: { home: 0, away: 0 },
    venue: 'Emirates Stadium, London',
    round: 'Matchday 36',
    servers: liveMatchStreams
  },
  {
    id: 'f3',
    sport: 'football',
    league: 'Serie A',
    leagueBadge: '🇮🇹',
    homeTeam: 'AC Milan',
    homeLogo: 'ACM',
    awayTeam: 'Inter Milan',
    awayLogo: 'INT',
    status: 'UPCOMING',
    time: '08:45 PM',
    date: '2026-06-29',
    venue: 'San Siro, Milan',
    round: 'Matchday 35',
    servers: liveMatchStreams
  },
  {
    id: 'f4',
    sport: 'football',
    league: 'La Liga',
    leagueBadge: '🇪🇸',
    homeTeam: 'Barcelona',
    homeLogo: 'FCB',
    awayTeam: 'Atletico Madrid',
    awayLogo: 'ATM',
    status: 'FINISHED',
    time: 'FT',
    date: '2026-06-28',
    scores: { home: 3, away: 2 },
    venue: 'Camp Nou, Barcelona',
    round: 'Matchday 34',
    servers: []
  },

  // BASKETBALL MATCHES
  {
    id: 'b1',
    sport: 'basketball',
    league: 'NBA Finals',
    leagueBadge: '🏀',
    homeTeam: 'Los Angeles Lakers',
    homeLogo: 'LAL',
    awayTeam: 'Boston Celtics',
    awayLogo: 'BOS',
    status: 'LIVE',
    time: 'Q3 - 04:12',
    date: '2026-06-29',
    scores: { home: 88, away: 92 },
    venue: 'Crypto.com Arena, Los Angeles',
    round: 'Game 5 (Series Tied 2-2)',
    servers: liveMatchStreams
  },
  {
    id: 'b2',
    sport: 'basketball',
    league: 'NBA Playoffs',
    leagueBadge: '🏀',
    homeTeam: 'Golden State Warriors',
    homeLogo: 'GSW',
    awayTeam: 'Phoenix Suns',
    awayLogo: 'PHX',
    status: 'FINISHED',
    time: 'FT',
    date: '2026-06-28',
    scores: { home: 112, away: 105 },
    venue: 'Chase Center, San Francisco',
    round: 'Conference Semis - Game 6',
    servers: []
  },

  // CRICKET MATCHES
  {
    id: 'c1',
    sport: 'cricket',
    league: 'Indian Premier League (IPL)',
    leagueBadge: '🏏',
    homeTeam: 'Mumbai Indians',
    homeLogo: 'MI',
    awayTeam: 'Chennai Super Kings',
    awayLogo: 'CSK',
    status: 'LIVE',
    time: '14.2 Ov (Target 188)',
    date: '2026-06-29',
    scores: { home: 118, away: 187 },
    venue: 'Wankhede Stadium, Mumbai',
    round: 'League Match',
    servers: liveMatchStreams
  },

  // WWE MATCHES
  {
    id: 'w1',
    sport: 'wwe',
    league: 'WWE Raw',
    leagueBadge: '⚡',
    homeTeam: 'Cody Rhodes',
    homeLogo: 'COD',
    awayTeam: 'Roman Reigns',
    awayLogo: 'ROM',
    status: 'LIVE',
    time: 'Main Event',
    date: '2026-06-29',
    venue: 'Madison Square Garden, New York',
    round: 'Undisputed Championship Match',
    servers: liveMatchStreams
  },

  // TENNIS MATCHES
  {
    id: 't1',
    sport: 'tennis',
    league: 'Wimbledon',
    leagueBadge: '🎾',
    homeTeam: 'Carlos Alcaraz',
    homeLogo: 'ALC',
    awayTeam: 'Novak Djokovic',
    awayLogo: 'DJO',
    status: 'LIVE',
    time: 'Set 4 - 3-2',
    date: '2026-06-29',
    scores: { home: 2, away: 1 },
    venue: 'Centre Court, London',
    round: 'Finals',
    servers: liveMatchStreams
  }
];
