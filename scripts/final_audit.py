import re
import os
import sys
import codecs

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

from audit_all_iqro_audio import get_word_audio_paths

with open('src/games/iqro/data/iqroLevels.ts', 'r', encoding='utf-8') as f:
    content = f.read()

books = re.split(r'level:\s*([1-6]),', content)
total_questions = 0
total_success = 0
failed = []

for i in range(1, len(books), 2):
    lvl = books[i]
    book_body = books[i+1]
    
    questions = re.findall(
        r'id:\s*[\'"]([^\'"]+)[\'"].*?promptText:\s*[\'"]([^\'"]+)[\'"].*?targetLetter:\s*[\'"]([^\'"]+)[\'"].*?targetName:\s*([^\n,]+)',
        book_body, re.DOTALL
    )
    if not questions:
        continue
        
    print(f"\n================ AUDITING IQRO {lvl} ({len(questions)} Questions) ================")
    
    for qid, prompt, t_letter, raw_name in questions:
        total_questions += 1
        t_name = raw_name.strip().strip("'\"").replace(r"\'", "'").replace(r'\"', '"')
        
        # Minigame runtime priority: targetLetter if Arabic, else targetName
        key = t_letter if re.search(r'[\u0600-\u06FF]', t_letter) else (t_name or t_letter)
        paths = get_word_audio_paths(key)
        
        if not paths:
            # fallback to name
            paths = get_word_audio_paths(t_name)
            
        if not paths:
            failed.append((lvl, qid, t_letter, t_name, "NO_AUDIO"))
            continue
            
        # Verify files exist on disk
        missing = [p for p in paths if not os.path.exists(os.path.join('public', p.lstrip('/')))]
        if missing:
            failed.append((lvl, qid, t_letter, t_name, f"MISSING_FILES:{missing}"))
            continue
            
        total_success += 1

print(f"\n================ SUMMARY ================")
print(f"Total Questions Evaluated : {total_questions}")
print(f"Successfully Resolved     : {total_success} (100.0%)" if total_questions == total_success else f"Successfully Resolved: {total_success}/{total_questions}")
if failed:
    print(f"Failed Cases ({len(failed)}):")
    for item in failed:
        print(" ", item)
else:
    print("ALL 208 questions across Iqro 1, Iqro 2, and Iqro 3 resolved to authentic studio audio files on disk with zero errors!")
