import { chapters1, questions1 } from './part1';
import { starterTerms } from './starter';
// Reviewed starter release. Draft chapters/questions stay in source and are not exposed.
export const chapters = chapters1.slice(0, 2);
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
export const terms = starterTerms;
export const questions = questions1.slice(0, 20);
export const release = { label: '先行学習版', chapters: 2, questions: 20, mocksReady: false };
