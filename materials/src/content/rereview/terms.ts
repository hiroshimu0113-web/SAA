import type { Term } from "../../types";
export const terms: Term[] = [
  {
    "id": "reserved-instances",
    "name": "Reserved Instances（RI）",
    "meaning": "適合するEC2使用量への期間契約の割引。リージョンとAZのスコープで容量予約の有無等が異なる。",
    "chapterId": "ch04"
  },
  {
    "id": "ec2-hibernation",
    "name": "EC2休止",
    "meaning": "対応条件下でRAMを暗号化EBSへ保存し、再開時に状態を戻す。停止中も保存費等は残る。",
    "chapterId": "ch04"
  },
  {
    "id": "ec2-stop",
    "name": "EC2停止",
    "meaning": "EBS-backedの実行を止める操作。通常停止はRAMを保持せず、EBS等の保持費は別。",
    "chapterId": "ch04"
  },
  {
    "id": "rcu",
    "name": "RCU",
    "meaning": "DynamoDBの読取り容量単位。単一項目は4KB単位のサイズと整合性等から計算する。",
    "chapterId": "ch06"
  },
  {
    "id": "wcu",
    "name": "WCU",
    "meaning": "DynamoDBの書込み容量単位。通常書込みは1KB単位へ切り上げ、トランザクションは2倍。",
    "chapterId": "ch06"
  },
  {
    "id": "cost-explorer",
    "name": "AWS Cost Explorer",
    "meaning": "費用・使用量の傾向と内訳を可視化して分析するサービス。",
    "chapterId": "ch12"
  },
  {
    "id": "budgets",
    "name": "AWS Budgets",
    "meaning": "実績や予測が予算条件へ達したことを通知する。支出の即時・絶対上限ではない。",
    "chapterId": "ch12"
  },
  {
    "id": "cur",
    "name": "Cost and Usage Report（CUR）",
    "meaning": "詳細な費用・使用量データをS3へ出力し、独自分析に使う。新規はData ExportsのCUR 2.0も比較。",
    "chapterId": "ch12"
  },
  {
    "id": "cost-allocation",
    "name": "コスト配分タグ",
    "meaning": "費用を部門等へ分けるために有効化するタグ。未設定・共有費の配賦規則も必要。",
    "chapterId": "ch12"
  },
  {
    "id": "gwlb",
    "name": "Gateway Load Balancer（GWLB）",
    "meaning": "仮想ファイアウォール等のアプライアンスへ通信を透過的に分配する負荷分散。",
    "chapterId": "ch04"
  },
  {
    "id": "requester-pays",
    "name": "Requester Pays",
    "meaning": "対応するS3要求・ダウンロード費を要求者が負担する設定。所有者の保存費は残る。",
    "chapterId": "ch05"
  },
  {
    "id": "throttling",
    "name": "スロットリング",
    "meaning": "レートやバーストに基づく流量制御。再試行と下流能力も合わせて設計する。",
    "chapterId": "ch07"
  }
];
