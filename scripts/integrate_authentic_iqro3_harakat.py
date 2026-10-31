import io
import os
import sys
import array
import math
import zipfile
import urllib.request
import miniaudio
import lameenc

URL = 'https://huggingface.co/datasets/Reinjin/Pelafalan_Huruf_Hijaiyah/resolve/main/dataset.zip'
TOTAL_SIZE = 238129941
DEST_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'letters')

# PROTECTED IQRO 1 & 2 FILES - STRICT PRESERVATION GUARANTEE
PROTECTED_IQRO_1_AND_2_FILES = {
    'a.mp3', 'alif.mp3', 'ba.mp3', 'ta.mp3', 'tsa.mp3', 'tha.mp3', 'ja.mp3', 'jim.mp3',
    'ha.mp3', 'kho.mp3', 'kha.mp3', 'da.mp3', 'dal.mp3', 'dza.mp3', 'dzal.mp3', 'ro.mp3',
    'ra.mp3', 'za.mp3', 'zai.mp3', 'zay.mp3', 'sa.mp3', 'sin.mp3', 'sya.mp3', 'syin.mp3',
    'sho.mp3', 'shod.mp3', 'dho.mp3', 'dhod.mp3', 'tho.mp3', 'thod.mp3', 'zho.mp3', 'dhzo.mp3',
    'ain_a.mp3', 'ain.mp3', 'gho.mp3', 'ghoin.mp3', 'fa.mp3', 'qo.mp3', 'qof.mp3', 'ka.mp3',
    'kaf.mp3', 'la.mp3', 'lam.mp3', 'ma.mp3', 'mim.mp3', 'na.mp3', 'nun.mp3', 'wa.mp3',
    'waw.mp3', 'haa.mp3', 'ha_besar.mp3', 'laa.mp3', 'ya.mp3',
    'baa.mp3', 'taa.mp3', 'tsaa.mp3', 'jaa.mp3', 'haaa.mp3', 'khoo.mp3', 'daa.mp3',
    'dzaa.mp3', 'roo.mp3', 'zaa.mp3', 'saa.mp3', 'syaa.mp3', 'shoo.mp3', 'dhoo.mp3',
    'thoo.mp3', 'zhoo.mp3', 'ain_aa.mp3', 'ghoo.mp3', 'faa.mp3', 'qoo.mp3', 'kaa.mp3',
    'maa.mp3', 'naa.mp3', 'waa.mp3', 'yaa.mp3'
}

# 28 Kasrah mappings: folder name in dataset.zip -> target file(s) in public/audio/letters/
KASRAH_MAP = {
    '02. alif_kasroh': ['i.mp3'],
    '05. ba_kasroh': ['bi.mp3'],
    '08. ta_kasroh': ['ti.mp3'],
    '11. tsa_kasroh': ['tsi.mp3'],
    '14. jim_kasroh': ['ji.mp3'],
    '17. hah_kasroh': ['hi.mp3'],
    '20. kha_kasroh': ['khi.mp3'],
    '23. dal_kasroh': ['di.mp3'],
    '26. dzal_kasroh': ['dzi.mp3'],
    '29. ra_kasroh': ['ri.mp3'],
    '32. zay_kasroh': ['zi.mp3'],
    '35. sin_kasroh': ['si.mp3'],
    '38. shin_kasroh': ['syi.mp3'],
    '41. sad_kasroh': ['shi.mp3'],
    '44. dad_kasroh': ['dhi.mp3'],
    '47. tah_kasroh': ['thi.mp3'],
    '50. zah_kasroh': ['zhi.mp3'],
    '53. ain_kasroh': ['ain_i.mp3'],
    '56. ghaiin_kasroh': ['ghi.mp3'],
    '59. fa_kasroh': ['fi.mp3'],
    '62. qaf_kasroh': ['qi.mp3'],
    '65. kaf_kasroh': ['ki.mp3'],
    '68. lam_kasroh': ['li.mp3'],
    '71. mim_kasroh': ['mi.mp3'],
    '74. nun_kasroh': ['ni.mp3'],
    '77. Ha_kasroh': ['hii.mp3'],
    '80. waw_kasroh': ['wi.mp3'],
    '83. ya_kasroh': ['yi.mp3'],
}

