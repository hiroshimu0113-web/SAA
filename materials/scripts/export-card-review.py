"""Publish the review document; no third-party Markdown dependency required."""
from pathlib import Path
import html
import re
root = Path(__file__).resolve().parents[1]
source = (root / 'docs/CARD_EFFECTS_REVISION2_REVIEW.md').read_text()
def inline(s):
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html.escape(s))
lines = source.splitlines()
parts = []
i = 0
while i < len(lines):
    line = lines[i]
    if not line.strip():
        i += 1
        continue
    if line.startswith('|'):
        rows = []
        while i < len(lines) and lines[i].startswith('|'):
            cells = lines[i].strip('|').split('|')
            if not all(re.fullmatch(r'\s*:?-+:?\s*', c) for c in cells):
                tag = 'th' if not rows else 'td'
                rows.append('<tr>' + ''.join(f'<{tag}>{inline(c)}</{tag}>' for c in cells) + '</tr>')
            i += 1
        parts.append('<div class="table-scroll" tabindex="0" aria-label="比較表（横にスクロールできます）"><table>' + ''.join(rows) + '</table></div>')
        continue
    m = re.match(r'^(#{1,6}) (.*)', line)
    if m:
        level = len(m[1])
        anchor = ' id="balance"' if m[2].startswith('ゲームバランスの追加検証') else ''
        parts.append(f'<h{level}{anchor}>{inline(m[2])}</h{level}>')
    elif line.startswith('- '):
        items = []
        while i < len(lines) and lines[i].startswith('- '):
            items.append('<li>' + inline(lines[i][2:]) + '</li>')
            i += 1
        parts.append('<ul>' + ''.join(items) + '</ul>')
        continue
    else:
        parts.append('<p>' + inline(line) + '</p>')
    i += 1
page = '''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>カード効果案の検証・ゲームバランスレポート</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f5fa;color:#1b2942;font:16px/1.85 system-ui,sans-serif;overflow-wrap:anywhere}main{max-width:960px;margin:auto;background:white;padding:28px}h1{font-size:1.8rem}h2{margin-top:2.5em;border-bottom:2px solid #dde3ef}h3{margin-top:2em}a{color:#215eb2}nav{padding:16px;background:#edf3fb;border-radius:10px}nav a{display:inline-block;margin:4px 14px 4px 0}.notice{background:#fff4dc;padding:14px;border-radius:8px}.table-scroll{overflow-x:auto}table{border-collapse:collapse;min-width:600px;width:100%}td,th{padding:10px;text-align:left;vertical-align:top;border:1px solid #dde3ef}th{background:#edf3fb}li{margin:8px 0} @media(max-width:600px){main{padding:16px}h1{font-size:1.5rem}} @media print{nav{display:none}}
</style></head><body><main><nav aria-label="レポートのナビゲーション"><a href="#balance">ゲームバランスの検証へ</a><a href="card-effects-proposal.html#revision">検証対象のカード案</a><a href="card-effects-review.md" download>全文を保存（Markdown）</a></nav><p class="notice">改訂2に対する検証記録です。本文の「未同期」「未公開」は検証時点の記録です。このレポートは公開済みですが、提案カードのゲーム実装・勝率検証は未実施です。</p>'''
page += '\n'.join(parts) + '</main></body></html>\n'
out = root / 'public/design'
(out / 'card-effects-review.html').write_text(page)
(out / 'card-effects-review.md').write_text(source)
print('Published review generated from docs/CARD_EFFECTS_REVISION2_REVIEW.md')
