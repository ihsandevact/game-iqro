import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Download,
  Upload,
  Search,
  Volume2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Trash2,
  Radio,
  Sliders,
  MoreVertical,
  ListFilter,
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
  onBack: () => void;
  isOpen?: boolean; // For backwards compatibility
  onClose?: () => void;
}

export const QariStudioDashboard: React.FC<QariStudioDashboardProps> = ({
  onBack,
  isOpen = true,
  onClose,
}) => {
  const handleBack = onBack || onClose || (() => {});

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

  // Mobile navigation tab: 'prompter' (default recording view) or 'list' (question browser)
  const [mobileTab, setMobileTab] = useState<'prompter' | 'list'>('prompter');

  // Mobile overflow options menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Approved recordings loaded from IndexedDB
  const [approvedRecords, setApprovedRecords] = useState<Record<string, StudioRecordingRecord>>({});
  const [isVoiceOverrideActive, setIsVoiceOverrideActive] = useState<boolean>(false);

  // Audio Device state
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [activeDeviceLabel, setActiveDeviceLabel] = useState<string>('');
  const [isHardwareMuted, setIsHardwareMuted] = useState<boolean>(false);
  const [isTestingMic, setIsTestingMic] = useState<boolean>(false);
  const [isMicModalOpen, setIsMicModalOpen] = useState<boolean>(false);

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

  // Web Audio refs for VU-meter (prevent GC)
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Enumerate input devices
  const refreshAudioDevices = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices.filter((d) => d.kind === 'audioinput');
      setAudioDevices(inputs);
      if (inputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(inputs[0].deviceId);
        if (inputs[0].label) {
          setActiveDeviceLabel(inputs[0].label);
        }
      }
    } catch (e) {
      console.warn('enumerateDevices error:', e);
    }
  }, [selectedDeviceId]);

  // Load all existing recordings and audio devices on mount
  useEffect(() => {
    if (isOpen) {
      loadRecords();
      setIsVoiceOverrideActive(isStudioVoiceEnabled());
      refreshAudioDevices();
    }
  }, [isOpen, refreshAudioDevices]);

  const loadRecords = async () => {
    try {
      const records = await getAllStudioRecordings();
      setApprovedRecords(records);
    } catch {
      setApprovedRecords({});
    }
  };

  const cleanupAudioContext = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      sourceNodeRef.current = null;
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
    setIsHardwareMuted(false);
  }, []);

  // Clean up object URLs when draft changes or unmounts
  useEffect(() => {
    return () => {
      if (draftAudio?.url) {
        URL.revokeObjectURL(draftAudio.url);
      }
      cleanupAudioContext();
    };
  }, [draftAudio, cleanupAudioContext]);

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
    }, 4500);
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

  // Stop recording handler
  const stopRecording = useCallback(() => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.requestData();
      } catch (e) {
        console.warn('requestData error:', e);
      }
      mediaRecorderRef.current.stop();
      soundManager.playPop();
    }
  }, []);

  // Reset draft when selecting another question
  const selectQuestion = (idx: number, autoSwitchMobileTab = true) => {
    stopPlayback();
    if (isRecording) {
      stopRecording();
    }
    if (isTestingMic) {
      cleanupAudioContext();
      setIsTestingMic(false);
    }
    if (draftAudio?.url) {
      URL.revokeObjectURL(draftAudio.url);
    }
    setDraftAudio(null);
    setRecordDuration(0);
    setSelectedIndex(idx);
    if (autoSwitchMobileTab) {
      setMobileTab('prompter');
    }
  };

  // Setup Audio Stream & High-Sensitivity Time-Domain RMS VU-Meter
  const setupAudioStreamAndVU = async (deviceId?: string): Promise<{ stream: MediaStream; ctx: AudioContext }> => {
    cleanupAudioContext();

    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
      },
    };

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    micStreamRef.current = stream;

    const track = stream.getAudioTracks()[0];
    if (track) {
      setActiveDeviceLabel(track.label || 'Mikrofon Bawaan Laptop');
      setIsHardwareMuted(track.muted);
      track.onmute = () => setIsHardwareMuted(true);
      track.onunmute = () => setIsHardwareMuted(false);
    }

    refreshAudioDevices();

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    audioContextRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.2;
    analyserRef.current = analyser;

    const source = ctx.createMediaStreamSource(stream);
    sourceNodeRef.current = source;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.fftSize);
    const updateLevel = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteTimeDomainData(dataArray);

      let sumSquares = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const norm = (dataArray[i] - 128) / 128;
        sumSquares += norm * norm;
      }
      const rms = Math.sqrt(sumSquares / dataArray.length);
      const normalized = Math.min(100, Math.round(rms * 450));
      setMicLevel(normalized);

      animFrameRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();

    return { stream, ctx };
  };

  // Toggle Live Microphone Test Mode
  const toggleTestMic = async () => {
    if (isTestingMic) {
      cleanupAudioContext();
      setIsTestingMic(false);
      return;
    }

    stopPlayback();
    if (isRecording) {
      stopRecording();
    }

    try {
      await setupAudioStreamAndVU(selectedDeviceId);
      setIsTestingMic(true);
      showNotice('info', 'Mode Tes Mic Aktif. Silakan bersuara untuk melihat bar bergerak.');
    } catch (err) {
      console.error('Tes mic error:', err);
      showNotice('error', 'Gagal mengakses mikrofon untuk pengujian.');
      setIsTestingMic(false);
    }
  };

  // Audio Recording Handlers
  const startRecording = async () => {
    stopPlayback();
    if (isTestingMic) {
      cleanupAudioContext();
      setIsTestingMic(false);
    }

    try {
      const { stream } = await setupAudioStreamAndVU(selectedDeviceId);

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
        cleanupAudioContext();

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
      showNotice('error', `Gagal memutar audio (${msg}). Silakan coba putar melalui pemutar audio.`);
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

      if (isVoiceOverrideActive) {
        await ttsNarrator.loadStudioRecordings();
      }

      soundManager.playCorrect();
      confetti({ particleCount: 35, spread: 65, origin: { y: 0.8 } });
      showNotice('success', `Audio soal "${currentItem.targetName || currentItem.targetLetter}" berhasil di-approve!`);

      stopPlayback();
      if (draftAudio.url) URL.revokeObjectURL(draftAudio.url);
      setDraftAudio(null);

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
      setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  // Export to ZIP
  const handleExportZip = async () => {
    const total = Object.keys(approvedRecords).length;
    if (total === 0) {
      showNotice('error', 'Belum ada rekaman yang di-approve untuk diekspor!');
      return;
    }

    setIsExporting(true);
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
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
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') return;

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
          selectQuestion(selectedIndex + 1, false);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (selectedIndex > 0) {
          selectQuestion(selectedIndex - 1, false);
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

  // Sub-component: Question Sidebar List (Reused in Desktop sidebar & Mobile list tab)
  const renderQuestionList = () => (
    <div className="flex flex-col h-full w-full bg-slate-50 overflow-hidden">
      {/* Level Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setSelectedLevel('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition ${
            selectedLevel === 'all'
              ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua
        </button>
        {[1, 2, 3, 4, 5, 6].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition ${
              selectedLevel === lvl
                ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iqro {lvl}
          </button>
        ))}
      </div>

      {/* Filter Bar: Search & Status */}
      <div className="p-2.5 sm:p-3 border-b border-slate-200 space-y-2 bg-white shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari huruf, kata, target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent"
          />
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({filteredQuestions.length})
          </button>
          <button
            onClick={() => setStatusFilter('unrecorded')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition ${
              statusFilter === 'unrecorded'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Belum ({allQuestions.filter((q) => !approvedRecords[q.id]).length})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition ${
              statusFilter === 'approved'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approved ({totalApproved})
          </button>
        </div>
      </div>

      {/* Scrollable Question Items */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1.5">
        {filteredQuestions.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-semibold">
            Tidak ada soal yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredQuestions.map((item, idx) => {
            const isApproved = !!approvedRecords[item.id];
            const isSelected = idx === selectedIndex;
            const hasDraft = isSelected && !!draftAudio;

            return (
              <button
                key={item.id}
                onClick={() => selectQuestion(idx, true)}
                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-left border transition ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {isApproved ? (
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 text-slate-400 shrink-0">
                      <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-slate-800 truncate">
                        {item.targetName || item.targetLetter}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded shrink-0">
                        Iqro {item.bookLevel}
                      </span>
                      {hasDraft && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-300 animate-pulse shrink-0">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">
                      {item.stageTitle}
                    </p>
                  </div>
                </div>

                <span className="font-amiri text-lg font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50/70 rounded-lg shrink-0 ml-2">
                  {item.targetLetter}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // Sub-component: Prompter & Studio Recording Core Area
  const renderPrompterArea = () => (
    <div className="flex-1 flex flex-col justify-between w-full max-w-2xl mx-auto space-y-3 sm:space-y-4 py-1 sm:py-4 px-1 sm:px-6">
      {/* Mobile Question Quick Switcher Header (Visible only on mobile) */}
      <div className="flex md:hidden items-center justify-between bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-2xl w-full">
        <button
          onClick={() => selectQuestion(selectedIndex - 1, false)}
          disabled={selectedIndex === 0}
          className="p-1.5 text-slate-600 disabled:opacity-30 rounded-lg hover:bg-slate-200 active:scale-95 transition"
          title="Soal Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center min-w-0 px-2 text-center">
          <span className="text-[11px] font-black text-slate-800 truncate">
            Soal {selectedIndex + 1} dari {filteredQuestions.length} • {currentItem?.targetName || currentItem?.targetLetter}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 truncate">
            {currentItem?.bookTitle}
          </span>
        </div>

        <button
          onClick={() => selectQuestion(selectedIndex + 1, false)}
          disabled={selectedIndex === filteredQuestions.length - 1}
          className="p-1.5 text-slate-600 disabled:opacity-30 rounded-lg hover:bg-slate-200 active:scale-95 transition"
          title="Soal Berikutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Stage Info Breadcrumb */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl border border-emerald-300">
          {currentItem?.bookTitle}
        </span>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200">
          {currentItem?.unitTitle}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200">
          {currentItem?.stageTitle}
        </span>
      </div>

      {/* BIG PROMPTER CARD (Compact on mobile) */}
      <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-b from-slate-50 to-emerald-50/40 rounded-3xl border-2 border-emerald-200 shadow-md text-center relative overflow-hidden">
        <div className="text-[10px] sm:text-xs font-extrabold text-emerald-600 tracking-wider uppercase mb-0.5">
          LAFAL YANG HARUS DIBACAKAN:
        </div>

        {/* Responsive Arabic Text: Dynamic Scale without horizontal clipping */}
        <div className="font-amiri text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-800 my-1 sm:my-2 select-none leading-normal break-keep">
          {currentItem?.targetLetter}
        </div>

        {/* Transliteration / Guide */}
        <div className="text-base sm:text-xl md:text-2xl font-black text-emerald-700 tracking-wide">
          "{currentItem?.targetName || currentItem?.targetLetter}"
        </div>

        {/* Makhraj / Harakat Hint */}
        {currentItem?.hint && (
          <div className="mt-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-xl text-[11px] sm:text-xs font-semibold text-slate-600 border border-slate-200 max-w-md">
            💡 {currentItem.hint}
          </div>
        )}

        {/* Approval Status Badge */}
        <div className="mt-2.5">
          {isCurrentApproved ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 bg-emerald-500 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tersimpan & Di-Approve</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 bg-amber-100 text-amber-800 text-[11px] sm:text-xs font-bold rounded-full border border-amber-300">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Belum Ada Rekaman Resmi</span>
            </div>
          )}
        </div>
      </div>

      {/* MICROPHONE SELECTOR & TEST BAR (100% Responsive 2-Row Stack) */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Pilihan Mikrofon:</span>
          </div>

          <button
            onClick={toggleTestMic}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 border transition shrink-0 ${
              isTestingMic
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isTestingMic ? 'Tutup Tes' : 'Tes Mic'}</span>
          </button>
        </div>

        {/* Trigger Button to open BottomSheet / Modal */}
        <button
          onClick={() => {
            refreshAudioDevices();
            setIsMicModalOpen(true);
          }}
          className="w-full flex items-center justify-between bg-white hover:bg-slate-50 active:scale-[0.99] border-2 border-slate-200 hover:border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs transition text-left"
          title="Klik untuk memilih mikrofon"
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">
              {audioDevices.find((d) => d.deviceId === selectedDeviceId)?.label || activeDeviceLabel || 'Pilih Mikrofon'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* HARDWARE MUTE WARNING BANNER */}
      {isHardwareMuted && (
        <div className="w-full bg-amber-500 text-white p-2.5 sm:p-3 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-md animate-bounce">
          <MicOff className="w-4 h-4 shrink-0" />
          <span>
            ⚠️ Mikrofon terdeteksi DI-MUTE oleh tombol keyboard laptop (F4) atau sistem Windows. Tekan tombol tersebut untuk menyalakan suara.
          </span>
        </div>
      )}

      {/* LIVE MIC TEST MODE HUD */}
      {isTestingMic && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span className="flex items-center gap-1.5 truncate">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-spin shrink-0" />
              Mode Tes Mic Aktif
            </span>
            <span className={micLevel > 15 ? 'text-emerald-700 font-black' : 'text-slate-400'}>
              {micLevel > 15 ? `🟢 Suara Masuk (${micLevel}%)` : '⚪ Hening'}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
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
        </motion.div>
      )}

      {/* RECORDING & VERIFICATION CONTROLS */}
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Live Recording HUD with Timer & VU-Meter */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-rose-50 border-2 border-rose-300 rounded-3xl p-3 sm:p-4 flex flex-col items-center gap-2 shadow-lg"
          >
            <div className="flex items-center justify-between w-full px-1">
              <div className="flex items-center gap-2 text-rose-700 font-black text-xs sm:text-sm">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
                <span>Sedang Merekam Suara...</span>
              </div>
              <div className="font-mono font-black text-base text-rose-700 bg-white px-2.5 py-0.5 rounded-xl border border-rose-200 shadow-sm">
                {(recordDuration / 1000).toFixed(1)}s
              </div>
            </div>

            {/* Live Microphone Visual VU-Meter */}
            <div className="w-full px-1 space-y-1">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-600">
                <span>Level Suara Mikrofon:</span>
                <span className={micLevel > 15 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                  {micLevel > 15 ? `🟢 Suara Terdeteksi (${micLevel}%)` : '⚪ Hening'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-600/30 active:scale-95 transition"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Selesai Rekam (Stop)</span>
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition"
            >
              <Mic className="w-5 h-5" />
              <span>{draftAudio || isCurrentApproved ? 'Rekam Ulang' : 'Mulai Rekam Suara'}</span>
            </button>
          )}

          {/* Existing Approved Audio Playback */}
          {isCurrentApproved && !draftAudio && !isRecording && (
            <button
              onClick={playApprovedAudio}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 rounded-2xl font-bold text-sm shadow-md transition active:scale-95 ${
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
            className="w-full bg-amber-50/95 border-2 border-amber-300 rounded-3xl p-3.5 sm:p-5 shadow-lg space-y-3"
          >
            {/* Draft Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-900">
                  Hasil Rekaman Baru (Draft Siap)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-800">
                <span className="px-2 py-0.5 bg-amber-200/80 rounded-full">
                  ⏱️ {(draftAudio.durationMs / 1000).toFixed(1)}s
                </span>
                <span className="px-2 py-0.5 bg-amber-200/80 rounded-full">
                  📦 {(draftAudio.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            {/* Interactive Player Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-amber-200 shadow-inner">
              <button
                onClick={playDraftAudio}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition active:scale-95 whitespace-nowrap w-full sm:w-auto ${
                  isPlayingDraft
                    ? 'bg-amber-500 text-white shadow-amber-500/30 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                }`}
              >
                {isPlayingDraft ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{isPlayingDraft ? 'Pause' : 'Dengarkan Rekaman'}</span>
              </button>

              <div className="flex-1 w-full flex items-center">
                <audio
                  controls
                  src={draftAudio.url}
                  className="w-full h-9 sm:h-10 rounded-lg focus:outline-none"
                  preload="auto"
                />
              </div>
            </div>

            {/* Actions: Cancel Draft & Approve */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1">
              <button
                onClick={() => {
                  stopPlayback();
                  if (draftAudio.url) URL.revokeObjectURL(draftAudio.url);
                  setDraftAudio(null);
                }}
                className="flex items-center justify-center gap-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Batal</span>
              </button>

              <button
                onClick={handleApprove}
                className="flex items-center justify-center gap-2 flex-1 py-3 sm:py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Approve & Simpan</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Delete Button for already approved item */}
        {isCurrentApproved && !draftAudio && !isRecording && (
          <button
            onClick={() => handleDeleteRecording(currentItem.id)}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition pt-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Suara Resmi Soal Ini</span>
          </button>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="flex md:hidden items-center justify-between w-full pt-2 pb-4 border-t border-slate-200">
        <button
          onClick={() => selectQuestion(selectedIndex - 1, false)}
          disabled={selectedIndex === 0}
          className="flex items-center gap-1 px-3 py-2 bg-slate-100 active:scale-95 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-30 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={() => setMobileTab('list')}
          className="text-xs font-black text-emerald-600 hover:text-emerald-700 py-1 px-2 rounded-lg"
        >
          Daftar Soal ({selectedIndex + 1}/{filteredQuestions.length})
        </button>

        <button
          onClick={() => selectQuestion(selectedIndex + 1, false)}
          disabled={selectedIndex === filteredQuestions.length - 1}
          className="flex items-center gap-1 px-3 py-2 bg-slate-100 active:scale-95 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-30 transition"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* DESKTOP BOTTOM NAVIGATION: Next / Prev Question & Shortcuts */}
      <div className="hidden md:flex items-center justify-between w-full pt-4 border-t border-slate-200">
        <button
          onClick={() => selectQuestion(selectedIndex - 1, false)}
          disabled={selectedIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya (←)</span>
        </button>

        <span className="text-[11px] font-semibold text-slate-400">
          💡 Pintasan: [Spasi] Rekam • [P] Dengar • [Enter] Approve
        </span>

        <button
          onClick={() => selectQuestion(selectedIndex + 1, false)}
          disabled={selectedIndex === filteredQuestions.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 transition"
        >
          <span>Berikutnya (→)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full max-w-full bg-slate-100 flex flex-col font-sans select-none text-slate-800 overflow-x-hidden">
      {/* 1. TOP DEDICATED HEADER: Back Button, Progress & Actions (Guaranteed Zero Horizontal Overflow) */}
      <header className="sticky top-0 z-40 w-full bg-white border-b-2 border-slate-200 py-1.5 sm:py-2.5 px-2 sm:px-6 shadow-xs select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4">
          {/* Left: Back to Game Button & Branding */}
          <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs sm:text-sm rounded-xl border border-slate-200 transition shrink-0"
              title="Kembali ke Peta Permainan"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <div className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/20 shrink-0">
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 truncate">
                  <h1 className="text-xs sm:text-base font-black text-slate-800 tracking-tight truncate">
                    Studio Qari
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-extrabold px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded border border-emerald-300 shrink-0">
                    1–6
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Progress Bar (Desktop & Tablet) */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 gap-4 mb-1">
                <span>Progres Rekaman</span>
                <span className="text-emerald-600 font-black">
                  {totalApproved} / {totalQuestionsCount} ({progressPercent}%)
                </span>
              </div>
              <div className="w-44 h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Progress Pill */}
            <div className="flex lg:hidden items-center text-[10px] sm:text-[11px] font-black px-1.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl shrink-0 whitespace-nowrap">
              {totalApproved}/{totalQuestionsCount}
            </div>

            {/* Mobile 1-Tap Voice Override Toggle Pill */}
            <button
              onClick={handleToggleVoiceOverride}
              className={`flex md:hidden items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-black border transition shrink-0 ${
                isVoiceOverrideActive
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title="Aktifkan atau nonaktifkan audio studio di dalam permainan"
            >
              <Volume2 className="w-3 h-3" />
              <span>{isVoiceOverrideActive ? 'Aktif' : 'Game: Off'}</span>
            </button>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={handleToggleVoiceOverride}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  isVoiceOverrideActive
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="Jika aktif, audio studio Anda akan langsung dimainkan saat anak bermain di level game"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isVoiceOverrideActive ? 'Suara Studio Aktif' : 'Pakai di Game'}</span>
              </button>

              <button
                onClick={handleExportZip}
                disabled={isExporting || totalApproved === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs disabled:opacity-50 transition"
                title="Unduh seluruh audio yang di-approve dalam bentuk ZIP"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>{isExporting ? 'Mengekspor...' : 'Ekspor ZIP'}</span>
              </button>

              <label
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs cursor-pointer disabled:opacity-50 transition"
                title="Pulihkan rekaman dari berkas ZIP"
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

              {totalApproved > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-rose-200 shadow-2xs transition"
                  title="Hapus semua rekaman browser"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              )}
            </div>

            {/* Mobile Options Menu Trigger */}
            <div className="relative md:hidden shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition"
                title="Menu Pengaturan Studio"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Mobile Options Dropdown Popover */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-10 w-56 bg-white border-2 border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-bold space-y-1">
                  <button
                    onClick={handleToggleVoiceOverride}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>{isVoiceOverrideActive ? 'Nonaktifkan di Game' : 'Aktifkan Suara di Game'}</span>
                  </button>

                  <button
                    onClick={handleExportZip}
                    disabled={isExporting || totalApproved === 0}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Ekspor Berkas ZIP</span>
                  </button>

                  <label className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 cursor-pointer">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Impor dari ZIP</span>
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      disabled={isImporting}
                      className="hidden"
                    />
                  </label>

                  {totalApproved > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-rose-50 text-rose-600 border-t border-slate-100 pt-2"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                      <span>Reset Semua Rekaman</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 border max-w-[90vw] truncate ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : notification.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MOBILE TAB SWITCHER: Visible ONLY on mobile (< md) */}
      <div className="md:hidden flex items-center bg-white border-b border-slate-200 px-2.5 py-1.5 sticky top-[49px] z-30 w-full">
        <div className="flex w-full bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMobileTab('prompter')}
            className={`flex-1 py-1.5 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'prompter'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Prompter Rekam</span>
          </button>
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-1.5 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'list'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Daftar Soal ({filteredQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER (Zero horizontal overflow) */}
      <div className="flex-1 flex overflow-hidden w-full max-w-full">
        {/* DESKTOP SPLIT VIEW (>= md): Left Sidebar always visible */}
        <aside className="hidden md:flex w-80 lg:w-96 flex-col bg-slate-50 border-r border-slate-200 h-[calc(100vh-64px)] shrink-0">
          {renderQuestionList()}
        </aside>

        {/* DESKTOP MAIN PROMPTER (>= md) */}
        <main className="hidden md:flex flex-1 flex-col justify-between bg-white overflow-y-auto h-[calc(100vh-64px)]">
          {renderPrompterArea()}
        </main>

        {/* MOBILE VIEW (< md): Switch between Prompter or Question List Tab */}
        <div className="flex md:hidden flex-1 flex-col w-full max-w-full min-h-[calc(100vh-95px)] bg-white overflow-y-auto overflow-x-hidden p-2.5">
          {mobileTab === 'prompter' ? renderPrompterArea() : renderQuestionList()}
        </div>
      </div>

      {/* 4. BOTTOMSHEET / MODAL UNTUK PEMILIHAN MIKROFON */}
      <AnimatePresence>
        {isMicModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
            {/* Click backdrop to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setIsMicModalOpen(false)}
            />

            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 max-h-[80vh] flex flex-col overflow-hidden"
            >
              {/* Mobile Drag Pill */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">Pilih Mikrofon</h3>
                    <p className="text-[10px] font-semibold text-slate-400">Pilih perangkat audio untuk rekaman</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMicModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List of Microphones */}
              <div className="p-4 space-y-2 overflow-y-auto flex-1">
                {audioDevices.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-slate-200">
                    Tidak ada mikrofon eksternal yang terdeteksi. Sistem menggunakan mikrofon default.
                  </div>
                ) : (
                  audioDevices.map((dev, i) => {
                    const isSelected = dev.deviceId === selectedDeviceId || (!selectedDeviceId && i === 0);
                    const label = dev.label || `Mikrofon ${i + 1}`;

                    return (
                      <button
                        key={dev.deviceId || i}
                        onClick={() => {
                          setSelectedDeviceId(dev.deviceId);
                          setActiveDeviceLabel(label);
                          if (isTestingMic) {
                            setupAudioStreamAndVU(dev.deviceId);
                          }
                          setIsMicModalOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Mic className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-800 truncate">
                              {label}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400 truncate">
                              {label.toLowerCase().includes('realtek')
                                ? 'Mikrofon Bawaan Laptop'
                                : label.toLowerCase().includes('default')
                                ? 'Perangkat Default Sistem'
                                : 'Perangkat Audio Input'}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer Helper */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] font-semibold text-slate-500 text-center">
                💡 Pilih <b>"Microphone Array (Realtek)"</b> untuk mikrofon bawaan laptop Anda.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
