import type {Chapter} from "../../types";
import {lessons} from "./lessons";
export {questions} from "./questions";
export function supplement(chapters: Chapter[]) { for(const chapter of chapters) chapter.lessons.push(...lessons.filter(l=>l.id.startsWith(chapter.id+"-"))); }
