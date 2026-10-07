import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch01-l04",
    "title": "配置・切替・データ・残存容量を別々に確認する",
    "analogy": "別店舗があっても、在庫と店員の余力がなければ全注文は引き継げません。",
    "explanation": "前提はリージョンとAZの違いです。到達目標は、複数AZという名前だけで判断せず、故障後の処理経路を追えることです。Web層を2AZに置いても、セッションが停止した1台にしかなければ処理は続きません。データ層の切替、再接続、残った台数の処理能力まで確認します。\n\n学習用の仮定として、負荷900件/秒、1台の上限300件/秒、各AZ2台なら、通常は合計1200件/秒でも片側停止後は600件/秒で不足します。2AZ構成で片側喪失直後にも900件/秒を処理するなら各AZ3台が必要です。実測で余裕を決める必要があり、これはEC2の性能保証ではありません。障害後の新規起動だけに依存すると起動時間や容量不足が復旧を遅らせます。\n\nALBは正常な登録先へ振り分けますが、全登録先が異常になるとfail-openで異常先にも送ります。ヘルスチェックだけでデータを復元したりサーバーを増やしたりはできません。机上演習：AZ-Aを図から消し、入口→AZ-B→データの各矢印と容量を確認してください。",
    "diagram": [
      "ALB → AZ-A: 3台 / AZ-B: 3台",
      "AZ-A停止 → AZ-Bの900件/秒を利用",
      "両系から利用できるセッション・データ → 再接続"
    ],
    "points": [
      "故障後に残る容量と依存データを計算できる。",
      "2AZ配置だけでは継続性を保証しない。",
      "確認：各AZ2台なら900件/秒を維持できる？ → 600件/秒で不足。"
    ],
    "comparison": [
      {
        "name": "事前容量確保",
        "use": "切替直後の負荷に耐える",
        "caution": "平常時の費用が増える"
      },
      {
        "name": "障害後に増設",
        "use": "平常時の台数を減らす",
        "caution": "起動時間と確保可能性に依存する"
      }
    ],
    "conceptIds": [
      "az",
      "availability",
      "residual-capacity",
      "alb"
    ],
    "sources": [
      {
        "title": "障害後も新規起動に依存しない残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ALBの正常ターゲット選択と全異常時のfail-open",
        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr01-01",
    "chapterId": "ch01",
    "domain": 2,
    "conceptIds": [
      "residual-capacity"
    ],
    "prompt": "学習用の仮定：各AZに毎秒300件処理できるサーバーが2台ずつある。通常負荷は毎秒900件。片側AZ停止直後も同じ負荷を処理する最小の事前配置はどれか。",
    "options": [
      {
        "id": "a",
        "text": "各AZに3台ずつ置く",
        "explanation": "残る1AZだけで3×300=900件/秒を処理できる。"
      },
      {
        "id": "b",
        "text": "各AZに2台ずつ置く",
        "explanation": "平常時は足りるが障害後は600件/秒となる。"
      },
      {
        "id": "c",
        "text": "片側に4台、もう片側に2台置く",
        "explanation": "4台の側が停止すると600件/秒しか残らない。"
      },
      {
        "id": "d",
        "text": "各AZに1台置き障害後に増やす",
        "explanation": "起動完了前の容量を満たさず直後の条件に違反する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "残る1AZだけで3×300=900件/秒を処理できる。 条件変更：負荷600件/秒なら各AZ2台で計算上満たす。",
    "sources": [
      {
        "title": "障害後も新規起動に依存しない残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ALBの正常ターゲット選択と全異常時のfail-open",
        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "rr01-02",
    "chapterId": "ch01",
    "domain": 2,
    "conceptIds": [
      "availability"
    ],
    "prompt": "2AZのWeb構成でAZ障害後もログイン済みの注文処理を続けたい。残存Web容量とDBの切替は検証済み。追加で確認すべき設計を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "正常なWeb先へ入口が切り替わる",
        "explanation": "正常先へ到達できなければ残存容量を利用できない。"
      },
      {
        "id": "b",
        "text": "セッションを残存側から取得できる",
        "explanation": "停止したWebのローカル状態だけに依存させない。"
      },
      {
        "id": "c",
        "text": "全Webを同一AZに集約する",
        "explanation": "同じ障害範囲へ集約すると要件を損なう。"
      },
      {
        "id": "d",
        "text": "ヘルスチェックでDBの履歴も復元する",
        "explanation": "ヘルスチェックは履歴復元の仕組みではない。"
      },
      {
        "id": "e",
        "text": "停止側のローカルメモリだけを正本にする",
        "explanation": "停止した側の状態にアクセスできなくなる。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "正常先へ到達できなければ残存容量を利用できない。 停止したWebのローカル状態だけに依存させない。 条件変更：ログイン状態を持たない読み取り処理ならセッション共有の必要は減る。",
    "sources": [
      {
        "title": "障害後も新規起動に依存しない残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ALBの正常ターゲット選択と全異常時のfail-open",
        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
