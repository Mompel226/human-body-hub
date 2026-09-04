#!/usr/bin/env python3
"""Drop assets/anatomy/body.svg into index.html between the PLATE markers.

Run this after editing the plate:   python3 tools/inline-plate.py
Inlining (rather than fetching) means the page still works when someone
just double-clicks index.html, with no web server running.
"""
import os, re, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
svg  = open(os.path.join(root, 'assets/anatomy/body.svg')).read()
svg  = re.sub(r'<\?xml[^>]*\?>\s*', '', svg)          # no XML prolog inside HTML
svg  = re.sub(r'<!--.*?-->', '', svg, flags=re.S)      # nor Inkscape's comments

page = os.path.join(root, 'index.html')
html = open(page).read()
block = '<!-- PLATE:START -->' + svg + '<!-- PLATE:END -->'
new, n = re.subn(r'<!-- PLATE:START -->.*?<!-- PLATE:END -->',
                 lambda _m: block, html, flags=re.S)
if not n:
    sys.exit('index.html has no <!-- PLATE:START --> … <!-- PLATE:END --> markers')
open(page, 'w').write(new)
print('plate inlined — index.html is now %.0f KB' % (len(new) / 1024))
