import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const streamUrl = searchParams.get('url');

  if (!streamUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const res = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    if (!res.ok) {
      return new Response(`Failed to fetch remote stream: ${res.statusText}`, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || '';

    // If it's a playlist manifest (.m3u8), parse and rewrite segment URLs to also route through this proxy
    if (contentType.includes('mpegurl') || contentType.includes('x-mpegURL') || streamUrl.split('?')[0].endsWith('.m3u8')) {
      const text = await res.text();
      const baseUrl = streamUrl.substring(0, streamUrl.lastIndexOf('/') + 1);
      
      const lines = text.split('\n');
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          // Construct absolute URL for relative links
          const absoluteUrl = trimmed.startsWith('http') ? trimmed : `${baseUrl}${trimmed}`;
          // Route the segment/sub-playlist through our proxy
          return `/api/stream-proxy?url=${encodeURIComponent(absoluteUrl)}`;
        }
        return line;
      });

      return new Response(rewrittenLines.join('\n'), {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // For TS video segments or other binary stream parts, stream the binary buffer directly
    const data = await res.arrayBuffer();
    return new Response(data, {
      headers: {
        'Content-Type': contentType || 'video/MP2T',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=86400',
      },
    });
  } catch (error: any) {
    console.error('Stream proxy error:', error);
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}
