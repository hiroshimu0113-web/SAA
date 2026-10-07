export const BASE_ENEMIES={
 noise:{tier:'battle',name:'ノイズの群れ',hp:32,glyph:'✺',pattern:[['attack',7],['guard',7],['attack',10],['junk',2]]},
 surge:{tier:'battle',name:'負荷の奔流',hp:38,glyph:'≋',pattern:[['buff',2],['attack',8],['attack',12],['junk',2]]},
 leak:{tier:'battle',name:'メモリの亡霊',hp:35,glyph:'♧',pattern:[['attack',6],['attack',6],['attack',13],['junk',2]]},
 timeout:{tier:'battle',name:'時切れの番人',hp:42,glyph:'⌛',pattern:[['guard',10],['attack',13],['buff',3],['junk',2]]},
 storm:{tier:'battle',name:'再試行の嵐',hp:45,glyph:'ϟ',pattern:[['attack',9],['buff',2],['attack',14],['junk',2]]},
 deadlock:{tier:'battle',name:'膠着の双環',hp:47,glyph:'∞',pattern:[['attack',10],['guard',12],['attack',14],['junk',2]]},
 elite:{tier:'elite',name:'断絶の騎士',hp:65,glyph:'⛨',pattern:[['debuff',2,'misconfig'],['attack',15],['attack',19],['guard',12]]},
 elite_fire:{tier:'elite',name:'炎上の番人',hp:65,glyph:'♨',pattern:[['debuff',3,'burn'],['attack',14],['guard',12],['attack',18]]},
 elite_drain:{tier:'elite',name:'枯渇の収集者',hp:65,glyph:'◈',pattern:[['debuff',2,'depletion'],['attack',15],['guard',10],['attack',19]]},
 boss:{tier:'boss',name:'連鎖障害の王',hp:125,glyph:'♜',pattern:[['debuff',1,'delay',10],['attack',16],['debuff',3,'burn',10],['guard',18],['debuff',2,'overload',10],['attack',27]]},
 boss_resource:{tier:'boss',name:'資源喰らいの巨塔',hp:125,glyph:'▥',pattern:[['debuff',2,'depletion',10],['attack',19],['debuff',2,'misconfig',10],['attack',21],['junk',1,null,10],['attack',25]]},
 boss_stagnation:{tier:'boss',name:'停滞の支配者',hp:125,glyph:'⌛',pattern:[['debuff',2,'overload',10],['attack',19],['debuff',1,'delay',10],['guard',18],['attack',25],['attack',17]]}
};
export const ENEMIES=JSON.parse(JSON.stringify(BASE_ENEMIES));
