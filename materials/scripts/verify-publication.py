"""Verify the deployment against the exact artifact uploaded by this workflow."""
import hashlib
import pathlib
import re
import sys
import time
import urllib.request

root = pathlib.Path(sys.argv[1])
base = sys.argv[2].rstrip('/') + '/'
index = (root / 'index.html').read_text()
assets = re.findall(r'(?:src|href)="\./(assets/[^"?]+)"', index)
assert assets, 'No app assets in built index'
paths = ['design/role-effects.html', 'design/role-effects.json', 'index.html', 'knowledge/graph.json', 'tower/learning-catalog.json', 'tower/study-catalog.json', 'tower/study.html', 'tower/starters.html', 'tower/starter-update.html', 'tower/icons.html', 'tower/icons-v2.html', 'tower/icons-flat.html', 'tower/icons.mjs', 'tower/card-icons.mjs',
         'study/2026-10-07/questions.html', 'sw.js', *assets]
for attempt in range(12):
    try:
        for path in paths:
            expected = (root / path).read_bytes()
            request = urllib.request.Request(base + path + '?verify=' + hashlib.sha256(expected).hexdigest()[:16],
                                             headers={'Cache-Control': 'no-cache'})
            with urllib.request.urlopen(request, timeout=30) as response:
                actual = response.read()
                assert response.status == 200, (path, response.status)
            assert hashlib.sha256(actual).digest() == hashlib.sha256(expected).digest(), path + ': stale content'
        print('Verified HTTP 200 and SHA256 for deployed HTML, app assets, knowledge graph, quiz catalog, and service worker: ' + base)
        break
    except Exception as error:
        print(f'Publication check {attempt + 1}/12: {error}', flush=True)
        if attempt == 11:
            raise
        time.sleep(10)
