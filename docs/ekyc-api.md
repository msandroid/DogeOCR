# Doge eKYC API ドキュメント

## 概要

Doge eKYCは、日本の犯罪収益移転防止法に準拠した包括的電子本人確認システムです。8段階の認証フローにより、高精度で安全な本人確認を提供します。

## 特徴

- **8段階認証フロー**: 包括的で詳細な認証プロセス
- **eKYCホ方式**: 身分証明書画像 + セルフィーによる本人確認
- **犯罪収益移転防止法準拠**: 日本の法令要件に完全対応
- **AI駆動**: Fireworks.ai（OCR）+ DeepFace（顔認証）の組み合わせ
- **包括的セキュリティ**: 真贋判定、顔認証、OCRを統合
- **リアルタイム処理**: 数秒での認証完了
- **高精度顔認証**: Fireworks.ai APIによる専門的な顔照合
- **年齢確認機能**: 実年齢計算による成年判定

## 8段階認証フロー

### 1. カメラ起動・身分証撮影
- カメラ撮影し画像を保存
- ガイドライン表示で適切な撮影をサポート
- 運転免許証、マイナンバーカード、パスポート等に対応

### 2. OCR処理（Fireworks.ai）
- 身分証画像をBase64エンコードしてFireworks.aiに送信
- Llava4 maverickーinstructモデルで統合OCR+LLM処理
- 氏名、生年月日、住所、身分証番号等を構造化データとして抽出

### 3. セルフィー撮影
- 顔認識ガイド表示
- 生体検知（リアルタイム撮影確認）
- 自動品質チェック

### 4. 顔認証処理
- 身分証の顔写真とセルフィーを照合
- 同一人物判定（高精度マッチング）
- 偽造・なりすまし検出
- Deepfaceによる高精度顔認証

### 5. 年齢確認
- 実年齢 = 現在時刻 - 生年月日
- 成年判定 = 実年齢 > 18年と1日
- 年齢制限の動的設定対応

### 6. セキュリティ処理
- TLS暗号化通信
- 画像即座削除（処理後）
- 認証トークンによる安全なAPI呼び出し
- データ最小化（年齢確認に必要な情報のみ）

### 7. 総合判定
- OCR信頼度スコア（99%以上）
- 顔認証マッチスコア
- 年齢確認結果
- 最終判定: PASS / FAIL / RETRY

### 8. 結果表示
- 成功/失敗の明確な表示
- 年齢確認結果
- 詳細な認証結果レポート

## API エンドポイント

### POST /api/id-verify

身分証明書とセルフィーによるeKYC本人確認を実行します。

#### リクエスト

**Content-Type**: `application/json`

**リクエストボディ**:

```json
{
  "documentImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  "selfieImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  "userInfo": {
    "name": "山田 太郎",
    "birthDate": "1990-01-01",
    "address": "東京都新宿区西新宿2-8-1"
  },
  "sessionId": "session_1234567890"
}
```

**パラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|----|------|------|
| `documentImage` | string | ✅ | 身分証明書のBase64エンコードされた画像データ（4MB以下） |
| `selfieImage` | string | ✅ | セルフィーのBase64エンコードされた画像データ（4MB以下） |
| `userInfo` | object | ❌ | 申請者の基本情報 |
| `userInfo.name` | string | ❌ | 申請者の氏名 |
| `userInfo.birthDate` | string | ❌ | 生年月日（YYYY-MM-DD形式） |
| `userInfo.address` | string | ❌ | 住所 |
| `sessionId` | string | ❌ | セッションID（自動生成される場合は省略可能） |

#### レスポンス

**成功時（200）**:

