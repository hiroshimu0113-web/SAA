"""Generate three alternative voices using the local VOICEVOX engine (no paid API)."""
from pathlib import Path
import json, urllib.request, urllib.parse, subprocess, tempfile, hashlib, html
root=Path(__file__).resolve().parents[1]
out=root/'public/audio'
text=json.loads((root/'audio/sample-01.json').read_text())['segments'][2]['text']
voices=[('hau','雨晴はう',10,'https://amehau.com/?page_id=225'),('himari','冥鳴ひまり',14,'https://meimeihimari.wixsite.com/himari/terms-of-use'),('sora','九州そら',16,'https://zunko.jp/con_ongen_kiyaku.html')]
items=[]
with tempfile.TemporaryDirectory(prefix='saa-female-') as directory:
 for slug,name,speaker,terms in voices:
  url='http://127.0.0.1:50021/'
  request=urllib.request.Request(url+'audio_query?'+urllib.parse.urlencode({'speaker':speaker,'text':text.replace('EC2','イーシーツー')}),method='POST')
  q=json.load(urllib.request.urlopen(request,timeout=60));q.update(speedScale=0.95,intonationScale=0.9,pitchScale=0,outputSamplingRate=44100)
  request=urllib.request.Request(url+'synthesis?speaker='+str(speaker),data=json.dumps(q).encode(),headers={'Content-Type':'application/json'})
  wav=Path(directory)/(slug+'.wav')
  with urllib.request.urlopen(request,timeout=240) as response:wav.write_bytes(response.read())
  filt='loudnorm=I=-18:TP=-2:LRA=7'
  result=subprocess.run(['ffmpeg','-hide_banner','-i',str(wav),'-af',filt+':print_format=json','-f','null','-'],check=True,capture_output=True,text=True)
  m=json.JSONDecoder().raw_decode(result.stderr[result.stderr.rfind('{'):])[0]
  filt+=f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
  dest=out/('compare-'+slug+'.mp3')
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-af',filt,'-ar','44100','-ac','1','-b:a','128k',str(dest)],check=True)
  duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(dest)]))
  assert 20<duration<60
  items.append(dict(name=name,speaker=speaker,file=dest.name,duration_seconds=duration,sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),terms=terms))
  print(name,duration,flush=True)
old=json.loads((out/'comparison.json').read_text())['samples'][2]
items.append({**old,'name':'波音リツ（現在の声・比較用）','terms':'https://canon-voice.com/kiyaku.html'})
metadata={'engine':'VOICEVOX Engine 0.25.2','text':text,'settings':{'speedScale':0.95,'intonationScale':0.9,'pitchScale':0},'samples':items}
(out/'female-comparison.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
sections='\n'.join(f'<section><h2>{i+1}. {html.escape(x["name"])}</h2><p>ノーマル・約{round(x["duration_seconds"])}秒</p><audio controls preload="metadata" aria-label="{html.escape(x["name"])}" src="{x["file"]}"></audio><p><a href="{x["file"]}" download>MP3を保存</a> · <a href="{html.escape(x["terms"])}">利用規約</a></p><small>VOICEVOX:{html.escape(x["name"].split('（')[0])}</small></section>' for i,x in enumerate(items))
(out/'female-comparison.html').write_text('''<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SAA 女性の声を聴き比べる</title><style>body{font-family:system-ui,sans-serif;background:#f5f4ef;color:#172b35;margin:0 auto;padding:24px 16px;max-width:680px;line-height:1.8}section{background:white;border:1px solid #c8d3d5;border-radius:14px;margin:20px 0;padding:16px}h1{font-size:1.8rem}h2{font-size:1.25rem}audio{width:100%}a{color:#005c75}summary{cursor:pointer}</style><main><a href="index.html">← 5分の教材</a><h1>若さと、声の明瞭さを聴き比べる</h1><p>波音リツの高さはよいけれど、もう少し若く、こもりの少ない声がほしい。その希望に合わせた候補です。印象は実際に聴いて判断してください。</p><p>同じ台本、同じ速さの設定、ほぼ同じ音量です。音程やイコライザーによる加工はしていません。声ごとの高さの違いも含めて比べられます。BGMなし。</p>'''+sections+f'<details><summary>共通の台本を読む</summary><p>{html.escape(text)}</p></details>'+'''<p>一番近い番号と、「こもり」「高さ」「若い感じ」のどれが気になるかを教えてください。5分版は選択後に更新します。</p><p>無料のローカルCPU合成。有料APIは利用していません。生成音声の再利用時も各音声ライブラリの規約とクレジット表記を守ってください。</p></main><script>document.querySelectorAll('audio').forEach(a=>a.addEventListener('play',()=>document.querySelectorAll('audio').forEach(b=>{if(a!==b)b.pause()})));</script></html>''')
