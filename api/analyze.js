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
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
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
Analyze these two sky photos for weather conditions.

Return ONLY valid JSON:

{
  "condition":"clear|partly_cloudy|cloudy|overcast|foggy|rainy|snowy|stormy",
  "cloudCoverPercent":0,
  "precipitation":false,
  "visibility":"excellent|good|moderate|poor",
  "confidence":0,
  "notes":"one sentence about what you observe"
}
`
              }
            ]
          }]
        })
      }
    );

    const text =
  data.candidates?.[0]?.content?.parts?.[0]?.text || '';

console.log('RAW GEMINI RESPONSE:', text);

const cleaned = text
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();

let parsed;

try {
  parsed = JSON.parse(cleaned);
} catch {
  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error('Could not parse Gemini response');
  }

  parsed = JSON.parse(match[0]);
}

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message || 'Server error'
    });const text =
  }
}