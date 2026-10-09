import data from '../../knowledge/build-gap-expansion.json';
import type {Chapter, Term} from '../types';
export const buildGapTerms:Term[]=data.items.map(t=>({id:t.id,name:t.name,meaning:t.meaning,chapterId:t.chapterId}));
export function enrichBuildGapLessons(chapters:Chapter[]){
 for(const t of data.items){
  const lesson=chapters.flatMap(c=>c.lessons).find(l=>l.id===t.lessonId);
  if(!lesson)throw new Error('Missing expansion lesson: '+t.lessonId);
  lesson.explanation+='\n\n'+t.name+'：'+t.meaning+' '+t.caution+'\n確認例：'+t.scenario+'\n判断：'+t.answer;
  lesson.conceptIds.push(t.id);
  lesson.sources.push({title:t.name+'の機能と限界',url:t.source,checked:t.checkedOn});
 }
}
