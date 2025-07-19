const fs = require('fs');
const path = require('path');

// テスト用の画像ファイルパス
const documentImagePath = path.join(__dirname, '../input/001.png');
const selfieImagePath = path.join(__dirname, '../input/002.png');

// Base64エンコード関数
function encodeImageToBase64(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64String = imageBuffer.toString('base64');
    const mimeType = getMimeType(filePath);
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`画像の読み込みに失敗しました: ${error.message}`);
    return null;
  }
}

// MIMEタイプを取得
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

// APIテスト関数
async function testIDVerifyAPI() {
  console.log('🚀 Doge ID Verify API テスト開始\n');

  // 画像をBase64エンコード
  console.log('📸 画像をBase64エンコード中...');
  const documentImage = encodeImageToBase64(documentImagePath);
  const selfieImage = encodeImageToBase64(selfieImagePath);

  if (!documentImage || !selfieImage) {
    console.error('❌ 画像のエンコードに失敗しました');
    return;
  }

  console.log('✅ 画像のエンコード完了\n');

  // テストケース
  const testCases = [
    {
      name: '基本認証テスト',
      data: {
        documentImage,
        selfieImage,
        userInfo: {
          name: '山田 太郎',
          birthDate: '1990-01-01',
          address: '東京都新宿区西新宿2-8-1'
        }
      }
    },
    {
      name: '最小限データテスト',
      data: {
        documentImage,
        selfieImage
      }
    },
    {
      name: 'セッションID付きテスト',
      data: {
        documentImage,
        selfieImage,
        sessionId: `test_session_${Date.now()}`
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`🧪 テストケース: ${testCase.name}`);
    console.log('─'.repeat(50));

    try {
      const startTime = Date.now();
      
      const response = await fetch('http://localhost:3000/api/id-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const result = await response.json();

      console.log(`📊 レスポンス時間: ${responseTime}ms`);
      console.log(`📋 HTTPステータス: ${response.status}`);
      console.log(`✅ 成功: ${result.success}`);

      if (result.success) {
        console.log('\n📋 認証結果:');
        console.log(`  文書種別: ${result.data.documentType}`);
        console.log(`  顔照合スコア: ${(result.data.faceMatchScore * 100).toFixed(1)}%`);
        console.log(`  顔照合結果: ${result.data.faceMatchResult}`);
        if (result.data.faceMatchNotes) {
          console.log(`  顔照合詳細: ${result.data.faceMatchNotes}`);
        }
        if (result.data.faceQuality) {
          console.log(`  顔画像品質:`);
          console.log(`    明度: ${(result.data.faceQuality.brightness * 100).toFixed(0)}%`);
          console.log(`    鮮明度: ${((1 - result.data.faceQuality.blur) * 100).toFixed(0)}%`);
          console.log(`    角度: ${(result.data.faceQuality.angle * 180 / Math.PI).toFixed(1)}°`);
          console.log(`    遮蔽: ${(result.data.faceQuality.occlusion * 100).toFixed(0)}%`);
        }
        console.log(`  真贋判定: ${result.data.documentAuthenticity}`);
        console.log(`  最終判定: ${result.data.finalJudgement}`);
        console.log(`  審査タイプ: ${result.data.reviewType}`);
        console.log(`  信頼度: ${(result.data.confidence * 100).toFixed(1)}%`);
        console.log(`  セッションID: ${result.data.sessionId}`);

        if (result.data.documentOcr) {
          console.log('\n📄 OCR結果:');
          Object.entries(result.data.documentOcr).forEach(([key, value]) => {
            if (value) {
              console.log(`  ${key}: ${value}`);
            }
          });
        }
      } else {
        console.log(`❌ エラー: ${result.error}`);
        if (result.errorCode) {
          console.log(`エラーコード: ${result.errorCode}`);
        }
      }

    } catch (error) {
      console.error(`❌ テスト実行エラー: ${error.message}`);
    }

    console.log('\n');
  }
}

// 開発用APIキーテスト
async function testWithDevAPIKey() {
  console.log('🔑 開発用APIキーでのテスト');
  console.log('─'.repeat(50));

  const documentImage = encodeImageToBase64(documentImagePath);
  const selfieImage = encodeImageToBase64(selfieImagePath);

  if (!documentImage || !selfieImage) {
    console.error('❌ 画像のエンコードに失敗しました');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/id-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_test_key_123'
      },
      body: JSON.stringify({
        documentImage,
        selfieImage,
        userInfo: {
          name: 'テスト ユーザー',
          birthDate: '1985-06-15',
          address: '大阪府大阪市北区梅田1-1-1'
        }
      })
    });

    const result = await response.json();
    console.log(`📋 HTTPステータス: ${response.status}`);
    console.log(`✅ 成功: ${result.success}`);

    if (result.success) {
      console.log('✅ 開発用APIキーでの認証が成功しました');
    } else {
      console.log(`❌ エラー: ${result.error}`);
    }

  } catch (error) {
    console.error(`❌ テスト実行エラー: ${error.message}`);
  }
}

// エラーハンドリングテスト
async function testErrorHandling() {
  console.log('🚨 エラーハンドリングテスト');
  console.log('─'.repeat(50));

  const testCases = [
    {
      name: '無効な画像データ',
      data: {
        documentImage: 'invalid_image_data',
        selfieImage: 'invalid_selfie_data'
      }
    },
    {
      name: '画像サイズ超過',
      data: {
        documentImage: 'data:image/jpeg;base64,' + 'A'.repeat(5 * 1024 * 1024), // 5MB
        selfieImage: 'data:image/jpeg;base64,' + 'B'.repeat(5 * 1024 * 1024)
      }
    },
    {
      name: '必須フィールド欠如',
      data: {
        documentImage: 'data:image/jpeg;base64,test'
        // selfieImage を省略
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`🧪 ${testCase.name}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/id-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      const result = await response.json();
      console.log(`📋 ステータス: ${response.status}`);
      console.log(`✅ 成功: ${result.success}`);
      
      if (!result.success) {
        console.log(`❌ エラー: ${result.error}`);
      }

    } catch (error) {
      console.error(`❌ テスト実行エラー: ${error.message}`);
    }
    
    console.log('');
  }
}

// メイン実行関数
async function main() {
  console.log('🐕 Doge ID Verify API テストスイート');
  console.log('='.repeat(60));
  console.log('');

  // サーバーが起動しているかチェック
  try {
    const healthCheck = await fetch('http://localhost:3000/api/id-verify', {
      method: 'GET'
    });
    
    if (!healthCheck.ok) {
      console.error('❌ サーバーが起動していません。npm run dev を実行してください。');
      return;
    }
    
    console.log('✅ サーバーが起動しています\n');
  } catch (error) {
    console.error('❌ サーバーに接続できません。npm run dev を実行してください。');
    return;
  }

  // テスト実行
  await testIDVerifyAPI();
  await testWithDevAPIKey();
  await testErrorHandling();

  console.log('🎉 すべてのテストが完了しました');
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testIDVerifyAPI,
  testWithDevAPIKey,
  testErrorHandling
}; 