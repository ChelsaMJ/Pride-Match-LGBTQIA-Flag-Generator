import os
import re
import json
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FLAGS_DIR = os.path.join(PROJECT_DIR, 'assets', 'flags')
OUTPUT_JS = os.path.join(PROJECT_DIR, 'js', 'data', 'flagsData.js')

os.makedirs(FLAGS_DIR, exist_ok=True)

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}
API_URL = 'https://lgbtqia.fandom.com/api.php'

KNOWN_DESCRIPTIONS = {
    'biromantic': 'Biromantic describes someone who experiences romantic attraction to people of more than one gender identity. Romantic attraction is distinct from sexual attraction under the Split Attraction Model.',
    'panromantic': 'Panromantic refers to experiencing romantic attraction to people regardless of their gender identity. Gender is not a limiting factor in who they may fall in love with.',
    'homoromantic': 'Homoromantic describes someone who experiences romantic attraction exclusively or primarily to people of their own gender.',
    'heteroromantic': 'Heteroromantic describes individuals who experience romantic attraction to people of a gender different from their own.',
    'demiromantic': 'Demiromantic individuals only experience romantic attraction after forming a deep, emotional connection or bond with someone first.',
    'aromantic': 'Aromantic (Aro) describes individuals who experience little to no romantic attraction to others, or experience it in ways different from societal norms.',
    'autoromantic': 'Autoromantic describes individuals who experience romantic attraction toward themselves, or prefer romantic experiences centered on self-love.',
    'desinoromantic': 'Desinoromantic describes someone who does not experience full romantic attraction, but experiences attraction that is on the boundary or threshold of romance.',
    'quoiromantic': 'Quoiromantic (WTFromantic) describes someone who finds the concept of romantic attraction unclear, inapplicable, or indistinguishable from platonic attraction.',
    'cupioromantic': 'Cupioromantic describes an aromantic individual who desires a romantic relationship despite not feeling romantic attraction.',
    'frayromantic': 'Frayromantic describes someone who experiences romantic attraction toward people they do not know well, but that attraction fades as a deeper bond forms.',
    'aegoromantic': 'Aegoromantic describes individuals who enjoy romantic concepts, stories, or fantasies, but experience a disconnect between themselves and the target of romantic attraction.',
    'bisexual': 'Bisexual (Bi) refers to attraction to two or more genders. Bisexuality is an inclusive orientation that encompasses attraction across the gender spectrum.',
    'pansexual': 'Pansexual (Pan) describes attraction to people regardless of their gender identity, often described as attraction to people based on personality rather than gender.',
    'asexual': 'Asexual (Ace) describes individuals who experience little to no sexual attraction to others. Asexuality exists on a broad spectrum.',
    'demisexual': 'Demisexual describes individuals who only experience sexual attraction after developing a strong emotional connection or bond with someone.',
    'genderqueer': 'Genderqueer is an umbrella term and gender identity for people whose gender identity falls outside the traditional binary of male and female.',
    'non-binary': 'Non-binary (Enby) is an umbrella term for gender identities that are not solely male or female, falling outside the gender binary.',
    'transgender': 'Transgender (Trans) describes people whose gender identity differs from the sex they were assigned at birth.',
    'intersex': 'Intersex individuals are born with sex characteristics (chromosomes, genitalia, or hormonal profiles) that do not fit typical binary notions of male or female bodies.',
    'achillean': 'Achillean refers to men or male-aligned individuals who are attracted to other men or male-aligned individuals (spanning gay, bi, pan, and omni men).',
    'sapphic': 'Sapphic refers to women or female-aligned individuals who are attracted to other women or female-aligned individuals (spanning lesbian, bi, pan, and omni women).',
    'diamoric': 'Diamoric refers to relationships, attractions, or identities held by non-binary people that do not fit into traditional monosexual or binary frameworks.',
    'polyamorous': 'Polyamorous (Poly) refers to the practice of, or desire for, romantic or sexual relationships with more than one partner concurrently, with the informed consent of all partners involved.'
}

