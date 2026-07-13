import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// IMPORTANT: For security, the API key must be stored in .env.local
// and NEVER hardcoded in the source code.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { incidentText, userLanguage = 'en' } = body;

    if (!incidentText || typeof incidentText !== 'string') {
      return NextResponse.json({ error: 'Invalid incident text provided.' }, { status: 400 });
    }

    const systemPrompt = `You are the core intelligence of "Aura," a smart stadium crisis resolution system.
A fan has reported an incident in a stadium. Your job is to extract the key entities from their message and translate their message context into a structured JSON response.

You must return ONLY a raw JSON object (without any markdown formatting or code blocks) containing the following fields:
1. "crisisType": A short 1-3 word description of the emergency (e.g., "Lost Child", "Medical Emergency", "Slip and Fall").
2. "location": The specific location mentioned (e.g., "Gate B", "Section 104", "Concourse 2"). If not mentioned, return "Unknown".
3. "identifiers": Any specific details helpful for security (e.g., "Red shirt", "7 years old", "bleeding").
4. "translatedMessage": An English translation of the fan's raw message (if it was already in English, just return it as is).
5. "empatheticResponse": A short, calming, and reassuring response written IN THE FAN'S ORIGINAL LANGUAGE telling them that security has been alerted and help is on the way.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\nFan Message:\n' + incidentText }] }
      ]
    });

    const textResponse = response.text || '';
    
    // Attempt to parse the JSON returned by Gemini
    let parsedData;
    try {
      // Strip potential markdown code block formatting
      const cleanJson = textResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', textResponse);
      return NextResponse.json({ error: 'Failed to process incident data.' }, { status: 500 });
    }

    return NextResponse.json(parsedData, { status: 200 });

  } catch (error: any) {
    console.error('Error in analyze-incident API:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
