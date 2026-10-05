# 5分音声サンプル：写真工房

初学者向けにEC2・S3・IAMロールを説明する、BGMなしの合成音声です。30分版の制作前に、声・テンポ・説明量を確認するための試作です。

- 公開プレーヤー：`public/audio/index.html`。台本、10個のチャプター、再生速度、MP3保存リンク付き。
- 音声：`public/audio/photo-studio-5min.mp3`（約5分、44.1kHz、モノラル、96kbps）。
- 台本：[TRANSCRIPT.md](TRANSCRIPT.md)。編集元は `sample-01.json`。
- 時刻・生成情報：`public/audio/sample-01.json`。
- 声：HTS Voice “Mei” / MMDAgent Project Team、名古屋工業大学。CC BY 3.0。[音声モデルのライセンス](VOICE_LICENSE.txt)。pyopenjtalkで合成し、テンポ・音量を調整。実在人物の録音ではありません。

## 構成

工房の条件 → EC2 → S3 → IAMロール → 最小権限 → 確認問題2問 → まとめ。各問題の後に7秒の間を設けます。英略語は合成時に読みを指定しています（EC2＝イーシーツー、S3＝エススリー、IAM＝アイアム）。

## 無料で再生成する

このサンプルは有料APIを使わず、ローカルのCPUで生成しています。アプリのNode依存とは分離します。Python 3.12、GCC/G++、ffmpeg、uvがある環境で、リポジトリルートから以下を実行します。

```sh
UV_CACHE_DIR=/workspace/.cache/uv uv venv /workspace/.tools/saa-audio-venv
CC=gcc CXX=g++ UV_CACHE_DIR=/workspace/.cache/uv uv pip install --python /workspace/.tools/saa-audio-venv/bin/python -r materials/audio/requirements.txt
/workspace/.tools/saa-audio-venv/bin/python materials/scripts/generate-audio.py
python materials/scripts/render-audio-page.py
```

初回はOpen JTalk辞書を公式配布先GitHubから取得します。pyopenjtalk 0.4.1に含まれるMei音声を使用。追加のサーバー・APIキー・有料契約は不要です。生成は上記音声ファイル、時刻情報、台本を更新し、ページ描画がHTMLを更新します。5分に収めるための速度調整が0.80〜1.25倍を外れる場合は停止し、台本の長さを直します。

## 根拠と確認

2026-10-05に無料のAWS公式資料を確認しています。

- [EC2でIAMロールを使用する](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)：EC2へ割り当てるロールと一時認証情報。
- [インスタンスストア](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html)：一時的な保存領域。
- [インスタンスストアの永続性](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html)：停止・終了時のデータ喪失。
- [S3の概要](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)：バケット、オブジェクト、アクセス管理、バージョニング。

独自教材であり、AWS公式問題ではありません。「EC2のディスクは全て終了時に消える」「ロールを付ければ何でも許可される」「S3なら誤削除も防げる」という誤解を避けた説明にしています。

## 検証

生成スクリプトは音声の非無音・有限値と295〜305秒の長さを確認します。`ffprobe`でMP3形式・長さ、ffmpegでデコード・音量を検査します。ブラウザー検証はビルド後、`materials/`で `CHROME_PATH=/usr/bin/chromium node scripts/audio-browser-check.mjs` を実行します。機械的な再生検証と、人が聞いた際の自然さの評価は別です。声質・発音全体の聴取評価とiPhone実機確認はユーザーフィードバック待ちです。

## 声の比較版

前回の声が高く鋭いという試聴結果に基づき、[比較版と再生成手順](COMPARISON.md)を追加。公開ページは `public/audio/comparison.html`。声の選択後に5分版へ反映する。
