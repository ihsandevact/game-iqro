import asyncio
import os
import sys
import edge_tts

# Add scripts directory to path for trim_audio_silence
sys.path.append(os.path.dirname(__file__))
from trim_audio_silence import trim_mp3

VOICE = "id-ID-GadisNeural"
RATE = "+5%"
PITCH = "+4Hz"

FATHAH_AUDIO_ITEMS = [
    # 1. 17 Huruf Fathah Murni (Bunyi Harakat 1 Harakat / Pendek)
    # Penting: Menggantikan duplikat nama huruf ("Alif", "Jim", "Dal", "Nun", dsb.)
    ("letters/a.mp3", "A"),
    ("letters/ja.mp3", "Ja"),
    ("letters/da.mp3", "Da"),
    ("letters/dza.mp3", "Dza"),
    ("letters/za.mp3", "Za"),
    ("letters/sa.mp3", "Sa"),
    ("letters/sya.mp3", "Sya"),
    ("letters/sho.mp3", "Sho"),
    ("letters/dho.mp3", "Dho"),
    ("letters/ain_a.mp3", "'A"),
    ("letters/gho.mp3", "Gho"),
    ("letters/qo.mp3", "Qo"),
    ("letters/ka.mp3", "Ka"),
    ("letters/la.mp3", "La"),
    ("letters/ma.mp3", "Ma"),
    ("letters/na.mp3", "Na"),
    ("letters/wa.mp3", "Wa"),

    # 2. 26 Mad Asli Fathah (Alif - Bacaan Panjang 2 Harakat / Berayun)
    ("letters/baa.mp3", "Baa"),
    ("letters/taa.mp3", "Taa"),
    ("letters/tsaa.mp3", "Tsaa"),
    ("letters/jaa.mp3", "Jaa"),
    ("letters/haaa.mp3", "Haa"),
    ("letters/khoo.mp3", "Khoo"),
    ("letters/daa.mp3", "Daa"),
    ("letters/dzaa.mp3", "Dzaa"),
    ("letters/roo.mp3", "Roo"),
    ("letters/zaa.mp3", "Zaa"),
    ("letters/saa.mp3", "Saa"),
    ("letters/syaa.mp3", "Syaa"),
    ("letters/shoo.mp3", "Shoo"),
    ("letters/dhoo.mp3", "Dhoo"),
    ("letters/thoo.mp3", "Thoo"),
    ("letters/zhoo.mp3", "Zhoo"),
    ("letters/ain_aa.mp3", "'Aa"),
    ("letters/ghoo.mp3", "Ghoo"),
    ("letters/faa.mp3", "Faa"),
    ("letters/qoo.mp3", "Qoo"),
    ("letters/kaa.mp3", "Kaa"),
    ("letters/laa.mp3", "Laa"),
    ("letters/maa.mp3", "Maa"),
    ("letters/naa.mp3", "Naa"),
    ("letters/waa.mp3", "Waa"),
    ("letters/yaa.mp3", "Yaa"),
]

async def generate():
    base_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
    os.makedirs(base_dir, exist_ok=True)
    
    print(f"Generating & trimming {len(FATHAH_AUDIO_ITEMS)} Fathah & Mad Asli audio items using {VOICE}...")
    
    for rel_path, text in FATHAH_AUDIO_ITEMS:
        full_path = os.path.join(base_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # 1. Synthesize with Edge Neural TTS
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await communicate.save(full_path)
        
        # 2. Silence trim for zero-latency snappy playback
        trim_mp3(full_path, lead_keep_ms=15, trail_keep_ms=30, threshold=400)
        print(f"Generated & trimmed: {rel_path} -> '{text}'")

    print("\nAll Fathah & Mad Asli audio files generated and trimmed successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