# 28 Dhammah mappings: folder name in dataset.zip -> target file(s) in public/audio/letters/
DHAMMAH_MAP = {
    '03. alif_dommah': ['u.mp3'],
    '06. ba_dommah': ['bu.mp3'],
    '09. ta_dommah': ['tu.mp3'],
    '12. tsa_dommah': ['tsu.mp3'],
    '15. jim_dommah': ['ju.mp3'],
    '18. hah_dommah': ['hu.mp3'],
    '21. kha_dommah': ['khu.mp3'],
    '24. dal_dommah': ['du.mp3'],
    '27. dzal_dommah': ['dzu.mp3'],
    '30. ra_dommah': ['ru.mp3'],
    '33. zay_dommah': ['zu.mp3'],
    '36. sin_dommah': ['su.mp3'],
    '39. shin_dommah': ['syu.mp3'],
    '42. sad_dommah': ['shu.mp3'],
    '45. dad_dommah': ['dhu.mp3'],
    '48. tah_dommah': ['thu.mp3'],
    '51. zah_dommah': ['zhu.mp3'],
    '54. ain_dommah': ['ain_u.mp3'],
    '57. ghaiin_dommah': ['ghu.mp3'],
    '60. fa_dommah': ['fu.mp3'],
    '63. qaf_dommah': ['qu.mp3'],
    '66. kaf_dommah': ['ku.mp3'],
    '69. lam_dommah': ['lu.mp3'],
    '72. mim_dommah': ['mu.mp3'],
    '75. nun_dommah': ['nu.mp3'],
    '78. Ha_dommah': ['huu.mp3'],
    '81. waw_dommah': ['wu.mp3'],
    '84. ya_dommah': ['yu.mp3'],
}

# Mad Asli elongation mappings: output file -> source file
MAD_ASLI_KASRAH_MAP = {
    'bii.mp3': 'bi.mp3',
    'tii.mp3': 'ti.mp3',
    'tsii.mp3': 'tsi.mp3',
    'jii.mp3': 'ji.mp3',
    'dii.mp3': 'di.mp3',
    'rii.mp3': 'ri.mp3',
    'sii.mp3': 'si.mp3',
    'ain_ii.mp3': 'ain_i.mp3',
    'fii.mp3': 'fi.mp3',
    'qii.mp3': 'qi.mp3',
    'kii.mp3': 'ki.mp3',
    'lii.mp3': 'li.mp3',
    'mii.mp3': 'mi.mp3',
    'nii.mp3': 'ni.mp3',
}

MAD_ASLI_DHAMMAH_MAP = {
    'buu.mp3': 'bu.mp3',
    'tuu.mp3': 'tu.mp3',
    'tsuu.mp3': 'tsu.mp3',
    'juu.mp3': 'ju.mp3',
    'duu.mp3': 'du.mp3',
    'ruu.mp3': 'ru.mp3',
    'suu.mp3': 'su.mp3',
    'ain_uu.mp3': 'ain_u.mp3',
    'fuu.mp3': 'fu.mp3',
    'quu.mp3': 'qu.mp3',
    'kuu.mp3': 'ku.mp3',
    'luu.mp3': 'lu.mp3',
    'muu.mp3': 'mu.mp3',
    'nuu.mp3': 'nu.mp3',
    'yuu.mp3': 'yu.mp3',
}

