"""VOICEVOX 0.25.2をローカル起動後に実行。出力先は必須。"""
import argparse,json,pathlib,urllib.request,urllib.parse
parser=argparse.ArgumentParser();parser.add_argument('--output-dir',required=True);args=parser.parse_args()
p=pathlib.Path(args.output_dir);p.mkdir(parents=True,exist_ok=True)
root=pathlib.Path(__file__).resolve().parents[1]
s=json.loads((root/'audio/sample-01.json').read_text())['segments'][2]['text'].replace('EC2','イーシーツー')
u='http://127.0.0.1:50021/'
for name,speaker in [('aoyama-normal',13),('aoyama-soft',84),('ritsu-normal',9)]:
 req=urllib.request.Request(u+'audio_query?'+urllib.parse.urlencode({'speaker':speaker,'text':s}),method='POST')
 q=json.load(urllib.request.urlopen(req,timeout=60));q.update(speedScale=0.95,intonationScale=0.9,outputSamplingRate=44100)
 (p/(name+'.query.json')).write_text(json.dumps(q,ensure_ascii=False,indent=2)+'\n')
 req=urllib.request.Request(u+'synthesis?speaker='+str(speaker),data=json.dumps(q).encode(),headers={'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=240) as response: (p/(name+'.wav')).write_bytes(response.read())
 print(name,flush=True)
