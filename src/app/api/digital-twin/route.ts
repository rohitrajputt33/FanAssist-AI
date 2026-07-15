import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
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

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
