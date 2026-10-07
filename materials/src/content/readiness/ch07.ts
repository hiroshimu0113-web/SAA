import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch07-l04",
    "title": "配信・拠点接続を遅延と総費用で比較する",
    "analogy": "近所の配布所に在庫を置く方法と、専用道路で本店へ運ぶ方法を使い分けます。",
    "explanation": "前提はDNSによる名前解決と、実際にデータが通る経路の違いです。到達目標は転送するデータと通信要件で接続方式を選ぶことです。HTTPの共通画像を世界へ配るならCloudFrontのキャッシュを比較します。TTLを長くすればオリジンへの要求が減りますが、更新直後の鮮度と両立するため版付きURLや失効方針を決めます。個人別応答ではキャッシュキーと認証情報を設計し、他人の応答を共有しません。Global Acceleratorは固定IPとAWSネットワーク経由の到達先選択を提供し、TCP/UDPの用途でも候補ですが、画像のエッジキャッシュそのものではありません。\n\nオンプレミスとの接続では、短期導入やバックアップにSite-to-Site VPN、安定した専用接続にはDirect Connectを比較します。Direct Connectは既定で暗号化されず、要件に応じTLS、VPNの併用、対応接続のMACsec等を設計します。専用線1本を作るだけでは拠点・装置・回線の単一障害点が残ります。主系10Gbpsに対し代替系が1Gbpsなら切替成功だけではピーク負荷を処理できません。\n\n費用はポート時間、回線事業者費、VPN、転送GB、AZ/リージョン間経路、CDN要求と配信を分けて比較します。キャッシュヒット率はオリジン側の量を変えますが利用者への配信量をゼロにしません。単価を固定せず、同一期間・同一データ量と可用性で比較します。",
    "diagram": [
      "利用者 → CloudFrontキャッシュ → ミス時だけオリジン",
      "TCP/UDP利用者 → Global Accelerator → 正常な接続先",
      "拠点 → 冗長接続 → AWS：暗号化と代替帯域を確認"
    ],
    "points": [
      "鮮度・帯域・暗号化・障害範囲で接続方式を比較できる。",
      "専用接続は暗号化や無停止を自動保証しない。",
      "確認：主系の必要帯域4Gbpsを1Gbpsの予備へ切り替えると？ → 容量不足。"
    ],
    "comparison": [
      {
        "name": "CloudFront",
        "use": "HTTPコンテンツの配信・キャッシュ",
        "caution": "鮮度とキャッシュキーを設計"
      },
      {
        "name": "Global Accelerator",
        "use": "固定IPとTCP/UDP経路の改善",
        "caution": "オブジェクトキャッシュではない"
      },
      {
        "name": "Direct Connect + VPN等",
        "use": "専用接続と暗号化要件",
        "caution": "多経路と代替帯域・費用を確認"
      }
    ],
    "conceptIds": [
      "direct-connect",
      "site-to-site-vpn",
      "cloudfront",
      "global-accelerator",
      "hybrid-network"
    ],
    "sources": [
      {
        "title": "Direct Connectの既定は通信暗号化なし",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Direct Connectの冗長経路設計",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudFront TTLとオリジン負荷",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Global Acceleratorの固定IPと正常な到達先",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr07-01",
    "chapterId": "ch07",
    "domain": 3,
    "conceptIds": [
      "hybrid-network"
    ],
    "prompt": "拠点からAWSへ機密データを常時送る。専用接続、通信暗号化、回線故障時の継続を求める。妥当な確認を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "Direct Connectとは別にTLSやVPN等の暗号化方式を設計",
        "explanation": "Direct Connectは既定では通信を暗号化しない。"
      },
      {
        "id": "b",
        "text": "冗長な接続と切替後の必要帯域を検証する",
        "explanation": "経路が残っても容量不足では処理を維持できない。"
      },
      {
        "id": "c",
        "text": "Direct Connectを1本作れば暗号化と冗長性が完了する",
        "explanation": "専用接続の採用だけでは両要件を満たさない。"
      },
      {
        "id": "d",
        "text": "予備回線は帯域に関係なく常に同じ性能になる",
        "explanation": "代替経路の容量が小さければボトルネックとなる。"
      },
      {
        "id": "e",
        "text": "Route 53でデータ全体を暗号化する",
        "explanation": "名前解決は通信データの暗号化の代わりではない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "Direct Connectは既定では通信を暗号化しない。 経路が残っても容量不足では処理を維持できない。 条件変更：専用接続が不要で早期導入重視ならVPN単独も比較する。",
    "sources": [
      {
        "title": "Direct Connectの既定は通信暗号化なし",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Direct Connectの冗長経路設計",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "rr07-02",
    "chapterId": "ch07",
    "domain": 4,
    "conceptIds": [
      "cloudfront"
    ],
    "prompt": "世界中へ同じ版付き商品画像をHTTP配信する。更新は新URLで行い、同一URLの内容は変えない。オリジンへの転送と要求を減らす構成はどれか。",
    "options": [
      {
        "id": "a",
        "text": "CloudFrontで適切なTTLを設定し版付きURLをキャッシュ",
        "explanation": "同じ画像の再取得をエッジから提供してオリジン要求を減らす。"
      },
      {
        "id": "b",
        "text": "Global Acceleratorだけで画像オブジェクトを保存する",
        "explanation": "経路最適化は画像キャッシュではない。"
      },
      {
        "id": "c",
        "text": "Route 53のTTLだけで画像本体をキャッシュする",
        "explanation": "DNSキャッシュはコンテンツ本体を保存しない。"
      },
      {
        "id": "d",
        "text": "すべての画像でキャッシュを無効にし毎回オリジンへ送る",
        "explanation": "要求削減という目的と逆になる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "同じ画像の再取得をエッジから提供してオリジン要求を減らす。 条件変更：同じURLで頻繁に内容を変えるなら鮮度・失効方針を再設計する。",
    "sources": [
      {
        "title": "CloudFront TTLとオリジン負荷",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Global Acceleratorの固定IPと正常な到達先",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
