# SVGアイコンの再現と検証（現行版）

2026-10-08 UTC。受領した「ゲームアイコンの再現手順書 2026年10月8日版」に基づく現行版への適用。

受領した手順書の再現キットとmanifestは、この環境にはない。従って元のローカル実装とのバイト一致は未確認。下記は共有された仕様を現行ゲームへ実装した新版。7ab388dを上書き復元して旧ゲームへ戻す操作は行っていない。

## 現行版との差

- 通常カード30種と既存の戦闘限定カード1種を維持。手順書の20種/お邪魔0枚へ戻さない。
- レリック24種すべてに異なる専用図形を用意（手順書の4種を含む）。敵12種にも異なる図形を用意。
- 学習用の表示名は現行教材対応のまま。保存IDでアイコンを選ぶ。
- カード種別名は「攻撃・スキル・パワー・お邪魔」。本文の「戦闘中持続」はそのまま。
- マップは現行の15ノード・8階・冒険ごとの抽選を維持。
- 図形は24×24、currentColor、fill=none、丸い線端、線幅1.7のオリジナルSVG。AWS公式ロゴではない。

## 実装と検証

`public/tower/icons.mjs`に専用パス、`card-icons.mjs`に4分類を一元化。カード名の左に配置。レリック一覧/獲得結果、敵戦闘/状態詳細で同じIDを使用。マップはSVGと名称を同じstrong内へ置き、説明を下段へ置く。

役3種・デバフ5種・HP/防御/エナジー・見出し・結果・操作にも線画を使用。クイズ選択肢と行動ログは文章のまま。✓、×、★、矢印は維持。旧設計クエストはQuestIcon.tsxのサービス/役割別8SVGを使用し、4分類を適用しない。ゲームエンジン、カード性能、保存形式、教材本文、分類台帳は本作業で変更しない。

新入口：`tower/icons-v2.html`。従来入口にも同じ表示を反映。旧PNG素材は履歴用に保管し、新UIは参照しない。

```powershell
Set-Location materials
pnpm install --frozen-lockfile
pnpm test
pnpm build
$env:CHROME_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe'
node scripts/icons-browser-check.mjs
node scripts/icons-audit.mjs
node scripts/touch-browser-check.mjs
node scripts/game-browser-check.mjs
pnpm start
```

Linuxでは `CHROME_PATH=/usr/bin/chromium` を指定できる。アイコン試験は4179、監査は4189、操作試験は4183、旧クエストは4187。試験は順番に実行する。Safari相当は `BROWSER=webkit` を指定し、Playwright WebKitを導入する。

監査：320/390/1000pxの33画面と、現行全31カードの詳細を各幅で確認（計93詳細）。一覧図：artifacts/icons-roster.png。監査画像/結果：artifacts/icon-audit/。検証用データは個人の実績ではない。

## 新しい再現キット

新キットの基準コミットはmanifest.jsonに記録。旧手順書の基準コミットではなく、この版のmanifestの基準を使用する。既存作業のあるフォルダへ強制コピーせず、新規cloneへ展開する。

```powershell
git clone https://github.com/hiroshimu0113-web/SAA.git SAA-icon-reproduction
Set-Location SAA-icon-reproduction
Expand-Archive -LiteralPath 'C:\Downloads\icon-reproduction-kit.zip' -DestinationPath '.\icon-kit'
$iconManifest = Get-Content '.\icon-kit\manifest.json' -Raw | ConvertFrom-Json
git switch --detach $iconManifest.base_commit
Copy-Item '.\icon-kit\materials\*' '.\materials' -Recurse -Force
Copy-Item '.\icon-kit\.github\workflows\deploy.yml' '.\.github\workflows\deploy.yml' -Force
foreach ($iconEntry in $iconManifest.files) {
  $iconHash = (Get-FileHash -LiteralPath $iconEntry.path -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($iconHash -ne $iconEntry.sha256) { throw "Mismatch: $($iconEntry.path)" }
}
```

起動はhttp://127.0.0.1:4180/tower/、旧クエストはホームから開く。新キットは配布済み教材ZIPや個人保存を含まない。生成スクリプトはscripts/package-icons.py。新規clone復元試験・公開・未確認事項はCHECKPOINT.md末尾に記録する。
