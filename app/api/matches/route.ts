import { NextResponse } from 'next/server';
import { Match } from '@/types/match';
import { liveMatchStreams, mockMatches } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateQuery = searchParams.get('date');

    // Fetch live fixtures from ESPN soccer scoreboard API
    let events: any[] = [];
    try {
      const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        },
        next: { revalidate: 30 }
      });
      if (res.ok) {
        const data = await res.json();
        events = data.events || [];
      }
    } catch (e) {
      console.warn("ESPN World Cup API failed, trying fallback:", e);
    }
    
    if (events.length === 0) {
      try {
        // Fallback to international club scoreboard if World Cup matches are not live
        const fallbackRes = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard', {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          events = fallbackData.events || [];
        }
      } catch (e) {
        console.warn("ESPN Fallback API failed:", e);
      }
    }

    const formattedMatches = formatESPNData(events, dateQuery);
    
    // Merge ESPN matches with the local mock matches (Cricket, WWE, Basketball, etc.)
    // Avoid duplicating if the ESPN API somehow contains a duplicate ID
    const mergedMatches = [...formattedMatches];
    const existingIds = new Set(formattedMatches.map((m) => m.id));

    for (const mock of mockMatches) {
      if (!existingIds.has(mock.id)) {
        // If a date query is passed, filter matches that match the requested date
        if (dateQuery) {
          if (mock.date === dateQuery) {
            mergedMatches.push(mock);
          }
        } else {
          mergedMatches.push(mock);
        }
      }
    }

    return NextResponse.json(mergedMatches);
  } catch (error) {
    console.error("Matches API general error:", error);
    // Fallback solely to mock matches if all external requests fail
    return NextResponse.json(mockMatches);
  }
}

function formatESPNData(events: any[], dateQuery: string | null): Match[] {
  if (!events) return [];
  
  return events.map((event: any) => {
    const competition = event.competitions[0];
    const home = competition.competitors[0];
    const away = competition.competitors[1];

    const espnState = event.status.type.state;
    let status: 'LIVE' | 'UPCOMING' | 'FINISHED' = 'UPCOMING';
    if (espnState === 'in') status = 'LIVE';
    if (espnState === 'post') status = 'FINISHED';

    const realDate = event.date ? event.date.split('T')[0] : '2026-06-29';
    const displayDate = status === 'LIVE' ? '2026-06-29' : realDate;

    return {
      id: event.id,
      sport: 'football',
      league: event.season?.slug?.toUpperCase() || 'INTERNATIONAL MATCH',
      leagueBadge: '⚽',
      homeTeam: home.team.displayName,
      homeLogo: home.team.abbreviation || home.team.displayName.substring(0, 3).toUpperCase(),
      awayTeam: away.team.displayName,
      awayLogo: away.team.abbreviation || away.team.displayName.substring(0, 3).toUpperCase(),
      status: status,
      time: event.status.displayClock || (status === 'FINISHED' ? 'FT' : event.status.type.detail || '0\''),
      date: displayDate,
      scores: {
        home: parseInt(home.score) || 0,
        away: parseInt(away.score) || 0
      },
      venue: competition.venue?.fullName || 'International Arena',
      round: competition.notes?.[0]?.headline || 'Matchday',
      // Attach global stream servers
      servers: liveMatchStreams
    };
  });
}
