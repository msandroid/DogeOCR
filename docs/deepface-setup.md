# DeepFaceセットアップガイド

## 概要

Doge OCRプロジェクトでDeepFaceを使用した顔認証機能を有効にするためのセットアップガイドです。

## 前提条件

- Python 3.8以上
- pip3
- Node.js 18以上

## セットアップ手順

### 1. Python環境のセットアップ

```bash
# セットアップスクリプトを実行
npm run setup-python

# または手動で実行
chmod +x scripts/setup-python.sh
./scripts/setup-python.sh
```

### 2. 依存関係のインストール

```bash
# 仮想環境をアクティベート
source venv/bin/activate

# 依存関係をインストール
pip3 install -r requirements.txt
```

### 3. 動作テスト

```bash
# DeepFaceの動作テスト
npm run test-deepface

# または手動でテスト
node scripts/test-deepface.js
```

## ファイル構成

```
scripts/
├── deepface-verify.py    # DeepFace顔認証スクリプト
├── setup-python.sh       # Python環境セットアップスクリプト
└── test-deepface.js      # 動作テストスクリプト

requirements.txt           # Python依存関係
```

## DeepFaceの設定

### 使用モデル
- **モデル**: VGG-Face
- **距離メトリック**: コサイン距離
- **顔検出**: enforce_detection=false

### パフォーマンス設定

```python
# scripts/deepface-verify.py で設定可能
result = DeepFace.verify(
    img1_path=img1_path,
    img2_path=img2_path,
    model_name="VGG-Face",        # 使用モデル
    distance_metric="cosine",      # 距離メトリック
    enforce_detection=False        # 顔検出の厳密性
)
```

## トラブルシューティング

### 1. Pythonが見つからない

```bash
# Python3のインストール確認
python3 --version

# インストールされていない場合
# Ubuntu/Debian
sudo apt-get install python3 python3-pip

# macOS
brew install python3

# Windows
# Python公式サイトからダウンロード
```

### 2. DeepFaceのインストールエラー

```bash
# 仮想環境をアクティベート
source venv/bin/activate

# 依存関係を個別にインストール
pip3 install deepface==0.0.79
pip3 install opencv-python==4.8.1.78
pip3 install tensorflow==2.13.0
```

### 3. メモリ不足エラー

```python
# scripts/deepface-verify.py でGPU使用を無効化
import os
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # GPUを無効化
```

### 4. 顔検出エラー

```python
# enforce_detection=False を設定
result = DeepFace.verify(
    img1_path=img1_path,
    img2_path=img2_path,
    enforce_detection=False  # 顔検出失敗時も処理継続
)
```

## 本番環境での設定

### Vercel環境

Vercel環境では、Python環境の制約があるため、以下の設定が必要です：

1. **Pythonランタイムの設定**
   - `vercel.json`でPythonランタイムを指定
   - または、外部APIサービスを使用

2. **代替案**
   - 外部の顔認証APIサービスを使用
   - サーバーレス関数でのPython実行

### ローカル開発環境

```bash
# 開発サーバー起動
npm run dev

# DeepFace機能のテスト
curl -X POST http://localhost:3000/api/ekyc \
  -H "Content-Type: application/json" \
  -d '{
    "documentImage": "data:image/jpeg;base64,...",
    "documentFaceImage": "data:image/jpeg;base64,...",
    "selfieImage": "data:image/jpeg;base64,..."
  }'
```

## パフォーマンス最適化

### 1. モデルの事前ダウンロード

```python
# 初回実行時にモデルがダウンロードされる
# 事前にダウンロードする場合
from deepface import DeepFace
DeepFace.build_model("VGG-Face")
```

### 2. バッチ処理

```python
# 複数画像の一括処理
results = DeepFace.verify(
    img1_path=img1_path,
    img2_path=img2_path,
    model_name="VGG-Face",
    distance_metric="cosine",
    enforce_detection=False
)
```

### 3. キャッシュ設定

```python
# モデルのキャッシュ
import os
os.environ['DEEPFACE_HOME'] = './models'  # モデル保存先
```

## セキュリティ考慮事項

1. **画像データの一時保存**
   - 処理後は即座に削除
   - セキュアな一時ディレクトリを使用

2. **エラーハンドリング**
   - 機密情報のログ出力を避ける
   - 適切なエラーメッセージ

3. **アクセス制御**
   - APIエンドポイントの認証
   - レート制限の実装

## 参考リンク

- [DeepFace公式ドキュメント](https://github.com/serengil/deepface)
- [VGG-Faceモデル](https://github.com/serengil/deepface/wiki/Models)
- [顔認証のベストプラクティス](https://github.com/serengil/deepface/wiki/Face-Recognition) 