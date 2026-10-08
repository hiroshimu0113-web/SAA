// Service/role metaphors, drawn independently of AWS logos and tower card kinds.
const paths: Record<string,string>={
 ec2:'M4 3h16v18H4zM7 7h10m-10 5h10m-10 5h3',
 'multi-az':'M2 5h8v14H2zM14 5h8v14h-8zM5 9h2m-2 5h2m10-5h2m-2 5h2M12 2v20',
 alb:'M9 2h6v5H9zM2 17h6v5H2zm14 0h6v5h-6zM12 7v5H5v5m7-5h7v5',
 s3:'M3 6l9-4 9 4-9 4zM3 6v12l9 4 9-4V6M12 10v12',
 role:'M12 2l8 4v7l-8 9-8-9V6zM8 12l3 3 5-6',
 keys:'M7 3a5 5 0 1 0 0 10 5 5 0 1 0 0-10M10 12l10 10m-3-3 3-3m-6 0 3-3',
 mfa:'M3 6h10v15H3zM6 17h4M17 2l5 2v6l-5 5-5-5V4zM15 7l2 2 3-4',
 root:'M4 7l4 4 4-8 4 8 4-4-2 12H6zM9 15h6M3 22h18',
 start:'M7 3l14 9-14 9z',book:'M3 3h7l2 2 2-2h7v17h-7l-2 1-2-1H3zM12 5v16',
 test:'M9 2h6M10 2v7L3 21h18L14 9V2M7 15h10',restart:'M4 9a9 9 0 1 1 0 6M4 3v6h6',
};
export function QuestIcon({id}: {id:string}){
 const path=paths[id];if(!path)throw new Error('Unknown quest icon: '+id);
 return <svg className="quest-icon" data-quest-icon={id} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={path}/></svg>;
}
