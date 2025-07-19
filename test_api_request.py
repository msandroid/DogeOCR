import requests
import base64
import json
import os

# APIキー
API_KEY = "dw_46b3e6a8c920b0ed6ce228ea4aa2839f14d1f1adf7debc65e08ad87bfcf4bfeb"
API_URL = "http://localhost:3000/api/ocr"

def encode_image_to_base64(image_path):
    """画像ファイルをBase64エンコードする"""
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        return f"data:image/png;base64,{encoded_string}"

def send_ocr_request(image_path):
    """OCR APIにリクエストを送信する"""
    try:
        # 画像をBase64エンコード
        image_data = encode_image_to_base64(image_path)
        
        # リクエストヘッダー
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }
        
        # リクエストボディ
        payload = {
            "image": image_data
        }
        
        print(f"画像ファイル: {image_path}")
        print(f"API URL: {API_URL}")
        print(f"API キー: {API_KEY[:10]}...")
        print("リクエストを送信中...")
        
        # APIリクエストを送信
        response = requests.post(API_URL, headers=headers, json=payload)
        
        print(f"レスポンスステータス: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ APIリクエスト成功!")
            print(f"抽出されたテキスト: {result.get('data', {}).get('extractedText', 'N/A')}")
            print(f"処理時間: {result.get('data', {}).get('processingTime', 'N/A')}ms")
            print(f"信頼度: {result.get('data', {}).get('confidence', 'N/A')}")
            return result
        else:
            print(f"❌ APIリクエスト失敗: {response.status_code}")
            print(f"エラーメッセージ: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ エラーが発生しました: {str(e)}")
        return None

def main():
    """メイン関数"""
    print("=== Doge OCR API テスト ===")
    print()
    
    # テスト用の画像ファイル
    test_images = [
        "input/001.png",
        "input/002.png", 
        "input/003.JPG",
        "input/004.png",
        "input/005.png"
    ]
    
    for image_path in test_images:
        if os.path.exists(image_path):
            print(f"\n--- {image_path} をテスト中 ---")
            result = send_ocr_request(image_path)
            if result:
                print("✅ テスト成功")
            else:
                print("❌ テスト失敗")
        else:
            print(f"⚠️ ファイルが見つかりません: {image_path}")
        
        print("-" * 50)

if __name__ == "__main__":
    main() 