```json
{
  "success": true,
  "data": {
    "documentType": "運転免許証",
    "documentOcr": {
      "name": "山田 太郎",
      "birthDate": "1990-01-01",
      "address": "東京都新宿区西新宿2-8-1",
      "expirationDate": "2030-12-31",
      "documentNumber": "123456789012",
      "issuingAuthority": "警視庁"
    },
    "faceMatchScore": 0.92,
    "faceMatchResult": "PASS",
    "faceMatchNotes": "同一人物と判定",
    "faceQuality": {
      "brightness": 0.85,
      "blur": 0.12,
      "angle": 0.05,
      "occlusion": 0.02
    },
    "documentAuthenticity": "VALID",
    "ageVerification": {
      "isAdult": true,
      "age": 34,
      "birthDate": "1990-01-01",
      "verificationDate": "2024-01-15",
      "daysUntil18": -5840,
      "reason": "成年者として認証"
    },
    "finalJudgement": "APPROVED",
    "reviewType": "AUTO",
    "reason": "すべての認証項目を満たしています",
    "processingTime": 2450,
    "confidence": 0.89,
    "sessionId": "session_1234567890",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**エラー時（400/401/500）**:

```json
{
  "success": false,
  "error": "エラーメッセージ",
  "errorCode": "ERROR_CODE",
  "processingTime": 1200
}
```

#### レスポンスフィールド

| フィールド | 型 | 説明 |
|-----------|----|------|
| `documentType` | string | 文書種別（運転免許証、マイナンバーカード等） |
| `documentOcr` | object | OCRで抽出された文書情報 |
| `documentOcr.name` | string | 氏名 |
| `documentOcr.birthDate` | string | 生年月日（YYYY-MM-DD形式） |
| `documentOcr.address` | string | 住所 |
| `documentOcr.expirationDate` | string | 有効期限 |
| `documentOcr.documentNumber` | string | 身分証番号 |
| `documentOcr.issuingAuthority` | string | 発行機関 |
| `faceMatchScore` | number | 顔照合スコア（0-1） |
| `faceMatchResult` | string | 顔照合結果（PASS/FAIL/REVIEW） |
| `faceMatchNotes` | string | 顔照合の詳細説明 |
| `faceQuality` | object | 顔画像品質情報 |
| `faceQuality.brightness` | number | 明度スコア（0-1） |
| `faceQuality.blur` | number | ぼかしスコア（0-1） |
| `faceQuality.angle` | number | 角度スコア（0-1） |
| `faceQuality.occlusion` | number | 遮蔽スコア（0-1） |
| `documentAuthenticity` | string | 文書真贋判定（VALID/INVALID/SUSPICIOUS） |
| `ageVerification` | object | 年齢確認結果 |
| `ageVerification.isAdult` | boolean | 18歳以上かどうか |
| `ageVerification.age` | number | 計算された年齢 |
| `ageVerification.birthDate` | string | 生年月日 |
| `ageVerification.verificationDate` | string | 確認日 |
| `ageVerification.daysUntil18` | number | 18歳になるまでの日数 |
| `ageVerification.reason` | string | 年齢確認の理由 |
| `finalJudgement` | string | 最終判定（APPROVED/REJECTED/REVIEW_REQUIRED） |
| `reviewType` | string | 審査タイプ（AUTO/MANUAL） |
| `reason` | string | 判定理由 |
| `processingTime` | number | 処理時間（ミリ秒） |
| `confidence` | number | 全体の信頼度（0-1） |
| `sessionId` | string | セッションID |
| `timestamp` | string | 処理日時 |

## セッション管理API

### POST /api/id-verify/session

eKYCセッションを作成します。

**レスポンス**:

```json
{
  "success": true,
  "session": {
    "sessionId": "session_1234567890",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-01-15T10:40:00.000Z"
  }
}
```

### GET /api/id-verify/session/{sessionId}

セッション情報を取得します。

**レスポンス**:

```json
{
  "success": true,
  "session": {
    "sessionId": "session_1234567890",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-01-15T10:40:00.000Z",
    "result": {
      // 認証結果
    }
  }
}
```

## 認証

### 開発環境

開発用APIキーを使用してテストできます：

```bash
curl -X POST https://your-domain.com/api/id-verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev_your_dev_key" \
  -d '{
    "documentImage": "data:image/jpeg;base64,...",
    "selfieImage": "data:image/jpeg;base64,..."
  }'
