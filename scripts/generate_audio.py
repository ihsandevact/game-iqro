import asyncio
import os
import edge_tts

VOICE = "id-ID-GadisNeural"
RATE = "+5%"
PITCH = "+4Hz"

AUDIO_ITEMS = [
    # Praises
    ("praises/praise_hebat.mp3", "Hebat sekali!"),
    ("praises/praise_pintar.mp3", "Masya Allah, pintar!"),
    ("praises/praise_luarbiasa.mp3", "Luar biasa, benar sekali!"),
    ("praises/praise_keren.mp3", "Wah, keren banget!"),
    ("praises/praise_bagus.mp3", "Bagus sekali!"),
    
    # Encouragements
    ("encourages/encourage_coba_lagi.mp3", "Oops, ayo coba dengarkan lagi ya!"),
    ("encourages/encourage_hampir.mp3", "Hampir benar, yuk coba lagi!"),
    ("encourages/encourage_semangat.mp3", "Ayo semangat, kamu pasti bisa!"),

    # Celebrations & Greetings
    ("prompts/prompt_selesai.mp3", "Alhamdulillah! Pelajaran selesai, kamu hebat sekali!"),
    ("prompts/prompt_sapaan.mp3", "Halo! Ayo semangat belajar mengaji bersamaku!"),
    ("prompts/prompt_dengarkan.mp3", "Dengarkan suara huruf ini!"),
    ("prompts/prompt_cari_ba.mp3", "Ayo cari huruf BA!"),
    ("prompts/prompt_mana_a.mp3", "Yang mana huruf A?"),
    ("prompts/prompt_tulis_ba.mp3", "Ayo coba tulis huruf BA! Telusuri garisnya!"),

    # 28 Hijaiyah Letters
    ("letters/alif.mp3", "Alif"),
    ("letters/ba.mp3", "Ba"),
    ("letters/ta.mp3", "Ta"),
    ("letters/tsa.mp3", "Tsa"),
    ("letters/jim.mp3", "Jim"),
    ("letters/ha.mp3", "Ha"),
    ("letters/kho.mp3", "Kho"),
    ("letters/dal.mp3", "Dal"),
    ("letters/dzal.mp3", "Dzal"),
    ("letters/ro.mp3", "Ro"),
    ("letters/zai.mp3", "Zai"),
    ("letters/sin.mp3", "Sin"),
    ("letters/syin.mp3", "Syin"),
    ("letters/shod.mp3", "Shod"),
    ("letters/dhod.mp3", "Dhod"),
    ("letters/tho.mp3", "Tho"),
    ("letters/zho.mp3", "Zho"),
    ("letters/ain.mp3", "'Ain"),
    ("letters/ghoin.mp3", "Ghoin"),
    ("letters/fa.mp3", "Fa"),
    ("letters/qof.mp3", "Qof"),
    ("letters/kaf.mp3", "Kaf"),
    ("letters/lam.mp3", "Lam"),
    ("letters/mim.mp3", "Mim"),
    ("letters/nun.mp3", "Nun"),
    ("letters/waw.mp3", "Waw"),
    ("letters/haa.mp3", "Ha"),
    ("letters/ya.mp3", "Ya"),
]

async def generate():
    base_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
    os.makedirs(base_dir, exist_ok=True)
    
    print(f"Total audio files to generate: {len(AUDIO_ITEMS)}")
    
    for rel_path, text in AUDIO_ITEMS:
        full_path = os.path.join(base_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await communicate.save(full_path)
        print(f"Generated: {rel_path} -> '{text}'")

    print("\nAll audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
