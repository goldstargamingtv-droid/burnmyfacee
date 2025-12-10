import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { image, facts } = await req.json();

    // Clean base64 for Grok
    let cleanImage = image;
    if (image.startsWith('data:image')) {
      cleanImage = image;
    } else {
      cleanImage = `data:image/jpeg;base64,${image.split(',')[1]}`;
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Roast this person brutally and hilariously based on their photo. Make it viral, savage, no mercy. Use these facts if provided: ${facts || 'none'}. Keep it under 200 words.`
            },
            {
              type: 'image_url',
              image_url: { url: cleanImage }
            }
          ]
        }],
        max_tokens: 300,
        temperature: 1.0,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const data = await response.json();
    const roast = data.choices[0]?.message?.content || 'Grok refused—your face broke the AI.';

    return NextResponse.json({ roast });
  } catch (error) {
    console.error('Roast error:', error);
    return NextResponse.json({ error: 'Roast failed—try again' }, { status: 500 });
  }
}
