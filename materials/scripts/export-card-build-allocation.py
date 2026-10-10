import json,html,pathlib
r=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((r/'knowledge/game-supplement.json').read_text())['characterCardAllocation']
candidates=data['candidates']; builds=data['builds']; by={c['termId']:c for c in candidates}
(r/'public/design/card-build-allocation.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
e=lambda v:html.escape(str(v))
parts=['<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>6キャラ・18ビルドと教材カード候補</title><style>body{font:16px/1.75 -apple-system,BlinkMacSystemFont,sans-serif;background:#f4f6fa;color:#17233b;margin:0;padding:24px}main{max-width:1100px;margin:auto}section,article{background:white;padding:20px;margin:18px 0;border-radius:12px}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #dce2ec;text-align:left;padding:10px;vertical-align:top}code{overflow-wrap:anywhere;font-size:12px}input{font:inherit;padding:10px;width:90%}.scroll{overflow-x:auto}a{color:#205db5}.warn{color:#a33}small{display:block;color:#54617a}@media(max-width:600px){body{padding:12px}section,article{padding:12px}td,th{padding:6px}}@media print{input{display:none}article{break-inside:avoid}}</style><main><h1>6キャラ・18ビルドと教材カード候補</h1><p>設計案／ゲーム未実装。教材の名称・意味を保持し、ビルドへの接続を整理。</p>']
left=[c for c in candidates if not c['memberships']]
parts.append(f'<p>候補 <b>{len(candidates)}</b>件／ビルド所属 <b>{len(candidates)-len(left)}</b>件／未所属 <b>{len(left)}</b>件／重複を含む所属 <b>{sum(len(c["memberships"]) for c in candidates)}</b>件。</p><ul>'+''.join('<li>'+e(x)+'</li>' for x in data['rules'])+'</ul><p>役割と分類は別の軸です。キーにも特化の候補があり、コネクションにも汎用の候補があります。列挙カードすべての取得が完成条件ではありません。カード効果・入手先・レア度は仮設定です。強化後効果と試遊による調整は未実施です。</p><p><a href="card-build-allocation.json">構造化JSON</a></p><input id="search" placeholder="カード名・ID・意味で全候補を検索" aria-label="カード候補検索"><p id="result"></p><nav>'+''.join(f'<a href="#b-{b["id"]}">{e(b["characterName"])}／{e(b["name"])}</a>　' for b in builds)+'<a href="#remaining">未所属候補</a>　<a href="#all">全件逆引き</a></nav>')
parts.append('<section id="axes"><h2>分類基準：役割 × 分類</h2>')
for axis in data['axes'].values():
 parts.append('<p>'+e(axis['description'])+'</p><ul>'+''.join('<li><b>'+e(k)+'</b>：'+e(v)+'</li>' for k,v in axis['values'].items())+'</ul>')
parts.append('<p>「特化」は不要という意味ではありません。条件が合えばキーにもなります。この分類だけでデッキの成立や強さは判定できず、カード効果を決めてから再確認します。未所属候補の2軸は所属先が決まってから設定します。</p></section>')
if data.get('cardSettings'):
 settings=data['cardSettings']
 parts.append('<section id="settings"><h2>カード効果・入手先・レア度の仮設定</h2><p>全180候補の設計案。現行ゲームには未適用。階層・報酬回数・提示数・レア度抽選は全キャラ共通です。</p><ul>'+''.join('<li>'+e(x)+'</li>' for x in settings['rules'])+'</ul><h3>キャラ別の入手先内訳</h3><p>元の所属種類数を維持。共通スターターは初期所持で補い、所属外カードを通常報酬へ自動追加しません。レア度はAWS上の重要度ではありません。</p><div class="scroll"><table><tr><th>キャラ</th><th>所属種類数</th><th>戦闘報酬対象</th><th>交換所のみ</th><th>専用スターター3枚</th></tr>')
 for cid,ids in settings['starterDedicated'].items():
  bs=[b for b in builds if b['characterId']==cid];owned={c['termId'] for b in bs for c in b['cards']};regular=sum('戦闘報酬' in by[tid]['cardDesign']['acquisition'] for tid in owned)
  parts.append('<tr><td>'+e(bs[0]['characterName'])+'</td><td>'+str(len(owned))+'</td><td>'+str(regular)+'</td><td>'+str(len(owned)-regular)+'</td><td>'+e('／'.join(by[tid]['name'] for tid in ids))+'</td></tr>')
 parts.append('</table></div><p>未所属17件は対応する専用イベント・交換所で全キャラが検討できる枠。ただしキャラへの本所属はまだ未決定です。</p><details><summary>残る設計事項</summary><ul>'+''.join('<li>'+e(x)+'</li>' for x in settings['openQuestions'])+'</ul></details></section>')
 parts.append('<p><label>レア度 <select id="rarity"><option value="">すべて</option><option>コモン</option><option>アンコモン</option><option>レア</option></select></label>　<label>入手先 <select id="acquisition"><option value="">すべて</option><option>戦闘報酬</option><option>交換所</option><option>専用イベント</option></select></label></p>')
for b in builds:
 parts.append(f'<section id="b-{b["id"]}"><h2>{e(b["characterName"])}：{e(b["name"])}ビルド</h2><p>{e(b["gameplay"])}</p>')
 if b['gap']:parts.append('<p class="warn">不足：'+e(b['gap'])+'</p>')
 for role in ['キー','オプション','コネクション']:
  selected=[x for x in b['cards'] if x['role']==role]
  parts.append('<h3>'+role+f'（{len(selected)}種類）</h3>')
  if not selected:parts.append('<p>該当候補なし</p>');continue
  parts.append('<div class="scroll"><table><tr><th>カード候補</th><th>分類</th><th>適用条件・判断理由</th></tr>')
  for c in selected:
   parts.append(f'<tr class="membership" data-role="{e(c["role"])}" data-usage="{e(c["usage"])}"><td><a href="#c-{c["termId"]}">{e(by[c["termId"]]["name"])}</a></td><td>{e(c["usage"])}</td><td>{e(c["usageCondition"])}</td></tr>')
  parts.append('</table></div>')
 parts.append('</section>')
parts.append('<section id="remaining"><h2>未所属候補：後続整理用ID</h2><p>削除・不採用を意味しません。共通枠、新しい組み合わせ、状況対策などを後で設計します。</p><div class="scroll"><table><tr><th>追跡ID／候補名</th><th>保留理由</th></tr>')
for c in left:parts.append(f'<tr><td><code>{e(c["remainderId"])}</code><br><a href="#c-{c["termId"]}">{e(c["name"])}</a></td><td>{e(c["remainderReason"])}</td></tr>')
parts.append('</table></div></section><h2 id="all">全候補の逆引き</h2>')
bmap={b['id']:b for b in builds}
for c in candidates:
 links='／'.join(e(bmap[x['buildId']]['characterName']+'・'+bmap[x['buildId']]['name']+'［'+x['role']+'／'+x['usage']+'］') for x in c['memberships']) or '未所属：'+e(c['remainderId'])
 parts.append(f'<article class="candidate" id="c-{c["termId"]}"><h3>{e(c["name"])}</h3><code>{e(c["id"])}</code><p>{e(c["meaning"])}</p><p>所属：{links}</p><small>教材参照：{e(c["sourceRef"]["path"])} #{e(c["termId"])}</small>'+('<p>共通スターター候補。5枚の内訳は未決定。</p>' if c['commonStarterCandidate'] else '')+'</article>')
 if c.get('cardDesign'):
  design=c['cardDesign'];parts[-1]=parts[-1].removesuffix('</article>')
  parts[-1]=parts[-1].replace('class="candidate"','class="candidate" data-rarity="'+e(design['rarity'])+'" data-acquisition="'+e(' '.join(design['acquisition']))+'"')
  parts.append('<section class="card-design"><h4>カード仮設定</h4><p><b>'+e(design['rarity'])+'</b>／エナジー '+str(design['energy'])+'／入手先：'+e('・'.join(design['acquisition']))+'</p><dl>'+''.join('<dt><b>'+e(label)+'</b></dt><dd>'+e(design[key])+'</dd>' for label,key in [('実際の機能','realFunction'),('ゲーム効果','effect'),('発動・利用条件','trigger'),('代償・弱点','tradeoff'),('比喩の限界','metaphorLimit'),('入手先の理由','acquisitionReason'),('レア度の理由','rarityReason')])+'</dl></section></article>')
 if c.get('lessonDetails'):
  parts[-1]=parts[-1].removesuffix('</article>')
  t=c['lessonDetails'];parts.append('<section class="expansion"><h4>'+e(t['name'])+'：追加教材</h4><p>'+e(t['caution'])+'</p><p>適用の確認：'+e(t['scenario'])+'</p><details><summary>判断の例を表示</summary><p>'+e(t['answer'])+'</p></details><p><a href="'+e(t['source'])+'">AWS公式出典</a>／確認日 '+e(t['checkedOn'])+'／自己照合・独立監査前</p></section></article>')

parts.append('<script>const q=document.getElementById("search"),cards=[...document.querySelectorAll(".candidate")],rarity=document.getElementById("rarity"),acquisition=document.getElementById("acquisition");function filter(){let n=0;for(const c of cards){c.hidden=!c.textContent.toLowerCase().includes(q.value.toLowerCase())||(rarity?.value&&c.dataset.rarity!==rarity.value)||(acquisition?.value&&!c.dataset.acquisition?.includes(acquisition.value));if(!c.hidden)n++;}document.getElementById("result").textContent=n+"件表示（ビルド一覧・未所属一覧は常に表示）";}q.addEventListener("input",filter);rarity?.addEventListener("change",filter);acquisition?.addEventListener("change",filter);document.addEventListener("click",e=>{const a=e.target.closest("a");if(a?.getAttribute("href")?.startsWith("#c-")){q.value="";if(rarity)rarity.value="";if(acquisition)acquisition.value="";filter();}});</script></main></html>')

(r/'public/design/card-build-allocation.html').write_text('\n'.join(parts))
