// Shared silhouettes connect installed equipment, action popups and enemy targets.
const shapes={
 ec2:'M9 5h22v30H9zM13 11h14m-14 8h14m-14 8h14M13 8v1m0 7v1m0 7v1',
 rds:'M8 10c0-7 24-7 24 0v20c0 7-24 7-24 0zM8 10c0 7 24 7 24 0M8 20c0 7 24 7 24 0',
 replica:'M5 10c0-5 17-5 17 0v20c0 5-17 5-17 0zM5 10c0 5 17 5 17 0M27 14h8v18h-8M27 21h8',
 sqs:'M4 10h9v20H4zM16 10h9v20h-9zM28 10h8v20h-8zM7 16h3m9 0h3m9 0h2',
 'pilot-light':'M17 14h6l6 22H11zM15 14V7h10v7M18 4h4M4 8l7 2M36 8l-7 2M17 22h6',
 data:'M10 4h14l7 7v25H10zM24 4v9h7M15 20h11m-11 7h11',
 az:'M5 5h30v30H5zM10 11h7v7h-7zM23 11h7v7h-7zM10 24h20',
 spot:'M23 3 11 22h10l-3 15 13-21H21z',
 target:'M20 4v7m0 18v7M4 20h7m18 0h7M20 10a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
 stopped:'M13 9v22m14-22v22',
 corrupt:'M7 7l26 26M33 7 7 33',
 running:'M9 20l8 8L32 12'
};
export function equipmentSymbol(kind){const key=Object.hasOwn(shapes,kind)?kind:'ec2';return `<svg class="equipment-symbol" data-equipment-symbol="${key}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="${shapes[key]}"/></svg>`;}
export const equipmentName=e=>e.spot?'Spot EC2':({ec2:'EC2',rds:'RDS＋待機',replica:'DB＋レプリカ',sqs:'SQS','pilot-light':'復旧中核'}[e.kind]||e.kind);
export function equipmentObject(e){const kind=Object.hasOwn(shapes,e.kind)?e.kind:'ec2';return `<span class="equipment-object" data-object-kind="${kind}">${equipmentSymbol(kind)}${e.spot?'<span class="equipment-overlay">'+equipmentSymbol('spot')+'</span>':''}</span>`;}
export function equipmentThreat(e,f){return f.hazard==='az-stop'&&e.group==='process'&&e.az===f.az||f.hazard==='spot-interruption'&&e.spot||f.hazard==='data-corruption'&&e.attack>0;}
export function equipmentStatus(e,c,f){if(e.state!=='running')return {icon:'stopped',text:({stopped:'停止',starting:'起動待ち',switching:'切替中'}[e.state]||'停止')};if(e.attack&&!c.data.healthy)return {icon:'corrupt',text:'データ破損・攻撃不可'};if(e.kind==='replica'&&(!f.allowRead||e.replicaVersion!==c.data.version))return {icon:'stopped',text:!f.allowRead?'読取り対象なし':'同期待ち'};return {icon:'running',text:'稼働'};}
