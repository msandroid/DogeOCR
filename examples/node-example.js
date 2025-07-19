#!/usr/bin/env node
/**
 * Doge OCR API - Node.js サンプルコード
 */

const fs = require('fs');
const path = require('path');

// 画像ファイルをBase64エンコードする
function encodeImageToBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        
        // MIMEタイプを推測
        const extension = path.extname(imagePath).toLowerCase();
        const mimeType = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.heic': 'image/heic'
        }[extension] || 'image/jpeg';
        
        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error('画像の読み込みエラー:', error.message);
        return null;
    }
}

// OCR APIを呼び出す
async function callOcrApi(apiUrl, imagePath, customPrompt = null) {
    // 画像をBase64エンコード
    const base64Image = encodeImageToBase64(imagePath);
    if (!base64Image) {
        return null;
    }
    
    // リクエストボディを作成
    const requestData = {
        image: base64Image
    };
    
    if (customPrompt) {
        requestData.prompt = customPrompt;
    }
    
    try {
        console.log(`OCR API呼び出し中... (${imagePath})`);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        return { result, statusCode: response.status };
        
    } catch (error) {
        console.error('APIリクエストエラー:', error.message);
        return null;
    }
}

// 結果を表示する
function displayResult(data, statusCode) {
    if (!data) {
        console.log('❌ APIからの応答がありません');
        return;
    }
    
    const { result } = data;
    
    console.log('\n' + '='.repeat(50));
    console.log(`HTTP Status: ${statusCode}`);
    console.log('='.repeat(50));
    
    if (result.success) {
        const ocrData = result.data;
        console.log('✅ OCR処理成功');
        console.log(`処理時間: ${ocrData.processingTime || 'N/A'}ms`);
        console.log(`信頼度: ${((ocrData.confidence || 0) * 100).toFixed(1)}%`);
        console.log(`APIバージョン: ${ocrData.apiVersion || 'N/A'}`);
        
        console.log('\n📄 抽出されたテキスト:');
        console.log('-'.repeat(30));
        console.log(ocrData.extractedText || 'N/A');
        
        if (ocrData.structuredData) {
            console.log('\n🔧 構造化データ:');
            console.log('-'.repeat(30));
            console.log(JSON.stringify(ocrData.structuredData, null, 2));
        }
    } else {
        console.log('❌ OCR処理失敗');
        console.log(`エラー: ${result.error || 'N/A'}`);
        if (result.details) {
            console.log(`詳細: ${JSON.stringify(result.details, null, 2)}`);
        }
    }
}

// メイン関数
async function main() {
    // 設定
    const API_URL = 'http://localhost:3000/api/ocr'; // 本番環境では適切なURLに変更
    
    // コマンドライン引数のチェック
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('使用法: node node-example.js <画像ファイルパス> [カスタムプロンプト]');
        console.log('\n例:');
        console.log('  node node-example.js image.jpg');
        console.log('  node node-example.js image.jpg "この画像から名前と住所を抽出してください"');
        process.exit(1);
    }
    
    const imagePath = args[0];
    const customPrompt = args[1] || null;
    
    // ファイルの存在確認
    if (!fs.existsSync(imagePath)) {
        console.log(`❌ 画像ファイルが見つかりません: ${imagePath}`);
        process.exit(1);
    }
    
    // OCR API呼び出し
    const result = await callOcrApi(API_URL, imagePath, customPrompt);
    
    // 結果表示
    displayResult(result, result?.statusCode);
}

// スクリプトが直接実行された場合のみメイン関数を実行
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    encodeImageToBase64,
    callOcrApi,
    displayResult
}; 