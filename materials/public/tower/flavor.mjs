export const FLAVOR={
  "strike": {
    "flavor": "大きな混乱も、ひとつずつ切り分ければ輪郭が見える。",
    "note": "指標を他の情報と照合し、問題の箇所を絞り込みます。",
    "limit": "切り分けそのものが障害を修復するとは限りません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html"
  },
  "guard": {
    "flavor": "直すまでの時間を、守りでつくる。",
    "note": "運用上の対応は、利用者や事業への影響を基準に優先します。",
    "limit": "防壁は特定のAWSサービス名ではなく、ブロックは架空の防御値です。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html"
  },
  "probe": {
    "flavor": "見えない敵には、まず灯りを。",
    "note": "データを集めるだけでなく、基準値や変化を読み取ることが重要です。",
    "limit": "監視を置くだけで障害が解消するわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html"
  },
  "burst": {
    "flavor": "力を注ぐ場所は、確かめてから決める。",
    "note": "ワークロードの要件に合わせ、資源の種類や大きさを選びます。",
    "limit": "集中処理の攻撃値は、特定インスタンスの処理性能ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "parallel": {
    "flavor": "一つの肩に、すべてを背負わせない。",
    "note": "複数の小さな資源へ処理を分散し、共通の障害点を避ける考え方があります。",
    "limit": "2回攻撃はゲーム上の表現で、性能が必ず2倍になる意味ではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "retry": {
    "flavor": "もう一度。ただし、同じ失敗を重ねるためではない。",
    "note": "このカードは0エナジーで攻撃できます。",
    "limit": "実際の再試行が無料・無制限・常に安全という意味ではありません。",
    "source": null
  },
  "reserve": {
    "flavor": "余白は、何も起きない日のためだけにあるのではない。",
    "note": "需要と使用量を監視し、必要な容量を考えます。",
    "limit": "予備容量の確保だけで、すべての障害に耐えられるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "restore": {
    "flavor": "帰り道は、出発する前に確かめておく。",
    "note": "復旧手順は、障害を想定して実際に試験します。",
    "limit": "HP回復量は現実の復旧時間やデータ復元量を表しません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "foresight": {
    "flavor": "いつもとの違いが、次の一手を教えてくれる。",
    "note": "平常時の指標を基準に、変化を捉えます。",
    "limit": "ドローは情報を得る比喩で、将来の障害を確実に予言する機能ではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html"
  },
  "isolate": {
    "flavor": "すべてを守るために、境界を引く。",
    "note": "共通の障害点を避け、単一障害の影響を小さくする設計を考えます。",
    "limit": "弱体のターン数は現実の障害隔離時間ではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "detour": {
    "flavor": "道が塞がれても、旅まで終わらせない。",
    "note": "障害を回避・修復する復旧の手順を設計し、試験します。",
    "limit": "カードを使うだけで現実の代替経路が自動的に用意されるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "analysis": {
    "flavor": "記録は、過去から届く手掛かり。",
    "note": "ログや指標を調査と原因分析に利用します。",
    "limit": "ログがあるだけで原因を断定できるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html"
  },
  "overload": {
    "flavor": "限界を知るなら、限界の向こうを覗く覚悟も。",
    "note": "性能試験で基準を作り、負荷をかけたときの指標を確認します。",
    "limit": "自傷3は架空の代償で、本番環境へ無計画に負荷をかける推奨ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "redundant": {
    "flavor": "一本が折れても、支える手を残しておく。",
    "note": "資源を複数に分ける際は、共通の障害点も確認します。",
    "limit": "毎ターン防御は比喩です。複製するだけで可用性が保証されるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "optimize": {
    "flavor": "足す前に、流れを見直す。",
    "note": "指標を観察し、ワークロードに合う改善を選びます。",
    "limit": "強化値は実際の性能改善率ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "cache": {
    "flavor": "同じ仕事を、何度も最初からやり直さなくていい。",
    "note": "キャッシュの効果や性能を監視し、使い方を見直します。",
    "limit": "エナジー回復はゲーム上の報酬で、キャッシュが無条件に有効という意味ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "patch": {
    "flavor": "小さな手当てにも、確かな手順を。",
    "note": "インフラの変更は自動化し、その変更自体も追跡・レビューします。",
    "limit": "緊急パッチのブロック値は、脆弱性の解消度を表しません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "balance": {
    "flavor": "流れを分ければ、支え方も変わる。",
    "note": "リクエストを複数の資源へ分散する考え方です。",
    "limit": "攻撃と防御を同時に得るのはゲーム固有の効果です。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "reversal": {
    "flavor": "積み上げた備えが、次の一手になる。",
    "note": "このカードは、使用時のブロックを攻撃に加えます。",
    "limit": "防御を攻撃へ変える計算はゲーム固有で、AWSの機能ではありません。",
    "source": null
  },
  "quarantine": {
    "flavor": "連鎖する前に、その一歩を止める。",
    "note": "一つの障害が全体へ与える影響を小さくすることを考えます。",
    "limit": "弱体化は比喩で、具体的な隔離設定を代わりに実施するものではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  }
};
