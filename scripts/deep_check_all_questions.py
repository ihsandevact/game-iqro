import re
import os
import sys
import codecs

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

from audit_all_iqro_audio import get_word_audio_paths, get_letter_audio_path

with open('src/games/iqro/data/iqroLevels.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all questions in Iqro 2 and Iqro 3
matches = re.findall(
    r'id:\s*[\'"]([^\'"]+)[\'"].*?promptText:\s*[\'"]([^\'"]+)[\'"].*?targetLetter:\s*[\'"]([^\'"]+)[\'"].*?targetName:\s*([^\n,]+)',
    content, re.DOTALL
)

print(f"Total question targets extracted across all books: {len(matches)}")

issues = []

for qid, prompt, t_letter, raw_tname in matches:
    # Clean targetName (could be 'Ja-\'A-La' or "Ma-'A")
    t_name = raw_tname.strip().strip("'\"").replace(r"\'", "'").replace(r'\"', '"')
    
    # 1. Test targetLetter resolution
    l_paths = get_word_audio_paths(t_letter)
    # 2. Test targetName resolution
    n_paths = get_word_audio_paths(t_name)
    
    # Check if either is empty
    if not l_paths and not n_paths:
        issues.append((qid, t_letter, t_name, "BOTH_FAILED_TO_RESOLVE"))
        continue
    if not l_paths:
        issues.append((qid, t_letter, t_name, "LETTER_FAILED_TO_RESOLVE"))
        continue
    if not n_paths:
        issues.append((qid, t_letter, t_name, "NAME_FAILED_TO_RESOLVE"))
        continue
        
    # Check if they resolve to different files
    l_bases = [os.path.basename(p) for p in l_paths]
    n_bases = [os.path.basename(p) for p in n_paths]
    if l_bases != n_bases:
        issues.append((qid, t_letter, t_name, f"MISMATCH: Letter={l_bases} vs Name={n_bases}"))
        
    # Check if all files exist on disk
    for p in l_paths + n_paths:
        disk_p = os.path.join('public', p.lstrip('/'))
        if not os.path.exists(disk_p):
            issues.append((qid, t_letter, t_name, f"FILE_NOT_FOUND:{p}"))

print(f"\nFound {len(issues)} potential discrepancies in question target resolutions:")
for item in issues:
    print(f"  [{item[0]}] '{item[1]}' ({item[2]}): {item[3]}")
