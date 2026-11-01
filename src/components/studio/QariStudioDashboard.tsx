import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Download,
  Upload,
  Search,
  Volume2,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IQRO_BOOKS } from '../../games/iqro/data/iqroLevels';
import { IqroLevelId, StageType } from '../../core/types/gameTypes';
import {
  StudioRecordingRecord,
  saveStudioRecording,
  getAllStudioRecordings,
  deleteStudioRecording,
  clearAllStudioRecordings,
  exportStudioZip,
  importStudioZip,
  isStudioVoiceEnabled,
  setStudioVoiceEnabled,
} from '../../core/audio/qariStudioCache';
import { ttsNarrator } from '../../core/audio/ttsNarrator';
import { soundManager } from '../../core/audio/soundManager';

export interface StudioItem {
  id: string; // question id
  bookLevel: IqroLevelId;
  bookTitle: string;
  unitId: string;
  unitTitle: string;
  stageId: string;
  stageTitle: string;
  stageType: StageType;
  targetLetter: string;
  targetName: string;
  promptText: string;
  hint?: string;
}

export interface DraftAudio {
  blob: Blob;
  url: string;
  durationMs: number;
  sizeBytes: number;
  mimeType: string;
}

interface QariStudioDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QariStudioDashboard: React.FC<QariStudioDashboardProps> = ({ isOpen, onClose }) => {
  // 1. Flatten all questions from IQRO_BOOKS (Iqro 1 to 6)
  const allQuestions: StudioItem[] = useMemo(() => {
    const list: StudioItem[] = [];
    for (const book of IQRO_BOOKS) {
      for (const unit of book.units) {
        for (const stage of unit.stages) {
          for (const q of stage.questions) {
            list.push({
              id: q.id,
              bookLevel: book.level,
              bookTitle: book.title,
              unitId: unit.id,
              unitTitle: unit.title,
              stageId: stage.id,
              stageTitle: stage.title,
              stageType: q.type,
              targetLetter: q.targetLetter || (q.options?.find((o) => o.isCorrect)?.letter || ''),
              targetName: q.targetName || (q.options?.find((o) => o.isCorrect)?.name || ''),
              promptText: q.promptText,
              hint: q.hint,
            });
          }
        }
      }
    }
    return list;
  }, []);

  // Filter states
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unrecorded' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active question index in filtered list
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Approved recordings loaded from IndexedDB
  const [approvedRecords, setApprovedRecords] = useState<Record<string, StudioRecordingRecord>>({});
  const [isVoiceOverrideActive, setIsVoiceOverrideActive] = useState<boolean>(false);

  // Recorder state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [micLevel, setMicLevel] = useState<number>(0); // 0 - 100 for VU-meter
  const [draftAudio, setDraftAudio] = useState<DraftAudio | null>(null);

  // Playback state
  const [isPlayingDraft, setIsPlayingDraft] = useState<boolean>(false);
  const [isPlayingApproved, setIsPlayingApproved] = useState<boolean>(false);

  // UI state
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Refs for recording & audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Web Audio refs for VU-meter
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Load all existing recordings on mount
  useEffect(() => {
    if (isOpen) {
      loadRecords();
      setIsVoiceOverrideActive(isStudioVoiceEnabled());
    }
  }, [isOpen]);

  const loadRecords = async () => {
    try {
      const records = await getAllStudioRecordings();
      setApprovedRecords(records);
    } catch {
      setApprovedRecords({});
    }
  };

  // Clean up object URLs when draft changes or unmounts
  useEffect(() => {
    return () => {
      if (draftAudio?.url) {
        URL.revokeObjectURL(draftAudio.url);
      }
      cleanupAudioContext();
    };
  }, [draftAudio]);

