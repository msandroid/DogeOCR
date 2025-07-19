# 年齢確認機能

## 概要

Doge OCRのID verify機能に年齢確認機能を追加しました。この機能により、身分証明書から抽出された生年月日を基に、ユーザーが18歳以上の成人かどうかを自動判定します。

## 機能仕様

### 年齢計算ロジック

- **実年齢計算式**: 実年齢 = 現在時刻 - 生年月日
- **成人判定**: 実年齢 > 18年と1日
- **未成年判定**: 実年齢 < 18年と1日

### 対応日付形式

以下の日付形式に対応しています：

1. `YYYY-MM-DD` (例: 1990-01-01)
2. `YYYY/MM/DD` (例: 1990/01/01)
3. `YYYY年MM月DD日` (例: 1990年1月1日)
4. `MM/DD/YYYY` (例: 01/01/1990)
5. `MM-DD-YYYY` (例: 01-01-1990)

### API仕様

#### リクエスト

```json
{
  "documentImage": "data:image/jpeg;base64,...",
  "selfieImage": "data:image/jpeg;base64,...",
  "userInfo": {
    "birthDate": "1990-01-01" // オプション
  }
}
```

#### レスポンス

```json
{
  "success": true,
  "data": {
    "documentType": "運転免許証",
    "documentOcr": {
      "name": "山田 太郎",
      "birthDate": "1990-01-01",
      "address": "東京都新宿区...",
      "expirationDate": "2025-01-01",
      "documentNumber": "123456789012",
      "issuingAuthority": "警視庁"
    },
    "ageVerification": {
      "isAdult": true,
      "age": 34,
      "birthDate": "1990-01-01",
      "verificationDate": "2024-01-15",
      "daysUntil18": 0,
      "reason": "18歳以上の成人です"
    },
    "faceMatchScore": 0.95,
    "faceMatchResult": "PASS",
    "documentAuthenticity": "VALID",
    "finalJudgement": "APPROVED",
    "reviewType": "AUTO",
    "processingTime": 2500,
    "confidence": 0.92,
    "sessionId": "session_1705123456789_abc123def",
    "timestamp": "2024-01-15T10:30:45.123Z"
  }
}
```

### 年齢確認結果の詳細

| フィールド | 型 | 説明 |
|-----------|----|------|
| `isAdult` | boolean | 18歳以上かどうか |
| `age` | number | 計算された年齢 |
| `birthDate` | string | 生年月日 |
| `verificationDate` | string | 確認日 |
| `daysUntil18` | number | 18歳になるまでの日数（未成年の場合） |
| `reason` | string | 年齢確認の理由 |

## 実装詳細

### 年齢計算ユーティリティ

`lib/age-verification.ts`に以下の関数を実装：

- `verifyAge(birthDateString)`: 基本的な年齢確認
- `verifyAgeFlexible(birthDateInput)`: 複数日付形式対応
- `verifyAgeFromOCR(ocrData)`: OCR結果からの年齢確認
- `formatAgeVerificationResult(result)`: 結果のフォーマット

### 最終判定ロジック

未成年の場合は自動的に`REJECTED`判定となります：

```typescript
// 未成年の場合は自動的にREJECTED
if (!isAdult) {
  finalJudgement = {
    judgement: "REJECTED",
    reviewType: "AUTO",
    reason: `未成年のため認証を拒否しました。年齢: ${age}歳`
  }
}
```

## フロントエンド表示

### 年齢確認表示コンポーネント

`components/age-verification-display.tsx`で年齢確認結果を表示：

- 成人/未成年の判定表示
- 年齢、生年月日、確認日の表示
- 未成年の場合の注意メッセージ
- 18歳になるまでの日数表示

### デモページでの表示

ID verifyデモページ（`/demo/id-verify`）で年齢確認結果を確認できます。

## テスト

### テストスクリプト

`scripts/test-age-verification.js`で年齢確認機能をテスト：

```bash
node scripts/test-age-verification.js
```

### テストケース

1. **18歳以上の成人**: 正常に成人判定
2. **18歳ちょうど**: 誕生日当日の判定
3. **17歳の未成年**: 未成年判定
4. **18歳になる前日**: 未成年判定
5. **様々な日付形式**: 複数形式の対応確認
6. **無効な日付形式**: エラーハンドリング

## セキュリティ考慮事項

1. **年齢計算の精度**: うるう年や誕生日の正確な計算
2. **日付形式の検証**: 無効な日付形式の適切な処理
3. **未成年保護**: 未成年の自動拒否機能
4. **データ保護**: 生年月日情報の適切な管理

## 今後の拡張予定

1. **国際対応**: 各国の成人年齢に対応
2. **年齢制限のカスタマイズ**: 設定可能な年齢制限
3. **詳細な年齢情報**: 月齢、日齢の表示
4. **履歴管理**: 年齢確認履歴の保存

## トラブルシューティング

### よくある問題

1. **年齢が正しく計算されない**
   - 生年月日の形式を確認
   - 日付の妥当性をチェック

2. **未成年なのに成人判定される**
   - 現在日付の設定を確認
   - 年齢計算ロジックを検証

3. **無効な日付形式エラー**
   - 対応形式を確認
   - 日付の正規化処理を確認

### デバッグ方法

```typescript
// 年齢確認のデバッグ
import { verifyAgeFlexible } from '@/lib/age-verification'

const result = verifyAgeFlexible("1990-01-01")
console.log(result)
``` 