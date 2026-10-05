# SAAリポジトリへの移行記録

2026-10-05、日本時間。取り込み元は `main` の `3194c34`。`materials/` に配置された既存ファイルは同梱 `deliverables/SAA-project-source.zip` の同名ファイルとバイト単位で一致していました。

## 復元したもの

ZIP内にのみ存在した13ファイルを、既存ファイルを上書きせず `materials/` へ復元しました。

- `docs/` の7ファイル：PROJECT、TASKS、CHECKPOINT、CONTENT_MAP、CONTENT_REVIEW、STARTER_REVIEW、IPHONE_CHECK。
- `.npmrc`、`.gitignore`、`tsconfig.json`、`vite.config.ts`、`Start-Learning.cmd`。
- `.github/workflows/deploy.yml`。これは旧配置の参考用です。GitHubが実行するのはリポジトリルートの `.github/workflows/deploy.yml` です。

ZIPのCRC検査、およびSHA256SUMSに記載されたEPUB・HTML・2つのZIPのハッシュ検査に成功しました。配布物そのものは変更していません。

## 今後の編集場所

`materials/src/` を正本として更新します。配布ZIPと同名でも、今後は展開済みソースが新しくなります。ZIPを再展開して上書きしないでください。

移行後にREADME、学習ガイド、学習記録を整備し、現在の依頼に合わせてチェックポイントと台帳を更新しました。原計画と過去の監査記録は残しています。過去の停止時刻や自動フォローアップ記述は当時の履歴で、この環境で予約が動いていることを意味しません。

## ゲーム試作への追加依頼

今回の目標は **2026-10-06 07:00 JST時点でiPhoneから遊べるたたき台**。GitHub Pages公開はユーザーが明示的に承認済みです。全教材監査後の本格版とは別に、3ミッションの試作を追加しています。検証結果と公開状況は [CHECKPOINT.md](CHECKPOINT.md) に記録します。