class RemoteZipFile(io.RawIOBase):
    def __init__(self, url, size):
        self.url = url
        self.size = size
        self.pos = 0

    def seek(self, offset, whence=0):
        if whence == 0:
            self.pos = offset
        elif whence == 1:
            self.pos += offset
        elif whence == 2:
            self.pos = self.size + offset
        return self.pos

    def tell(self):
        return self.pos

    def read(self, n=-1):
        if n == -1 or self.pos + n > self.size:
            n = self.size - self.pos
        if n <= 0:
            return b""
        end = self.pos + n - 1
        req = urllib.request.Request(self.url, headers={'User-Agent': 'Mozilla/5.0', 'Range': f'bytes={self.pos}-{end}'})
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            self.pos += len(data)
            return data

def trim_normalize_and_encode(raw_wav_bytes, dest_path, lead_keep_ms=10, trail_keep_ms=25, threshold=350, target_peak=26000):
    decoded = miniaudio.decode(raw_wav_bytes)
    samples = decoded.samples
    sr = decoded.sample_rate
    nch = decoded.nchannels

    # Find start and end above threshold
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

    # Channel boundary alignment
    s_idx -= (s_idx % nch)
    if e_idx % nch != 0:
        e_idx += (nch - (e_idx % nch))

    trimmed = samples[s_idx:e_idx]
    if len(trimmed) == 0:
        trimmed = samples

    # Measure current peak
    cur_peak = max(abs(s) for s in trimmed) if trimmed else 0
    gain = 1.0
    if cur_peak > 500:
        gain = min(target_peak / cur_peak, 32000 / cur_peak)

    norm_samples = array.array('h')
    for s in trimmed:
        val = int(round(s * gain))
        if val > 32767: val = 32767
        elif val < -32768: val = -32768
        norm_samples.append(val)

    # Encode to MP3 CBR 64kbps
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(64)
    encoder.set_in_sample_rate(sr)
    encoder.set_channels(nch)
    encoder.set_quality(2)
    mp3_data = encoder.encode(norm_samples.tobytes())
    mp3_data += encoder.flush()

    with open(dest_path, 'wb') as f:
        f.write(mp3_data)
    return len(mp3_data)

