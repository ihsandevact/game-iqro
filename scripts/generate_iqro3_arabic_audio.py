import asyncio
import os
import sys
import array
import math
import edge_tts
import miniaudio
import lameenc

VOICE = "ar-EG-ShakirNeural"
RATE = "-5%"
PITCH = "+0Hz"

IQRO3_ITEMS = [
    # 1. Kasrah (-i)
    ("letters/i.mp3", "إِ"),
    ("letters/bi.mp3", "بِ"),
    ("letters/ti.mp3", "تِ"),
    ("letters/tsi.mp3", "ثِ"),
    ("letters/ji.mp3", "جِ"),
    ("letters/hi.mp3", "حِ"),
    ("letters/khi.mp3", "خِ"),
    ("letters/di.mp3", "دِ"),
    ("letters/dzi.mp3", "ذِ"),
    ("letters/ri.mp3", "رِ"),
    ("letters/zi.mp3", "زِ"),
    ("letters/si.mp3", "سِ"),
    ("letters/syi.mp3", "شِ"),
    ("letters/shi.mp3", "صِ"),
    ("letters/dhi.mp3", "ضِ"),
    ("letters/thi.mp3", "طِ"),
    ("letters/zhi.mp3", "ظِ"),
    ("letters/ain_i.mp3", "عِ"),
    ("letters/ghi.mp3", "غِ"),
    ("letters/fi.mp3", "فِ"),
    ("letters/qi.mp3", "قِ"),
    ("letters/ki.mp3", "كِ"),
    ("letters/li.mp3", "لِ"),
    ("letters/mi.mp3", "مِ"),
    ("letters/ni.mp3", "نِ"),
    ("letters/wi.mp3", "وِ"),
    ("letters/hii.mp3", "هِ"),
    ("letters/yi.mp3", "يِ"),

    # 2. Dhammah (-u)
    ("letters/u.mp3", "أُ"),
    ("letters/bu.mp3", "بُ"),
    ("letters/tu.mp3", "تُ"),
    ("letters/tsu.mp3", "ثُ"),
    ("letters/ju.mp3", "جُ"),
    ("letters/hu.mp3", "حُ"),
    ("letters/khu.mp3", "خُ"),
    ("letters/du.mp3", "دُ"),
    ("letters/dzu.mp3", "ذُ"),
    ("letters/ru.mp3", "رُ"),
    ("letters/zu.mp3", "زُ"),
    ("letters/su.mp3", "سُ"),
    ("letters/syu.mp3", "شُ"),
    ("letters/shu.mp3", "صُ"),
    ("letters/dhu.mp3", "ضُ"),
    ("letters/thu.mp3", "طُ"),
    ("letters/zhu.mp3", "ظُ"),
    ("letters/ain_u.mp3", "عُ"),
    ("letters/ghu.mp3", "غُ"),
    ("letters/fu.mp3", "فُ"),
    ("letters/qu.mp3", "قُ"),
    ("letters/ku.mp3", "كُ"),
    ("letters/lu.mp3", "لُ"),
    ("letters/mu.mp3", "مُ"),
    ("letters/nu.mp3", "نُ"),
    ("letters/wu.mp3", "وُ"),
    ("letters/huu.mp3", "هُ"),
    ("letters/yu.mp3", "يُ"),

    # 3. Mad Asli Kasrah (2 Harakat)
    ("letters/bii.mp3", "بِيْ"),
    ("letters/tii.mp3", "تِيْ"),
    ("letters/tsii.mp3", "ثِيْ"),
    ("letters/jii.mp3", "جِيْ"),
    ("letters/dii.mp3", "دِيْ"),
    ("letters/rii.mp3", "رِيْ"),
    ("letters/sii.mp3", "سِيْ"),
    ("letters/fii.mp3", "فِيْ"),
    ("letters/qii.mp3", "قِيْ"),
    ("letters/kii.mp3", "كِيْ"),
    ("letters/lii.mp3", "لِيْ"),
    ("letters/mii.mp3", "مِيْ"),
    ("letters/nii.mp3", "نِيْ"),

    # 4. Mad Asli Dhammah (2 Harakat)
    ("letters/buu.mp3", "بُوْ"),
    ("letters/tuu.mp3", "تُوْ"),
    ("letters/tsuu.mp3", "ثُوْ"),
    ("letters/juu.mp3", "جُوْ"),
    ("letters/duu.mp3", "دُوْ"),
    ("letters/ruu.mp3", "رُوْ"),
    ("letters/suu.mp3", "سُوْ"),
    ("letters/fuu.mp3", "فُوْ"),
    ("letters/quu.mp3", "قُوْ"),
    ("letters/kuu.mp3", "كُوْ"),
    ("letters/luu.mp3", "لُوْ"),
    ("letters/muu.mp3", "مُوْ"),
    ("letters/nuu.mp3", "نُوْ"),
    ("letters/yuu.mp3", "يُوْ"),
]

def trim_and_normalize(file_path, lead_keep_ms=10, trail_keep_ms=25, threshold=300, target_peak=26000):
    try:
        decoded = miniaudio.decode_file(file_path)
        samples = list(decoded.samples)
        sr = decoded.sample_rate
        nch = decoded.nchannels
        
        start_sample = 0
        for idx, s in enumerate(samples):
            if abs(s) > threshold:
                start_sample = idx
                break
                
        end_sample = len(samples) - 1
        for idx in range(len(samples) - 1, -1, -1):
            if abs(samples[idx]) > threshold:
                end_sample = idx
                break
                
        lead_keep = int((lead_keep_ms / 1000.0) * sr) * nch
        trail_keep = int((trail_keep_ms / 1000.0) * sr) * nch
        
        s_idx = max(0, start_sample - lead_keep)
        e_idx = min(len(samples), end_sample + trail_keep)
        
        s_idx -= (s_idx % nch)
        if e_idx % nch != 0:
            e_idx += (nch - (e_idx % nch))
            
        trimmed = samples[s_idx:e_idx]
        if len(trimmed) == 0:
            trimmed = samples
            
        # Peak normalization to match Studio Qari gain level
        cur_peak = max(abs(x) for x in trimmed) if len(trimmed) > 0 else 1
        if cur_peak > 0:
            gain = min(2.5, target_peak / float(cur_peak))
            normalized = [int(max(-32767, min(32767, x * gain))) for x in trimmed]
        else:
            normalized = trimmed
            
        raw_bytes = array.array('h', normalized).tobytes()
        encoder = lameenc.Encoder()
        encoder.set_bit_rate(96)
        encoder.set_in_sample_rate(sr)
        encoder.set_channels(nch)
        encoder.set_quality(2)
        
        mp3_data = encoder.encode(raw_bytes) + encoder.flush()
        with open(file_path, 'wb') as f:
            f.write(mp3_data)
            
        dur = (len(normalized) // nch) / sr
        return dur
    except Exception as e:
        print(f"Error trimming {file_path}: {e}")
        return 0

async def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_base = os.path.join(base_dir, "public", "audio")

    print(f"--- Synthesizing {len(IQRO3_ITEMS)} authentic Arabic Kasrah, Dhammah & Mad Asli letters ({VOICE}) ---")

    for rel_path, text in IQRO3_ITEMS:
        full_path = os.path.join(audio_base, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        try:
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(full_path)
            dur = trim_and_normalize(full_path)
            # print cleanly without cp1252 issue
            print(f"OK {rel_path} ({dur*1000:.0f}ms)")
        except Exception as e:
            print(f"FAILED {rel_path}: {e}")

    print("\nAll authentic Arabic Iqro 3 audio files synthesized, normalized and trimmed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
