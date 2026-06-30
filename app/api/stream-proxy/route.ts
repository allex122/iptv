import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const streamUrl = searchParams.get('url');
  const cookie = searchParams.get('cookie');

  if (!streamUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    // Construct request headers
    const requestHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    // Forward the security cookie from the query parameters if present
    if (cookie) {
      requestHeaders['Cookie'] = cookie;
    }

    const res = await fetch(streamUrl, {
      headers: requestHeaders
    });

    if (!res.ok) {
      return new Response(`Failed to fetch remote stream: ${res.statusText}`, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || '';
    const urlObj = new URL(streamUrl);
    const queryString = urlObj.search;

    // If it's a playlist manifest (.m3u8), parse and rewrite segment URLs to route through this proxy
    if (contentType.includes('mpegurl') || contentType.includes('x-mpegURL') || streamUrl.split('?')[0].endsWith('.m3u8')) {
      const text = await res.text();
      const baseUrl = streamUrl.substring(0, streamUrl.lastIndexOf('/') + 1);
      
      const lines = text.split('\n');
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          // Construct absolute URL for relative links
          let absoluteUrl = trimmed.startsWith('http') ? trimmed : `${baseUrl}${trimmed}`;
          
          // Append the original query string (like authentication tokens) to segment requests
          if (queryString && !absoluteUrl.includes('?')) {
            absoluteUrl += queryString;
          }
          
          // Route the segment/sub-playlist through our proxy and forward the Cookie parameter
          let proxyUrl = `/api/stream-proxy?url=${encodeURIComponent(absoluteUrl)}`;
          if (cookie) {
            proxyUrl += `&cookie=${encodeURIComponent(cookie)}`;
          }
          return proxyUrl;
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
