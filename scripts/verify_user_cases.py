import sys, codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

from audit_all_iqro_audio import get_word_audio_paths

test_cases = [
    # Question ID, Arabic Letter, Target Name
    ("q30 (Ain fathah)", "عَ", "'A"),
    ("q32 (Ain tracing)", "عَ", "'A"),
    ("iqro2-u2 (Ja-Ba)", "جَبَ", "Ja-Ba"),
    ("iqro2-u2-s3 (Kho-Ro-Ja)", "خَرَجَ", "Kho-Ro-Ja"),
    ("iqro2-u2-s4 (Ja-'A-La)", "جَعَلَ", "Ja-'A-La"),
    ("iqro2-u5-s2 (Ma-'A)", "مَعَ", "Ma-'A"),
    ("iqro2-u5-s4 (Fahima)", "فَهِمَ", "Fa-Hi-Ma"),
    ("iqro3-u1-s4-q3 (Ain kasrah)", "عِ", "'I"),
    ("iqro3-u2-s4-q2 (Ain dhammah)", "عُ", "'U"),
    ("iqro3-u3-s4-q3 ('Ulima)", "عُلِمَ", "'U-Li-Ma"),
    ("iqro3-u6-s1-q3 (Jaa-Jii-Juu)", "جَاجِيْجُوْ", "Jaa-Jii-Juu"),
    ("iqro3-u7-s2 (Sami'a)", "سَمِعَ", "Sa-Mi-'A"),
]

print("=== VERIFYING RUNTIME RESOLUTION FOR USER REPORTED CASES ===")
for label, ar_letter, lat_name in test_cases:
    # 1. From Arabic Letter (prioritized in minigames)
    ar_paths = get_word_audio_paths(ar_letter)
    # 2. From Latin Name
    lat_paths = get_word_audio_paths(lat_name)
    
    print(f"\nCase: {label}")
    print(f"  Arabic '{ar_letter}' -> {[p.split('/')[-1] for p in ar_paths]}")
    print(f"  Latin  '{lat_name}'   -> {[p.split('/')[-1] for p in lat_paths]}")
    
    assert len(ar_paths) > 0, f"Arabic resolution failed for {ar_letter}"
    assert len(lat_paths) > 0, f"Latin resolution failed for {lat_name}"
    
print("\nAll runtime resolutions VERIFIED 100% SUCCESFUL!")
