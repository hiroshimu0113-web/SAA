import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch04-l04",
    "title": "CPU・メモリ・I/Oから実行資源を選ぶ",
    "analogy": "速い作業員を増やしても机が狭ければ仕事は進みません。詰まる資源を測ります。",
    "explanation": "前提はスケールアップとスケールアウトです。到達目標は、測定したボトルネックと停止可否から資源を選ぶことです。CPUが継続して高い処理にはコンピューティング最適化、作業集合がメモリに収まらずスワップする処理にはメモリ最適化を比較します。汎用はバランス型で、ストレージ最適化はローカルI/O要件の候補です。ネットワーク・EBS帯域・CPUアーキテクチャ互換性も確認し、単に最大サイズを選びません。平均CPUが低くてもp95遅延やメモリ不足があれば縮小は早計です。\n\n台数で負荷を分けられる処理は、1台当たりリクエスト数など容量に応じて変化する指標をターゲット追跡に使います。朝の既知のピークは予定スケーリング、長い初期化はWarm Poolを比較します。AMIと起動テンプレートで再現性を持たせても、アプリの準備完了や依存先の容量確認は必要です。\n\nSavings Plansは割引であり指定AZの容量確保ではありません。容量保証が必要なら属性を一致させたCapacity Reservationを検討し、予約した未使用分の費用も含めます。クォータ引き上げだけでも実容量は確保されません。低遅延の密結合処理には同一AZのクラスタ配置、障害分離にはスプレッドやパーティション配置を要件で比較します。単一AZへの集約はAZ障害対策と交換条件になります。",
    "diagram": [
      "測定：CPU / メモリ / I/O / ネットワーク / p95",
      "→ ファミリーとサイズの候補 → 実負荷試験",
      "購入割引・容量確保・障害分離は別々に選択"
    ],
    "points": [
      "ボトルネックに合う資源と容量確保を説明できる。",
      "CPU平均値だけでサイズを決めない。",
      "確認：割引契約だけで指定AZへ必ず起動できる？ → できない。"
    ],
    "comparison": [
      {
        "name": "コンピューティング最適化",
        "use": "CPU中心の処理",
        "caution": "メモリ不足やDB待ちには別対策"
      },
      {
        "name": "メモリ最適化",
        "use": "大きい作業集合",
        "caution": "不要なメモリ確保は費用増"
      },
      {
        "name": "Capacity Reservation",
        "use": "特定AZの容量要件",
        "caution": "割引とは別で未使用容量にも費用"
      }
    ],
    "conceptIds": [
      "instance-family",
      "capacity-reservation",
      "placement-group",
      "target-tracking",
      "scheduled-scaling",
      "warm-pool",
      "ami"
    ],
    "sources": [
      {
        "title": "資源特性によるEC2ファミリー選択",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約と割引方式の違い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "負荷と台数に対応するターゲット追跡指標",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html",
        "checked": "2026-10-08"
      },
      {
        "title": "クラスタ・パーティション・スプレッド配置",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr04-01",
    "chapterId": "ch04",
    "domain": 3,
    "conceptIds": [
      "instance-family"
    ],
    "prompt": "夜間集計は分割できず、CPU使用率30%、メモリ不足で大量のスワップが発生する。処理は中断不可で期限も厳しい。最初に比較すべき構成はどれか。",
    "options": [
      {
        "id": "a",
        "text": "作業集合が収まるメモリ最適化のオンデマンドEC2で実測する",
        "explanation": "メモリ不足へ対処しSpot中断を避けて処理時間を評価する。"
      },
      {
        "id": "b",
        "text": "同じメモリ容量のコンピューティング最適化Spotへ移す",
        "explanation": "メモリ不足を解消せず中断不可にも反する。"
      },
      {
        "id": "c",
        "text": "同じインスタンスを複数台へ増やすだけにする",
        "explanation": "分割不可の処理では単一ジョブのメモリ不足は残る。"
      },
      {
        "id": "d",
        "text": "CPUが低いのでインスタンスをさらに縮小する",
        "explanation": "メモリ不足と遅延を悪化させる可能性がある。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "メモリ不足へ対処しSpot中断を避けて処理時間を評価する。 条件変更：CPUが飽和しメモリに余裕があればコンピューティング最適化を比較する。",
    "sources": [
      {
        "title": "資源特性によるEC2ファミリー選択",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約と割引方式の違い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "負荷と台数に対応するターゲット追跡指標",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html",
        "checked": "2026-10-08"
      },
      {
        "title": "クラスタ・パーティション・スプレッド配置",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "rr04-02",
    "chapterId": "ch04",
    "domain": 2,
    "conceptIds": [
      "capacity-reservation"
    ],
    "prompt": "来月のイベントで指定AZのEC2台数を確保したい。起動する種類とOSは決まっている。準備として適切なものを2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "対象属性と期間を満たすCapacity Reservationを確保する",
        "explanation": "予約された属性の計算容量を準備する手段になる。"
      },
      {
        "id": "b",
        "text": "必要なvCPU等のクォータを事前確認する",
        "explanation": "容量予約とアカウント上限の両方を満たす必要がある。"
      },
      {
        "id": "c",
        "text": "Savings Plansの購入だけで容量確保完了とする",
        "explanation": "利用料金の割引は容量の確保と同じではない。"
      },
      {
        "id": "d",
        "text": "起動テンプレートだけ作れば必ず起動できると考える",
        "explanation": "起動設定の保存だけでは容量や上限を確保しない。"
      },
      {
        "id": "e",
        "text": "Spotの再試行だけで開始時刻を保証する",
        "explanation": "Spotの空き容量と起動時刻は保証されない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "予約された属性の計算容量を準備する手段になる。 容量予約とアカウント上限の両方を満たす必要がある。 条件変更：AZも種類も柔軟なら複数候補で容量不足の影響を減らせる。",
    "sources": [
      {
        "title": "資源特性によるEC2ファミリー選択",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約と割引方式の違い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "負荷と台数に対応するターゲット追跡指標",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html",
        "checked": "2026-10-08"
      },
      {
        "title": "クラスタ・パーティション・スプレッド配置",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
