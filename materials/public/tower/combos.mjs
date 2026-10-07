// Educational motifs, not a list of sufficient AWS deployment requirements.
export const BASE_COMBOS={
 incident:{name:'インシデント対応',cards:['probe','strike','guard'],icons:['◉','ϟ','◇'],block:5,label:'ブロック ＋5',lesson:'観測して状況を把握し、原因を切り分け、影響を抑えるという運用の考え方です。AWSではメトリクスと調査用のプレイブック等を使います。この3枚だけで対応が完結するという意味ではありません。',source:'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html'},
 balancing:{name:'負荷分散構成',cards:['balance','parallel','probe'],icons:['⇄','ϟ','◉'],damage:3,label:'追加攻撃 3',lesson:'ALBは登録されたターゲットへリクエストを振り分け、ヘルスチェックで状態を確認します。分散先と正常性の確認をカードで表現しています。実際にはリスナー、ターゲットグループ、ネットワーク等の設定も必要です。',source:'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html'},
 caching:{name:'キャッシュ活用',cards:['analysis','cache','optimize'],icons:['≡','⚡','✧'],energy:1,label:'エナジー ＋1',lesson:'キャッシュは置くだけでなく、ヒット率や性能を調べて使い方を改善します。ElastiCacheの指標を監視し、ワークロードに合う戦略を選ぶ考え方です。エナジー回復はゲーム上の報酬です。',source:'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html'}
};
export const COMBOS=JSON.parse(JSON.stringify(BASE_COMBOS));
export function comboReady(b,id){return Object.entries(COMBOS).filter(([key,r])=>!b.comboDone?.includes(key)&&!b.comboPlayed?.includes(id)&&r.cards.includes(id)&&r.cards.every(c=>c===id||b.comboPlayed?.includes(c))).map(([key])=>key);}
export function triggeredCombos(before,after){if(before?.phase!=='battle'||!after?.battle||before.battle.turn!==after.battle.turn)return [];return (after.battle.comboDone||[]).filter(id=>!before.battle.comboDone?.includes(id));}
