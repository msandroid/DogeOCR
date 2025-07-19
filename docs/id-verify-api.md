# Doge ID Verify API ドキュメント

## 概要

Doge ID Verifyは、日本の犯罪収益移転防止法に準拠したeKYCホ方式の身分証明書認証APIです。身分証明書のOCR、顔認証、真贋判定を統合し、高精度な本人確認を提供します。

## 特徴

- **eKYCホ方式**: 身分証明書画像 + セルフィーによる本人確認
- **犯罪収益移転防止法準拠**: 日本の法令要件に完全対応
- **AI駆動**: Fireworks.ai（OCR）+ DeepFace（顔認証）の組み合わせ
- **包括的セキュリティ**: 真贋判定、顔認証、OCRを統合
- **リアルタイム処理**: 数秒での認証完了
- **高精度顔認証**: Fireworks.ai APIによる専門的な顔照合

## 認証フロー

### 1. 利用者による撮影・入力
- 身分証明書の撮影（運転免許証、マイナンバーカード、パスポート等）
- セルフィーの撮影（静止画または動画）

### 2. 画像解析処理
- **OCR処理**: Fireworks.aiを使用した氏名、生年月日、住所、有効期限等の抽出
- **顔認証**: Fireworks.ai APIを使用した身分証明書内の顔写真とセルフィーの照合
- **真贋判定**: 画像の加工・改ざん検知

### 3. ロジックによる整合性検証
- 書類情報とOCR結果の一致確認
- 年齢チェック（18歳以上）
- 有効期限チェック

### 4. 結果判定と記録
- 自動判定（APPROVED/REJECTED/REVIEW_REQUIRED）
- 7年間の記録保存
- 監査ログの維持

## API エンドポイント

### POST /api/id-verify

身分証明書とセルフィーによる本人確認を実行します。

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
    "documentAuthenticity": "VALID",
    "finalJudgement": "APPROVED",
    "reviewType": "AUTO",
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
| `documentOcr.birthDate` | string | 生年月日 |
| `documentOcr.address` | string | 住所 |
| `documentOcr.expirationDate` | string | 有効期限 |
| `documentOcr.documentNumber` | string | 文書番号 |
| `documentOcr.issuingAuthority` | string | 発行機関 |
| `faceMatchScore` | number | 顔照合スコア（0.0-1.0） |
| `faceMatchResult` | string | 顔照合結果（PASS/FAIL/REVIEW） |
| `faceMatchNotes` | string | 顔照合の詳細説明 |
| `faceQuality` | object | 顔画像品質情報（明度、鮮明度、角度、遮蔽） |
| `documentAuthenticity` | string | 文書真贋判定（VALID/INVALID/SUSPICIOUS） |
| `finalJudgement` | string | 最終判定（APPROVED/REJECTED/REVIEW_REQUIRED） |
| `reviewType` | string | 審査タイプ（AUTO/MANUAL） |
| `processingTime` | number | 処理時間（ミリ秒） |
| `confidence` | number | 全体の信頼度（0.0-1.0） |
| `sessionId` | string | セッションID |
| `timestamp` | string | 処理日時（ISO 8601形式） |

### GET /api/id-verify

API仕様とコンプライアンス情報を取得します。

**レスポンス**:

