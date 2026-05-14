import glob, os

# ── EMAIL ─────────────────────────────────────────────────────────────────────
OLD_EMAIL = b'info@trinityhomecarellc.com'
NEW_EMAIL = b'mail@trinityhomecarellc.com'

email_changed = 0
for path in glob.glob('**/*.html', recursive=True):
    with open(path, 'rb') as f:
        data = f.read()
    new = data.replace(OLD_EMAIL, NEW_EMAIL)
    if new != data:
        with open(path, 'wb') as f:
            f.write(new)
        email_changed += 1
        print(f'Email updated: {path}')

print(f'\nEmail: {email_changed} files updated')

# ── HOURS ─────────────────────────────────────────────────────────────────────
# Only contact.html, index.html, about.html contain hours
hours_files = ['contact.html', 'index.html', 'about.html']

hours_replacements = [
    # Visible hours — structured list (contact.html)
    (b'<span class="hours-time">8:00 AM \xe2\x80\x93 6:00 PM</span>',
     b'<span class="hours-time">9:00 AM \xe2\x80\x93 5:00 PM</span>'),
    # Saturday time → Closed
    (b'<span class="hours-time">9:00 AM \xe2\x80\x93 3:00 PM</span>',
     b'<span class="hours-time">Closed</span>'),
    # Inline short form — contact.html info-card-sub
    (b'Mon\xe2\x80\x93Fri 8am\xe2\x80\x936pm, Sat 9am\xe2\x80\x933pm.',
     b'Mon\xe2\x80\x93Fri 9am\xe2\x80\x935pm, closed weekends.'),
    # Inline short form — footer/cta (ndash + middot variants)
    (b'Mon&ndash;Fri 8 am&ndash;6 pm &nbsp;&middot;&nbsp; Sat 9 am&ndash;3 pm',
     b'Mon&ndash;Fri 9 am&ndash;5 pm &nbsp;&middot;&nbsp; Closed weekends'),
    (b'Mon&ndash;Fri 8am&ndash;6pm &middot; Sat 9am&ndash;3pm &middot; Care team reachable 24/7 for existing clients.',
     b'Mon&ndash;Fri 9am&ndash;5pm &middot; Closed weekends &middot; Care team reachable 24/7 for existing clients.'),
    # Contact form time preference options
    (b'<option value="morning">Morning (8am \xe2\x80\x93 noon)</option>',
     b'<option value="morning">Morning (9am \xe2\x80\x93 noon)</option>'),
    (b'<option value="evening">Evening (4pm \xe2\x80\x93 6pm)</option>',
     b'<option value="evening">Evening (4pm \xe2\x80\x93 5pm)</option>'),
    # JSON-LD structured data — Mon-Fri hours (CRLF line endings)
    (b'"opens": "08:00",\r\n        "closes": "18:00"',
     b'"opens": "09:00",\r\n        "closes": "17:00"'),
    # JSON-LD structured data — remove Saturday block (CRLF)
    (b'      {\r\n        "@type": "OpeningHoursSpecification",\r\n        "dayOfWeek": "Saturday",\r\n        "opens": "09:00",\r\n        "closes": "15:00"\r\n      }\r\n    ]',
     b'    ]'),
]

hours_changed = 0
for path in hours_files:
    with open(path, 'rb') as f:
        data = f.read()
    original = data
    for old, new in hours_replacements:
        data = data.replace(old, new)
    if data != original:
        with open(path, 'wb') as f:
            f.write(data)
        hours_changed += 1
        print(f'Hours updated: {path}')

print(f'Hours: {hours_changed} files updated')
