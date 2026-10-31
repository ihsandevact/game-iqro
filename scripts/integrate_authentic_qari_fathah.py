import os
import urllib.request
import miniaudio
import lameenc
import array

BASE_URL = 'https://raw.githubusercontent.com/AzizSudrajat/ionic-belajariqro/master/platforms/android/assets/www/audio/'

# Mapping of SuaraX.mp3 to destination files in public/audio/letters/
FATHAH_QARI_MAP = {
    'Suara1.mp3': ['a.mp3', 'alif.mp3'],
    'Suara2.mp3': ['ba.mp3'],
    'Suara3.mp3': ['ta.mp3'],
    'Suara4.mp3': ['tsa.mp3', 'tha.mp3'],
    'Suara5.mp3': ['ja.mp3', 'jim.mp3'],
    'Suara6.mp3': ['ha.mp3'],
    'Suara7.mp3': ['kho.mp3', 'kha.mp3'],
    'Suara8.mp3': ['da.mp3', 'dal.mp3'],
    'Suara9.mp3': ['dza.mp3', 'dzal.mp3'],
    'Suara10.mp3': ['ro.mp3', 'ra.mp3'],
    'Suara11.mp3': ['za.mp3', 'zai.mp3', 'zay.mp3'],
    'Suara12.mp3': ['sa.mp3', 'sin.mp3'],
    'Suara13.mp3': ['sya.mp3', 'syin.mp3'],
    'Suara14.mp3': ['sho.mp3', 'shod.mp3'],
    'Suara15.mp3': ['dho.mp3', 'dhod.mp3'],
    'Suara16.mp3': ['tho.mp3', 'thod.mp3'],
    'Suara17.mp3': ['zho.mp3', 'dhzo.mp3'],
    'Suara18.mp3': ['ain_a.mp3', 'ain.mp3'],
    'Suara19.mp3': ['gho.mp3', 'ghoin.mp3'],
    'Suara20.mp3': ['fa.mp3'],
    'Suara21.mp3': ['qo.mp3', 'qof.mp3'],
    'Suara22.mp3': ['ka.mp3', 'kaf.mp3'],
    'Suara23.mp3': ['la.mp3', 'lam.mp3'],
    'Suara24.mp3': ['ma.mp3', 'mim.mp3'],
    'Suara25.mp3': ['na.mp3', 'nun.mp3'],
    'Suara26.mp3': ['wa.mp3', 'waw.mp3'],
    'Suara27.mp3': ['haa.mp3', 'ha_besar.mp3'],
    'Suara28.mp3': ['laa.mp3'],
    'Suara29.mp3': ['ya.mp3']
}

MAD_ASLI_MAP = {
    'baa.mp3': 'ba.mp3',
    'taa.mp3': 'ta.mp3',
    'tsaa.mp3': 'tsa.mp3',
    'jaa.mp3': 'ja.mp3',
    'haaa.mp3': 'ha.mp3',
    'khoo.mp3': 'kho.mp3',
    'daa.mp3': 'da.mp3',
    'dzaa.mp3': 'dza.mp3',
    'roo.mp3': 'ro.mp3',
    'zaa.mp3': 'za.mp3',
    'saa.mp3': 'sa.mp3',
    'syaa.mp3': 'sya.mp3',
    'shoo.mp3': 'sho.mp3',
    'dhoo.mp3': 'dho.mp3',
    'thoo.mp3': 'tho.mp3',
    'zhoo.mp3': 'zho.mp3',
    'ain_aa.mp3': 'ain_a.mp3',
    'ghoo.mp3': 'gho.mp3',
    'faa.mp3': 'fa.mp3',
    'qoo.mp3': 'qo.mp3',
    'kaa.mp3': 'ka.mp3',
    'maa.mp3': 'ma.mp3',
    'naa.mp3': 'na.mp3',
    'waa.mp3': 'wa.mp3',
    'yaa.mp3': 'ya.mp3',
}

def trim_and_encode(src_path, dest_path, lead_keep_ms=10, trail_keep_ms=25, threshold=350):
    decoded = miniaudio.decode_file(src_path)
    samples = decoded.samples
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
    
    # Align to channel boundary
    s_idx -= (s_idx % nch)
    if e_idx % nch != 0:
        e_idx += (nch - (e_idx % nch))
        
    trimmed = samples[s_idx:e_idx]
    if len(trimmed) == 0:
        trimmed = samples
        
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(96)
    encoder.set_in_sample_rate(sr)
    encoder.set_channels(nch)
    encoder.set_quality(2)
    
    mp3_data = encoder.encode(trimmed.tobytes()) + encoder.flush()
    with open(dest_path, 'wb') as f:
        f.write(mp3_data)
        
    dur = len(trimmed) / (sr * nch)
    return dur

