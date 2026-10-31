import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// In-memory cache for fast repeat requests
const audioCache = new Map();

/**
 * Synthesize speech using Microsoft Edge Neural TTS
 * @param {Object} options
 * @param {string} options.text
 * @param {string} [options.voice='id-ID-GadisNeural']
 * @param {string} [options.rate='+5%']
 * @param {string} [options.pitch='+4Hz']
 * @returns {Promise<Buffer>}
 */
export async function synthesizeEdgeTTS({
  text,
  voice = 'id-ID-GadisNeural',
  rate = '+5%',
  pitch = '+4Hz',
}) {
  if (!text || !text.trim()) {
    throw new Error('Text parameter is required');
  }

  const cleanText = text.trim();
  const cacheKey = `${voice}_${rate}_${pitch}_${cleanText}`;

  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(cleanText, { rate, pitch });

  return new Promise((resolve, reject) => {
    const chunks = [];
    audioStream.on('data', (chunk) => chunks.push(chunk));
    audioStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      audioCache.set(cacheKey, buffer);
      resolve(buffer);
    });
    audioStream.on('error', (err) => reject(err));
  });
}
