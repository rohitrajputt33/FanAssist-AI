import { NextRequest, NextResponse } from 'next/server';

/** Rate limiter for the Digital Twin API endpoint. */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

/**
 * POST handler for the Digital Twin chat endpoint.
 * Provides AI-driven operational intelligence by simulating a natural language
 * interface to the stadium's digital twin for real-time decision support
 * during FIFA World Cup 2026.
 */
export async function POST(req: NextRequest) {
  try {
    // Security: Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    if (now - rateData.timestamp > 60000) {
      rateData.count = 0;
      rateData.timestamp = now;
    }
    rateData.count += 1;
    rateLimitMap.set(ip, rateData);
    if (rateData.count > 15) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.length > 500) {
      return NextResponse.json({ error: 'Invalid query.' }, { status: 400 });
    }

    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerQuery = query.toLowerCase();
    
    // Feature 4: "Chat with the Stadium" Digital Twin Logic
    if (lowerQuery.includes('rain') || lowerQuery.includes('weather')) {
      return NextResponse.json({ 
        reply: "Rain will cause fans to shelter under the East Concourse overhang, reducing exit flow by 40%. Recommend opening the VIP underground tunnels to general admission to relieve pressure. Shall I update the digital signs to route them there?" 
      }, { status: 200 });
    }

    if (lowerQuery.includes('yes') || lowerQuery.includes('update')) {
      return NextResponse.json({ 
        reply: "Confirmed. Digital signs at the East Concourse have been updated to route general admission through the VIP underground tunnels." 
      }, { status: 200 });
    }

    // Generic fallback
    return NextResponse.json({ 
      reply: "I am analyzing the spatial data for that request. Current stadium capacity is at 94%. No critical anomalies detected outside of Gate 4." 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Digital Twin API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
