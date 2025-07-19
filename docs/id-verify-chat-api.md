# ID Verify チャットAPI ドキュメント

## 概要

ID Verifyの認証条件をチャットで動的に変更するためのAPIです。自然言語でのコマンド入力により、顔認証スコアの閾値、年齢制限、文書真贋判定の条件などをリアルタイムで調整できます。

## エンドポイント

### POST /api/id-verify/chat

チャットメッセージを送信して設定を変更します。

#### リクエスト

```json
{
  "message": "顔認証承認0.85",
  "userId": "admin",
  "sessionId": "optional-session-id"
}
```

#### レスポンス

```json
{
  "success": true,
  "data": {
    "response": "顔認証設定を更新しました。承認: 0.85, 拒否: 0.6, 審査: 0.7",
    "settingsChanged": true,
    "newSettings": {
      "faceMatchThresholds": {
        "approved": 0.85,
        "rejected": 0.6,
        "reviewRequired": 0.7
      },
      // ... その他の設定
    },
    "action": "update_face_match"
  }
}
```

## 利用可能なコマンド

### 1. 設定表示
```
設定
settings
show
```

### 2. 顔認証設定変更
```
顔認証承認0.85
顔認証拒否0.5
顔認証審査0.7
```

### 3. 年齢制限変更
```
最小年齢20
最大年齢80
```

### 4. 文書真贋判定設定変更
```
文書VALID必須
文書SUSPICIOUS許可
```

### 5. OCR信頼度変更
```
OCR信頼度0.8
```

### 6. リセット
```
リセット
reset
デフォルト
```

### 7. ヘルプ
```
ヘルプ
help
使い方
```

## 設定項目

### 顔認証閾値 (faceMatchThresholds)
- `approved`: 承認される顔認証スコアの最小値 (0-1)
- `rejected`: 拒否される顔認証スコアの最大値 (0-1)
- `reviewRequired`: 審査が必要な顔認証スコアの閾値 (0-1)

### 文書真贋判定 (documentAuthenticity)
- `validRequired`: 文書がVALIDである必要があるか (boolean)
- `suspiciousAllowed`: SUSPICIOUSを許可するか (boolean)

### 年齢制限 (ageRestrictions)
- `minimumAge`: 最小年齢 (number)
- `maximumAge`: 最大年齢 (number, オプション)

### OCR信頼度 (ocrConfidence)
- `minimumConfidence`: OCR信頼度の最小値 (0-1)

### 追加条件 (additionalConditions)
- `requireNameMatch`: 名前の一致を要求するか (boolean)
- `requireBirthDateMatch`: 生年月日の一致を要求するか (boolean)
- `requireAddressMatch`: 住所の一致を要求するか (boolean)
- `allowManualReview`: 手動審査を許可するか (boolean)

## 認証

すべてのAPIリクエストには、AuthorizationヘッダーにBearerトークンが必要です：

```
Authorization: Bearer your-api-key
```

## エラーレスポンス

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## 使用例

### cURL
```bash
curl -X POST http://localhost:3000/api/id-verify/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "message": "顔認証承認0.85",
    "userId": "admin"
  }'
```

### JavaScript
```javascript
const response = await fetch('/api/id-verify/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key',
  },
  body: JSON.stringify({
    message: '顔認証承認0.85',
    userId: 'admin',
  }),
})

const data = await response.json()
console.log(data.data.response)
```

## フロントエンド統合

チャットUIコンポーネントを使用して、ブラウザから直接設定を変更できます：

```tsx
import IdVerifyChat from '@/components/id-verify-chat'

export default function ChatPage() {
  return <IdVerifyChat />
}
```

## 注意事項

1. **認証**: 管理者権限を持つAPIキーが必要です
2. **設定の永続化**: 変更された設定はJSONファイルに保存されます
3. **リアルタイム反映**: 設定変更は即座にID verify処理に反映されます
4. **バックアップ**: 重要な設定変更前には設定ファイルのバックアップを推奨します

## トラブルシューティング

### よくあるエラー

1. **認証エラー**: APIキーが正しく設定されているか確認
2. **設定ファイルエラー**: `id-verify-settings.json`の権限と形式を確認
3. **サーバーエラー**: ログを確認して詳細なエラー情報を取得

### デバッグ

設定の現在の状態を確認：

```bash
curl -H "Authorization: Bearer your-api-key" \
  http://localhost:3000/api/id-verify/settings
```

## 更新履歴

- v1.0.0: 初期リリース
  - 基本的なチャット機能
  - 顔認証、年齢、文書真贋判定の設定変更
  - 設定の永続化 