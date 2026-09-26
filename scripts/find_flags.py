import json

with open('js/data/flagsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

json_str = content.split('export const FLAGS_DATA = ')[1].rstrip(';\n').rstrip(';')
flags = json.loads(json_str)

for i, flag in enumerate(flags):
    name = flag['name']
    if 'Xenogender' in name or 'Polyamorous' in name or 'Lesbian' in name:
        print(str(i) + '  id=' + flag['id'] + '  name=' + name)
