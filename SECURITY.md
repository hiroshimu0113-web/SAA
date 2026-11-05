# セキュリティポリシー

## 脆弱性・情報漏えいの報告
このリポジトリで脆弱性や、誤って公開された鍵・個人情報を見つけた場合は、Issue に書かず、
GitHub の「Security」タブ →「Report a vulnerability」（非公開の報告）から連絡してください。

## 運用方針
- リポジトリに認証情報（APIキー、トークン、秘密鍵、.env）を置かない。
- `main` への変更はすべて Pull Request 経由 (ブランチ保護で強制)。Claude も PR を作成し、マージは所有者が行う。
- GitHub Actions の権限は最小限（`contents: read` など）に保つ。
- 依存パッケージと Actions は Dependabot で定期的に更新する。
