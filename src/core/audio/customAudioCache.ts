// IndexedDB Audio Cache for Personalized Child Name Praises (Hybrid Cache)

export interface PersonalizedPhrase {
  key: string;
  template: (name: string) => string;
}

export const PERSONALIZED_PHRASES: PersonalizedPhrase[] = [
  { key: 'praise_hebat', template: (name) => `Kamu hebat, ${name}!` },
  { key: 'praise_pintar', template: (name) => `Masya Allah, pintar ${name}!` },
  { key: 'praise_luarbiasa', template: (name) => `Luar biasa, benar sekali ${name}!` },
  { key: 'praise_keren', template: (name) => `Wah, keren banget ${name}!` },
  { key: 'praise_bagus', template: (name) => `Bagus sekali ${name}!` },
  { key: 'prompt_selesai', template: (name) => `Alhamdulillah! Pelajaran selesai, kamu hebat sekali ${name}!` },
  { key: 'prompt_sapaan', template: (name) => `Halo ${name}! Ayo semangat belajar mengaji bersamaku!` },
];

const DB_NAME = 'iqro_audio_cache_v1';
const STORE_NAME = 'personalized_audio';
const DB_VERSION = 1;

interface AudioRecord {
  id: string; // `${name.toLowerCase()}_${key}`
  name: string;
  key: string;
  blob: Blob;
  timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

export async function getAudioDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    throw new Error('IndexedDB is not supported in this environment');
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Check if all personalized audio phrases for a child name are already cached
 */
export async function hasCachedAudioForName(name: string): Promise<boolean> {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return false;

  try {
    const db = await getAudioDB();
    const count = await new Promise<number>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      let matchCount = 0;

      tx.oncomplete = () => resolve(matchCount);
      tx.onerror = () => resolve(0);

      for (const phrase of PERSONALIZED_PHRASES) {
        const id = `${trimmed}_${phrase.key}`;
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            matchCount++;
          }
        };
      }
    });

    return count === PERSONALIZED_PHRASES.length;
  } catch {
    return false;
  }
}

/**
 * Save an audio blob to IndexedDB
 */
export async function saveAudioBlob(name: string, key: string, blob: Blob): Promise<void> {
  const trimmed = name.trim().toLowerCase();
  const db = await getAudioDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: AudioRecord = {
      id: `${trimmed}_${key}`,
      name: trimmed,
      key,
      blob,
      timestamp: Date.now(),
    };

    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieve a specific cached audio blob
 */
export async function getCachedAudioBlob(name: string, key: string): Promise<Blob | null> {
  const trimmed = name.trim().toLowerCase();
  try {
    const db = await getAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`${trimmed}_${key}`);

      req.onsuccess = () => {
        resolve(req.result ? req.result.blob : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Retrieve all cached audio blobs for a child name
 */
export async function getAllCachedAudioForName(name: string): Promise<Record<string, Blob>> {
  const trimmed = name.trim().toLowerCase();
  const result: Record<string, Blob> = {};

  try {
    const db = await getAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      tx.oncomplete = () => resolve(result);
      tx.onerror = () => resolve(result);

      for (const phrase of PERSONALIZED_PHRASES) {
        const id = `${trimmed}_${phrase.key}`;
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            result[phrase.key] = req.result.blob;
          }
        };
      }
    });
  } catch {
    return result;
  }
}

/**
 * Fetch speech audio from /api/tts endpoint
 */
export async function fetchTTSAudio(
  text: string,
  voice = 'id-ID-GadisNeural',
  rate = '+5%',
  pitch = '+4Hz'
): Promise<Blob> {
  const params = new URLSearchParams({ text, voice, rate, pitch });
  const response = await fetch(`/api/tts?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'audio/mpeg',
    },
  });

  if (!response.ok) {
    throw new Error(`TTS server responded with ${response.status}: ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * Generate and cache all 7 personalized phrases for a child name
 */
export async function generateAndCacheAudiosForName(
  childName: string,
  onProgress?: (completed: number, total: number) => void
): Promise<{ success: boolean; cachedCount: number; error?: string }> {
  const trimmed = childName.trim();
  if (!trimmed) {
    return { success: false, cachedCount: 0, error: 'Nama anak kosong' };
  }

  const total = PERSONALIZED_PHRASES.length;
  let completed = 0;

  // 1. Check existing blobs in IndexedDB first
  const existingBlobs = await getAllCachedAudioForName(trimmed);
  completed = Object.keys(existingBlobs).length;
  onProgress?.(completed, total);

  if (completed === total) {
    return { success: true, cachedCount: total };
  }

  // 2. Fetch missing items concurrently in small batches
  const missingPhrases = PERSONALIZED_PHRASES.filter(
    (p) => !existingBlobs[p.key]
  );

  try {
    // Process items in parallel batches of 3
    const batchSize = 3;
    for (let i = 0; i < missingPhrases.length; i += batchSize) {
      const batch = missingPhrases.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (phrase) => {
          const phraseText = phrase.template(trimmed);
          const blob = await fetchTTSAudio(phraseText);
          await saveAudioBlob(trimmed, phrase.key, blob);
          completed++;
          onProgress?.(completed, total);
        })
      );
    }

    return { success: true, cachedCount: completed };
  } catch (err: any) {
    return {
      success: false,
      cachedCount: completed,
      error: err.message || 'Gagal mengunduh audio TTS',
    };
  }
}

/**
 * Remove cached audio for a specific child name
 */
export async function clearAudioCacheForName(name: string): Promise<void> {
  const trimmed = name.trim().toLowerCase();
  try {
    const db = await getAudioDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const phrase of PERSONALIZED_PHRASES) {
      store.delete(`${trimmed}_${phrase.key}`);
    }
  } catch {
    // ignore
  }
}
