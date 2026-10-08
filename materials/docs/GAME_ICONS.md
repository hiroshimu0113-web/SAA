# ゲームアイコン 現行仕様

2026-10-08 UTC。受領した再現手順書に基づき、初回のPNG共通6種から線画SVGへ更新。

- カード4分類：攻撃・スキル・パワー・お邪魔。card-icons.mjsでkindに基づく対応を一元化し、名前の左に配置。
- 敵12種・現行レリック24種は、IDごとに異なるSVG。戦闘/詳細と所持/獲得結果で同じ図形を使用。
- マップ6種・全15ノード、役3種、デバフ5種、HP/防御/エナジー、結果、操作もSVGを使用。
- 旧設計クエスト8枚はサービス/役割を表すQuestIcon.tsxの専用図形。
- エンジン/性能/保存形式/教材本文/分類データは変更せず、現行30通常カード＋既存一時カードを維持。
- 旧PNG素材は保存し、現行UIでは参照しない。

詳細手順・元手順書との差分：ICON_REPRODUCTION.md。新キット：output/icon-reproduction/icon-reproduction-kit.zip。元キットは未受領のため元実装との完全一致は未確認。

検証：111テスト、ビルド、33画面＋93カード詳細、Chromium操作/旧クエスト、オフライン。新規cloneへキットを展開し、SHA256一致、111テスト/ビルド/アイコン試験/サーバー起動を確認。2環境のゲーム入口・SVG2定義・Service WorkerのSHA256一致。

新入口tower/icons-v2.html。公開の最終結果はCHECKPOINT.md末尾に記録。


公開完了：6d952fa / Actions 37723712347。ChromeとWebKitで全件/33画面/93詳細、111テストと操作回帰を確認。公式入口：https://hiroshimu0113-web.github.io/SAA/tower/icons-v2.html 。元キットのSVGとの完全一致と実機iPhoneは未確認。

## 2D Webデザインへの調整
2026-10-08の追加希望に対応。アイコンは正面向きの単色線画。奥行き表現を含む攻撃・刃・積層の図形を整理し、カードは種類別の単色背景と細い境界線へ変更。常時の影・発光・背景グラデーションを除去し、選択と役成立は枠線と文字で表示。操作時の短い戦闘演出は維持。最新入口は `tower/icons-flat.html`。

- 公式公開完了：f791b6e / Actions 37724790265 のbuild・deploy成功。WebKitのアイコン/33画面/93詳細・タッチ/保存/オフライン・教材更新・章/模試の検証成功。deployで新入口を含むHTTPS HTTP200/SHA256一致確認。公式URL：https://hiroshimu0113-web.github.io/SAA/tower/icons-flat.html 。実機iPhoneは未確認。
