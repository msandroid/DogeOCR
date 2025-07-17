# Doge OCR - 世界対応文書認識システム

## 概要

Doge OCRは、世界中のあらゆる文書に対応する包括的なOCR（光学文字認識）システムです。AI技術を活用して、画像から文字を抽出し、文書の種類に応じてJSON形式で構造化されたデータを提供します。

## 対応文書タイプ

### 🏛️ 政府・公的文書
- **身分証明書**: パスポート、運転免許証、国民IDカード、在留カード、グリーンカード等
- **戸籍・住民関連**: 出生証明書、婚姻証明書、住民票、戸籍謄本等
- **税務・年金**: 納税証明書、年金手帳、社会保険証等
- **許可証・免許**: 各種営業許可証、医師免許、弁護士資格証等

### 💰 金融・保険文書
- **銀行関連**: 銀行明細書、通帳、融資契約書、住宅ローン文書等
- **保険関連**: 保険証券、保険請求書、健康保険証等
- **投資関連**: 株券、債券、投資明細書等

### ⚖️ 法律・司法文書
- **契約書**: 売買契約書、賃貸契約書、雇用契約書、秘密保持契約書等
- **法廷文書**: 判決文、裁判所命令、召喚状、宣誓供述書等
- **公証文書**: 公証文書、認証謄本等

### 🏥 医療・健康文書
- **臨床文書**: 診断書、処方箋、診療記録、健康診断結果等
- **医療費関連**: 医療費明細書、保険請求書等

### 🎓 教育・資格文書
- **証明書**: 卒業証明書、学位記、成績証明書等
- **資格関連**: 各種資格証明書、研修修了証等

### 🏢 企業・業務文書
- **財務諸表**: 貸借対照表、損益計算書、キャッシュフロー計算書等
- **商取引**: 請求書、レシート、注文書、見積書、納品書等
- **人事関連**: 履歴書、給与明細、勤怠管理表等

### 💻 デジタル・技術文書
- **技術文書**: API文書、ユーザーマニュアル、技術仕様書等
- **ウェブ関連**: ウェブページ、プライバシーポリシー、利用規約等

## 主な機能

### 🎯 高精度OCR
- Fireworks AI OCR エンジンを使用
- 多言語対応（日本語、英語、中国語、韓国語等）
- 文書構造の自動分析

### 🔍 自動文書分類
- AI による文書種類の自動検出
- 120+ 種類の文書タイプに対応
- 地域別最適化（日本、米国、EU、インド等）

### 📊 構造化データ抽出
- 文書タイプに応じた専用スキーマ
- JSON形式での構造化出力
- フィールド別信頼度スコア

### ✅ データ検証・品質管理
- Zodスキーマによる厳密な検証
- 必須フィールドの完成度チェック
- 改善提案の自動生成

## 使用方法

### 基本的な使用例

#### Node.js での使用

```javascript
import { handleImageUpload } from './app/actions/demo.js'

// フォームデータの準備
const formData = new FormData()
formData.append('image', imageFile)
formData.append('language', 'ja')  // ja, en, zh, ko等
formData.append('documentHint', 'パスポート')  // オプション

// OCR実行
const result = await handleImageUpload(
  { imagePreview: null, ocrResult: null },
  formData
)

console.log(result.ocrResult)
```

#### Python での使用

```python
import requests
import base64

# 画像をBase64エンコード
with open('document.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode()

# API呼び出し
response = requests.post('http://localhost:3000/api/ocr', json={
    'image': f'data:image/jpeg;base64,{image_data}',
    'language': 'ja',
    'documentType': 'パスポート'
})

result = response.json()
print(result)
```

### 高度な機能

#### 文書タイプ検出のみ

```javascript
import { detectDocumentTypeFromImage } from './app/actions/demo.js'

const detection = await detectDocumentTypeFromImage(imageBase64)
console.log(`文書タイプ: ${detection.documentType}`)
console.log(`信頼度: ${detection.confidence}`)
console.log(`カテゴリ: ${detection.category}`)
```

#### バッチ処理（複数画像）

```javascript
import { handleMultipleImages } from './app/actions/demo.js'

const files = [file1, file2, file3]  // File オブジェクトの配列
const results = await handleMultipleImages(files)

results.forEach((result, index) => {
  console.log(`ファイル ${index + 1}: ${result.filename}`)
  console.log('OCR結果:', result.ocrResult)
})
```

#### データ検証

```javascript
import { validateDocumentData } from './app/actions/demo.js'

const validation = await validateDocumentData('パスポート', extractedData)
console.log(`検証結果: ${validation.isValid}`)
console.log(`完成度: ${validation.completeness * 100}%`)
console.log('エラー:', validation.errors)
console.log('警告:', validation.warnings)
```

## 出力フォーマット

### 基本出力構造