def clean_title_and_notes(caption_raw, filename):
    if not caption_raw:
        title = filename.replace('_', ' ').replace('.svg', '').replace('.png', '')
        title = re.sub(r'\s+Flag$', '', title, flags=re.IGNORECASE).strip()
        return title, "", title
        
    # 1. Strip <ref>...</ref> and <ref ... />
    s = re.sub(r'<ref.*?>.*?</ref>', '', caption_raw, flags=re.DOTALL)
    s = re.sub(r'<ref.*?/>', '', s)
    s = re.sub(r'<!--.*?-->', '', s, flags=re.DOTALL).strip()
    
    # 2. Separate title from extra notes (e.g. after <br> or double newline)
    parts = re.split(r'<br\s*/?>|\n', s, flags=re.IGNORECASE)
    primary_part = parts[0].strip()
    extra_notes = " ".join([p.strip() for p in parts[1:] if p.strip()]) if len(parts) > 1 else ""
    
    # 3. Extract title from wiki link [[Link|Title]] or [[Title]]
    match = re.search(r'\[\[(?:[^|\]]*\|)?([^\]]+)\]\]', primary_part)
    if match:
        main_title = match.group(1).strip()
    else:
        main_title = primary_part.strip()
        
    main_title = re.sub(r'\[\[|\]\]', '', main_title)
    main_title = main_title.replace('"', '').replace("'", "").strip()
    
    if not main_title or len(main_title) > 45:
        main_title = filename.replace('_', ' ').replace('.svg', '').replace('.png', '')
        main_title = re.sub(r'\s+Flag$', '', main_title, flags=re.IGNORECASE).strip()
        
    wiki_page_match = re.search(r'\[\[([^|\]]+)', caption_raw)
    wiki_page = wiki_page_match.group(1) if wiki_page_match else main_title
    
    return main_title, extra_notes, wiki_page

def fetch_gallery_wikitext():
    params = {'action': 'parse', 'page': 'Pride_flag_gallery', 'prop': 'wikitext', 'format': 'json'}
    r = requests.get(API_URL, params=params, headers=HEADERS)
    return r.json()['parse']['wikitext']['*']

def parse_gallery_entries(wikitext):
    lines = wikitext.split('\n')
    current_section = "General"
    entries = []
    seen = set()
    title_counts = {}
    
    in_gallery = False
    for line in lines:
        l = line.strip()
        if l.startswith('==') and l.endswith('=='):
            heading = l.strip('=').strip()
            if heading:
                current_section = heading
        elif '<gallery' in l:
            in_gallery = True
        elif '</gallery>' in l:
            in_gallery = False
        elif in_gallery and l and not l.startswith('//'):
            # Ignore commented out lines
            if l.startswith('<!--'):
                continue
                
            parts = l.split('|', 1)
            filename = parts[0].strip()
            caption_raw = parts[1].strip() if len(parts) > 1 else ''
            
            # Remove comment artifacts from filename if present
            filename = re.sub(r'<!--.*?-->', '', filename, flags=re.DOTALL).strip()
            if not filename or filename.startswith('<!--'):
                continue
                
            main_title, extra_notes, wiki_page = clean_title_and_notes(caption_raw, filename)
            
            key = f"{filename}_{main_title}"
            if filename and key not in seen:
                seen.add(key)
                
                title_counts[main_title] = title_counts.get(main_title, 0) + 1
                display_name = main_title
                if title_counts[main_title] > 1:
                    display_name = f"{main_title} (Variant {title_counts[main_title]})"
                    
                entries.append({
                    'filename': filename,
                    'raw_caption': caption_raw,
                    'title': display_name,
                    'wiki_page': wiki_page,
                    'extra_notes': extra_notes,
                    'section': current_section
                })
    return entries

def fetch_image_urls(filenames):
    urls = {}
    for i in range(0, len(filenames), 50):
        chunk = filenames[i:i+50]
        titles = ['File:' + fn for fn in chunk]
        params = {
            'action': 'query',
            'titles': '|'.join(titles),
            'prop': 'imageinfo',
            'iiprop': 'url',
            'format': 'json'
        }
        try:
            r = requests.get(API_URL, params=params, headers=HEADERS)
            data = r.json()
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                t = p.get('title', '').replace('File:', '').strip()
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url')
                if url:
                    urls[t] = url
        except Exception:
            pass
    return urls

def download_single_image(filename_url):
    filename, url = filename_url
    safe_filename = filename.replace(' ', '_')
    dest_path = os.path.join(FLAGS_DIR, safe_filename)
    rel_path = f"assets/flags/{safe_filename}"
    
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 100:
        return filename, rel_path

    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        if r.status_code == 200:
            with open(dest_path, 'wb') as f:
                f.write(r.content)
    except Exception:
        pass
    return filename, rel_path

