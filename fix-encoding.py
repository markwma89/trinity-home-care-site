import os, glob

# Each tuple: (corrupted UTF-8 bytes, correct UTF-8 bytes)
# These are the result of Latin-1 re-encoding UTF-8 special chars
fixes = [
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x94', b'\xe2\x80\x94'),  # — em dash
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'\xe2\x80\x9d'),  # " right double quote
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9c', b'\xe2\x80\x9c'),  # " left double quote
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x99', b'\xe2\x80\x99'),  # ' right single quote
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x98', b'\xe2\x80\x98'),  # ' left single quote
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\xa6', b'\xe2\x80\xa6'),  # … ellipsis
    (b'\xc3\xa2\xe2\x82\xac\xc5\x93',     b'\xe2\x80\x9c'),  # " (variant)
    (b'\xc3\xa2\xe2\x82\xac\xc2\xa2',     b'\xc2\xa2'),      # ¢ cent sign
    (b'\xc3\xa2\xe2\x82\xac\xc2\xba',     b'\xe2\x80\xba'),  # › single right angle quote
    (b'\xc3\xa2\xe2\x82\xac\xc2\xb0',     b'\xc2\xb0'),      # ° degree
    (b'\xc3\xa2\xe2\x82\xac\xc2\xb9',     b'\xc2\xb9'),      # ¹ superscript 1
]

changed = 0
for path in glob.glob('**/*.html', recursive=True):
    with open(path, 'rb') as f:
        data = f.read()
    original = data
    for bad, good in fixes:
        data = data.replace(bad, good)
    if data != original:
        with open(path, 'wb') as f:
            f.write(data)
        changed += 1
        print(f'Fixed: {path}')

print(f'\nTotal files fixed: {changed}')
