from pathlib import Path
from html import escape
import json
root=Path(__file__).resolve().parent.parent
metadata=json.loads((root/'public/audio/sample-01.json').read_text())
chapters=[];transcript=[]
for segment in metadata['segments']:
    seconds=round(segment['start_seconds']); timestamp=f'{seconds//60:02}:{seconds%60:02}'
    title=escape(segment['title']);text=escape(segment['text'])
    chapters.append(f'<li><button type="button" data-time="{segment["start_seconds"]}"><time>{timestamp}</time><span>{title}</span></button></li>')
    pause='<p class="note">（考える時間：7秒）</p>' if segment['pause_after']>=7 else ''
    transcript.append(f'<section><h3>{timestamp} {title}</h3><p>{text}</p>{pause}</section>')
page=(root/'audio/player-template.html').read_text().replace('{{CHAPTERS}}','\n'.join(chapters)).replace('{{TRANSCRIPT}}','\n'.join(transcript))
(root/'public/audio/index.html').write_text(page)
print('Rendered player, 10 chapter links, complete transcript')
