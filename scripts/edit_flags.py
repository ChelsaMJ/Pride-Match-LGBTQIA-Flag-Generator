import json

with open('js/data/flagsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

header = content.split('export const FLAGS_DATA = ')[0]
json_str = content.split('export const FLAGS_DATA = ')[1].rstrip(';\n').rstrip(';')
flags = json.loads(json_str)

# IDs to remove
remove_ids = {
    'xenogender_variant_3',  # Remove Xenogender (Variant 3)
    'polyamorous_variant_3', # Remove Polyamorous (Variant 3) 
    'lesbian_variant_4',     # Remove Lesbian (Variant 4)
}

filtered = []
for flag in flags:
    if flag['id'] in remove_ids:
        print('Removing: ' + flag['name'])
        continue
    # Rename Lesbian (Variant 2) -> Lesbian, update its id
    if flag['id'] == 'lesbian_variant_2':
        flag['name'] = 'Lesbian (Labrys)'
        print('Renamed lesbian_variant_2 -> Lesbian (Labrys)')
    filtered.append(flag)

print('Before:', len(flags), 'After:', len(filtered))

js_out = header + 'export const FLAGS_DATA = ' + json.dumps(filtered, indent=2) + ';\n'
with open('js/data/flagsData.js', 'w', encoding='utf-8') as f:
    f.write(js_out)

print('Saved flagsData.js')
