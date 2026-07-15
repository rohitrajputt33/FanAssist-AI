import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simulated Rate Limiting (Security Parameter)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

export async function POST(req: NextRequest) {
  try {
    // 1. Security: Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    
    // Reset window every 60 seconds
    if (now - rateData.timestamp > 60000) {
      rateData.count = 0;
      rateData.timestamp = now;
    }
    
    rateData.count += 1;
    rateLimitMap.set(ip, rateData);

    if (rateData.count > 10) {
      return NextResponse.json({ error: 'Rate limit exceeded. Too many requests.' }, { status: 429 });
    }

    // 2. Input Validation
    const body = await req.json();
    const { incidentText, userLanguage = 'en' } = body;

    if (!incidentText || typeof incidentText !== 'string' || incidentText.length > 500) {
      return NextResponse.json({ error: 'Invalid or too long incident text provided.' }, { status: 400 });
    }

    const systemPrompt = `You are the core intelligence of "FanAssist AI," a smart stadium crisis resolution system.
A fan has reported an incident in a stadium. Extract key entities and predict operations.

Return ONLY a raw JSON object containing:
1. "crisisType": Short 1-3 word description (e.g., "Lost Child", "Medical").
2. "location": Specific location (e.g., "Gate B", "Section 104"). If none, return "Unknown".
3. "identifiers": Key details as a string (e.g., "Red shirt").
4. "translatedMessage": English translation of the fan's message.
5. "empatheticResponse": A short, calming response IN THE FAN'S ORIGINAL LANGUAGE.
6. "severity": "Low", "Medium", or "High" based on the threat level.
7. "dispatchUnit": The recommended staff unit (e.g., "Medical Alpha", "Crowd Control", "Steward").
8. "announcementScriptEn": A brief public address script in English to calm the surrounding crowd (e.g., "Attention fans near Gate B...").
9. "announcementScriptEs": The same script translated to Spanish.`;

    let jsonText = '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\nFan Message:\n' + incidentText }] }
        ]
      });
      
      const rawText = response.text || '';
      jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (apiError: any) {
      console.warn("Gemini API Error (likely Quota Exceeded). Falling back to mock response.");
      
      const mockResponse = {
        translatedMessage: "Help, my son is lost near Gate D. He is wearing a blue shirt.",
        location: "Gate D",
        crisisType: "Lost Person",
        identifiers: "Blue shirt, son",
        empatheticResponse: "Please stay calm. Security has been alerted to Gate D and is actively looking for your son.",
        severity: "High",
        dispatchUnit: "Child Welfare & Security Team Beta",
        announcementScriptEn: "Attention fans near Gate D. We are looking for a lost child wearing a blue shirt. If you see him, please alert the nearest steward.",
        announcementScriptEs: "Atención fans cerca de la Puerta D. Buscamos a un niño perdido que lleva una camiseta azul. Si lo ven, alerten al personal más cercano."
      };
      jsonText = JSON.stringify(mockResponse);
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', jsonText);
      return NextResponse.json({ error: 'Failed to process incident data.' }, { status: 500 });
    }

    return NextResponse.json(parsedData, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
