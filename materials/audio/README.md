# 5分音声サンプル：写真工房

初学者向けにEC2・S3・IAMロールを説明する、BGMなしの合成音声です。30分版の制作前に、声・テンポ・説明量を確認するための試作です。

- 公開プレーヤー：`public/audio/index.html`。台本、10個のチャプター、再生速度、MP3保存リンク付き。
- 音声：`public/audio/photo-studio-himari-5min.mp3`（約5分、44.1kHz、モノラル、128kbps）。
- 台本：[TRANSCRIPT.md](TRANSCRIPT.md)。編集元は `sample-01.json`。
- 時刻・生成情報：`public/audio/sample-01.json`。
- 声：VOICEVOX:冥鳴ひまり（ノーマル）。ユーザーが追加比較で「一番声質が好き。このコで行きましょう」と選択。声の高さは比較版と同じに維持。[利用条件](VOICEVOX_LICENSE.md)。旧Mei音声は `photo-studio-5min.mp3` と `sample-mei.json` に保管。

## 構成

工房の条件 → EC2 → S3 → IAMロール → 最小権限 → 確認問題2問 → まとめ。各問題の後に7秒の間を設けます。英略語は合成時に読みを指定しています（EC2＝イーシーツー、S3＝エススリー、IAM＝アイアム）。

## 無料で再生成する

有料APIを使わずVOICEVOX Engine 0.25.2のCPUで生成します。エンジンの取得・チェックサム・起動方法は [COMPARISON.md](COMPARISON.md)。起動後、リポジトリルートから次を実行します。Python環境にはnumpyとsoundfile、システムにはffmpegが必要です。

```sh
/workspace/.tools/saa-audio-venv/bin/python materials/scripts/generate-himari-audio.py
python materials/scripts/render-audio-page.py
```

スタイルID 14、speedScale 0.95、intonationScale 0.9、pitchScale 0。5分に収めるため音程を保ったテンポ補正を行います。補正が0.80〜1.25倍を外れる場合は停止し、台本の長さを直します。確認問題後は7秒の間を保ちます。声の合成設定と最終補正係数は `public/audio/sample-01.json`。

旧Mei版の再生成は従来の `generate-audio.py`。旧音声・`sample-mei.json`・`TRANSCRIPT-mei.md` を出力し、現行の冥鳴ひまり版の時刻情報は更新しません。比較ページの旧音声抜粋も旧時刻情報を参照します。

## 根拠と確認

2026-10-05に無料のAWS公式資料を確認しています。

- [EC2でIAMロールを使用する](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)：EC2へ割り当てるロールと一時認証情報。
- [インスタンスストア](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html)：一時的な保存領域。
- [インスタンスストアの永続性](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html)：停止・終了時のデータ喪失。
- [S3の概要](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)：バケット、オブジェクト、アクセス管理、バージョニング。

独自教材であり、AWS公式問題ではありません。「EC2のディスクは全て終了時に消える」「ロールを付ければ何でも許可される」「S3なら誤削除も防げる」という誤解を避けた説明にしています。

## 検証

生成スクリプトは音声の非無音・有限値と295〜305秒の長さを確認します。`ffprobe`でMP3形式・長さ、ffmpegでデコード・音量を検査します。ブラウザー検証はビルド後、`materials/`で `CHROME_PATH=/usr/bin/chromium node scripts/audio-browser-check.mjs` を実行します。機械的な再生検証と、人が聞いた際の自然さの評価は別です。短い比較版は本人が試聴して冥鳴ひまりを選択。5分全体の声質・発音とiPhone実機確認はフィードバック待ちです。

## 声の比較版

前回の声が高く鋭いという試聴結果に基づき、[比較版と再生成手順](COMPARISON.md)を追加。公開ページは `public/audio/comparison.html`。選択された冥鳴ひまり・ノーマルを5分版へ反映。

波音リツの旧5分版は `photo-studio-ritsu-5min.mp3` と `sample-ritsu.json` を保持。旧生成スクリプトは旧時刻情報・旧台本のみ更新する。今後の音声教材は冥鳴ひまり・ノーマルを基本にする。
