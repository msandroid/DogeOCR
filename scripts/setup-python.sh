#!/bin/bash

# Python環境のセットアップスクリプト

echo "Python環境のセットアップを開始します..."

# Python3がインストールされているかチェック
if ! command -v python3 &> /dev/null; then
    echo "エラー: python3が見つかりません。Python3をインストールしてください。"
    exit 1
fi

# pip3がインストールされているかチェック
if ! command -v pip3 &> /dev/null; then
    echo "エラー: pip3が見つかりません。pip3をインストールしてください。"
    exit 1
fi

echo "Python3とpip3が見つかりました。"

# 仮想環境を作成（オプション）
if [ ! -d "venv" ]; then
    echo "仮想環境を作成します..."
    python3 -m venv venv
fi

# 仮想環境をアクティベート
echo "仮想環境をアクティベートします..."
source venv/bin/activate

# 依存関係をインストール
echo "Python依存関係をインストールします..."
pip3 install -r requirements.txt

echo "セットアップが完了しました！"
echo ""
echo "使用方法:"
echo "1. 仮想環境をアクティベート: source venv/bin/activate"
echo "2. テスト実行: python3 scripts/deepface-verify.py <画像1> <画像2>" 