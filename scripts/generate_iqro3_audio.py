import asyncio
import os
import edge_tts
from trim_audio_silence import trim_mp3

VOICE = "id-ID-GadisNeural"
RATE = "+5%"
PITCH = "+4Hz"

IQRO3_AUDIO_ITEMS = [
    # 1. Kasrah (-i)
    ("letters/i.mp3", "I"),
    ("letters/bi.mp3", "Bi"),
    ("letters/ti.mp3", "Ti"),
    ("letters/tsi.mp3", "Tsi"),
    ("letters/ji.mp3", "Ji"),
    ("letters/hi.mp3", "Hi"),
    ("letters/khi.mp3", "Khi"),
    ("letters/di.mp3", "Di"),
    ("letters/dzi.mp3", "Dzi"),
    ("letters/ri.mp3", "Ri"),
    ("letters/zi.mp3", "Zi"),
    ("letters/si.mp3", "Si"),
    ("letters/syi.mp3", "Syi"),
    ("letters/shi.mp3", "Shi"),
    ("letters/dhi.mp3", "Dhi"),
    ("letters/thi.mp3", "Thi"),
    ("letters/zhi.mp3", "Zhi"),
    ("letters/ain_i.mp3", "'I"),
    ("letters/ghi.mp3", "Ghi"),
    ("letters/fi.mp3", "Fi"),
    ("letters/qi.mp3", "Qi"),
    ("letters/ki.mp3", "Ki"),
    ("letters/li.mp3", "Li"),
    ("letters/mi.mp3", "Mi"),
    ("letters/ni.mp3", "Ni"),
    ("letters/wi.mp3", "Wi"),
    ("letters/hii.mp3", "Hi"),
    ("letters/yi.mp3", "Yi"),

    # 2. Dhammah (-u)
    ("letters/u.mp3", "U"),
    ("letters/bu.mp3", "Bu"),
    ("letters/tu.mp3", "Tu"),
    ("letters/tsu.mp3", "Tsu"),
    ("letters/ju.mp3", "Ju"),
    ("letters/hu.mp3", "Hu"),
    ("letters/khu.mp3", "Khu"),
    ("letters/du.mp3", "Du"),
    ("letters/dzu.mp3", "Dzu"),
    ("letters/ru.mp3", "Ru"),
    ("letters/zu.mp3", "Zu"),
    ("letters/su.mp3", "Su"),
    ("letters/syu.mp3", "Syu"),
    ("letters/shu.mp3", "Shu"),
    ("letters/dhu.mp3", "Dhu"),
    ("letters/thu.mp3", "Thu"),
    ("letters/zhu.mp3", "Zhu"),
    ("letters/ain_u.mp3", "'U"),
    ("letters/ghu.mp3", "Ghu"),
    ("letters/fu.mp3", "Fu"),
    ("letters/qu.mp3", "Qu"),
    ("letters/ku.mp3", "Ku"),
    ("letters/lu.mp3", "Lu"),
    ("letters/mu.mp3", "Mu"),
    ("letters/nu.mp3", "Nu"),
    ("letters/wu.mp3", "Wu"),
    ("letters/huu.mp3", "Hu"),
    ("letters/yu.mp3", "Yu"),

    # 3. Mad Asli Kasrah (Panjang 2 Harakat /ii/)
    ("letters/bii.mp3", "Bii"),
    ("letters/tii.mp3", "Tii"),
    ("letters/tsii.mp3", "Tsii"),
    ("letters/jii.mp3", "Jii"),
    ("letters/dii.mp3", "Dii"),
    ("letters/rii.mp3", "Rii"),
    ("letters/sii.mp3", "Sii"),
    ("letters/fii.mp3", "Fii"),
    ("letters/qii.mp3", "Qii"),
    ("letters/kii.mp3", "Kii"),
    ("letters/lii.mp3", "Lii"),
    ("letters/mii.mp3", "Mii"),
    ("letters/nii.mp3", "Nii"),

    # 4. Mad Asli Dhammah (Panjang 2 Harakat /uu/)
    ("letters/buu.mp3", "Buu"),
    ("letters/tuu.mp3", "Tuu"),
    ("letters/tsuu.mp3", "Tsuu"),
    ("letters/duu.mp3", "Duu"),
    ("letters/ruu.mp3", "Ruu"),
    ("letters/suu.mp3", "Suu"),
    ("letters/fuu.mp3", "Fuu"),
    ("letters/quu.mp3", "Quu"),
    ("letters/kuu.mp3", "Kuu"),
    ("letters/luu.mp3", "Luu"),
    ("letters/muu.mp3", "Muu"),
    ("letters/nuu.mp3", "Nuu"),
    ("letters/yuu.mp3", "Yuu"),
]

async def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_base = os.path.join(base_dir, "public", "audio")

    print(f"Generating {len(IQRO3_AUDIO_ITEMS)} Iqro 3 audio items using {VOICE}...")

    for rel_path, text in IQRO3_AUDIO_ITEMS:
        full_path = os.path.join(audio_base, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # Generate audio
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await communicate.save(full_path)

        # Silence trim immediately for snappy zero-delay playback
        trim_mp3(full_path, lead_keep_ms=10, trail_keep_ms=25, threshold=350)
        print(f"Generated & trimmed: {rel_path} -> '{text}'")

    print("\nAll Iqro 3 audio items successfully generated and trimmed!")

if __name__ == "__main__":
    asyncio.run(main())