```json
{
  "extractedText": "生のOCRテキスト",
  "documentType": "パスポート",
  "documentCategory": "GOVERNMENT.IDENTITY",
  "structuredData": {
    "passport_number": "AB1234567",
    "surname": "YAMADA",
    "given_names": "TARO",
    "nationality": "JPN",
    "date_of_birth": "01 JAN 1990",
    "date_of_expiry": "01 JAN 2030"
  },
  "processingTime": 2340,
  "apiVersion": "v2.0",
  "confidence": 0.92,
  "language": "ja",
  "documentStructure": {
    "hasTable": false,
    "hasSignature": true,
    "hasPhoto": true,
    "hasBarcode": false,
    "structure": "certificate"
  },
  "fieldConfidence": {
    "passport_number": 0.95,
    "surname": 0.88,
    "given_names": 0.90
  },
  "recommendations": [
    "画像の解像度を上げると認識精度が向上します"
  ]
}
```

### 文書タイプ別スキーマ例

#### パスポート

```json
{
  "passport_number": "パスポート番号",
  "surname": "姓",
  "given_names": "名",
  "nationality": "国籍",
  "date_of_birth": "生年月日",
  "place_of_birth": "出生地",
  "sex": "性別",
  "date_of_issue": "発行日",
  "date_of_expiry": "有効期限",
  "issuing_authority": "発行機関",
  "mrz_Doge1": "MRZ第1行",
  "mrz_Doge2": "MRZ第2行"
}
```

#### 請求書

```json
{
  "invoice_number": "請求書番号",
  "invoice_date": "請求日",
  "due_date": "支払期限",
  "vendor": {
    "name": "請求元会社名",
    "address": "住所",
    "tax_id": "税務ID"
  },
  "items": [
    {
      "description": "項目説明",
      "quantity": "数量",
      "unit_price": "単価",
      "total_price": "合計金額"
    }
  ],
  "total_amount": "総額",
  "currency": "通貨"
}
```

#### 診断書

```json
{
  "patient_name": "患者名",
  "diagnosis_date": "診断日",
  "doctor_name": "医師名",
  "medical_facility": "医療機関",
  "diagnosis": "診断名",
  "treatment": "治療内容",
  "prescribed_medication": [
    {
      "medication": "薬剤名",
      "dosage": "用量",
      "frequency": "服用頻度"
    }
  ],
  "icd_10_code": "ICD-10コード"
}
```

## API エンドポイント

### POST /api/ocr

基本的なOCR処理を実行します。

**リクエスト:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "language": "ja",
  "documentHint": "パスポート"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "extractedText": "...",
    "documentType": "パスポート",
    "structuredData": {...}
  }
}
```

### POST /api/ocr/detect

文書タイプの検出のみを実行します。

### POST /api/ocr/batch

複数画像の一括処理を実行します。

### POST /api/ocr/validate

抽出データの検証を実行します。

## 設定

### 環境変数

```bash
# 必須
FIREWORKS_API_KEY=your_fireworks_api_key

# オプション
OCR_MAX_FILE_SIZE=10MB
OCR_SUPPORTED_FORMATS=jpg,png,gif,webp
OCR_DEFAULT_LANGUAGE=ja
```

### 対応画像形式

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### ファイルサイズ制限

- 最大ファイルサイズ: 10MB
- 推奨解像度: 300 DPI以上
- 最小サイズ: 200x200 ピクセル

## トラブルシューティング

### よくあるエラーと解決方法

#### 1. 文書タイプが「不明」になる

**原因:**
- 画像の解像度が低い
- 文字が不鮮明
- 対応していない文書タイプ

**解決方法:**
```javascript
// より高解像度の画像を使用
// documentHint パラメータで文書タイプを指定
formData.append('documentHint', '適切な文書タイプ')
```

#### 2. 抽出精度が低い

**原因:**
- 画像の傾きや歪み
- 照明不足
- 背景のノイズ

**解決方法:**
- 画像を正面から撮影
- 十分な照明を確保
- 背景をクリーンに保つ

#### 3. APIエラー

**原因:**
- APIキーの設定不備
- レート制限の超過
- ネットワーク問題

**解決方法:**
```bash
# APIキーの確認
echo $FIREWORKS_API_KEY

# レート制限の確認
curl -H "Authorization: Bearer $FIREWORKS_API_KEY" https://api.fireworks.ai/v1/usage
```

## パフォーマンス最適化

### 画像前処理

```javascript
// 画像を最適化してからOCR実行
function preprocessImage(imageFile) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // リサイズと最適化
      canvas.width = Math.min(img.width, 2048)
      canvas.height = Math.min(img.height, 2048)
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(resolve, 'image/jpeg', 0.9)
    }
    
    img.src = URL.createObjectURL(imageFile)
  })
}
```

### バッチ処理の最適化

```javascript
// 並列処理で高速化
async function processMultipleImagesOptimized(files) {
  const batches = []
  const batchSize = 3  // 同時処理数の制限
  
  for (let i = 0; i < files.length; i += batchSize) {
    batches.push(files.slice(i, i + batchSize))
  }
  
  const results = []
  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map(file => handleImageUpload({}, createFormData(file)))
    )
    results.push(...batchResults)
  }
  
  return results
}
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## サポート

技術的な質問やバグ報告は、GitHubのIssuesページまでお願いします。

## 更新履歴

### v2.0.0 (2024-01-15)
- 世界対応文書タイプの追加（120+ 種類）
- 多言語OCR対応
- 高度なデータ検証機能
- バッチ処理機能
- 構造化データの信頼度スコア

### v1.0.0 (2023-12-01)  
- 基本OCR機能
- 日本語文書対応
- JSON構造化出力 