  const cleanupAudioContext = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch {
        // ignore
      }
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    setMicLevel(0);
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((item) => {
      if (selectedLevel !== 'all' && item.bookLevel !== selectedLevel) {
        return false;
      }
      const isApproved = !!approvedRecords[item.id];
      if (statusFilter === 'unrecorded' && isApproved) {
        return false;
      }
      if (statusFilter === 'approved' && !isApproved) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesArabic = item.targetLetter.includes(q);
        const matchesTranslit = item.targetName.toLowerCase().includes(q);
        const matchesPrompt = item.promptText.toLowerCase().includes(q);
        const matchesStage = item.stageTitle.toLowerCase().includes(q);
        if (!matchesArabic && !matchesTranslit && !matchesPrompt && !matchesStage) {
          return false;
        }
      }
      return true;
    });
  }, [allQuestions, selectedLevel, statusFilter, searchQuery, approvedRecords]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filteredQuestions.length) {
      setSelectedIndex(Math.max(0, filteredQuestions.length - 1));
    }
  }, [filteredQuestions.length, selectedIndex]);

  const currentItem = filteredQuestions[selectedIndex] || allQuestions[0];
  const isCurrentApproved = currentItem ? !!approvedRecords[currentItem.id] : false;
  const currentApprovedRecord = currentItem ? approvedRecords[currentItem.id] : null;

  // Notification helper
  const showNotice = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Stop any active playback
  const stopPlayback = useCallback(() => {
    if (playbackAudioRef.current) {
      try {
        playbackAudioRef.current.pause();
        playbackAudioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      playbackAudioRef.current = null;
    }
    setIsPlayingDraft(false);
    setIsPlayingApproved(false);
  }, []);

  // Reset draft when selecting another question
  const selectQuestion = (idx: number) => {
    stopPlayback();
    if (isRecording) {
      stopRecording();
    }
    if (draftAudio?.url) {
      URL.revokeObjectURL(draftAudio.url);
    }
    setDraftAudio(null);
    setRecordDuration(0);
    setSelectedIndex(idx);
  };

  // Stop recording handler
  const stopRecording = useCallback(() => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        // Force-flush remaining chunks before stopping
        mediaRecorderRef.current.requestData();
      } catch (e) {
        console.warn('requestData error:', e);
      }
      mediaRecorderRef.current.stop();
      soundManager.playPop();
    }
  }, []);

  // Audio Recording Handlers
  const startRecording = async () => {
    stopPlayback();
    try {
      // 1. Get raw audio stream with fallback
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true,
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      micStreamRef.current = stream;

      // 2. Set up Web Audio Analyser for live VU-meter
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Scale 0-128 to 0-100%
          const normalized = Math.min(100, Math.round((avg / 100) * 100));
          setMicLevel(normalized);
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch (err) {
        console.warn('Could not initialize AudioContext VU-meter:', err);
      }

      // 3. Determine best supported MIME type
      const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/aac',
      ];
      let chosenMime = '';
      for (const cand of candidates) {
        if (MediaRecorder.isTypeSupported(cand)) {
          chosenMime = cand;
          break;
        }
      }

      audioChunksRef.current = [];
      const recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Cleanup mic stream & analyser
        cleanupAudioContext();

        // Strip codec parameter so HTMLAudioElement reliably plays the blob
        const rawMime = recorder.mimeType || chosenMime || 'audio/webm';
        const cleanMime = rawMime.split(';')[0].trim() || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: cleanMime });

        if (blob.size === 0) {
          showNotice('error', '⚠️ Rekaman kosong (0 byte). Pastikan mikrofon aktif dan tidak dimute di Windows/Browser.');
          setIsRecording(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        if (draftAudio?.url) {
          URL.revokeObjectURL(draftAudio.url);
        }

        setDraftAudio({
          blob,
          url,
          durationMs: recordDuration,
          sizeBytes: blob.size,
          mimeType: cleanMime,
        });
        setIsRecording(false);
        showNotice('success', `Rekaman siap! Durasi: ${(recordDuration / 1000).toFixed(1)}s (${(blob.size / 1024).toFixed(1)} KB)`);
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordDuration(0);

      // Start elapsed timer
      const startTime = Date.now();
      recordTimerRef.current = window.setInterval(() => {
        setRecordDuration(Date.now() - startTime);
      }, 50);

      soundManager.playPop();
    } catch (err) {
      console.error('Mikrofon error:', err);
      showNotice('error', 'Izin mikrofon ditolak atau tidak tersedia pada browser Anda.');
      setIsRecording(false);
      cleanupAudioContext();
    }
  };

  // Playback helper with HTMLAudioElement and WebAudio fallback
  const playUrl = (url: string, source: 'draft' | 'approved', onCleanup?: () => void) => {
    stopPlayback();

    const audio = new Audio();
    audio.src = url;
    audio.volume = 1.0;
    playbackAudioRef.current = audio;

    if (source === 'draft') setIsPlayingDraft(true);
    else setIsPlayingApproved(true);

    const cleanup = () => {
      if (source === 'draft') setIsPlayingDraft(false);
      else setIsPlayingApproved(false);
      playbackAudioRef.current = null;
      if (onCleanup) onCleanup();
    };

    audio.onended = cleanup;
    audio.onpause = () => {
      if (source === 'draft') setIsPlayingDraft(false);
      else setIsPlayingApproved(false);
    };
    audio.onerror = (e) => {
      console.error('Audio playback error:', e, audio.error);
      const code = audio.error?.code;
      const msg = audio.error?.message || (code ? `Kode error: ${code}` : 'Format audio tidak didukung');
      showNotice('error', `Gagal memutar audio (${msg}). Silakan coba putar melalui pemutar audio di bawah.`);
      cleanup();
    };

    audio.play().catch(async (err) => {
      console.warn('HTMLAudioElement play() rejected, trying Web Audio API fallback:', err);
      try {
        await playWithWebAudio(url);
        cleanup();
      } catch (fallbackErr) {
        console.error('WebAudio fallback error:', fallbackErr);
        showNotice('error', 'Browser memblokir pemutaran otomatis. Silakan klik tombol putar pada kontrol audio.');
        cleanup();
      }
    });
  };

  // Web Audio API playback fallback
  const playWithWebAudio = async (url: string): Promise<void> => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const sourceNode = ctx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(ctx.destination);
    return new Promise((resolve) => {
      sourceNode.onended = () => {
        try {
          ctx.close().catch(() => {});
        } catch {
          // ignore
        }
        resolve();
      };
      sourceNode.start(0);
    });
  };

  const playDraftAudio = () => {
    if (!draftAudio) return;
    if (isPlayingDraft) {
      stopPlayback();
      return;
    }
    playUrl(draftAudio.url, 'draft');
  };

  const playApprovedAudio = () => {
    if (!currentApprovedRecord?.blob) return;
    if (isPlayingApproved) {
      stopPlayback();
      return;
    }
    const url = URL.createObjectURL(currentApprovedRecord.blob);
    playUrl(url, 'approved', () => URL.revokeObjectURL(url));
  };

  // Approval Handler
  const handleApprove = useCallback(async () => {
    if (!draftAudio || !currentItem) return;

    try {
      const record: StudioRecordingRecord = {
        questionId: currentItem.id,
        targetLetter: currentItem.targetLetter,
        targetName: currentItem.targetName,
        bookLevel: currentItem.bookLevel,
        stageId: currentItem.stageId,
        stageType: currentItem.stageType,
        promptText: currentItem.promptText,
        blob: draftAudio.blob,
        durationMs: draftAudio.durationMs,
        mimeType: draftAudio.mimeType,
        approvedAt: Date.now(),
      };

      await saveStudioRecording(record);
      setApprovedRecords((prev) => ({ ...prev, [currentItem.id]: record }));

      // Reload narrator if in-game override is enabled
      if (isVoiceOverrideActive) {
        await ttsNarrator.loadStudioRecordings();
      }

      soundManager.playCorrect();
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      showNotice('success', `Audio soal "${currentItem.targetName || currentItem.targetLetter}" berhasil di-approve!`);

      // Clear draft & stop playback
      stopPlayback();
      if (draftAudio.url) URL.revokeObjectURL(draftAudio.url);
      setDraftAudio(null);

      // Auto advance to next question
      if (selectedIndex < filteredQuestions.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    } catch (err) {
      console.error('Save error:', err);
      showNotice('error', 'Gagal menyimpan rekaman ke IndexedDB.');
    }
  }, [draftAudio, currentItem, isVoiceOverrideActive, selectedIndex, filteredQuestions.length, stopPlayback]);

  const handleDeleteRecording = async (qId: string) => {
    try {
      await deleteStudioRecording(qId);
      setApprovedRecords((prev) => {
        const copy = { ...prev };
        delete copy[qId];
        return copy;
      });
      if (isVoiceOverrideActive) {
        await ttsNarrator.loadStudioRecordings();
      }
      showNotice('info', 'Rekaman resmi berhasil dihapus.');
    } catch {
      showNotice('error', 'Gagal menghapus rekaman.');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus SEMUA rekaman studio yang tersimpan di browser ini?')) {
      await clearAllStudioRecordings();
      setApprovedRecords({});
      if (isVoiceOverrideActive) {
        await ttsNarrator.loadStudioRecordings();
      }
      showNotice('info', 'Semua rekaman studio berhasil dibersihkan.');
    }
  };

  const handleToggleVoiceOverride = async () => {
    const nextVal = !isVoiceOverrideActive;
    setIsVoiceOverrideActive(nextVal);
    setStudioVoiceEnabled(nextVal);
    await ttsNarrator.loadStudioRecordings();
    showNotice(
      'info',
      nextVal
        ? 'Suara Studio Aktif! Permainan akan menggunakan suara rekaman Anda.'
        : 'Suara Studio Nonaktif. Permainan kembali menggunakan audio default.'
    );
  };

  // Export to ZIP
  const handleExportZip = async () => {
    const total = Object.keys(approvedRecords).length;
    if (total === 0) {
      showNotice('error', 'Belum ada rekaman yang di-approve untuk diekspor!');
      return;
    }

    setIsExporting(true);
    try {
      const zipBlob = await exportStudioZip(approvedRecords);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iqro_audio_pack_${total}_soal_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotice('success', `Berhasil mengekspor ${total} audio ke dalam arsip ZIP!`);
    } catch (err) {
      console.error('Export error:', err);
      showNotice('error', 'Gagal membuat berkas ZIP.');
    } finally {
      setIsExporting(false);
    }
  };

  // Import from ZIP
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await importStudioZip(file);
      await loadRecords();
      if (isVoiceOverrideActive) {
        await ttsNarrator.loadStudioRecordings();
      }
      showNotice(
        'success',
        `Berhasil mengimpor ${result.importedCount} rekaman dari ZIP!${result.errors.length ? ` (${result.errors.length} dilewati)` : ''}`
      );
    } catch (err) {
      console.error('Import error:', err);
      showNotice('error', 'Gagal membaca berkas ZIP. Pastikan berkas berasal dari ekspor Studio.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Keyboard Shortcuts (Space to record, P to play, Enter to approve, Arrows to navigate)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in search
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRecording) {
          startRecording();
        } else {
          stopRecording();
        }
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        if (draftAudio) {
          playDraftAudio();
        } else if (currentApprovedRecord?.blob) {
          playApprovedAudio();
        }
      } else if (e.code === 'Enter' || e.code === 'KeyA') {
        if (draftAudio && !isRecording) {
          e.preventDefault();
          handleApprove();
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (selectedIndex < filteredQuestions.length - 1) {
          selectQuestion(selectedIndex + 1);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (selectedIndex > 0) {
          selectQuestion(selectedIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    isRecording,
    draftAudio,
    selectedIndex,
    filteredQuestions.length,
    currentApprovedRecord,
    handleApprove,
    stopRecording,
  ]);

  if (!isOpen) return null;

  // Stats calculation
  const totalApproved = Object.keys(approvedRecords).length;
  const totalQuestionsCount = allQuestions.length;
  const progressPercent = Math.round((totalApproved / totalQuestionsCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 overflow-hidden">
      <div className="relative flex flex-col w-full max-w-6xl h-[94vh] bg-white rounded-3xl shadow-2xl border-4 border-slate-200 overflow-hidden">
        {/* TOP HEADER: Branding, Progress, & Global Actions */}
        <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-500/20">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-800">Studio Rekaman Qari</h1>
                <span className="text-xs font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Iqro 1–6
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Rekam & approve pelafalan resmi untuk 208 soal permainan
              </p>
            </div>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 gap-4 mb-1">
                <span>Progres Rekaman</span>
                <span className="text-emerald-600 font-black">
                  {totalApproved} / {totalQuestionsCount} ({progressPercent}%)
                </span>
              </div>
              <div className="w-44 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Toggle Live In-Game Audio */}
            <button
              onClick={handleToggleVoiceOverride}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isVoiceOverrideActive
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Jika aktif, audio studio Anda akan langsung dimainkan saat anak bermain di level game"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isVoiceOverrideActive ? 'Suara Studio Aktif' : 'Pakai di Game'}</span>
            </button>

            {/* Export ZIP */}
            <button
              onClick={handleExportZip}
              disabled={isExporting || totalApproved === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-sm disabled:opacity-50 transition"
              title="Unduh seluruh audio yang di-approve dalam bentuk ZIP"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{isExporting ? 'Mengekspor...' : 'Ekspor ZIP'}</span>
            </button>

            {/* Import ZIP */}
            <label
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-sm cursor-pointer disabled:opacity-50 transition"
              title="Pulihkan rekaman dari berkas ZIP sebelumnya"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>{isImporting ? 'Mengimpor...' : 'Impor ZIP'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                disabled={isImporting}
                className="hidden"
              />
            </label>

            {/* Reset All Button */}
            {totalApproved > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 shadow-sm transition"
                title="Hapus semua rekaman yang tersimpan di browser ini"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition ml-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* NOTIFICATION TOAST */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 border ${
                notification.type === 'success'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : notification.type === 'error'
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800 text-white border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN BODY: 2-Column Responsive Layout */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* LEFT SIDEBAR: Question Selector & Filters */}
          <aside className="w-full md:w-80 lg:w-96 flex flex-col bg-slate-50 border-r border-slate-200 overflow-hidden">
            {/* Level Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition ${
                  selectedLevel === 'all'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition ${
                    selectedLevel === lvl
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Iqro {lvl}
                </button>
              ))}
            </div>

            {/* Filter Bar: Status & Search */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari huruf, nama, kata..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent"
                />
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold text-center transition ${
                    statusFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({filteredQuestions.length})
                </button>
                <button
                  onClick={() => setStatusFilter('unrecorded')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold text-center transition ${
                    statusFilter === 'unrecorded'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Belum ({allQuestions.filter((q) => !approvedRecords[q.id]).length})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold text-center transition ${
                    statusFilter === 'approved'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Approved ({totalApproved})
                </button>
              </div>
            </div>

            {/* Question List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredQuestions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold">
                  Tidak ada soal yang sesuai dengan filter.
                </div>
              ) : (
                filteredQuestions.map((item, idx) => {
                  const isApproved = !!approvedRecords[item.id];
                  const isSelected = idx === selectedIndex;
                  const hasDraft = isSelected && !!draftAudio;

                  return (
                    <button
                      key={item.id}
                      onClick={() => selectQuestion(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left border transition ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Status Icon */}
                        {isApproved ? (
                          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-100 text-slate-400">
                            <Mic className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-800">
                              {item.targetName || item.targetLetter}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">
                              Iqro {item.bookLevel}
                            </span>
                            {hasDraft && (
                              <span className="text-[10px] font-black px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-300 animate-pulse">
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[170px]">
                            {item.stageTitle}
                          </p>
                        </div>
                      </div>

                      {/* Arabic Preview */}
                      <span className="font-amiri text-lg font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50/50 rounded-lg">
                        {item.targetLetter}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* RIGHT AREA: Visual "Baca Ini" Prompter & Recording Studio */}
          <main className="flex-1 flex flex-col justify-between bg-white overflow-y-auto p-4 sm:p-8">
            {currentItem ? (
              <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-6 my-auto">
                {/* Stage Info Header */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl border border-emerald-300">
                    {currentItem.bookTitle}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200">
                    {currentItem.unitTitle}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200">
                    {currentItem.stageTitle}
                  </span>
                </div>

                {/* BIG PROMPTER CARD */}
                <div className="w-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-emerald-50/40 rounded-3xl border-2 border-emerald-200/80 shadow-lg text-center relative overflow-hidden">
                  <div className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase mb-2">
                    Lafal Yang Harus Dibacakan:
                  </div>

                  {/* Giant Arabic Text */}
                  <div className="font-amiri text-7xl sm:text-8xl md:text-9xl font-bold text-slate-800 my-2 drop-shadow-sm select-none leading-tight">
                    {currentItem.targetLetter}
                  </div>

                  {/* Transliteration / Guide */}
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 tracking-wide mt-1">
                    "{currentItem.targetName || currentItem.targetLetter}"
                  </div>

                  {/* Makhraj / Harakat Hint */}
                  {currentItem.hint && (
                    <div className="mt-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 max-w-md">
                      💡 {currentItem.hint}
                    </div>
                  )}

                  {/* Approval Status Badge */}
                  <div className="mt-4">
                    {isCurrentApproved ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tersimpan & Di-Approve</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
                        <AlertCircle className="w-4 h-4" />
                        <span>Belum Ada Rekaman Resmi</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RECORDING & VERIFICATION CONTROLS */}
                <div className="w-full max-w-xl flex flex-col items-center space-y-4">
                  {/* Live Recording HUD with Timer & VU-Meter */}
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 flex flex-col items-center gap-2.5 shadow-lg"
                    >
                      <div className="flex items-center justify-between w-full px-2">
                        <div className="flex items-center gap-2 text-rose-700 font-black text-sm">
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                          </span>
                          <span>Sedang Merekam Suara...</span>
                        </div>
                        <div className="font-mono font-black text-lg text-rose-700 bg-white px-3 py-0.5 rounded-xl border border-rose-200 shadow-sm">
                          {(recordDuration / 1000).toFixed(1)}s
                        </div>
                      </div>

                      {/* Live Microphone Visual VU-Meter */}
                      <div className="w-full px-2 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-600">
                          <span>Indikator Mikrofon:</span>
                          <span className={micLevel > 15 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                            {micLevel > 15 ? '🟢 Suara Terdeteksi' : micLevel > 0 ? '🟡 Mendeteksi...' : '⚪ Hening'}
                          </span>
                        </div>
                        <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                          <motion.div
                            className={`h-full rounded-full transition-all duration-75 ${
                              micLevel > 60
                                ? 'bg-rose-500'
                                : micLevel > 20
                                ? 'bg-emerald-500'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${Math.max(4, micLevel)}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Main Record & Approved Playback Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                    {isRecording ? (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2.5 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-600/30 active:scale-95 transition"
                      >
                        <Square className="w-5 h-5 fill-current" />
                        <span>Selesai Rekam (Stop)</span>
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2.5 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition"
                      >
                        <Mic className="w-5 h-5" />
                        <span>{draftAudio || isCurrentApproved ? 'Rekam Ulang' : 'Mulai Rekam Suara'}</span>
                      </button>
                    )}

                    {/* Existing Approved Audio Playback */}
                    {isCurrentApproved && !draftAudio && !isRecording && (
                      <button
                        onClick={playApprovedAudio}
                        className={`flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm shadow-md transition active:scale-95 ${
                          isPlayingApproved
                            ? 'bg-emerald-600 text-white shadow-emerald-600/30 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isPlayingApproved ? 'Memutar...' : 'Putar Suara Resmi'}</span>
                      </button>
                    )}
                  </div>

                  {/* DEDICATED DRAFT AUDIO RESULT CARD (Visible whenever draft exists) */}
                  {draftAudio && !isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="w-full bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 shadow-lg space-y-4"
                    >
                      {/* Draft Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                          </span>
                          <span className="text-sm font-black text-amber-900">
                            Hasil Rekaman Baru (Draft Siap)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                          <span className="px-2.5 py-0.5 bg-amber-200/80 rounded-full">
                            ⏱️ {(draftAudio.durationMs / 1000).toFixed(1)}s
                          </span>
                          <span className="px-2.5 py-0.5 bg-amber-200/80 rounded-full">
                            📦 {(draftAudio.sizeBytes / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>

                      {/* Interactive Player Controls */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-amber-200 shadow-inner">
                        <button
                          onClick={playDraftAudio}
                          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-sm shadow-md transition active:scale-95 whitespace-nowrap ${
                            isPlayingDraft
                              ? 'bg-amber-500 text-white shadow-amber-500/30 animate-pulse'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                          }`}
                        >
                          {isPlayingDraft ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current" />
                          )}
                          <span>{isPlayingDraft ? 'Pause' : 'Dengarkan Rekaman'}</span>
                        </button>

                        {/* Browser native audio player */}
                        <div className="flex-1 w-full flex items-center">
                          <audio
                            controls
                            src={draftAudio.url}
                            className="w-full h-10 rounded-lg focus:outline-none"
                            preload="auto"
                          />
                        </div>
                      </div>

                      {/* Actions: Cancel Draft & Approve */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => {
                            stopPlayback();
                            if (draftAudio.url) URL.revokeObjectURL(draftAudio.url);
                            setDraftAudio(null);
                          }}
                          className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition"
                        >
                          <RotateCcw className="w-4 h-4 text-slate-400" />
                          <span>Batalkan Draft</span>
                        </button>

                        <button
                          onClick={handleApprove}
                          className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Approve & Simpan (Enter)</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Delete Button for already approved item */}
                  {isCurrentApproved && !draftAudio && !isRecording && (
                    <button
                      onClick={() => handleDeleteRecording(currentItem.id)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition pt-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Suara Resmi Soal Ini</span>
                    </button>
                  )}
                </div>

                {/* BOTTOM NAVIGATION: Next / Prev Question */}
                <div className="flex items-center justify-between w-full pt-4 border-t border-slate-200">
                  <button
                    onClick={() => selectQuestion(selectedIndex - 1)}
                    disabled={selectedIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya (←)</span>
                  </button>

                  {/* Keyboard Shortcuts Hint */}
                  <span className="hidden sm:inline text-[11px] font-semibold text-slate-400">
                    💡 Pintasan: [Spasi] Rekam • [P] Dengar • [Enter] Approve
                  </span>

                  <button
                    onClick={() => selectQuestion(selectedIndex + 1)}
                    disabled={selectedIndex === filteredQuestions.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 transition"
                  >
                    <span>Berikutnya (→)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                Pilih salah satu soal di bilah samping.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
