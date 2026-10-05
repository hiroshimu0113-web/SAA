import json,subprocess,pathlib,hashlib,html
import argparse
parser=argparse.ArgumentParser(); parser.add_argument('--wav-dir', required=True); args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1]; out=root/'public/audio'; temp=pathlib.Path(args.wav_dir)
src=json.loads((root/'audio/sample-01.json').read_text()); old=json.loads((out/'sample-mei.json').read_text()); text=src['segments'][2]['text']
items=[]
for name,label,speaker in [('aoyama-normal','青山龍星・ノーマル',13),('aoyama-soft','青山龍星・しっとり',84),('ritsu-normal','波音リツ・ノーマル',9),('mei-original','前回の声（Mei）',None)]:
 wav=temp/(name+'.wav')
 if speaker is None:
  start=old['segments'][2]['start_seconds']; end=old['segments'][3]['start_seconds']-old['segments'][2]['pause_after']
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-i',str(out/'photo-studio-5min.mp3'),'-t',str(end-start),str(wav)],check=True)
 filt='loudnorm=I=-18:TP=-2:LRA=7'
 r=subprocess.run(['ffmpeg','-hide_banner','-i',str(wav),'-af',filt+':print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 m=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0]; filt+=f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
 dest=out/('compare-'+name+'.mp3')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-af',filt,'-ar','44100','-ac','1','-b:a','128k',str(dest)],check=True)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(dest)]))
 assert 20<duration<70
 items.append(dict(name=name,label=label,speaker=speaker,file=dest.name,duration_seconds=duration,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
metadata=dict(engine='VOICEVOX Engine 0.25.2',text=text,settings={'speedScale':0.95,'intonationScale':0.9,'pitchScale':0,'loudness_target_lufs':-18},samples=items)
(out/'comparison.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
sections='\n'.join(f'<section><h2>{i+1}. {x["label"]}</h2><p>約{round(x["duration_seconds"])}秒</p><audio controls preload="metadata" aria-label="{x["label"]}"><source src="{x["file"]}" type="audio/mpeg"></audio><p><a href="{x["file"]}" download>MP3を保存</a></p></section>' for i,x in enumerate(items))
(out/'comparison.html').write_text('''<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SAA 音声の聴き比べ</title><style>body{font-family:system-ui,sans-serif;background:#f5f4ef;color:#172b35;margin:0 auto;padding:24px 16px;max-width:680px;line-height:1.8}section{background:white;border:1px solid #c8d3d5;border-radius:14px;margin:20px 0;padding:16px}h1{font-size:1.8rem}h2{font-size:1.25rem}audio{width:100%}a{color:#005c75}small{display:block}summary{cursor:pointer}</style><main><a href="index.html">← 5分の音声教材</a><h1>学習に集中できる声を探す</h1><p>同じ「EC2は作業場」の説明を、3種類の新しい声と前回の声で聴き比べます。BGMなし・音量をそろえた比較版です。まず小さめの音量でお試しください。</p><p>「耳への刺さり」「言葉の聞き取りやすさ」「長く聞けそうか」で、好きな番号を教えてください。追加の女性音声比較を経て、現在の5分版は冥鳴ひまり・ノーマルを採用しています。</p>'''+sections+f'<details><summary>共通の台本を読む</summary><p>{html.escape(text)}</p></details>'+'''<h2>音声について</h2><p>合成音声：VOICEVOX:青山龍星／VOICEVOX:波音リツ。<a href="https://www.virvoxproject.com/voicevoxの利用規約">青山龍星の利用規約</a>・<a href="https://canon-voice.com/kiyaku.html">波音リツの利用規約</a>。音声を再利用する際も各音声ライブラリの規約とクレジット表記を守ってください。青山龍星は企業が携わる利用には事前確認が必要です。</p><p>前回の声：HTS Voice Mei（MMDAgent Project Team／名古屋工業大学）、<a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>。元のサンプルから抜粋し音量を調整しています。</p><small>無料のローカルCPU合成。有料APIは利用していません。機械的な再生確認と、聞きやすさの評価は別です。</small></main><script>document.querySelectorAll('audio').forEach(a=>a.addEventListener('play',()=>document.querySelectorAll('audio').forEach(b=>{if(a!==b)b.pause()})));</script></html>''')
print(json.dumps(items,ensure_ascii=False,indent=2))
