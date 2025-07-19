#!/usr/bin/env python3
"""
Doge OCR API - Python サンプルコード
"""

import requests
import base64
import json
from pathlib import Path
import sys

def encode_image_to_base64(image_path):
    """画像ファイルをBase64エンコードする"""
    try:
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            # MIMEタイプを推測
            extension = Path(image_path).suffix.lower()
            mime_type = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.heic': 'image/heic'
            }.get(extension, 'image/jpeg')
            
            return f"data:{mime_type};base64,{encoded_string}"
    except Exception as e:
        print(f"画像の読み込みエラー: {e}")
        return None

def call_ocr_api(api_url, image_path, custom_prompt=None):
    """OCR APIを呼び出す"""
    # 画像をBase64エンコード
    base64_image = encode_image_to_base64(image_path)
    if not base64_image:
        return None
    
    # リクエストボディを作成
    request_data = {
        "image": base64_image
    }
    
    if custom_prompt:
        request_data["prompt"] = custom_prompt
    
    try:
        print(f"OCR API呼び出し中... ({image_path})")
        response = requests.post(
            api_url,
            json=request_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        return response.json(), response.status_code
    
    except requests.exceptions.RequestException as e:
        print(f"APIリクエストエラー: {e}")
        return None, None

def display_result(result, status_code):
    """結果を表示する"""
    if not result:
        print("❌ APIからの応答がありません")
        return
    
    print(f"\n{'='*50}")
    print(f"HTTP Status: {status_code}")
    print(f"{'='*50}")
    
    if result.get('success'):
        data = result['data']
        print("✅ OCR処理成功")
        print(f"処理時間: {data.get('processingTime', 'N/A')}ms")
        print(f"信頼度: {data.get('confidence', 'N/A'):.1%}")
        print(f"APIバージョン: {data.get('apiVersion', 'N/A')}")
        
        print("\n📄 抽出されたテキスト:")
        print("-" * 30)
        print(data.get('extractedText', 'N/A'))
        
        if data.get('structuredData'):
            print("\n🔧 構造化データ:")
            print("-" * 30)
            print(json.dumps(data['structuredData'], ensure_ascii=False, indent=2))
    else:
        print("❌ OCR処理失敗")
        print(f"エラー: {result.get('error', 'N/A')}")
        if result.get('details'):
            print(f"詳細: {json.dumps(result['details'], ensure_ascii=False, indent=2)}")

def main():
    """メイン関数"""
    # 設定
    API_URL = "http://localhost:3000/api/ocr"  # 本番環境では適切なURLに変更
    
    # コマンドライン引数のチェック
    if len(sys.argv) < 2:
        print("使用法: python3 python-example.py <画像ファイルパス> [カスタムプロンプト]")
        print("\n例:")
        print("  python3 python-example.py image.jpg")
        print("  python3 python-example.py image.jpg 'この画像から名前と住所を抽出してください'")
        sys.exit(1)
    
    image_path = sys.argv[1]
    custom_prompt = sys.argv[2] if len(sys.argv) > 2 else None
    
    # ファイルの存在確認
    if not Path(image_path).exists():
        print(f"❌ 画像ファイルが見つかりません: {image_path}")
        sys.exit(1)
    
    # OCR API呼び出し
    result, status_code = call_ocr_api(API_URL, image_path, custom_prompt)
    
    # 結果表示
    display_result(result, status_code)

if __name__ == "__main__":
    main() 