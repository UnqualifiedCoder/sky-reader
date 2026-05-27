export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const {
      image1,
      image2,
      type1,
      type2
    } = req.body;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          generationConfig: {
            responseMimeType: "application/json"
          },

          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: type1,
                    data: image1
                  }
                },
                {
                  inline_data: {
                    mime_type: type2,
                    data: image2
                  }
                },
                {
                  text: `
You are a weather analysis API.

Analyze these two sky photos.

IMPORTANT:
- Return ONLY raw JSON
- No markdown
- No explanation
- No code block
- No extra text

Use this exact format:

{
  "condition": "clear",
  "cloudCoverPercent": 40,
  "precipitation": false,
  "visibility": "good",
  "confidence": 88,
  "notes": "Light clouds with good daylight visibility."
}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log('FULL GEMINI RESPONSE:', data);

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      throw new Error('Empty Gemini response');
    }

    const parsed = JSON.parse(text);

    return res.status(200).json(parsed);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message || 'Server error'
    });
  }
}