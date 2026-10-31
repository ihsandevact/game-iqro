import { synthesizeEdgeTTS } from '../server/ttsHandler.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let text = '';
    let voice = 'id-ID-GadisNeural';
    let rate = '+5%';
    let pitch = '+4Hz';

    if (req.method === 'GET') {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      text = url.searchParams.get('text') || '';
      voice = url.searchParams.get('voice') || voice;
      rate = url.searchParams.get('rate') || rate;
      pitch = url.searchParams.get('pitch') || pitch;
    } else if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      text = body.text || '';
      voice = body.voice || voice;
      rate = body.rate || rate;
      pitch = body.pitch || pitch;
    }

    if (!text) {
      res.status(400).json({ error: 'Text parameter is required' });
      return;
    }

    const audioBuffer = await synthesizeEdgeTTS({ text, voice, rate, pitch });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(audioBuffer);
  } catch (err) {
    console.error('TTS handler error:', err);
    res.status(500).json({ error: err.message || 'Failed to synthesize speech' });
  }
}
