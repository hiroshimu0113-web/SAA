export const HEROES={
 se:{name:'SE',title:'システムエンジニア',relic:'blueprint'},
 sre:{name:'SRE',title:'サイト信頼性エンジニア',relic:'runbook'},
 architect:{name:'クラウドアーキテクト',title:'クラウドアーキテクト',relic:'capacity'}
};
export const RELICS={
 blueprint:{name:'設計の青写真',text:'各戦闘の開始時に2枚追加で引く。'},
 runbook:{name:'復旧手順書',text:'戦闘勝利時にHPを6回復（最大HPまで）。'},
 capacity:{name:'拡張の余力',text:'各戦闘の開始時にエナジー＋1（最初のターンのみ）。'},
 lantern:{name:'観測灯',text:'各戦闘の最初のターンに1枚多く引く。'},
 shell:{name:'耐障害の殻',text:'各戦闘の開始時に8ブロック。'},
 spring:{name:'復旧の泉',text:'戦闘勝利時にHPを4回復。'},
 ember:{name:'演算の火種',text:'各戦闘の開始時に攻撃力＋1。その戦闘中有効。'},
 edge:{name:'研磨された回路',text:'攻撃力＋1。その戦闘中有効、ターンごとの蓄積なし。'},
 plating:{name:'積層装甲',text:'防御力＋1。ブロックを得る効果1回につき＋1（0の効果には加算しない）。'},
 battery:{name:'起動電池',text:'各戦闘の開始時にエナジー＋1（最初のターンのみ）。'},
 opener:{name:'先駆けの演算核',text:'各戦闘の開始時に攻撃力＋5。その戦闘中有効、ターンごとの蓄積なし。'},
 dusk:{name:'終端の防壁',text:'自分のターン終了時、敵の行動前に3ブロック。'},
 prune:{name:'整理の工具',text:'休憩所で無料のカード削除を選べる。1枚削除して休憩所を終了（デッキ最低5枚）。'},
 choice:{name:'選択の羅針盤',text:'戦闘勝利時のカード候補が3枚から4枚になる。'},
 double:{name:'双取りの手帳',text:'戦闘勝利時のカード候補から異なる2枚まで獲得できる。途中で見送りも可能。'},
 elite_edge:{name:'難関突破の徽章',text:'強敵との戦闘中のみ攻撃力＋2。ボスは対象外、ターンごとの蓄積なし。'},
 elite_energy:{name:'高負荷電源',text:'強敵・ボス戦のみ、各ターン開始時にエナジー＋1。'},
 renewal:{name:'生命の小環',text:'戦闘勝利時、最大HPの2％を回復（端数切り上げ、上限まで）。'},
 growth:{name:'成長の器',text:'戦闘勝利時、最大HP＋5。現在HPはその効果だけでは回復しない。'},
 bounty:{name:'成果の金庫',text:'戦闘勝利時、追加で30コイン獲得。'},
 insight:{name:'先読みのレンズ',text:'各ターン開始時、ドロー＋1。手札上限10枚。'},
 escalation:{name:'競争の歯車',text:'各ターン開始時、自分の攻撃力＋3、敵の攻撃力＋1。その戦闘中は累積。'},
 regeneration:{name:'薄衣の再生炉',text:'各ターン開始時HPを4回復。防御力－2（固定）。ブロック獲得量は最低0。'},
 discount:{name:'交渉の契約書',text:'交換所の全価格が25％引き。割引後の端数は切り上げ。'},
 coupon:{name:'初回の招待券',text:'この冒険で購入する最初のカード1枚が無料。すでにカード購入済みなら使用不可。'}
};
export const REWARD_RELICS=Object.keys(RELICS).filter(id=>!Object.values(HEROES).some(h=>h.relic===id));
