import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  Play,
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
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded' | 'playing'>('idle');
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [draftBlob, setDraftBlob] = useState<Blob | null>(null);
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Refs for recording & audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Clean up object URLs when draft changes
  useEffect(() => {
    return () => {
      if (draftUrl) {
        URL.revokeObjectURL(draftUrl);
      }
    };
  }, [draftUrl]);

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

  // Reset draft when selecting another question
  const selectQuestion = (idx: number) => {
    stopPlayback();
    if (recordingStatus === 'recording') {
      stopRecording();
    }
    setDraftBlob(null);
    if (draftUrl) URL.revokeObjectURL(draftUrl);
    setDraftUrl(null);
    setRecordingStatus('idle');
    setRecordDuration(0);
    setSelectedIndex(idx);
  };

  // Notification helper
  const showNotice = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Audio Recording Handlers
  const startRecording = async () => {
    stopPlayback();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine best supported MIME type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else mimeType = '';
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setDraftBlob(blob);
        setDraftUrl(url);
        setRecordingStatus('recorded');
      };

      recorder.start(100);
      setRecordingStatus('recording');
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
      setRecordingStatus('idle');
    }
  };

  const stopRecording = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      soundManager.playPop();
    }
  };

  // Playback handlers
  const playAudio = (url: string) => {
    stopPlayback();
    const audio = new Audio(url);
    playbackAudioRef.current = audio;
    setRecordingStatus('playing');

    audio.onended = () => {
      setRecordingStatus(draftBlob ? 'recorded' : 'idle');
      playbackAudioRef.current = null;
    };
    audio.onerror = () => {
      setRecordingStatus(draftBlob ? 'recorded' : 'idle');
      playbackAudioRef.current = null;
    };
    audio.play().catch(() => {
      setRecordingStatus(draftBlob ? 'recorded' : 'idle');
    });
  };

  const stopPlayback = () => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current.currentTime = 0;
      playbackAudioRef.current = null;
    }
  };

  // Approval Handler
  const handleApprove = async () => {
    if (!draftBlob || !currentItem) return;

    try {
      const record: StudioRecordingRecord = {
        questionId: currentItem.id,
        targetLetter: currentItem.targetLetter,
        targetName: currentItem.targetName,
        bookLevel: currentItem.bookLevel,
        stageId: currentItem.stageId,
        stageType: currentItem.stageType,
        promptText: currentItem.promptText,
        blob: draftBlob,
        durationMs: recordDuration,
        mimeType: draftBlob.type || 'audio/webm',
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
      showNotice('success', `Audio soal ${currentItem.targetName || currentItem.targetLetter} berhasil di-approve!`);

      // Clear draft
      setDraftBlob(null);
      if (draftUrl) URL.revokeObjectURL(draftUrl);
      setDraftUrl(null);
      setRecordingStatus('idle');

      // Auto advance to next question
      if (selectedIndex < filteredQuestions.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    } catch (err) {
      console.error('Save error:', err);
      showNotice('error', 'Gagal menyimpan rekaman ke IndexedDB.');
    }
  };

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
      showNotice('info', 'Rekaman berhasil dihapus.');
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
        if (recordingStatus === 'idle' || recordingStatus === 'recorded') {
          startRecording();
        } else if (recordingStatus === 'recording') {
          stopRecording();
        }
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        if (draftUrl) {
          playAudio(draftUrl);
        } else if (currentApprovedRecord?.blob) {
          const url = URL.createObjectURL(currentApprovedRecord.blob);
          playAudio(url);
        }
      } else if (e.code === 'Enter' || e.code === 'KeyA') {
        if (draftBlob && recordingStatus === 'recorded') {
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
  }, [isOpen, recordingStatus, draftBlob, draftUrl, selectedIndex, filteredQuestions.length, currentApprovedRecord]);

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
                <div className="w-full max-w-md flex flex-col items-center space-y-4">
                  {/* Timer Display when Recording */}
                  {recordingStatus === 'recording' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 font-mono font-black text-lg rounded-2xl border border-rose-200 animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-rose-600" />
                      <span>{(recordDuration / 1000).toFixed(1)}s</span>
                    </div>
                  )}

                  {/* Main Record Buttons */}
                  <div className="flex items-center justify-center gap-4 w-full">
                    {recordingStatus === 'recording' ? (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2.5 px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-500/30 active:scale-95 transition"
                      >
                        <Square className="w-5 h-5 fill-current" />
                        <span>Selesai Rekam (Stop)</span>
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2.5 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition"
                      >
                        <Mic className="w-5 h-5" />
                        <span>
                          {draftBlob || isCurrentApproved ? 'Rekam Ulang' : 'Mulai Rekam Suara'}
                        </span>
                      </button>
                    )}

                    {/* Preview Player if Draft exists */}
                    {draftUrl && recordingStatus !== 'recording' && (
                      <button
                        onClick={() => playAudio(draftUrl)}
                        className="flex items-center gap-2 px-4 py-4 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-blue-500/20 active:scale-95 transition"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Dengar Hasil</span>
                      </button>
                    )}

                    {/* Existing Approved Audio Playback */}
                    {isCurrentApproved && !draftUrl && recordingStatus !== 'recording' && (
                      <button
                        onClick={() => {
                          if (currentApprovedRecord?.blob) {
                            const url = URL.createObjectURL(currentApprovedRecord.blob);
                            playAudio(url);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-4 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm rounded-2xl shadow-md active:scale-95 transition"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Putar Suara Resmi</span>
                      </button>
                    )}
                  </div>

                  {/* APPROVAL ACTION BAR (When draft is ready) */}
                  {draftBlob && recordingStatus === 'recorded' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-400 shadow-md"
                    >
                      <button
                        onClick={() => {
                          setDraftBlob(null);
                          if (draftUrl) URL.revokeObjectURL(draftUrl);
                          setDraftUrl(null);
                          setRecordingStatus('idle');
                        }}
                        className="flex items-center justify-center gap-1.5 flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                        <span>Batalkan Draft</span>
                      </button>

                      <button
                        onClick={handleApprove}
                        className="flex items-center justify-center gap-2 flex-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md shadow-emerald-500/25 active:scale-95 transition"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Approve & Simpan (Enter)</span>
                      </button>
                    </motion.div>
                  )}

                  {/* Delete Button for already approved item */}
                  {isCurrentApproved && !draftBlob && (
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
