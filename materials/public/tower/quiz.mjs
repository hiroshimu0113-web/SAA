// Adapted from the published 2026-10-07 lesson; checked against AWS docs on 2026-10-06.
const regions='https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html';
export const BASE_QUIZZES={
 az:{prompt:'リージョンとAZの関係として正しいものは？',options:['AZは常に別のリージョンにある','AZはリージョン内の独立した場所で、1つ以上のデータセンターからなる','AZは必ず1棟のデータセンターである'],answer:1,reasons:['AZはリージョン内にあります。','AZはリージョン内の障害を分離する場所で、1つ以上のデータセンターで構成されます。','1つのAZに複数のデータセンターが含まれる場合があります。'],source:regions},
 shared:{prompt:'同じAZにEC2が2台。AZ全体が停止した場合は？',options:['台数が2台なら必ず1台は動く','自動的に別リージョンへ移動する','2台とも影響を受ける可能性がある'],answer:2,reasons:['台数だけではAZ全体の障害を分離できません。','この配置だけでは自動移転しません。','同じ障害範囲にあるため、両方とも影響を受ける可能性があります。'],source:regions},
 routing:{prompt:'1つのAZが停止しても新しいHTTP要求を処理したい。必要データと残存容量は確保済み。適した構成は？',options:['別々のAZのEC2と複数AZのALBで、残った正常先へ振り分ける','同じAZにEC2を2台とALBを置く','別々のAZにEC2を置き、利用者は常に片方へ直接接続する'],answer:0,reasons:['障害範囲を分け、正常な処理先へ要求を送る仕組みを組み合わせます。','ALBがあっても、EC2が同じAZなら両方が停止する可能性があります。','正常先が残っても、利用者をそこへ送る仕組みが不足します。'],source:'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html'},
 capacity:{prompt:'2つのAZに処理能力が各100件/秒のサーバー。全体で160件/秒が必要。片方のAZ停止後、残った1台で維持できる？（この問題の仮定値）',options:['維持できる。複数AZなら容量も自動で倍になる','維持できない。残る100件/秒では60件/秒不足する','ALBがあれば残った1台の能力は必ず160件/秒になる'],answer:1,reasons:['配置を分けることと、残った処理能力は別です。','160−100＝60件/秒の不足です。障害後の残存容量も設計します。','振り分けは、処理先の能力を必ず増やす仕組みではありません。'],source:regions}
};
export const QUIZZES=JSON.parse(JSON.stringify(BASE_QUIZZES));
export const QUIZ_RULES={coins:30,damage:8,allRelicsCoins:60};
export function quizScore(q){return q.answers.reduce((n,a,i)=>n+Number(a===QUIZZES[q.ids[i]].answer),0);}
