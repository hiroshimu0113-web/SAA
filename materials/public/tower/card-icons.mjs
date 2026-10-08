import {icon} from './icons.mjs';
export const CARD_TYPES={
 attack:{name:'攻撃',icon:'battle'},
 skill:{name:'スキル',icon:'skill'},
 power:{name:'パワー',icon:'power'},
 junk:{name:'お邪魔',icon:'junk'},
};
export function cardIcon(kind){const type=CARD_TYPES[kind];if(!type)throw new Error('Unknown card kind: '+kind);return icon(type.icon);}