def make_smooth_mad(src_path, dest_path, extend_ms=250):
    dec = miniaudio.decode_file(src_path)
    samples = list(dec.samples)
    sr = dec.sample_rate
    nch = dec.nchannels
    
    total_frames = len(samples) // nch
    center_frame = int(total_frames * 0.50)
    extend_frames = int((extend_ms / 1000.0) * sr)
    xfade_frames = int(0.020 * sr) # 20ms crossfade
    
    p1_end = center_frame
    loop_start = max(0, center_frame - extend_frames // 2)
    loop_end = min(total_frames, loop_start + extend_frames)
    
    out = samples[: (p1_end - xfade_frames) * nch]
    
    # Overlap region 1
    for i in range(xfade_frames):
        alpha = i / float(xfade_frames)
        idx_p1 = (p1_end - xfade_frames + i) * nch
        idx_loop = (loop_start + i) * nch
        for c in range(nch):
            val = int((1.0 - alpha) * samples[idx_p1 + c] + alpha * samples[idx_loop + c])
            out.append(val)
            
    # Body of loop
    out.extend(samples[(loop_start + xfade_frames) * nch : loop_end * nch])
    
    # Overlap region 2 into continuation of original
    for i in range(xfade_frames):
        alpha = i / float(xfade_frames)
        idx_loop = (loop_end - xfade_frames + i) * nch
        idx_cont = (p1_end + i) * nch
        for c in range(nch):
            val = int((1.0 - alpha) * samples[idx_loop + c] + alpha * samples[idx_cont + c])
            out.append(val)
            
    out.extend(samples[(p1_end + xfade_frames) * nch :])
    
    raw_bytes = array.array('h', out).tobytes()
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(96)
    encoder.set_in_sample_rate(sr)
    encoder.set_channels(nch)
    encoder.set_quality(2)
    
    mp3_data = encoder.encode(raw_bytes) + encoder.flush()
    with open(dest_path, 'wb') as f:
        f.write(mp3_data)
        
    dur = (len(out) // nch) / sr
    return dur

def main():
    letters_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'letters')
    os.makedirs(letters_dir, exist_ok=True)
    temp_dir = os.path.join(os.path.dirname(__file__), 'temp_qari')
    os.makedirs(temp_dir, exist_ok=True)
    
    print(f"--- 1. Downloading and processing {len(FATHAH_QARI_MAP)} authentic studio Qari Fathah files ---")
    for suara_file, targets in FATHAH_QARI_MAP.items():
        url = BASE_URL + suara_file
        temp_file = os.path.join(temp_dir, suara_file)
        
        try:
            urllib.request.urlretrieve(url, temp_file)
            primary_target = os.path.join(letters_dir, targets[0])
            dur = trim_and_encode(temp_file, primary_target)
            
            with open(primary_target, 'rb') as f:
                primary_data = f.read()
                
            for alias in targets[1:]:
                alias_path = os.path.join(letters_dir, alias)
                with open(alias_path, 'wb') as f:
                    f.write(primary_data)
                    
            print(f"OK {suara_file} -> {targets} ({dur*1000:.0f}ms)")
        except Exception as e:
            print(f"FAILED {suara_file}: {e}")
            
    print(f"\n--- 2. Deriving {len(MAD_ASLI_MAP)} authentic studio Qari Mad Asli (2 Harakat) files ---")
    for mad_file, base_file in MAD_ASLI_MAP.items():
        base_path = os.path.join(letters_dir, base_file)
        mad_path = os.path.join(letters_dir, mad_file)
        if os.path.exists(base_path):
            dur = make_smooth_mad(base_path, mad_path, extend_ms=260)
            print(f"OK Mad Asli: {base_file} -> {mad_file} ({dur*1000:.0f}ms)")
        else:
            print(f"MISSING base {base_file} for {mad_file}")
            
    print("\nAll authentic studio Qari Fathah & Mad Asli letters processed successfully!")

if __name__ == '__main__':
    main()
