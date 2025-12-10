import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { image, facts } = await req.json();

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Roast this person as brutally and hilariously as possible. No mercy, make it viral-worthy. Extra facts: ${facts || 'none'}`,
            },
            {
              type: 'image_url',
              image_url: { url: image },
            },
          ],
        },
      ],
      max_tokens: 600,
      temperature: 1.0,
    }),
  });

  const data = await res.json();
  const roast = data.choices?.[0]?.message?.content || "Even Grok ran away screaming.";

  return Response.json({ roast });
};

export const runtime = 'edge';
