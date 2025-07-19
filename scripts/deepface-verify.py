#!/usr/bin/env python3
"""
DeepFaceを使用した顔認証スクリプト
"""

import sys
import json
import os
from deepface import DeepFace
import cv2
import numpy as np

def verify_faces(img1_path, img2_path):
    """
    2つの画像の顔を照合する
    
    Args:
        img1_path (str): 1つ目の画像パス
        img2_path (str): 2つ目の画像パス
    
    Returns:
        dict: 照合結果
    """
    try:
        # 画像が存在するかチェック
        if not os.path.exists(img1_path):
            return {
                "success": False,
                "error": f"画像1が見つかりません: {img1_path}"
            }
        
        if not os.path.exists(img2_path):
            return {
                "success": False,
                "error": f"画像2が見つかりません: {img2_path}"
            }
        
        # DeepFaceで顔照合を実行
        result = DeepFace.verify(
            img1_path=img1_path,
            img2_path=img2_path,
            model_name="VGG-Face",
            distance_metric="cosine",
            enforce_detection=False
        )
        
        return {
            "success": True,
            "distance": float(result["distance"]),
            "verified": bool(result["verified"]),
            "threshold": float(result["threshold"]),
            "model_name": str(result["model_name"]),
            "detector_backend": str(result["detector_backend"])
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def main():
    """
    メイン関数
    コマンドライン引数から画像パスを受け取り、照合結果をJSONで出力
    """
    if len(sys.argv) != 3:
        print(json.dumps({
            "success": False,
            "error": "使用方法: python deepface-verify.py <画像1パス> <画像2パス>"
        }))
        sys.exit(1)
    
    img1_path = sys.argv[1]
    img2_path = sys.argv[2]
    
    result = verify_faces(img1_path, img2_path)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main() 