```json
{
  "name": "Doge ID Verify API",
  "version": "v1.0",
  "description": "日本の犯罪収益移転防止法に準拠したeKYCホ方式の身分証明書認証API",
  "endpoints": {
    "/api/id-verify": {
      "method": "POST",
      "description": "身分証明書とセルフィーによる本人確認",
      "requestBody": {
        "documentImage": "身分証明書のBase64エンコードされた画像データ",
        "selfieImage": "セルフィーのBase64エンコードされた画像データ",
        "userInfo": "申請者の基本情報（オプション）",
        "sessionId": "セッションID（オプション）"
      }
    }
  },
  "compliance": {
    "standard": "犯罪収益移転防止法",
    "country": "日本",
    "method": "eKYCホ方式",
    "dataRetention": "7年間"
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
| `API_KEY_INVALID` | 401 | 無効なAPIキー |
| `RATE_LIMIT_EXCEEDED` | 429 | レート制限超過 |
| `INTERNAL_ERROR` | 500 | 内部エラー |
| `COMPLIANCE_VIOLATION` | 400 | コンプライアンス違反 |

## 判定基準

### 顔認証判定（Fireworks.ai API）

| スコア範囲 | 判定結果 | 説明 |
|-----------|----------|------|
| 0.8以上 | PASS | 同一人物と判定 |
| 0.6-0.8 | REVIEW | 要審査 |
| 0.6未満 | FAIL | 別人と判定 |

**顔画像品質評価**:
- **明度**: 画像の明るさ（0-100%）
- **鮮明度**: 画像の鮮明さ（0-100%）
- **角度**: 顔の角度（度）
- **遮蔽**: 顔の遮蔽率（0-100%）

### 真贋判定

| 判定結果 | 説明 |
|----------|------|
| VALID | 本物と判定 |
| SUSPICIOUS | 疑わしい要素あり |
| INVALID | 偽造と判定 |

### 最終判定

| 判定結果 | 説明 |
|----------|------|
| APPROVED | 認証完了 |
| REJECTED | 認証拒否 |
| REVIEW_REQUIRED | 手動審査必要 |

## コンプライアンス

### 犯罪収益移転防止法準拠

- **身分証明書の確認**: 運転免許証、マイナンバーカード等の確認
- **本人確認**: 顔認証による本人確認
- **記録の保存**: 7年間の記録保存
- **監査ログ**: 全処理の監査ログ維持
- **データ保護**: 個人情報の適切な保護

### データ保存期間

- **認証記録**: 7年間
- **画像データ**: 処理完了後24時間以内に削除
- **監査ログ**: 7年間

### セキュリティ要件

- **暗号化**: 全通信のTLS暗号化
- **アクセス制御**: APIキーによる認証
- **レート制限**: 不正利用防止のための制限
- **監査**: 全アクセスのログ記録

## 使用例

### JavaScript

```javascript
const response = await fetch('/api/id-verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    documentImage: 'data:image/jpeg;base64,...',
    selfieImage: 'data:image/jpeg;base64,...',
    userInfo: {
      name: '山田 太郎',
      birthDate: '1990-01-01',
      address: '東京都新宿区西新宿2-8-1'
    }
  })
});

const result = await response.json();
console.log('認証結果:', result.data.finalJudgement);
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

# APIリクエスト
response = requests.post('https://your-domain.com/api/id-verify', json={
    'documentImage': f'data:image/jpeg;base64,{document_image}',
    'selfieImage': f'data:image/jpeg;base64,{selfie_image}',
    'userInfo': {
        'name': '山田 太郎',
        'birthDate': '1990-01-01',
        'address': '東京都新宿区西新宿2-8-1'
    }
})

result = response.json()
print('認証結果:', result['data']['finalJudgement'])
```

### cURL

```bash
curl -X POST https://your-domain.com/api/id-verify \
  -H "Content-Type: application/json" \
  -d '{
    "documentImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "selfieImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "userInfo": {
      "name": "山田 太郎",
      "birthDate": "1990-01-01",
      "address": "東京都新宿区西新宿2-8-1"
    }
  }'
```

## 制限事項

- **画像サイズ**: 4MB以下
- **対応形式**: JPEG, PNG, GIF, WebP
- **レート制限**: 1分間に10リクエスト
- **同時処理**: 最大5リクエスト

## サポート

- **ドキュメント**: [https://docs.doge-ocr.com/id-verify](https://docs.doge-ocr.com/id-verify)
- **サポート**: [support@doge-ocr.com](mailto:support@doge-ocr.com)
- **GitHub**: [https://github.com/doge-ocr/doge-id-verify](https://github.com/doge-ocr/doge-id-verify)

## 更新履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|----------|
| v1.0.0 | 2024-01-15 | 初回リリース |
| v1.0.1 | 2024-01-20 | エラーハンドリング改善 |
| v1.1.0 | 2024-02-01 | 真贋判定機能強化 | 