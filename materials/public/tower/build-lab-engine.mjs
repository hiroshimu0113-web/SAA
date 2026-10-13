// Isolated 30-profile prototype. The existing tower engine and saves are not imported.
const copy=x=>JSON.parse(JSON.stringify(x));
export const CARDS={
 'ec2-burst':{term:'ec2',name:'Amazon EC2〈処理〉',cost:1,text:'6ダメージ。設備は残らない。',up:'8ダメージ。',damage:6},
 'ec2-deploy':{term:'ec2',name:'Amazon EC2〈配置〉',cost:2,text:'EC2設備を配置。終了時3ダメージ。',up:'終了時4ダメージ。',power:3},
 'security-group':{term:'security-group',name:'セキュリティグループ',cost:1,text:'通信型の攻撃に5ブロック。',up:'通信型に7ブロック。'},
 cloudwatch:{term:'cloudwatch',name:'CloudWatch',cost:1,text:'2枚引く。修復はしない。',up:'3枚引く。'},
 az:{name:'アベイラビリティーゾーン（AZ）',cost:1,text:'正常な処理設備を別AZへ分散。次のAZ停止の処理損失を抑える。',up:'2設備まで分散。停止自体は防がない。'},
 'rds-multi-az':{name:'RDS Multi-AZ',cost:2,text:'主力3攻撃＋待機を1処理枠に配置。主力停止後、1ターンで切替。',up:'主力4攻撃。待機は平時攻撃しない。'},
 'placement-group':{name:'プレイスメントグループ',cost:1,text:'EC2を別ホストへ分散。ホスト故障の波及を抑える。',up:'次のEC2処理を+2。'},
 'auto-scaling':{name:'EC2 Auto Scaling',cost:1,text:'枠外の制御設定。次ターンにEC2配置札1枚を生成。1戦闘1回。',up:'生成札を保留。'},
 lambda:{name:'Lambda',cost:1,text:'イベント処理で6ダメージ。常駐しない。',up:'8ダメージ。',damage:6},
 'instance-family':{name:'インスタンスファミリー',cost:1,text:'適合する次の計算処理を+3。',up:'+4。'},
 cloudfront:{name:'CloudFront',cost:1,text:'配信6ダメージ。同じ内容/版の次回配信を1軽減。',up:'8ダメージ。',damage:6},
 cache:{name:'キャッシュ',cost:1,text:'初回取得4ダメージ。同じキー/版の次回読取りを1軽減。',up:'5ダメージ。',damage:4},
 'read-replica':{name:'リードレプリカ',cost:2,text:'元DBとレプリカを1枠に配置。終了時読取り3ダメージ。書込みには無効。',up:'読取り4ダメージ。'},
 sqs:{name:'SQS',cost:1,text:'支援枠にキューを配置。未完了の処理札を最大2枚保留。',up:'最大3枚保留。'},
 idempotency:{name:'冪等性',cost:1,text:'初回業務処理4ダメージ。同じ仕事の完了を重複加算しない。',up:'5ダメージ。',damage:4},
 spot:{name:'Spotインスタンス',cost:2,text:'Spot設備を配置。終了時4ダメージ。中断リスクがある。',up:'終了時5ダメージ。'},
 'iam-role':{name:'IAMロール',cost:1,text:'必要な追加操作を委任。対応する配置札1枚を保留。',up:'配置札2枚まで保留。'},
 'vpc-endpoint':{name:'VPCエンドポイント',cost:1,text:'S3への専用経路を設定。認可は別。対応札1枚を保留。',up:'経路設定後、対応札の次回コストを1軽減。'},
 cloudformation:{name:'AWS CloudFormation',cost:1,text:'基本テンプレートを展開。SGの分として通信4ブロック。',up:'通信6ブロック。'},
 backup:{name:'バックアップ',cost:1,text:'正常な所有データを保存。破損時は保存した版の復元を次ターンへ予約。',up:'復元予約はこのターン終了前に適用。'},
 'pilot-light':{name:'パイロットライト',cost:1,text:'支援枠に復旧中核を準備。停止後の復旧先起動を支える。',up:'復旧先起動の次回コストを1軽減。'},
 'cloudwatch-alarm':{name:'CloudWatchアラーム',cost:1,text:'予告を評価し、対応する手札の対処札1枚を1軽減。通知だけでは修復しない。',up:'軽減する対応札1枚を保留。'},
 checkpoint:{name:'チェックポイント',cost:1,text:'未完了仕事の進捗を永続保存。中断後は残りだけ再開。',up:'保留する処理札を1枚追加。'},
 'health-check':{name:'ヘルスチェック',cost:0,text:'設備1つの応答を確認。正常先があれば情報を1枚引く。',up:'全設備を確認。ドローは1枚のみ。'},
 'restore-test':{name:'復元テスト',cost:1,text:'初期記録/保存版を隔離先で検証。対応復元札1枚を引く。',up:'検証後、対象札を保留。'},
 'target-tracking':{name:'ターゲット追跡スケーリング',cost:1,text:'高負荷予告に合わせ、次ターンEC2配置札1枚。1戦闘1回。',up:'生成札を保留。'},
 'rds-proxy':{name:'RDS Proxy',cost:1,text:'DB接続再利用を設定。各ターン最初の対応DB札を1軽減。SQL結果は記憶しない。',up:'対応DB札を保留。'},
 'visibility-timeout':{name:'可視性タイムアウト',cost:1,text:'未完了キュー仕事を次ターンまで他受信者から隠す。',up:'他受信者から隠す期間を2ターンに延長。'},
 'remaining-capacity':{name:'残存容量',cost:0,text:'停止後の処理能力を調べ、所持する増強札1枚を引く。',up:'引いた増強札を保留。'},
 'change-set':{name:'CloudFormation変更セット',cost:1,text:'次の更新を確認。適合する構成札1枚を保留する。成功保証ではない。',up:'構成札2枚まで保留。'}
};
for(const [id,c]of Object.entries(CARDS)){c.term??=id;c.rarity=['ec2-burst','ec2-deploy','security-group','cloudwatch',...['az','rds-multi-az','placement-group','auto-scaling','lambda','instance-family','cloudfront','cache','read-replica','sqs','idempotency','spot','iam-role','vpc-endpoint','cloudformation','backup','pilot-light','cloudwatch-alarm']].includes(id)?'コモン':'アンコモン';}
export const HEROES={guardian:{name:'守護者',dedicated:['az','rds-multi-az','placement-group'],support:['health-check','remaining-capacity','rds-proxy']},tuner:{name:'調律師',dedicated:['auto-scaling','lambda','instance-family'],support:['target-tracking','remaining-capacity','checkpoint']},accelerator:{name:'加速者',dedicated:['cloudfront','cache','read-replica'],support:['rds-proxy','health-check','change-set']},commander:{name:'指揮者',dedicated:['sqs','idempotency','spot'],support:['checkpoint','visibility-timeout','remaining-capacity']},builder:{name:'構築士',dedicated:['iam-role','vpc-endpoint','cloudformation'],support:['change-set','health-check','rds-proxy']},restorer:{name:'復旧者',dedicated:['backup','pilot-light','cloudwatch-alarm'],support:['restore-test','checkpoint','health-check']}};
export const ROLES={guardian:{name:'可用性',damage:3,block:8,condition:'分散・主力/待機・ホスト配置を整える。'},tuner:{name:'スケーリング',damage:5,block:4,condition:'増援設定・イベント処理・資源選定を行う。'},accelerator:{name:'読取り整合性',damage:3,block:4,condition:'配信・キャッシュ・参照分散を整え、データが正常。'},commander:{name:'冪等性',damage:4,block:5,condition:'キュー・重複防止・中断可能戦力をそろえる。'},builder:{name:'最小権限',damage:8,block:6,condition:'追加認可・専用経路・基本テンプレートが成立。'},restorer:{name:'バックアップ',damage:6,block:6,condition:'正常データの保存・復旧中核・監視アクションを整える。'}};
const COMMON=['ec2-burst','ec2-deploy','security-group','security-group','cloudwatch'];
export function random(s){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296;}
function shuffle(s,a){for(let i=a.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function card(s,id,up=false,temp=false){return{uid:'c'+(++s.serial),id,up,temp};}
function equip(s,kind,attack=0,group='process',extra={}){const e={id:'e'+(++s.serial),kind,attack,group,az:'a',host:'h1',state:'running',readyTurn:s.turn,observed:false,...extra};s.equipment.push(e);return e;}
function room(s){s.enemy={hp:32+(s.floor-1)*3,max:32+(s.floor-1)*3};if(s.floor===8)s.enemy.hp=s.enemy.max=72;s.metrics.roomStartHP=s.hp;s.turn=1;s.energy=3;s.guard=0;s.roleDone=false;s.used=[];s.equipment=[];s.flags={};s.history={};s.discounts=[];s.jobs={};s.jobSerial=0;s.scheduled=[];s.data={id:'input',kind:'object',payload:{version:1},version:1,nextVersion:2,healthy:true};s.snapshots={initial:{sourceDataId:'input',kind:'object',payload:{version:1},version:1}};s.draw=shuffle(s,s.deck.map(c=>({...c})));s.hand=[];s.discard=[];s.zeroUsed={};s.held=[];s.battleTokens=[];s.phase='battle';equip(s,'ec2',3,'process',{baseline:true});s.metrics.battles++;start(s,true);}
export function newRun(hero='guardian',seed=1,scenario='attack'){if(!HEROES[hero]||!['attack','equipment','data'].includes(scenario))throw Error('Unknown setup');const s={schema:1,hero,scenario,seed,rng:seed>>>0,serial:0,floor:1,hp:72,maxHP:72,coins:60,deck:[],logs:[],metrics:{roomTurns:[],battles:0,turns:0,plays:0,roles:0,blocked:0,damage:0,unusableSamples:0,handSamples:0,hpLoss:0,actions:0},serialCommands:0};s.deck=[...COMMON,...HEROES[hero].dedicated].map(id=>card(s,id));room(s);return s;}
function log(s,t){s.logs.push(t);s.logs=s.logs.slice(-14);}
export function forecast(s){let hazard='network-attack';const mod=s.turn%5;if(s.floor>1&&s.scenario==='equipment')hazard=mod===0?(s.floor%2===0?'az-stop':'spot-interruption'):'network-attack';if(s.floor>1&&s.scenario==='data')hazard=mod===0?'data-corruption':mod===3?'response-timeout':'network-attack';return{hazard,damage:7+Math.min(3,Math.floor(s.floor/3)),az:'a',highLoad:s.turn%2===0,key:'catalog-'+(Math.floor((s.turn-1)/2)%3),contentVersion:s.data.version,allowRead:!(s.floor>=3&&s.turn%3===0)};}
function draw(s,n){for(let i=0;i<n&&s.hand.length<10;i++){if(!s.draw.length&&s.discard.length)s.draw=shuffle(s,s.discard.splice(0));if(!s.draw.length)break;const c=s.draw.pop();if(c.jobId&&s.jobs[c.jobId]?.state==='succeeded')delete c.jobId;s.hand.push(c);}}
function start(s,first=false){s.phase='resolving';s.energy=3;s.guard=0;s.zeroUsed={};s.usedTurn=[];if(s.flags.dbPool){s.discounts=s.discounts.filter(d=>d.group!=='db');s.discounts.push({group:'db'});}const due=s.scheduled.filter(a=>a.turn<=s.turn);s.scheduled=s.scheduled.filter(a=>a.turn>s.turn);for(const a of due){if(a.kind==='generate'){const g=card(s,a.id,false,true);if(s.hand.length<10){s.hand.push(g);if(a.retain)s.held.push(g.uid);}else s.discard.push(g);}if(a.kind==='resume'){const e=s.equipment.find(e=>e.id===a.id);if(e)e.state='running';}if(a.kind==='restore')restore(s,a.snapshot);}for(const e of s.equipment)if(e.state==='switching'&&e.readyTurn<=s.turn)e.state='running';draw(s,5);s.phase='battle';s.metrics.handSamples+=s.hand.length;s.metrics.unusableSamples+=s.hand.filter(c=>!canPlay(s,c)).length;}
function has(s,kind){return s.equipment.some(e=>e.kind===kind&&e.state==='running');}
function space(s,group='process'){return s.equipment.filter(e=>e.group===group).length<(group==='process'?3:2);}
const POWERS=['ec2-deploy','rds-multi-az','read-replica','spot'];const READ=['cache','cloudfront','read-replica','rds-proxy'];
export function cost(s,c){let v=CARDS[c.id].cost;const f=forecast(s),d=s.discounts.find(d=>d.uid===c.uid||(d.group==='db'&&['rds-multi-az','read-replica'].includes(c.id))||(d.group==='compute'&&['ec2-burst','lambda','ec2-deploy'].includes(c.id)));if(d)v-=1;if(s.history[c.id]?.version===f.contentVersion&&s.history[c.id]?.key===f.key&&s.history[c.id]?.discountAvailable&&['cache','cloudfront'].includes(c.id))v-=1;return Math.max(0,v);}
function alarmTarget(s,c){const id=c.id,h=forecast(s).hazard;return cost(s,c)>0&&(['security-group','cloudformation','cloudwatch'].includes(id)||(id==='az'&&h==='az-stop')||(id==='backup'&&(h==='data-corruption'||!s.data.healthy))||(id==='pilot-light'&&s.equipment.some(e=>e.state==='stopped')));}
export function canPlay(s,c){if(s.phase!=='battle'||!CARDS[c.id]||s.energy<cost(s,c))return false;if(cost(s,c)===0&&s.zeroUsed[c.id])return false;const id=c.id;
 if(POWERS.includes(id)&&!space(s))return false;
 if(['sqs','pilot-light'].includes(id)&&(has(s,id)||!space(s,'support')))return false;
 if(['auto-scaling','target-tracking'].includes(id)&&s.flags[id])return false;
 if(['az','placement-group','health-check'].includes(id)&&!s.equipment.some(e=>e.group==='process'))return false;
 if(id==='target-tracking'&&!forecast(s).highLoad)return false;
 if(id==='backup'&&!s.data.healthy&&!Object.keys(s.snapshots).length)return false;
 if(c.jobId&&s.jobs[c.jobId]?.state==='succeeded')return false;
 if(id==='checkpoint'&&!Object.values(s.jobs).some(j=>j.state==='pending'))return false;
 if(id==='visibility-timeout'&&(!has(s,'sqs')||!Object.values(s.jobs).some(j=>j.state==='pending')))return false;
 if(id==='rds-proxy'&&!s.equipment.some(e=>['rds','replica'].includes(e.kind)))return false;
 if(id==='remaining-capacity'&&!s.draw.concat(s.discard).some(c=>['ec2-deploy','auto-scaling','target-tracking'].includes(c.id)))return false;
 if(id==='change-set'&&!s.flags.cloudformation)return false;
 if(id==='change-set'&&!s.hand.some(x=>x.uid!==c.uid&&['cloudformation','ec2-deploy','rds-multi-az'].includes(x.id)))return false;
 if(id==='cloudwatch-alarm'&&!s.hand.some(x=>x.uid!==c.uid&&alarmTarget(s,x)))return false;
 if(!forecast(s).allowRead&&['cache','cloudfront'].includes(id))return false;
 if(!s.data.healthy&&['cache','cloudfront','read-replica','idempotency'].includes(id))return false;
 return true;}
export function legalActions(s){if(s.phase!=='battle')return[];const a=s.hand.filter(c=>canPlay(s,c)).map(c=>({kind:'play',uid:c.uid}));for(const e of s.equipment){if(e.state==='stopped'&&s.energy>=(s.equipment.some(x=>x.kind==='pilot-light'&&x.recoveryDiscount)?0:1))a.push({kind:'resume',id:e.id});if(e.state==='stopped'||!space(s,e.group))a.push({kind:'retire',id:e.id});}if(s.flags.checkpoint&&s.data.healthy&&s.energy>=1)for(const j of Object.values(s.jobs).filter(j=>j.state==='pending'))a.push({kind:'retry',id:j.id});if(!s.data.healthy&&s.energy>=2)a.push({kind:'restore',snapshot:Object.keys(s.snapshots)[0]});return a;}
export function shouldAutoEnd(s){return s.phase==='battle'&&legalActions(s).length===0;}
function work(s,damage,source,jobId){const id=jobId||'j'+(++s.jobSerial);let j=s.jobs[id];if(!j)j=s.jobs[id]={id,businessKey:s.floor+':'+id,state:'pending',damage,source,applied:false,attempts:0};if(j.applied)return 0;if(j.attempts===0)j.damage=damage;j.attempts++;j.applied=true;j.state='succeeded';const applied=Math.min(s.enemy.hp,j.damage);s.enemy.hp-=applied;s.metrics.damage+=applied;return applied;}
function restore(s,id){const p=s.snapshots[id];if(!p||p.sourceDataId!==s.data.id||p.kind!==s.data.kind)return false;s.data.payload=copy(p.payload);s.data.healthy=true;s.data.version=s.data.nextVersion++;s.history={};log(s,'指定データだけ復元。仕事台帳・敵HP・コインは維持。');return true;}
function role(s){if(s.roleDone||!HEROES[s.hero].dedicated.every(id=>s.used.includes(id)))return;let valid=true;if(s.hero==='guardian')valid=s.flags.az&&s.flags['placement-group']&&has(s,'rds');if(s.hero==='accelerator')valid=s.data.healthy&&has(s,'replica');if(s.hero==='commander')valid=has(s,'sqs')&&s.equipment.some(e=>e.spot);if(s.hero==='builder')valid=s.flags['iam-role']&&s.flags['vpc-endpoint']&&s.flags.cloudformation;if(s.hero==='restorer')valid=has(s,'pilot-light')&&Object.keys(s.snapshots).some(k=>k!=='initial')&&s.flags['cloudwatch-alarm'];if(!valid)return;const r=ROLES[s.hero];s.roleDone=true;s.metrics.roles++;s.guard+=r.block;work(s,r.damage,'role:'+s.hero);log(s,'役「'+r.name+'」：連携報酬 '+r.damage+'攻撃／'+r.block+'防御。');}
function play(s,c){const paid=cost(s,c);s.energy-=paid;if(paid===0)s.zeroUsed[c.id]=true;s.discounts=s.discounts.filter(d=>!(d.uid===c.uid||(d.group==='db'&&['rds-multi-az','read-replica'].includes(c.id))||(d.group==='compute'&&['ec2-burst','lambda','ec2-deploy'].includes(c.id))));s.metrics.plays++;s.metrics.actions++;s.hand=s.hand.filter(x=>x.uid!==c.uid);s.used.push(c.id);s.usedTurn.push(c.id);const id=c.id,up=c.up;
 if(CARDS[id].damage){let damage=CARDS[id].damage+(up?(['ec2-burst','lambda','cloudfront'].includes(id)?2:1):0);if(s.flags.boost&&['ec2-burst','lambda'].includes(id)){damage+=s.flags.boost;delete s.flags.boost;}if(s.held.includes(c.uid)&&has(s,'sqs'))damage+=2;work(s,damage,id,c.jobId);if(['cache','cloudfront'].includes(id))s.history[id]={key:forecast(s).key,version:s.data.version,discountAvailable:paid>0};}
 if(id==='ec2-deploy')equip(s,'ec2',up?4:3);
 if(id==='security-group')s.guard+=up?7:5;
 if(id==='cloudwatch')draw(s,up?3:2);
 if(id==='az'){const es=s.equipment.filter(e=>e.group==='process'&&e.az==='a').slice(0,up?2:1);for(const e of es){e.az='b';if(e.standby)e.standbyAZ='a';}s.flags.az=true;}
 if(id==='placement-group'){s.equipment.filter(e=>e.kind==='ec2').forEach((e,i)=>e.host='h'+(i+2));s.flags[id]=true;if(up)s.flags.boost=2;}
 if(id==='rds-multi-az')equip(s,'rds',up?4:3,'process',{standby:true,standbyAZ:'b'});
 if(id==='read-replica')equip(s,'replica',up?4:3,'process',{replicaVersion:s.data.version,containsSourceDB:true});
 if(id==='spot')equip(s,'ec2',up?5:4,'process',{spot:true});
 if(['auto-scaling','target-tracking'].includes(id)){s.flags[id]=true;s.scheduled.push({kind:'generate',id:'ec2-deploy',turn:s.turn+1,retain:up});}
 if(id==='instance-family')s.flags.boost=up?4:3;
 if(id==='sqs')equip(s,'sqs',0,'support',{holdLimit:up?3:2});
 if(id==='iam-role'){s.flags[id]=true;s.hand.filter(c=>['ec2-deploy','lambda'].includes(c.id)).slice(0,up?2:1).forEach(c=>s.held.push(c.uid));}
 if(id==='vpc-endpoint'){s.flags[id]=true;const t=s.hand.find(c=>READ.includes(c.id)||c.id==='cloudformation');if(t){s.held.push(t.uid);if(up)s.discounts.push({uid:t.uid});}}
 if(id==='cloudformation'){s.flags[id]=true;s.guard+=up?6:4;}
 if(id==='backup'){if(s.data.healthy){s.snapshots['snap'+s.turn]={sourceDataId:s.data.id,kind:s.data.kind,payload:copy(s.data.payload),version:s.data.version};log(s,'正常データ版'+s.data.version+'を保存。');}else if(up)restore(s,Object.keys(s.snapshots)[Object.keys(s.snapshots).length-1]);else s.scheduled.push({kind:'restore',snapshot:Object.keys(s.snapshots)[Object.keys(s.snapshots).length-1],turn:s.turn+1});}
 if(id==='pilot-light')equip(s,'pilot-light',0,'support',{recoveryDiscount:up});
 if(id==='cloudwatch-alarm'){s.flags[id]=true;const t=s.hand.find(x=>alarmTarget(s,x));if(t){s.discounts.push({uid:t.uid});if(up)s.held.push(t.uid);}}
 if(id==='checkpoint'){s.flags.checkpoint=true;const targets=s.hand.filter(x=>CARDS[x.id].damage).slice(0,up?2:1);targets.forEach(x=>s.held.push(x.uid));}
 if(id==='health-check'){const es=up?s.equipment:s.equipment.slice(0,1);es.forEach(e=>e.observed=true);if(es.some(e=>e.state==='running'))draw(s,1);}
 if(id==='restore-test'){s.flags.tested=true;const t=s.draw.concat(s.discard).find(x=>['backup','pilot-light'].includes(x.id));if(t){s.draw=s.draw.filter(x=>x.uid!==t.uid);s.discard=s.discard.filter(x=>x.uid!==t.uid);s.hand.push(t);if(up)s.held.push(t.uid);}}
 if(id==='rds-proxy'){s.flags.dbPool=true;s.discounts.push({group:'db'});if(up){const t=s.hand.find(c=>c.id==='read-replica'||c.id==='rds-multi-az');if(t)s.held.push(t.uid);}}
 if(id==='visibility-timeout'){s.flags.visibilityUntil=s.turn+(up?2:1);const j=Object.values(s.jobs).find(j=>j.state==='pending');if(j)j.hiddenUntil=s.flags.visibilityUntil;}
 if(id==='remaining-capacity'){const t=s.draw.concat(s.discard).find(x=>['ec2-deploy','auto-scaling','target-tracking'].includes(x.id));if(t){s.draw=s.draw.filter(x=>x.uid!==t.uid);s.discard=s.discard.filter(x=>x.uid!==t.uid);s.hand.push(t);if(up)s.held.push(t.uid);}}
 if(id==='change-set')s.hand.filter(x=>['cloudformation','ec2-deploy','rds-multi-az'].includes(x.id)).slice(0,up?2:1).forEach(x=>s.held.push(x.uid));
 s.discard.push(c);log(s,CARDS[id].name+' 使用（支払'+paid+'）。');role(s);if(s.enemy.hp<=0)win(s);}
function win(s){if(s.phase==='reward'||s.phase==='won')return;s.metrics.roomTurns.push(s.turn);s.metrics.hpLoss+=Math.max(0,s.metrics.roomStartHP-s.hp);s.coins+=15;if(s.floor===8){s.phase='won';log(s,'8階層を完了。');return;}s.phase='reward';s.upgradeAvailable=true;const pool=[...COMMON.filter((v,i,a)=>a.indexOf(v)===i),...HEROES[s.hero].dedicated,...HEROES[s.hero].support].filter(id=>s.deck.filter(c=>c.id===id).length<(['rds-multi-az','read-replica','spot','sqs','pilot-light','auto-scaling'].includes(id)?1:2)).filter(id=>id!=='rds-proxy'||s.deck.some(c=>['rds-multi-az','read-replica'].includes(c.id))).filter(id=>id!=='change-set'||s.deck.some(c=>c.id==='cloudformation')).filter(id=>id!=='checkpoint'||s.scenario!=='attack'||s.deck.some(c=>c.id==='sqs'));s.offers=shuffle(s,pool).slice(0,3);log(s,'報酬は3候補。取得をスキップできます。');}
function end(s){s.phase='resolving';s.metrics.turns++;const f=forecast(s);for(const e of s.equipment){if(e.state!=='running'||!s.data.healthy)continue;if(e.kind==='replica'&&(!f.allowRead||e.replicaVersion!==s.data.version))continue;if(e.attack)work(s,e.attack,e.id);if(s.enemy.hp<=0){win(s);return;}}
 if(f.hazard==='az-stop'){for(const e of s.equipment.filter(e=>e.group==='process'&&e.az===f.az)){e.state=e.standby?'switching':'stopped';if(e.standby){e.az=e.standbyAZ;e.readyTurn=s.turn+1;}}log(s,'AZ '+f.az+'停止。別AZの設備は継続。');}
 if(f.hazard==='spot-interruption'){s.equipment.filter(e=>e.spot).forEach(e=>e.state='stopped');log(s,'Spot中断。');}
 if(f.hazard==='data-corruption'){s.data.healthy=false;s.data.payload={corrupt:true};s.data.version=s.data.nextVersion++;s.history={};log(s,'所有データを誤更新。復元対象はこのデータのみ。');}
 if(f.hazard==='response-timeout'){const id='j'+(++s.jobSerial);s.jobs[id]={id,businessKey:s.floor+':'+id,state:'pending',damage:3,source:'pending-request',applied:false,attempts:0};log(s,'未完了の応答不確定仕事を記録。');}
 const hit=Math.max(0,f.damage-s.guard);s.metrics.blocked+=Math.min(f.damage,s.guard);s.hp-=hit;log(s,'通信型の損失 '+hit+'。');if(s.hp<=0){s.hp=0;s.metrics.roomTurns.push(s.turn);s.phase='lost';return;}
 const limit=s.equipment.find(e=>e.kind==='sqs'&&e.state==='running')?.holdLimit||0;const queue=s.hand.filter(c=>CARDS[c.id].damage&&!s.held.includes(c.uid)).slice(0,limit);queue.forEach(c=>{s.held.push(c.uid);if(!c.jobId){c.jobId='j'+(++s.jobSerial);s.jobs[c.jobId]={id:c.jobId,businessKey:s.floor+':'+c.jobId,state:'pending',damage:CARDS[c.id].damage,source:c.id,applied:false,attempts:0};}});const kept=s.hand.filter(c=>s.held.includes(c.uid)&&(!c.jobId||s.jobs[c.jobId]?.state!=='succeeded'));s.discard.push(...s.hand.filter(c=>!kept.includes(c)));s.hand=kept;s.held=[];for(const e of s.equipment)if(e.kind==='replica')e.replicaVersion=s.data.version;s.turn++;start(s);}
export function act(input,a){const s=copy(input);if(a.turn!==undefined&&a.turn!==s.turn)return s;if(a.kind==='reward'&&s.phase==='reward'){if(a.id&&s.offers.includes(a.id))s.deck.push(card(s,a.id));s.hp=Math.min(72,s.hp+14);s.floor++;room(s);return s;}if(a.kind==='upgrade'&&s.phase==='reward'&&s.upgradeAvailable){const c=s.deck.find(c=>c.uid===a.uid&&!c.up);if(c){c.up=true;s.upgradeAvailable=false;}return s;}if(s.phase!=='battle')return s;if(a.kind==='end'){end(s);return s;}if(!legalActions(s).some(x=>x.kind===a.kind&&(a.kind==='play'?x.uid===a.uid:a.kind==='restore'?x.snapshot===a.snapshot:x.id===a.id)))return s;
 if(a.kind==='play'){const c=s.hand.find(c=>c.uid===a.uid);if(c)play(s,c);}if(a.kind==='resume'){s.energy-=s.equipment.some(x=>x.kind==='pilot-light'&&x.recoveryDiscount)?0:1;const e=s.equipment.find(e=>e.id===a.id);if(has(s,'pilot-light'))e.state='running';else{e.state='starting';s.scheduled.push({kind:'resume',id:e.id,turn:s.turn+1});}s.metrics.actions++;}if(a.kind==='retry'){s.energy--;const j=s.jobs[a.id];work(s,j.damage,j.source,j.id);s.metrics.actions++;if(s.enemy.hp<=0)win(s);}if(a.kind==='retire'){s.equipment=s.equipment.filter(e=>e.id!==a.id);s.metrics.actions++;}if(a.kind==='restore'){s.energy-=2;restore(s,a.snapshot);s.metrics.actions++;}
 if(shouldAutoEnd(s))end(s);return s;}
export function validate(s){
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k),record=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const fail=()=>{throw Error('Invalid prototype save');};
 if(!record(s)||s.schema!==1||!own(HEROES,s.hero)||!['attack','equipment','data'].includes(s.scenario)||!['battle','reward','won','lost'].includes(s.phase))fail();
 for(const [key,min,max]of [['hp',0,72],['energy',0,3],['floor',1,8],['turn',1,2000],['serial',0,100000],['rng',0,4294967295],['coins',0,100000],['guard',0,1000]])if(!Number.isInteger(s[key])||s[key]<min||s[key]>max)fail();
 for(const key of ['deck','hand','draw','discard'])if(!Array.isArray(s[key])||s[key].length>100||s[key].some(c=>!record(c)||!own(CARDS,c.id)||typeof c.uid!=='string'||!/^[a-zA-Z0-9-]{1,60}$/.test(c.uid)||typeof c.up!=='boolean'))fail();
 for(const key of ['logs','used','usedTurn','discounts','scheduled','held','battleTokens'])if(!Array.isArray(s[key])||s[key].length>10000)fail();
 for(const key of ['flags','history','jobs','snapshots','zeroUsed','metrics','data','enemy'])if(!record(s[key]))fail();
 if(!Array.isArray(s.equipment)||s.equipment.length>5||s.equipment.some(e=>!record(e)||typeof e.id!=='string'||!/^[a-zA-Z0-9-]{1,60}$/.test(e.id)||!['process','support'].includes(e.group)||!['running','stopped','starting','switching'].includes(e.state)||!Number.isFinite(e.attack)||typeof e.kind!=='string'))fail();
 if(s.data.id!=='input'||s.data.kind!=='object'||typeof s.data.healthy!=='boolean'||!Number.isInteger(s.data.version)||!Number.isInteger(s.data.nextVersion)||!record(s.data.payload)||!Number.isFinite(s.enemy.hp)||!Number.isFinite(s.enemy.max))fail();
 if(Object.values(s.snapshots).some(p=>!record(p)||p.sourceDataId!=='input'||p.kind!=='object'||!record(p.payload)))fail();
 if(Object.entries(s.jobs).some(([id,j])=>!record(j)||j.id!==id||!['pending','succeeded'].includes(j.state)||typeof j.applied!=='boolean'||!Number.isFinite(j.damage)))fail();
 if(s.phase==='reward'&&(!Array.isArray(s.offers)||s.offers.length>3||s.offers.some(id=>!own(CARDS,id))))fail();
 if(!Array.isArray(s.metrics.roomTurns)||Object.entries(s.metrics).some(([k,v])=>k!=='roomTurns'&&!Number.isFinite(v)))fail();
 return s;
}

export const applyWork=work;
