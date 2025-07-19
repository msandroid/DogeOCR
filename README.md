# Doge OCR & ID Verify

**Doge OCR & ID Verifyは、世界中のあらゆる文書の構造化OCRと、日本の犯罪収益移転防止法に準拠したeKYCホ方式の身分証明書認証を提供するAIサービスです。**

## 特徴

### Doge OCR
- 画像を送るだけ構造化されたJSONデータが返ってくる
- 形式の指定不要。どんな文書でも柔軟に対応可能
- スキャンからJSON出力まで２秒
- Fireworks.aiの最新モデルを使用した高精度なOCR

### Doge ID Verify
- **eKYCホ方式**: 身分証明書画像 + セルフィーによる本人確認
- **犯罪収益移転防止法準拠**: 日本の法令要件に完全対応
- **AI駆動**: Fireworks.ai（顔認証・OCR）+ 真贋判定を統合
- **リアルタイム処理**: 数秒での認証完了
- **高精度顔認証**: Fireworks.ai APIによる専門的な顔照合

## 主な機能

### 認証・決済
- Googleアカウントによる認証（NextAuth.js）
- Stripeによるサブスクリプション決済
- APIキーの発行・管理

### OCR機能
- ドキュメントOCR処理
- 構造化データ出力
- 多言語対応
- 高精度なテキスト抽出

### ID認証機能
- 身分証明書のOCR処理（Fireworks.ai）
- 顔認証（Fireworks.ai API - 身分証明書 vs セルフィー）
- 真贋判定
- 年齢・有効期限チェック
- 7年間の記録保存
- 顔画像品質評価

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI, Shadcn/ui
- **認証**: NextAuth.js
- **決済**: Stripe
- **AI**: Fireworks.ai (llama4-maverick-instruct-basic)
- **データベース**: Supabase
- **デプロイ**: Vercel

## クイックスタート

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/doge-ocr.git
cd doge-ocr
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Fireworks AI
FIREWORKS_API_KEY=your-fireworks-api-key
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

### 5. ブラウザでアクセス

```
http://localhost:3000
```

## API エンドポイント

### OCR API

```bash
POST /api/ocr
```

画像をOCR処理して構造化データを抽出します。

### ID Verify API

```bash
POST /api/id-verify
```

身分証明書とセルフィーによる本人確認を実行します。

詳細なAPI仕様は[API ドキュメント](docs/id-verify-api.md)を参照してください。

## テスト

### OCR API テスト

```bash
node scripts/ocr-request.js
```

### ID Verify API テスト

```bash
node scripts/test-id-verify.js
```

## デプロイ

### Vercel

1. Vercelにプロジェクトを接続
2. 環境変数を設定
3. デプロイ実行

```bash
vercel --prod
```

## コンプライアンス

### 犯罪収益移転防止法準拠

Doge ID Verifyは以下の要件を満たしています：

- **身分証明書の確認**: 運転免許証、マイナンバーカード等の確認
- **本人確認**: 顔認証による本人確認
- **記録の保存**: 7年間の記録保存
- **監査ログ**: 全処理の監査ログ維持
- **データ保護**: 個人情報の適切な保護

## ライセンス

MIT License

## サポート

- **ドキュメント**: [https://docs.doge-ocr.com](https://docs.doge-ocr.com)
- **サポート**: [support@doge-ocr.com](mailto:support@doge-ocr.com)
- **GitHub Issues**: [https://github.com/doge-ocr/doge-ocr/issues](https://github.com/doge-ocr/doge-ocr/issues)

## 貢献

プルリクエストやイシューの報告を歓迎します。詳細は[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください。

## 更新履歴

### v2.0.0 (2024-01-15)
- Doge ID Verify機能を追加
- 犯罪収益移転防止法準拠のeKYC機能
- 顔認証・真贋判定機能
- 包括的なセキュリティ機能

### v1.0.0 (2024-01-01)
- 初回リリース
- 基本的なOCR機能
- 認証・決済機能
- APIキー管理機能
