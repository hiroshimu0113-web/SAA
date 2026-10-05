# SAAへの道：教材・アプリ

このディレクトリが開発の作業場所です。[リポジトリ全体の案内](../README.md)から学習・開発・配信の入口へ進めます。

- 先行教材：2章6レッスン・20問・用語21件。
- 設計クエスト：8枚のAWSカードと3ミッションの試作。ホームの「設計クエストを遊ぶ」から開始。
- 監査待ち：12章36レッスン・通常200問の全体原稿。模試130問は未作成。

## 学習と進捗

[学習ガイド](docs/STUDY_GUIDE.md) / [学習記録](docs/STUDY_LOG.md) / [ゲームの遊び方](docs/GAME_PROTOTYPE.md) / [現在の状況](docs/CHECKPOINT.md)

`deliverables/` のEPUB・HTML・ZIPは移行時点の先行版で、新しいゲームは含みません。電子書籍には自動採点と回答履歴がありません。過去の配布手順は [使い方](deliverables/使い方.md)、復元した資料の説明は [移行記録](docs/MIGRATION.md)にあります。

## 開発

Node.js 24、pnpm 11.19.0で検証済み。リポジトリのルートから `cd materials` して実行します。

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

ビルドしたPWAの確認は `pnpm start` または `pnpm preview`。開発サーバーはService Workerを登録しません。`Start-Learning.cmd` はWindows用で、Node.jsと作成済みの `dist/` が必要です。ソースから使う場合は先に上記のインストール・ビルドを行ってください。

```sh
CHROME_PATH=/usr/bin/chromium node scripts/game-browser-check.mjs
CHROME_PATH=/usr/bin/chromium node scripts/browser-check.mjs
CHROME_PATH=/usr/bin/chromium node scripts/update-check.mjs
```

Chromeの場所は環境に合わせます。既存のブラウザーテストは `artifacts/` の画像・サンプルを上書きするため、移行時のファイルを保存してから実行してください。ビルドとService Worker試験は同時に実行しません。

## iPhoneと公開

GitHub Pagesには、リポジトリルートの `.github/workflows/deploy.yml` を使用します。`materials/.github/` は元ZIPから復元した旧配置の参考用で、GitHub Actionsから実行されません。

PagesのHTTPS URLをSafariで開き、共有 →「ホーム画面に追加」。オンラインでホーム画面から起動して「設定」で教材を保存した後、機内モードで再起動します。[実機チェック](docs/IPHONE_CHECK.md)を参照してください。端末のサイトデータ削除に備え、「設定」でJSONバックアップを保存します。

教材・問題は独自作成であり、AWS公式問題ではありません。ゲームの設計ポイントは実料金ではありません。
