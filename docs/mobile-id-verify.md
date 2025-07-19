# モバイルID Verify機能

## 概要

Doge ID Verifyシステムは、スマートフォンでの認証をサポートしています。QRコードを使用してデスクトップとモバイルデバイスを連携し、スマートフォンのカメラ機能を活用した認証プロセスを提供します。

## 機能

### 1. QRコード連携
- デスクトップでQRコードを表示
- スマートフォンでQRコードを読み取り
- セッション管理による安全な連携

### 2. モバイル専用UI
- スマートフォンに最適化されたインターフェース
- カメラ機能の直接利用
- 段階的な認証プロセス

### 3. リアルタイム通信
- セッション状態のリアルタイム更新
- デスクトップでの結果表示
- 自動的なセッション管理

## 使用方法

### デスクトップ側

1. **QRコードページにアクセス**
   ```
   http://localhost:3000/id-verify/qr
   ```

2. **QRコードの表示**
   - ページが読み込まれると自動的にセッションが作成される
   - QRコードが表示される
   - セッション状態がリアルタイムで更新される

3. **結果の確認**
   - モバイルでの認証完了後、結果が自動的に表示される
   - 詳細な認証結果を確認できる

### モバイル側

1. **QRコードの読み取り**
   - スマートフォンのカメラアプリでQRコードを読み取り
   - 表示されたURLにアクセス

2. **身分証明書の撮影**
   - 身分証明書を撮影
   - 画質と角度を調整

3. **顔写真の撮影**
   - 顔を撮影
   - 明るさと角度を調整

4. **認証処理**
   - 自動的に認証処理が開始される
   - 処理状況がリアルタイムで表示される

## API仕様

### セッション管理API

#### セッション作成
```http
POST /api/id-verify/session
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "session-uuid",
    "status": "waiting",
    "mobileUrl": "http://localhost:3000/id-verify/mobile/session-uuid",
    "desktopUrl": "http://localhost:3000/id-verify/desktop/session-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-01T00:10:00.000Z"
  }
}
```

#### セッション取得
```http
GET /api/id-verify/session/{sessionId}
```

#### セッション更新
```http
PUT /api/id-verify/session/{sessionId}
Content-Type: application/json

{
  "status": "active|completed|expired",
  "result": {...}
}
```

#### セッション統計
```http
GET /api/id-verify/session
```

### モバイルID Verify API

#### 認証処理
```http
POST /api/id-verify
Content-Type: multipart/form-data

documentImage: File
faceImage: File
sessionId: string
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "documentType": "運転免許証",
    "documentOcr": {
      "name": "山田太郎",
      "birthDate": "1990-01-01",
      "address": "東京都渋谷区..."
    },
    "faceMatchScore": 0.95,
    "faceMatchResult": "PASS",
    "documentAuthenticity": "VALID",
    "finalJudgement": "APPROVED",
    "processingTime": 2500,
    "confidence": 0.92,
    "sessionId": "session-uuid",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## セッション状態

| 状態 | 説明 |
|------|------|
| `waiting` | モバイルデバイスからの接続を待機中 |
| `active` | 認証処理中 |
| `completed` | 認証完了 |
| `expired` | セッション期限切れ（10分） |

## セキュリティ

### セッション管理
- ユニークなセッションIDの生成
- 10分のセッションタイムアウト
- 自動的な期限切れセッションのクリーンアップ

### データ保護
- 画像データの一時的な保存
- 処理完了後の自動削除
- HTTPS通信の強制

## トラブルシューティング

### よくある問題

1. **QRコードが読み取れない**
   - 画面の明るさを調整
   - QRコードのサイズを確認
   - カメラの焦点を調整

2. **カメラが動作しない**
   - ブラウザのカメラ権限を確認
   - HTTPS接続を確認
   - カメラテストページで動作確認

3. **セッションが期限切れ**
   - 新しいセッションを作成
   - 処理時間を短縮
   - ネットワーク接続を確認

### デバッグ

1. **セッション状態の確認**
   ```javascript
   fetch('/api/id-verify/session/{sessionId}')
   ```

2. **セッション統計の確認**
   ```javascript
   fetch('/api/id-verify/session')
   ```

3. **ログの確認**
   - ブラウザの開発者ツールでコンソールログを確認
   - ネットワークタブでAPI通信を確認

## テスト

### 自動テスト
```bash
node scripts/test-mobile-id-verify.js
```

### 手動テスト
1. デスクトップでQRコードページを開く
2. スマートフォンでQRコードを読み取る
3. モバイルページで認証を実行
4. デスクトップで結果を確認

## 技術仕様

### 使用技術
- **フロントエンド**: React, Next.js, TypeScript
- **QRコード**: qrcode.react
- **カメラ**: MediaDevices API
- **通信**: Fetch API, Server-Sent Events

### ブラウザ対応
- Chrome 60+
- Safari 11+
- Firefox 55+
- Edge 79+

### デバイス対応
- iOS 11+
- Android 7+
- デスクトップブラウザ

## 今後の改善予定

1. **プッシュ通知**
   - 認証完了時のプッシュ通知
   - セッション期限切れの通知

2. **オフライン対応**
   - オフライン時の画像保存
   - 接続復旧時の自動アップロード

3. **多言語対応**
   - 英語、日本語以外の言語サポート
   - 地域別の認証要件対応

4. **高度なセキュリティ**
   - 生体認証との連携
   - ブロックチェーン認証
   - 暗号化通信の強化 