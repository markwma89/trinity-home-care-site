import glob, os

changed = 0
for path in glob.glob('**/*.html', recursive=True):
    with open(path, 'rb') as f:
        data = f.read()
    new = data.replace(b'js/main.js"', b'js/main.js?v=2"')
    if new != data:
        with open(path, 'wb') as f:
            f.write(new)
        changed += 1
        print(f'Updated: {path}')

print(f'\nTotal: {changed} files')
