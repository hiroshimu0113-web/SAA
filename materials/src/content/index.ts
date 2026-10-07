import { chapters1, questions1, terms1 } from './part1';
import { chapters2, questions2, terms2 } from './part2';
import { starterTerms } from './starter';
// Chapter revision release; audit scope and limitations are recorded in SAA_REVISION_LOG.md.
export const chapters = [...chapters1, ...chapters2].map(ch => ({...ch, lessons: ch.lessons.map(l => ({...l, conceptIds: [...l.conceptIds]}))}));
chapters[0].lessons[2] = {
  ...chapters[0].lessons[2],
  explanation: chapters[0].lessons[2].explanation + '\n\nEC2は仮想サーバー、S3はオブジェクト保存、RDSはDB管理のサービスです。一時データと失いたくない結果を分け、EC2のインスタンスストアには再生成できる一時データを置きます。停止や終了で失う可能性があるため、処理結果はS3などへ保存します。Spotは中断される場合がある購入方式なので、チェックポイントと再投入を設計できる処理に向きます。',
  conceptIds: [...chapters[0].lessons[2].conceptIds, 'durability', 'spot', 'instance-store', 's3', 'rds'],
  sources: [...chapters[0].lessons[2].sources, {title:'EC2インスタンスストア',url:'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html',checked:'2026-10-05'}],
};
chapters[1].lessons[0] = {
  ...chapters[1].lessons[0],
  explanation: chapters[1].lessons[0].explanation + '\n\nMFAはパスワードに加えて別の認証要素を求める仕組みです。ルートユーザーをMFAで保護し、日常業務は必要な権限に絞った別のIDで行います。',
  conceptIds: [...chapters[1].lessons[0].conceptIds, 'root', 'mfa'],
};
chapters[1].lessons[2] = { ...chapters[1].lessons[2], conceptIds: [...chapters[1].lessons[2].conceptIds, 'cognito'] };
export const terms = [...starterTerms, ...terms1, ...terms2].filter((t,i,all) => all.findIndex(x => x.id === t.id || x.name === t.name) === i);
export const questions = [...questions1, ...questions2];
export const release = { label: '12章学習版', chapters: chapters.length, questions: questions.filter(q=>!q.exam).length, mocksReady: true };
