# 声質の比較 A-P2

ユーザーから前回のMei音声が「キンキンして集中できない」との評価。紹介記事（https://note.com/aivis_project/n/n20fcfb6d9785 ）を実際に取得し、ローカルで無料利用できるAivisSpeech／VOICEVOXを試した。有料API・課金登録は使用していない。

## 提供物

`public/audio/comparison.html` に青山龍星ノーマル、青山龍星しっとり、波音リツノーマル、従来Meiの4種類。既存台本の「EC2は作業場」を共通で使用。約29〜33秒、MP3 44.1kHz・モノラル・128kbps。新音声はspeedScale 0.95、intonationScale 0.9、pitchScale 0。音量のみ2パスloudnormで調整。既存5分版は声を選ぶまで保持。

音量の実測：-18.55〜-18.46 LUFS、ピーク-2.54〜-2.32 dBTP。MP3全体デコード成功。内容は既存の確認済み台本を再利用。声質・発音全体の聴取評価は本人待ち。実在人物の声を模倣する依頼や音声クローンは行っていない。

利用条件は [VOICEVOX_LICENSE.md](VOICEVOX_LICENSE.md)。エンジン同梱条件を確認しクレジットを公開ページに記載。モデル本体はリポジトリへ追加しない。詳細規約サイトへの接続は未解決で、許可先の設定案に追加済み。

## 導入で確認したこと

- AivisSpeech Engine 1.2.0のLinux配布物（340,613,180 bytes）を公式GitHub Releaseから取得し、公開SHA256 `a4b1cc790e9a1522d880e063d788ea2c33df909e88e764d8ae5a17e3597b15b5` に一致。実行・help成功。初期モデル取得の `api.aivis-project.com` がProxyError 403で起動完了せず、音声生成未実施。
- VOICEVOX Engine 0.25.2のLinux CPU版を公式GitHub Releaseから取得し、公開SHA256 `bab016a966131b89bad398e7b898f8c742617dc80a7da49bf494cd07133dbc7a` に一致。起動、speakers、audio_query、synthesis成功。3声の合成時間はそれぞれ約12秒。
- 両エンジンのDocker版はDocker側の保存領域不足でpull失敗。通常のLinux配布版に切り替えた。
- 記事内の他の5サービスは未実試験。クラウド無料枠を完全無料・無制限と扱わない。

## この環境での再生成

Python標準ライブラリとffmpegが必要。CPUエンジンはリポジトリ外の `/workspace/.tools/voicevox-engine/linux-cpu-x64/` に検証済みで展開済み。新環境へは公式Release 0.25.2の `voicevox_engine-linux-cpu-x64-0.25.2.7z.001` を取得し、上記SHA256確認後に7z対応ツールで展開する。モデルの再配布条件は別途守る。

```sh
XDG_DATA_HOME=/workspace/.cache/voicevox XDG_CACHE_HOME=/workspace/.cache /workspace/.tools/voicevox-engine/linux-cpu-x64/run --host 127.0.0.1 --port 50021 --cpu_num_threads 4
```

別のターミナルで、materials/から：

```sh
python scripts/synthesize-voice-comparison.py --output-dir /tmp/saa-voice-comparison
python scripts/package-voice-comparison.py --wav-dir /tmp/saa-voice-comparison
pnpm build
CHROME_PATH=/usr/bin/chromium node scripts/voice-comparison-browser-check.mjs
```

APIはローカル専用。公開ページは生成済みMP3を配信するため、利用者がエンジンを起動する必要はない。合成時のクエリはaudio/*.query.json、成果物の長さ・SHA256はpublic/audio/comparison.json。

## 次の作業

本人に比較ページの番号を選んでもらい、選択した声で5分版を制作。AivisSpeechも比較したい場合は、クラウド環境のネットワーク設定案を確認・保存・公開した後、モデル取得を再確認する。設定案の保存だけで接続可能・環境公開済みとは扱わない。
