import { chapters1, questions1 } from '../src/content/part1';
import { chapters2, questions2 } from '../src/content/part2';
const questions = [...questions1, ...questions2];
console.log(JSON.stringify({draftChapters: [...chapters1,...chapters2].length, draftLessons:[...chapters1,...chapters2].flatMap(c=>c.lessons).length,practice:questions.filter(q=>!q.exam).length,mock1:questions.filter(q=>q.exam==='mock1').length,mock2:questions.filter(q=>q.exam==='mock2').length,assessment:questions.filter(q=>q.exam==='assessment1').length,target:{chapters:12,practice:235,mock1:65,mock2:65,assessment:65},note:'数量は内容監査済みを意味しません。公開対象はsrc/content/index.tsを参照。'},null,2));
