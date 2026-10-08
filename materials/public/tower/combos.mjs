// Educational motifs, not a list of sufficient AWS deployment requirements.
export const BASE_COMBOS={
 incident:{name:'インシデント対応',cards:['probe','strike','guard'],icons:['◉','ϟ','◇'],block:5,label:'ブロック ＋5',lesson:'EC2を使う場合、利用者はゲストOSやアプリの保守、セキュリティグループによる通信許可、CloudWatchによる監視などを設計します。AWSが管理する物理基盤とは責任範囲が異なります。この3枚だけで安全性や運用が完結するという意味ではありません。',source:'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html'},
 balancing:{name:'負荷分散構成',cards:['balance','parallel','probe'],icons:['⇄','ϟ','◉'],damage:3,label:'追加攻撃 3',lesson:'ALBによる振り分け、複数AZへの配置、CloudWatchによるメトリクス監視を組み合わせて可用性を考えます。CloudWatchの監視はALBのターゲットヘルスチェックとは別です。正常先で利用できるデータと残存容量、ALBのヘルスチェックと全異常時のフェイルオープンも別途確認します。追加攻撃はゲーム上の報酬です。',source:'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html'},
 caching:{name:'キャッシュ活用',cards:['analysis','cache','optimize'],icons:['≡','⚡','✧'],energy:1,label:'エナジー ＋1',lesson:'キャッシュは置くだけでなく、ヒット率や性能を調べて使い方を改善します。ElastiCacheの指標を監視し、ワークロードに合う戦略を選ぶ考え方です。エナジー回復はゲーム上の報酬です。',source:'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html'}
};
export const COMBOS=JSON.parse(JSON.stringify(BASE_COMBOS));
export function comboReady(b,id){return Object.entries(COMBOS).filter(([key,r])=>!b.comboDone?.includes(key)&&!b.comboPlayed?.includes(id)&&r.cards.includes(id)&&r.cards.every(c=>c===id||b.comboPlayed?.includes(c))).map(([key])=>key);}
export function triggeredCombos(before,after){if(before?.phase!=='battle'||!after?.battle||before.battle.turn!==after.battle.turn)return [];return (after.battle.comboDone||[]).filter(id=>!before.battle.comboDone?.includes(id));}