```

### 本番環境

本番環境では、サーバー側でAPIキーが自動的に使用されます。

## エラーコード

| エラーコード | HTTPステータス | 説明 |
|-------------|---------------|------|
| `INVALID_IMAGE` | 400 | 無効な画像データ |
| `IMAGE_TOO_LARGE` | 400 | 画像サイズが4MBを超過 |
| `OCR_FAILED` | 500 | OCR処理に失敗 |
| `FACE_MATCH_FAILED` | 500 | 顔認証処理に失敗 |
| `AUTHENTICITY_CHECK_FAILED` | 500 | 真贋判定処理に失敗 |
| `AGE_VERIFICATION_FAILED` | 500 | 年齢確認処理に失敗 |
| `API_KEY_INVALID` | 401 | 無効なAPIキー |
| `RATE_LIMIT_EXCEEDED` | 429 | レート制限超過 |
| `INTERNAL_ERROR` | 500 | 内部エラー |
| `COMPLIANCE_VIOLATION` | 400 | コンプライアンス違反 |

## 判定基準

### 顔認証判定（Fireworks.ai API）

| スコア範囲 | 判定 | 説明 |
|-----------|------|------|
| 0.90以上 | PASS | 同一人物と判定 |
| 0.70-0.89 | REVIEW | 要審査 |
| 0.70未満 | FAIL | 別人と判定 |

### 年齢確認判定

| 条件 | 判定 | 説明 |
|------|------|------|
| 実年齢 >= 18歳1日 | 成年 | 認証可能 |
| 実年齢 < 18歳1日 | 未成年 | 認証不可 |

### 文書真贋判定

| 判定 | 説明 |
|------|------|
| VALID | 本物と判定 |
| SUSPICIOUS | 疑わしい要素あり |
| INVALID | 偽造と判定 |

### 最終判定ロジック

1. **年齢確認**: 未成年の場合は自動的にREJECTED
2. **顔認証**: スコアが基準値を下回る場合はREJECTED
3. **文書真贋**: 明らかな偽造の場合はREJECTED
4. **OCR信頼度**: 低い場合はREVIEW_REQUIRED
5. **総合判定**: 上記すべてを満たす場合のみAPPROVED

## セキュリティ機能

### TLS暗号化通信
- すべての通信はTLS 1.3で暗号化
- 証明書の自動更新
- 脆弱性の定期的なチェック

### 画像即座削除
- 処理完了後、画像データを即座に削除
- 一時的な保存のみ許可
- 永続的な保存は禁止

### 認証トークン
- APIキーによる安全な認証
- トークンの有効期限管理
- 不正アクセスの検知

### データ最小化
- 年齢確認に必要な情報のみ処理
- 個人情報の最小限の保持
- 不要なデータの自動削除

## コンプライアンス

### 犯罪収益移転防止法準拠
- 7年間の記録保存
- 監査ログの維持
- 報告義務の履行

### 個人情報保護法準拠
- 個人情報の適切な管理
- 同意の取得
- 削除権の保障

### eKYCホ方式要件
- 身分証明書の確認
- 本人確認の実施
- 記録の保存

## 使用例

### JavaScript

```javascript
const response = await fetch('/api/id-verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    documentImage: documentImageBase64,
    selfieImage: selfieImageBase64,
    sessionId: 'session_1234567890'
  })
})

const result = await response.json()
if (result.success) {
  console.log('認証成功:', result.data.finalJudgement)
} else {
  console.error('認証失敗:', result.error)
}
```

### Python

```python
import requests
import base64

# 画像をBase64エンコード
with open('document.jpg', 'rb') as f:
    document_image = base64.b64encode(f.read()).decode()

with open('selfie.jpg', 'rb') as f:
    selfie_image = base64.b64encode(f.read()).decode()

# API呼び出し
response = requests.post('https://your-domain.com/api/id-verify', json={
    'documentImage': f'data:image/jpeg;base64,{document_image}',
    'selfieImage': f'data:image/jpeg;base64,{selfie_image}',
    'sessionId': 'session_1234567890'
})

result = response.json()
if result['success']:
    print('認証成功:', result['data']['finalJudgement'])
else:
    print('認証失敗:', result['error'])
```

## トラブルシューティング

### よくある問題

1. **画像サイズエラー**
   - 画像を4MB以下に圧縮
   - JPEG形式での保存を推奨

2. **顔認証エラー**
   - 明るい環境での撮影
   - 正面を向いた撮影
   - 眼鏡や帽子の除去

3. **OCR認識エラー**
   - 高解像度での撮影
   - 影や反射の回避
   - 文字がはっきり見える角度

4. **セッション期限切れ**
   - 10分以内での認証完了
   - 新しいセッションの作成

### デバッグ

1. **ログの確認**
   ```bash
   tail -f logs/ekyc.log
   ```

2. **API応答の確認**
   ```bash
   curl -v -X POST /api/id-verify
   ```

3. **セッション状態の確認**
   ```bash
   curl /api/id-verify/session/{sessionId}
   ```

## 更新履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|----------|
| 1.0.0 | 2024-01-15 | 初回リリース |
| 1.1.0 | 2024-01-20 | 年齢確認機能追加 |
| 1.2.0 | 2024-01-25 | セキュリティ機能強化 | 