// Educational motifs, not a list of sufficient AWS deployment requirements.
export const COMBOS={
 incident:{name:'インシデント対応',cards:['probe','strike','guard'],icons:['◉','ϟ','◇'],block:5,label:'ブロック ＋5',lesson:'観測して状況を把握し、原因を切り分け、影響を抑えるという運用の考え方です。AWSではメトリクスと調査用のプレイブック等を使います。この3枚だけで対応が完結するという意味ではありません。',source:'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html'},
 balancing:{name:'負荷分散構成',cards:['balance','parallel','probe'],icons:['⇄','ϟ','◉'],damage:3,label:'追加攻撃 3',lesson:'ALBはリスナーからターゲットグループの処理先へ要求を転送し、周期的なヘルスチェックで状態を確認します。正常数が設定した下限を下回ると異常先にも送るため、必ず正常先だけに送るとは限りません。3枚は分散・処理先・観測の比喩で、実際には転送設定やネットワーク等も必要です。',source:'https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/elasticloadbalancingv2/types/types.go'},
 caching:{name:'キャッシュ活用',cards:['analysis','cache','optimize'],icons:['≡','⚡','✧'],energy:1,label:'エナジー ＋1',lesson:'キャッシュは置くだけでなく、ヒット率や性能を調べて使い方を改善します。ElastiCacheの指標を監視し、ワークロードに合う戦略を選ぶ考え方です。エナジー回復はゲーム上の報酬です。',source:'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html'}
};
export function comboReady(b,id){return Object.entries(COMBOS).filter(([key,r])=>!b.comboDone?.includes(key)&&!b.comboPlayed?.includes(id)&&r.cards.includes(id)&&r.cards.every(c=>c===id||b.comboPlayed?.includes(c))).map(([key])=>key);}
export function triggeredCombos(before,after){if(before?.phase!=='battle'||!after?.battle||before.battle.turn!==after.battle.turn)return [];return (after.battle.comboDone||[]).filter(id=>!before.battle.comboDone?.includes(id));}
