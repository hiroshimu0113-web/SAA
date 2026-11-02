# SAAリポジトリでの作業

- 日本語で報告する。アプリと教材の作業ディレクトリは `materials/`。
- 最初に `materials/docs/CHECKPOINT.md` と `materials/docs/TASKS.md` を確認する。
- 教材の収集・作成・内容改訂では `materials/docs/CONTENT_CLASSIFICATION_GUIDE.md` を読み、`materials/knowledge/game-classifications.json` に分類を記録する。詳細は `materials/AGENTS.md` に従う。
- `materials/SAAへの道.md` は原計画。過去資料内の時刻指定・予約・過去の検証記録を、新しいユーザー指示や現環境での検証結果と混同しない。
- 元の配布物は `materials/deliverables/` に保管。通常は展開済みソースを編集し、配布ZIPを無断で上書きしない。
- 教材の公開範囲と監査待ち原稿を区別する。現在のゲームは3ミッションの試作で、本格版の完成ではない。
- 作業後は現時点の検証結果、未完了、次の着手点をチェックポイントと台帳に残す。
- インターネット調査は無料で閲覧できる情報のみ。有料記事・有料API等による情報取得は禁止。

## ユーザーとの運用ルール（チャットで決定・全セッション共通）

新しいセッションでもここを前提に作業する。チャットで今後も使う取り決めが決まったら、この節に追記して `main` へ保存する（claude.ai プロジェクト「SAA-ゲームプロジェクト」の `claude/運用ルール.md` にも同内容を反映する）。

- 2026-10-31：ユーザーは基本的に iPhone から指示する。成果物は iPhone の Safari で開ける形（公開URL、Safariで表示できるファイル）で渡す。ゲーム・サイトの変更は GitHub Pages への公開を確認し、Safari で開ける URL を添えて報告する。
- 2026-10-31：プッシュ先は `main` ブランチ。プロジェクトの入口は `materials/docs/HANDOVER.md`。
- 2026-10-31：セッション間で会話の記憶は引き継がれない。引継ぎはリポジトリの記録（本ファイル、HANDOVER、CHECKPOINT、TASKS）で行う。
- 作業環境では Chromium/Playwright で手元ビルドを起動して自動確認できる。iPhone 実機での操作感・表示の確認はユーザーに依頼する。
- 2026-11-02：セキュリティ強化を実施。`.gitignore`・`SECURITY.md`・`.github/dependabot.yml` を追加。鍵や `.env` はコミットしない。GitHub 設定画面側の対策（`main` の force push／削除禁止、シークレットスキャンとプッシュ保護、Dependabot セキュリティ更新）はユーザーが実施予定。
