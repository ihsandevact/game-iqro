import os
import glob
import miniaudio
import lameenc

def trim_mp3(file_path, lead_keep_ms=15, trail_keep_ms=30, threshold=400):
    try:
        decoded = miniaudio.decode_file(file_path)
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
            print(f"Skipping empty: {file_path}")
            return
            
        encoder = lameenc.Encoder()
        encoder.set_bit_rate(96)
        encoder.set_in_sample_rate(sr)
        encoder.set_channels(nch)
        encoder.set_quality(2)
        
        mp3_data = encoder.encode(trimmed.tobytes()) + encoder.flush()
        
        with open(file_path, 'wb') as f:
            f.write(mp3_data)
            
        old_dur = len(samples) / (sr * nch)
        new_dur = len(trimmed) / (sr * nch)
        saved_ms = (old_dur - new_dur) * 1000.0
        print(f"Trimmed {os.path.basename(file_path)}: {old_dur*1000:.0f}ms -> {new_dur*1000:.0f}ms (saved {saved_ms:.0f}ms)")
    except Exception as e:
        print(f"Error trimming {file_path}: {e}")

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 1. Trim question prompts
    prompts_dir = os.path.join(base_dir, 'public', 'audio', 'prompts')
    print(f"\n--- Trimming Prompts in {prompts_dir} ---")
    prompt_files = glob.glob(os.path.join(prompts_dir, '*.mp3'))
    for f in prompt_files:
        trim_mp3(f, lead_keep_ms=10, trail_keep_ms=30, threshold=400)
        
    # 2. Trim hijaiyah letters
    letters_dir = os.path.join(base_dir, 'public', 'audio', 'letters')
    print(f"\n--- Trimming Letters in {letters_dir} ---")
    letter_files = glob.glob(os.path.join(letters_dir, '*.mp3'))
    for f in letter_files:
        trim_mp3(f, lead_keep_ms=10, trail_keep_ms=30, threshold=350)

if __name__ == '__main__':
    main()
