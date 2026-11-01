import JSZip from 'jszip';
import { IqroLevelId } from '../types/gameTypes';

export interface StudioRecordingRecord {
  questionId: string;
  targetLetter: string;
  targetName: string;
  bookLevel: IqroLevelId;
  stageId?: string;
  stageType?: string;
  promptText?: string;
  blob: Blob;
  durationMs: number;
  mimeType: string;
  approvedAt: number;
}

const DB_NAME = 'iqro_qari_studio_v1';
const STORE_NAME = 'studio_recordings';
const DB_VERSION = 1;
const STORAGE_KEY_STUDIO_VOICE_ENABLED = 'iqro_studio_voice_override_enabled';

let dbInstance: IDBDatabase | null = null;

export async function getStudioDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    throw new Error('IndexedDB is not supported in this environment');
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'questionId' });
        store.createIndex('bookLevel', 'bookLevel', { unique: false });
        store.createIndex('targetLetter', 'targetLetter', { unique: false });
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
 * Save an approved studio recording
 */
export async function saveStudioRecording(record: StudioRecordingRecord): Promise<void> {
  const db = await getStudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get an approved studio recording by question ID
 */
export async function getStudioRecording(questionId: string): Promise<StudioRecordingRecord | null> {
  try {
    const db = await getStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(questionId);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Get all approved studio recordings as a dictionary keyed by questionId
 */
export async function getAllStudioRecordings(): Promise<Record<string, StudioRecordingRecord>> {
  try {
    const db = await getStudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = req.result as StudioRecordingRecord[];
        const map: Record<string, StudioRecordingRecord> = {};
        for (const item of results) {
          map[item.questionId] = item;
        }
        resolve(map);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

/**
 * Delete a specific recording
 */
export async function deleteStudioRecording(questionId: string): Promise<void> {
  const db = await getStudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(questionId);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Clear all studio recordings
 */
export async function clearAllStudioRecordings(): Promise<void> {
  const db = await getStudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * In-Game Studio Audio Override Toggle (localStorage)
 */
export function isStudioVoiceEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_STUDIO_VOICE_ENABLED) === 'true';
}

export function setStudioVoiceEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_STUDIO_VOICE_ENABLED, enabled ? 'true' : 'false');
}

/**
 * Sanitize filename for export
 */
function sanitizeFileName(str: string): string {
  return str.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

/**
 * Export all approved recordings to a ZIP file with manifest.json
 */
export async function exportStudioZip(recordings: Record<string, StudioRecordingRecord>): Promise<Blob> {
  const zip = new JSZip();
  const manifest = {
    exportedAt: new Date().toISOString(),
    totalRecordings: Object.keys(recordings).length,
    recordings: [] as Array<{
      questionId: string;
      targetLetter: string;
      targetName: string;
      bookLevel: number;
      filename: string;
      durationMs: number;
      mimeType: string;
    }>,
  };

  const audioFolder = zip.folder('audio');

  for (const [qId, rec] of Object.entries(recordings)) {
    const ext = rec.mimeType.includes('mp4') || rec.mimeType.includes('aac') ? 'm4a' : 'webm';
    const cleanLetter = sanitizeFileName(rec.targetName || rec.targetLetter || 'audio');
    const filename = `iqro${rec.bookLevel}_${sanitizeFileName(qId)}_${cleanLetter}.${ext}`;

    if (audioFolder) {
      audioFolder.file(filename, rec.blob);
    }

    manifest.recordings.push({
      questionId: qId,
      targetLetter: rec.targetLetter,
      targetName: rec.targetName,
      bookLevel: rec.bookLevel,
      filename,
      durationMs: rec.durationMs,
      mimeType: rec.mimeType,
    });
  }

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Import and restore recordings from an exported ZIP
 */
export async function importStudioZip(file: File): Promise<{ importedCount: number; errors: string[] }> {
  const zip = await JSZip.loadAsync(file);
  const manifestFile = zip.file('manifest.json');
  const errors: string[] = [];

  if (!manifestFile) {
    throw new Error('Berkas ZIP tidak memiliki manifest.json yang valid!');
  }

  const manifestText = await manifestFile.async('text');
  const manifest = JSON.parse(manifestText);
  let importedCount = 0;

  for (const item of manifest.recordings || []) {
    const audioPathInZip = `audio/${item.filename}`;
    const zipAudioEntry = zip.file(audioPathInZip);

    if (!zipAudioEntry) {
      errors.push(`Berkas audio ${item.filename} tidak ditemukan dalam arsip`);
      continue;
    }

    const audioBlob = await zipAudioEntry.async('blob');
    const record: StudioRecordingRecord = {
      questionId: item.questionId,
      targetLetter: item.targetLetter,
      targetName: item.targetName,
      bookLevel: (item.bookLevel as IqroLevelId) || 1,
      blob: audioBlob,
      durationMs: item.durationMs || 500,
      mimeType: item.mimeType || 'audio/webm',
      approvedAt: Date.now(),
    };

    await saveStudioRecording(record);
    importedCount++;
  }

  return { importedCount, errors };
}