def fetch_single_description(page):
    clean_p = page.split('#')[0]
    params = {'action': 'parse', 'page': clean_p, 'prop': 'text', 'format': 'json'}
    try:
        r = requests.get(API_URL, params=params, headers=HEADERS, timeout=6)
        res = r.json()
        if 'parse' in res and 'text' in res['parse']:
            html = res['parse']['text']['*']
            soup = BeautifulSoup(html, 'html.parser')
            paragraphs = []
            for para in soup.find_all('p'):
                txt = para.get_text().strip()
                txt = re.sub(r'\[\d+\]', '', txt)
                if len(txt) > 30 and not txt.startswith('This page') and not txt.startswith('For '):
                    paragraphs.append(txt)
            if paragraphs:
                return page, ' '.join(paragraphs[:2])
    except Exception:
        pass
    return page, None

def extract_svg_stripe_colors(local_filepath):
    if not os.path.exists(local_filepath) or not local_filepath.endswith('.svg'):
        return []
    try:
        with open(local_filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        fills = re.findall(r'fill=["\'](#[0-9a-fA-F]{3,8})["\']', content)
        colors = []
        for c in fills:
            c_upper = c.upper()
            if len(c_upper) == 4:
                c_upper = '#' + ''.join([ch*2 for ch in c_upper[1:]])
            if c_upper not in colors and c_upper != '#00000000':
                colors.append(c_upper)
        return colors
    except Exception:
        return []

def assign_categories(title, section, caption):
    cats = set()
    t_lower = (title + ' ' + section + ' ' + caption).lower()
    
    # Romantic Orientations
    if any(k in t_lower for k in ['romantic', 'romance', 'aro', 'autoromantic', 'desinoromantic', 'quoiromantic', 'cupioromantic', 'frayromantic', 'aegoromantic', 'biromantic', 'panromantic', 'homoromantic', 'heteroromantic']):
        cats.add('Romantic Orientations')
        
    # Sexual Orientations
    if any(k in t_lower for k in ['sexual', 'bisexual', 'pansexual', 'homosexual', 'heterosexual', 'polysexual', 'omnisexual', 'abrosexual', 'androsexual', 'gynesexual', 'ceterosexual', 'multisexual', 'achillean', 'sapphic', 'diamoric', 'twink', 'butch', 'femme', 'gay', 'lesbian', 'ally']):
        cats.add('Sexual Orientations')
        
    # Ace & Aro Spectrum
    if any(k in t_lower for k in ['ace', 'aro', 'asexual', 'aromantic', 'demi', 'gray', 'grey', 'cupio', 'fray', 'quoi', 'lith', 'aego', 'apothi', 'alloace', 'oriented']):
        cats.add('Ace & Aro Spectrum')
        
    # Gender Identities
    if any(k in t_lower for k in ['gender', 'trans', 'non-binary', 'nonbinary', 'agender', 'genderfluid', 'maverique', 'neutrois', 'androgyne', 'intergender', 'bigender', 'pangender', 'xenogender', 'demigirl', 'demiboy', 'intersex', 'genderqueer', 'girlflux', 'boyflux', 'creative', 'unlabeled', 'questioning']):
        cats.add('Gender Identities')
        
    # Attraction Dynamics & Labels
    if any(k in t_lower for k in ['poly', 'polyamor', 'attraction', 'platonic', 'alterous', 'queerplatonic', 'amorous', 'relationship', 'split', 'monogam', 'enamoric', 'anarch', 'oriented', 'spectrum']):
        cats.add('Attraction Dynamics & Labels')
        
    if not cats:
        cats.add('Sexual Orientations')
        
    return list(cats)

def build_flags_dataset():
    print("Step 1: Parsing gallery wikitext with ref/comment stripping...")
    wikitext = fetch_gallery_wikitext()
    entries = parse_gallery_entries(wikitext)
    print(f"Parsed {len(entries)} clean flag entries.")
    
    filenames = [e['filename'] for e in entries]
    image_urls = fetch_image_urls(filenames)
    
    print("Step 2: Downloading flag images...")
    local_image_map = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(download_single_image, item) for item in image_urls.items()]
        for f in as_completed(futures):
            fn, rpath = f.result()
            local_image_map[fn] = rpath

    print("Step 3: Fetching wiki intro descriptions...")
    wiki_pages = list(set(e['wiki_page'] for e in entries if e['wiki_page'] and not e['wiki_page'].startswith('File:')))
    wiki_descs = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetch_single_description, page) for page in wiki_pages]
        for f in as_completed(futures):
            p, desc = f.result()
            if desc:
                wiki_descs[p] = desc

    print("Step 4: Assembling clean JSON flags database...")
    flags_list = []
    seen_ids = set()
    
    for idx, e in enumerate(entries):
        fn = e['filename']
        title = e['title']
        
        clean_id = re.sub(r'[^a-z0-9_]', '', title.lower().replace(' ', '_').replace('(', '').replace(')', ''))
        if not clean_id or clean_id in seen_ids:
            clean_id = re.sub(r'[^a-z0-9_]', '', fn.lower().replace('.svg', '').replace('.png', '').replace(' ', '_'))
        
        base_id = clean_id
        counter = 1
        while clean_id in seen_ids:
            clean_id = f"{base_id}_{counter}"
            counter += 1
        seen_ids.add(clean_id)
        
        img_rel_path = local_image_map.get(fn, f"assets/flags/{fn.replace(' ', '_')}")
        
        raw_base_title = title.split(' (')[0].lower()
        if raw_base_title in KNOWN_DESCRIPTIONS:
            description = KNOWN_DESCRIPTIONS[raw_base_title]
        elif e['wiki_page'] in wiki_descs:
            description = wiki_descs[e['wiki_page']]
        else:
            description = f"{title} is a pride identity flag featured in the LGBTQIA+ Pride Flag Gallery."
            
        description = description.replace('"', '').replace("'", "")
        
        origin_text = f"Featured in LGBTQIA+ Pride Flag Gallery under '{e['section']}'."
        if e['extra_notes']:
            origin_text += f" Note: {e['extra_notes'].replace('\"', '').replace('\'', '')}"
            
        short_desc = description.split('.')[0] + '.'
        if len(short_desc) > 140:
            short_desc = short_desc[:137] + '...'
            
        categories = assign_categories(title, e['section'], e['raw_caption'])
        primary_category = categories[0]
        
        full_dest_path = os.path.join(PROJECT_DIR, img_rel_path.replace('/', os.sep))
        colors = extract_svg_stripe_colors(full_dest_path)
        
        stripes = []
        if colors:
            for color in colors:
                stripes.append({
                    'color': color,
                    'label': f"Color {color}",
                    'meaning': f"Symbolic stripe ({color}) of the {title} flag."
                })
        else:
            stripes = [
                {'color': '#7C3AED', 'label': 'Primary Accent', 'meaning': f"Core color of {title}"},
                {'color': '#FFFFFF', 'label': 'White Stripe', 'meaning': 'Inclusivity & community'},
                {'color': '#06B6D4', 'label': 'Secondary Accent', 'meaning': 'Spectrum of attraction'}
            ]
            
        tags = [title.lower(), clean_id.replace('_', ' '), e['section'].lower()]
        tags.extend([c.lower() for c in categories])
        words = title.lower().split()
        tags.extend(words)
        
        sam_types = []
        if 'Romantic Orientations' in categories: sam_types.append('romantic')
        if 'Sexual Orientations' in categories: sam_types.append('sexual')
        if 'Ace & Aro Spectrum' in categories: sam_types.append('ace_aro')
        if 'Gender Identities' in categories: sam_types.append('gender')
        if 'Attraction Dynamics & Labels' in categories: sam_types.append('attraction')
        
        flag_obj = {
            'id': clean_id,
            'name': title,
            'category': primary_category,
            'categories': categories,
            'imageUrl': img_rel_path,
            'shortDesc': short_desc,
            'description': description,
            'stripes': stripes,
            'tags': list(set(tags)),
            'sam': sam_types if sam_types else ['sexual'],
            'origin': origin_text
        }
        flags_list.append(flag_obj)
        
    print(f"Generated clean dataset for {len(flags_list)} flags.")
    
    js_content = f"""// Clean LGBTQIA+ Flags Knowledge Base - Pride Flag Gallery ({len(flags_list)} Flags)

export const FLAG_CATEGORIES = {{
  ALL: 'All Flags',
  SEXUAL: 'Sexual Orientations',
  ROMANTIC: 'Romantic Orientations',
  ACE_ARO: 'Ace & Aro Spectrum',
  GENDER: 'Gender Identities',
  DYNAMICS: 'Attraction Dynamics & Labels'
}};

export const FLAGS_DATA = {json.dumps(flags_list, indent=2)};
"""
    with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Successfully saved clean {OUTPUT_JS}!")

if __name__ == '__main__':
    build_flags_dataset()
