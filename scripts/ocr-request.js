const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 設定
const IMAGE_PATH = path.join(__dirname, '../input/001.png');
const API_URL = 'http://localhost:3000/api/ocr';

async function main() {
  try {
    // 画像をBase64エンコード
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const base64 = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // APIリクエストボディ
    const body = {
      image: dataUrl,
      prompt: '',
      mimeType: 'image/png',
    };

    // POSTリクエスト
    const response = await axios.post(API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer dev_xxx', // 開発用APIキーが必要な場合はここを有効化
      },
      maxContentLength: 10 * 1024 * 1024, // 10MB
    });

    // レスポンス出力
    console.log('OCR API Response:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error('詳細エラー:', err);
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

main(); 