def generate_mad_asli(source_path, dest_path, target_duration_sec=0.58):
    decoded = miniaudio.decode_file(source_path)
    samples = decoded.samples
    sr = decoded.sample_rate
    nch = decoded.nchannels

    total_frames = len(samples) // nch
    target_frames = int(target_duration_sec * sr)

    if total_frames >= target_frames:
        out_samples = samples[:target_frames * nch]
    else:
        # Extract sustain section (between 35% and 85%)
        sustain_start = int(total_frames * 0.35)
        sustain_end = int(total_frames * 0.85)
        sustain_len = sustain_end - sustain_start

        if sustain_len <= 100:
            out_samples = samples
        else:
            needed_frames = target_frames - total_frames
            loops_needed = math.ceil(needed_frames / sustain_len) + 1

            crossfade_ms = 20
            xfade_frames = int((crossfade_ms / 1000.0) * sr)
            xfade_frames = min(xfade_frames, sustain_len // 4)

            # Build extended audio with smooth linear crossfade overlap-add
            prefix = samples[:sustain_start * nch]
            loop_body = samples[sustain_start * nch : sustain_end * nch]
            suffix = samples[sustain_end * nch :]

            extended_frames = list(prefix)
            current_sustain = list(loop_body)

            for _ in range(loops_needed):
                # Crossfade tail of extended_frames with head of loop_body
                if len(extended_frames) >= xfade_frames * nch:
                    overlap_base = len(extended_frames) - (xfade_frames * nch)
                    for f in range(xfade_frames):
                        weight = f / float(xfade_frames)
                        for ch in range(nch):
                            idx_ext = overlap_base + f * nch + ch
                            idx_loop = f * nch + ch
                            if idx_ext < len(extended_frames) and idx_loop < len(loop_body):
                                val = int(round(extended_frames[idx_ext] * (1.0 - weight) + loop_body[idx_loop] * weight))
                                extended_frames[idx_ext] = max(-32768, min(32767, val))

                    extended_frames.extend(loop_body[xfade_frames * nch:])
                else:
                    extended_frames.extend(loop_body)

                if (len(extended_frames) // nch) >= (target_frames - len(suffix) // nch):
                    break

            extended_frames.extend(suffix)
            out_frames_total = min(target_frames, len(extended_frames) // nch)
            out_samples = extended_frames[:out_frames_total * nch]

    # Smooth 30ms release fadeout at tail to avoid clicks
    fade_frames = int(0.030 * sr)
    total_out_frames = len(out_samples) // nch
    fade_start = max(0, total_out_frames - fade_frames)
    final_array = array.array('h', out_samples)

    for i in range(fade_start, total_out_frames):
        alpha = (total_out_frames - i) / float(fade_frames)
        for ch in range(nch):
            idx = i * nch + ch
            final_array[idx] = int(round(final_array[idx] * alpha))

    # Encode to MP3 CBR 64kbps
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(64)
    encoder.set_in_sample_rate(sr)
    encoder.set_channels(nch)
    encoder.set_quality(2)
    mp3_data = encoder.encode(final_array.tobytes())
    mp3_data += encoder.flush()

    with open(dest_path, 'wb') as f:
        f.write(mp3_data)
    return len(mp3_data)

def main():
    print("=== INTEGRASI AUDIO OTENTIK IQRO 3 (KASRAH & DHAMMAH SANTRI KUDUS) ===")
    os.makedirs(DEST_DIR, exist_ok=True)

    print("1. Menghubungkan ke dataset Hugging Face via RemoteZipFile...")
    remote_io = RemoteZipFile(URL, TOTAL_SIZE)
    zf = zipfile.ZipFile(remote_io)
    namelist = zf.namelist()
    print(f"   Terhubung! Total entri dalam zip: {len(namelist)}")

    # Speaker preferred: Abdullah_Bilfaqih (consistent across all 84 classes)
    PREFERRED_SPEAKER = 'Abdullah_Bilfaqih'

    # 2. Process Kasrah (-i)
    print("\n2. Memproses 28 huruf Kasrah (-i)...")
    kasrah_count = 0
    for folder, dest_files in KASRAH_MAP.items():
        # Find matching wav for Abdullah_Bilfaqih in this folder
        wav_entries = [n for n in namelist if folder in n and n.endswith('.wav') and PREFERRED_SPEAKER in n]
        if not wav_entries:
            wav_entries = [n for n in namelist if folder in n and n.endswith('.wav')]
        if not wav_entries:
            print(f"   [ERROR] Berkas tidak ditemukan untuk folder: {folder}")
            continue

        chosen_wav = wav_entries[0]
        wav_bytes = zf.read(chosen_wav)

        for dest_file in dest_files:
            # STRICT GUARANTEE: Never overwrite protected files
            if dest_file in PROTECTED_IQRO_1_AND_2_FILES:
                print(f"   [BLOCKED] Percobaan menulis ke file terlindungi: {dest_file}")
                continue

            dest_path = os.path.join(DEST_DIR, dest_file)
            size = trim_normalize_and_encode(wav_bytes, dest_path)
            kasrah_count += 1
            print(f"   -> {dest_file:15} ({size} B) dari {chosen_wav.split('/')[-1]}")

    print(f"   Selesai: {kasrah_count} file Kasrah berhasil dibuat!")

    # 3. Process Dhammah (-u)
    print("\n3. Memproses 28 huruf Dhammah (-u)...")
    dhammah_count = 0
    for folder, dest_files in DHAMMAH_MAP.items():
        wav_entries = [n for n in namelist if folder in n and n.endswith('.wav') and PREFERRED_SPEAKER in n]
        if not wav_entries:
            wav_entries = [n for n in namelist if folder in n and n.endswith('.wav')]
        if not wav_entries:
            print(f"   [ERROR] Berkas tidak ditemukan untuk folder: {folder}")
            continue

        chosen_wav = wav_entries[0]
        wav_bytes = zf.read(chosen_wav)

        for dest_file in dest_files:
            if dest_file in PROTECTED_IQRO_1_AND_2_FILES:
                print(f"   [BLOCKED] Percobaan menulis ke file terlindungi: {dest_file}")
                continue

            dest_path = os.path.join(DEST_DIR, dest_file)
            size = trim_normalize_and_encode(wav_bytes, dest_path)
            dhammah_count += 1
            print(f"   -> {dest_file:15} ({size} B) dari {chosen_wav.split('/')[-1]}")

    print(f"   Selesai: {dhammah_count} file Dhammah berhasil dibuat!")

    # 4. Synthesize Mad Asli Kasrah (-ii)
    print("\n4. Mensintesis Mad Asli Kasrah (-ii) 2 harakat...")
    mad_kasrah_count = 0
    for mad_file, src_file in MAD_ASLI_KASRAH_MAP.items():
        if mad_file in PROTECTED_IQRO_1_AND_2_FILES:
            print(f"   [BLOCKED] Percobaan menulis ke file terlindungi: {mad_file}")
            continue

        src_path = os.path.join(DEST_DIR, src_file)
        dest_path = os.path.join(DEST_DIR, mad_file)
        if not os.path.exists(src_path):
            print(f"   [WARNING] Sumber tidak ditemukan: {src_file}")
            continue

        size = generate_mad_asli(src_path, dest_path, target_duration_sec=0.60)
        mad_kasrah_count += 1
        print(f"   -> {mad_file:15} ({size} B) dari {src_file}")

    print(f"   Selesai: {mad_kasrah_count} file Mad Asli Kasrah berhasil dibuat!")

    # 5. Synthesize Mad Asli Dhammah (-uu)
    print("\n5. Mensintesis Mad Asli Dhammah (-uu) 2 harakat...")
    mad_dhammah_count = 0
    for mad_file, src_file in MAD_ASLI_DHAMMAH_MAP.items():
        if mad_file in PROTECTED_IQRO_1_AND_2_FILES:
            print(f"   [BLOCKED] Percobaan menulis ke file terlindungi: {mad_file}")
            continue

        src_path = os.path.join(DEST_DIR, src_file)
        dest_path = os.path.join(DEST_DIR, mad_file)
        if not os.path.exists(src_path):
            print(f"   [WARNING] Sumber tidak ditemukan: {src_file}")
            continue

        size = generate_mad_asli(src_path, dest_path, target_duration_sec=0.60)
        mad_dhammah_count += 1
        print(f"   -> {mad_file:15} ({size} B) dari {src_file}")

    print(f"   Selesai: {mad_dhammah_count} file Mad Asli Dhammah berhasil dibuat!")

    # 6. Strict Verification of Iqro 1 & 2 Preservation
    print("\n6. Verifikasi Perlindungan Iqro 1 & 2...")
    all_protected_intact = True
    for pf in PROTECTED_IQRO_1_AND_2_FILES:
        pf_path = os.path.join(DEST_DIR, pf)
        if not os.path.exists(pf_path) or os.path.getsize(pf_path) == 0:
            print(f"   [ERROR] Berkas Iqro 1/2 rusak atau hilang: {pf}")
            all_protected_intact = False

    if all_protected_intact:
        print(f"   [BERHASIL] Semua {len(PROTECTED_IQRO_1_AND_2_FILES)} file Iqro 1 & 2 TERLINDUNGI 100% UTUH!")
    else:
        print("   [FAILED] Ada file terlindungi yang terdampak!")
        sys.exit(1)

    print("\n=== SEMUA INTEGRASI AUDIO IQRO 3 SELESAI DENGAN SUKSES! ===")

if __name__ == '__main__':
    main()
