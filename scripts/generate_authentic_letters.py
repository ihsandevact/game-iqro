import asyncio
import os
import sys
import codecs
import edge_tts
from trim_audio_silence import trim_mp3

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

VOICE = "ar-SA-ZariyahNeural"

# 1. 28 Huruf Fathah Murni (1 Harakat ~300ms)
FATHAH_ITEMS = [
    ("letters/a.mp3", "اَ"),
    ("letters/ba.mp3", "بَ"),
    ("letters/ta.mp3", "تَ"),
    ("letters/tsa.mp3", "ثَ"),
    ("letters/ja.mp3", "جَ"),
    ("letters/ha.mp3", "حَ"),
    ("letters/kho.mp3", "خَ"),
    ("letters/da.mp3", "دَ"),
    ("letters/dza.mp3", "ذَ"),
    ("letters/ro.mp3", "رَ"),
    ("letters/za.mp3", "زَ"),
    ("letters/sa.mp3", "سَ"),
    ("letters/sya.mp3", "شَ"),
    ("letters/sho.mp3", "صَ"),
    ("letters/dho.mp3", "ضَ"),
    ("letters/tho.mp3", "طَ"),
    ("letters/zho.mp3", "ظَ"),
    ("letters/ain_a.mp3", "عَ"),
    ("letters/gho.mp3", "غَ"),
    ("letters/fa.mp3", "فَ"),
    ("letters/qo.mp3", "قَ"),
    ("letters/ka.mp3", "كَ"),
    ("letters/la.mp3", "لَ"),
    ("letters/ma.mp3", "مَ"),
    ("letters/na.mp3", "نَ"),
    ("letters/wa.mp3", "وَ"),
    ("letters/haa.mp3", "هَ"),
    ("letters/ya.mp3", "يَ"),
]

# 2. 28 Huruf Kasrah Murni (1 Harakat ~300ms)
KASRAH_ITEMS = [
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
]

# 3. 28 Huruf Dhammah Murni (1 Harakat ~300ms)
DHAMMAH_ITEMS = [
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
]

# 4. 26 Mad Asli Fathah (2 Harakat ~600ms)
MAD_FATHAH_ITEMS = [
    ("letters/baa.mp3", "بَا"),
    ("letters/taa.mp3", "تَا"),
    ("letters/tsaa.mp3", "ثَا"),
    ("letters/jaa.mp3", "جَا"),
    ("letters/haaa.mp3", "حَا"),
    ("letters/khoo.mp3", "خَا"),
    ("letters/daa.mp3", "دَا"),
    ("letters/dzaa.mp3", "ذَا"),
    ("letters/roo.mp3", "رَا"),
    ("letters/zaa.mp3", "زَا"),
    ("letters/saa.mp3", "سَا"),
    ("letters/syaa.mp3", "شَا"),
    ("letters/shoo.mp3", "صَا"),
    ("letters/dhoo.mp3", "ضَا"),
    ("letters/thoo.mp3", "طَا"),
    ("letters/zhoo.mp3", "ظَا"),
    ("letters/ain_aa.mp3", "عَا"),
    ("letters/ghoo.mp3", "غَا"),
    ("letters/faa.mp3", "فَا"),
    ("letters/qoo.mp3", "قَا"),
    ("letters/kaa.mp3", "كَا"),
    ("letters/laa.mp3", "لَا"),
    ("letters/maa.mp3", "مَا"),
    ("letters/naa.mp3", "نَا"),
    ("letters/waa.mp3", "وَا"),
    ("letters/yaa.mp3", "يَا"),
]

# 5. Mad Asli Kasrah (2 Harakat ~600ms)
MAD_KASRAH_ITEMS = [
    ("letters/bii.mp3", "بِيْ"),
    ("letters/tii.mp3", "تِيْ"),
    ("letters/tsii.mp3", "ثِيْ"),
    ("letters/jii.mp3", "جِيْ"),
    ("letters/dii.mp3", "دِيْ"),
    ("letters/dzii.mp3", "ذِيْ"),
    ("letters/rii.mp3", "رِيْ"),
    ("letters/zii.mp3", "زِيْ"),
    ("letters/sii.mp3", "سِيْ"),
    ("letters/syii.mp3", "شِيْ"),
    ("letters/shii.mp3", "صِيْ"),
    ("letters/dhii.mp3", "ضِيْ"),
    ("letters/thii.mp3", "طِيْ"),
    ("letters/zhii.mp3", "ظِيْ"),
    ("letters/ain_ii.mp3", "عِيْ"),
    ("letters/ghii.mp3", "غِيْ"),
    ("letters/fii.mp3", "فِيْ"),
    ("letters/qii.mp3", "قِيْ"),
    ("letters/kii.mp3", "كِيْ"),
    ("letters/lii.mp3", "لِيْ"),
    ("letters/mii.mp3", "مِيْ"),
    ("letters/nii.mp3", "نِيْ"),
    ("letters/wii.mp3", "وِيْ"),
    ("letters/yii.mp3", "يِيْ"),
]

# 6. Mad Asli Dhammah (2 Harakat ~600ms)
MAD_DHAMMAH_ITEMS = [
    ("letters/buu.mp3", "بُوْ"),
    ("letters/tuu.mp3", "تُوْ"),
    ("letters/tsuu.mp3", "ثُوْ"),
    ("letters/juu.mp3", "جُوْ"),
    ("letters/duu.mp3", "دُوْ"),
    ("letters/dzuu.mp3", "ذُوْ"),
    ("letters/ruu.mp3", "رُوْ"),
    ("letters/zuu.mp3", "زُوْ"),
    ("letters/suu.mp3", "سُوْ"),
    ("letters/syuu.mp3", "شُوْ"),
    ("letters/shuu.mp3", "صُوْ"),
    ("letters/dhuu.mp3", "ضُوْ"),
    ("letters/thuu.mp3", "طُوْ"),
    ("letters/zhuu.mp3", "ظُوْ"),
    ("letters/ain_uu.mp3", "عُوْ"),
    ("letters/ghuu.mp3", "غُوْ"),
    ("letters/fuu.mp3", "فُوْ"),
    ("letters/quu.mp3", "قُوْ"),
    ("letters/kuu.mp3", "كُوْ"),
    ("letters/luu.mp3", "لُوْ"),
    ("letters/muu.mp3", "مُوْ"),
    ("letters/nuu.mp3", "نُوْ"),
    ("letters/wuu.mp3", "وُوْ"),
    ("letters/yuu.mp3", "يُوْ"),
]

ALL_ITEMS = FATHAH_ITEMS + KASRAH_ITEMS + DHAMMAH_ITEMS + MAD_FATHAH_ITEMS + MAD_KASRAH_ITEMS + MAD_DHAMMAH_ITEMS

async def generate():
    base_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
    os.makedirs(base_dir, exist_ok=True)
    
    print(f"Total authentic Quranic letters to synthesize with {VOICE}: {len(ALL_ITEMS)}")
    
    for rel_path, ar_text in ALL_ITEMS:
        full_path = os.path.join(base_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # 1. Synthesize with Edge Neural TTS Arabic voice
        communicate = edge_tts.Communicate(ar_text, VOICE, rate="+0%", pitch="+0Hz")
        await communicate.save(full_path)
        
        # 2. Silence trim: keep 15ms lead and 35ms trail
        trim_mp3(full_path, lead_keep_ms=15, trail_keep_ms=35, threshold=350)
        print(f"Synthesized & trimmed: {rel_path} -> '{ar_text}'")

    print("\nAll authentic Quranic letters synthesized and trimmed successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
