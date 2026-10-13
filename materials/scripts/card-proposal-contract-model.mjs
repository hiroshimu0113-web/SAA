// Executable examples for the proposal's contracts; NOT imported by the game engine.
export function canPlay(card,state){
 const cost=card.profile.energy;
 if(state.phase!=='ready'||state.finished||card.scene!==state.scene||state.energy<cost)return false;
 if(cost===0&&(state.usedNames[card.name]||0)>=1)return false;
 if(card.requiresEquipment){const e=state.equipment[card.targetId];if(!e||e.kind!==card.requiresEquipment||!card.allowedEquipmentStates.includes(e.state))return false;}
 if(card.requiresJob){const job=state.jobs[card.jobId];if(!job||!['pending','running','uncertain'].includes(job.state)||job.maxAttempts<=job.attempts)return false;}
 if(card.requiresSnapshot){const snap=state.snapshots[card.snapshotId],data=state.data[card.dataId];if(!snap||!data||snap.sourceDataId!==card.dataId||snap.kind!==data.kind||data.owner!=='player'||!snap.healthy||!card.restoreAuthorized)return false;}
 return card.conditionsSatisfied!==false;
}
export function shouldAutoEnd(hand,state){return state.phase==='ready'&&!state.finished&&!hand.some(card=>canPlay(card,state));}
export function stopEquipment(state,id){const e=state.equipment[id];if(!e||e.kind!=='ec2'||e.state!=='running')return false;e.state='stopped';e.ram=null;return true;}
export function commitPart(state,jobId,partId,damage){const job=state.jobs[jobId];if(!job||job.state==='cancelled'||!job.parts.includes(partId))throw Error('Invalid work part');if(job.appliedPartIds.includes(partId))return 0;job.appliedPartIds.push(partId);const applied=Math.min(Math.max(0,damage),state.enemyHP);state.enemyHP-=applied;if(job.appliedPartIds.length===job.parts.length)job.state='succeeded';return applied;}
export function snapshotData(state,dataId,snapshotId){const data=state.data[dataId];if(!data||data.owner!=='player'||!data.healthy)throw Error('Invalid data');state.snapshots[snapshotId]={sourceDataId:dataId,kind:data.kind,payload:structuredClone(data.payload),savedVersion:data.version,healthy:true};}
export function restoreData(state,dataId,snapshotId,authorized){const data=state.data[dataId],snap=state.snapshots[snapshotId];if(!authorized||!data||!snap||data.owner!=='player'||snap.sourceDataId!==dataId||snap.kind!==data.kind||!snap.healthy)throw Error('Incompatible or unauthorized restore');data.payload=structuredClone(snap.payload);data.healthy=true;data.version=data.nextVersion++;}
export function protectionMatches(protection,action){return protection.hazardIds.includes(action.hazardId)&&protection.targetId===action.targetId&&(protection.scope===undefined||protection.scope===action.scope);}
export function offerAllowed(card,source,implementedFeatures,implementedHazards){return card.releaseGate.liveEligible&&card.acquisition.includes(source)&&card.requiredFeatures.every(f=>implementedFeatures.has(f))&&card.enemyHazardIds.every(h=>implementedHazards.has(h));}
