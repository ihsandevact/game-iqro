import re
import os
import sys

# Parse LETTER_AUDIO_MAP from ttsNarrator.ts
with open('src/core/audio/ttsNarrator.ts', 'r', encoding='utf-8') as f:
    tts_content = f.read()

map_match = re.search(r'const LETTER_AUDIO_MAP: Record<string, string> = \{(.*?)\};', tts_content, re.DOTALL)
letter_map = {}
if map_match:
    for line in map_match.group(1).splitlines():
        line = line.strip()
        m = re.match(r"['\"]([^'\"]+)['\"]\s*:\s*['\"]([^'\"]+)['\"]", line)
        if m:
            letter_map[m.group(1).lower().replace("’", "'").replace("`", "'")] = m.group(2)

def get_letter_audio_path(letter):
    if not letter: return None
    norm = letter.strip().lower().replace("’", "'").replace("`", "'")
    if norm in letter_map:
        return letter_map[norm]
    if norm == "'a": return '/audio/letters/ain_a.mp3'
    if norm == "'i": return '/audio/letters/ain_i.mp3'
    if norm == "'u": return '/audio/letters/ain_u.mp3'
    if norm == "'aa": return '/audio/letters/ain_aa.mp3'
    if norm == "'ii": return '/audio/letters/ain_ii.mp3'
    if norm == "'uu": return '/audio/letters/ain_uu.mp3'

    clean = re.sub(r"[^a-z']", '', norm)
    if clean in letter_map:
        return letter_map[clean]
    if not clean.startswith("'"):
        no_apos = clean.replace("'", "")
        if no_apos in letter_map:
            return letter_map[no_apos]
    return None

def get_word_audio_paths(word):
    if not word: return []
    trimmed = word.strip()
    
    # 1. Hyphen or space split first!
    if '-' in trimmed or ' ' in trimmed:
        parts = [p for p in re.split(r'[- ]+', trimmed) if p]
        if 2 <= len(parts) <= 6:
            paths = []
            all_valid = True
            for p in parts:
                p_path = get_letter_audio_path(p)
                if p_path:
                    paths.append(p_path)
                else:
                    all_valid = False
                    break
            if all_valid and len(paths) == len(parts):
                return paths

    # 2. Arabic analysis
    if re.search(r'[\u0600-\u06FF]', trimmed):
        direct = get_letter_audio_path(trimmed)
        if direct: return [direct]
        
        # Syllables
        syllable_regex = r'([\u0621-\u064A][\u064B-\u0652]?(?:[اى]|[يو][\u0652]?|[\u0670])?)'
        syllables = re.findall(syllable_regex, trimmed)
        if syllables:
            paths = []
            all_valid = True
            for syl in syllables:
                p = get_letter_audio_path(syl)
                if not p:
                    no_sukun = re.sub(r'\u0652', '', syl)
                    p = get_letter_audio_path(no_sukun)
                if not p:
                    base = re.sub(r'[\u064B-\u065F\u0670اى]', '', syl)
                    p = get_letter_audio_path(base)
                if p:
                    paths.append(p)
                else:
                    all_valid = False
                    break
            if all_valid and len(paths) == len(syllables):
                return paths

        # Fallback char by char
        paths = []
        for c in trimmed:
            if re.match(r'[\u064B-\u065F\u0670]', c): continue
            if c == 'ا' and len(paths) > 0: continue
            p = get_letter_audio_path(c)
            if p: paths.append(p)
        if paths:
            return paths

    # 3. Single letter direct match
    single = get_letter_audio_path(trimmed)
    if single: return [single]

    return []
