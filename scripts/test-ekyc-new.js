const fs = require('fs')
const path = require('path')

// テスト用の画像ファイルパス
const documentImagePath = path.join(__dirname, '../input/001.png')
const documentFaceImagePath = path.join(__dirname, '../input/002.png')
const faceImagePath = path.join(__dirname, '../input/003.JPG')

async function testNewEKYC() {
  console.log('🚀 Doge eKYC新機能のテストを開始します...\n')

  try {
    // 1. 画像ファイルの読み込み
    console.log('1. テスト画像の読み込み')
    const documentImage = fs.readFileSync(documentImagePath)
    const documentFaceImage = fs.readFileSync(documentFaceImagePath)
    const faceImage = fs.readFileSync(faceImagePath)
    
    const documentBase64 = documentImage.toString('base64')
    const documentFaceBase64 = documentFaceImage.toString('base64')
    const faceBase64 = faceImage.toString('base64')
    
    console.log('✅ テスト画像読み込み成功')
    console.log(`   身分証表面画像サイズ: ${documentImage.length} bytes`)
    console.log(`   身分証顔画像サイズ: ${documentFaceImage.length} bytes`)
    console.log(`   セルフィー画像サイズ: ${faceImage.length} bytes\n`)

    // 2. eKYC認証処理のテスト
    console.log('2. eKYC認証処理のテスト')
    const verifyResponse = await fetch('http://localhost:3000/api/ekyc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentImage: `data:image/png;base64,${documentBase64}`,
        documentFaceImage: `data:image/png;base64,${documentFaceBase64}`,
        selfieImage: `data:image/jpeg;base64,${faceBase64}`,
        userInfo: {
          name: "テスト 太郎",
          birthDate: "1990-01-01",
          address: "東京都渋谷区テスト1-1-1"
        }
      }),
    })

    const verifyData = await verifyResponse.json()
    
    if (!verifyData.success) {
      throw new Error(`eKYC認証に失敗: ${verifyData.error}`)
    }

    console.log('✅ eKYC認証処理成功')
    console.log(`   最終判定: ${verifyData.data.finalJudgement}`)
    console.log(`   顔認証スコア: ${(verifyData.data.faceMatchScore * 100).toFixed(1)}%`)
    console.log(`   顔認証結果: ${verifyData.data.faceMatchResult}`)
    console.log(`   処理時間: ${verifyData.data.processingTime}ms`)
    console.log(`   信頼度: ${(verifyData.data.confidence * 100).toFixed(1)}%`)
    
    if (verifyData.data.ageVerification) {
      console.log(`   年齢: ${verifyData.data.ageVerification.age}歳`)
      console.log(`   成年判定: ${verifyData.data.ageVerification.isAdult ? '成年' : '未成年'}`)
    }
    
    if (verifyData.data.documentOcr) {
      console.log(`   OCR結果: ${JSON.stringify(verifyData.data.documentOcr, null, 2)}`)
    }
    
    console.log(`   セッションID: ${verifyData.data.sessionId}`)
    console.log(`   タイムスタンプ: ${verifyData.data.timestamp}\n`)

    // 3. API仕様取得のテスト
    console.log('3. API仕様取得のテスト')
    const specResponse = await fetch('http://localhost:3000/api/ekyc')
    const specData = await specResponse.json()
    
    if (specData.name) {
      console.log('✅ API仕様取得成功')
      console.log(`   API名: ${specData.name}`)
      console.log(`   バージョン: ${specData.version}`)
      console.log(`   説明: ${specData.description}`)
    } else {
      console.log('⚠️ API仕様取得に失敗')
    }

    console.log('\n🎉 eKYC新機能のテストが完了しました！')

  } catch (error) {
    console.error('❌ テストエラー:', error.message)
    process.exit(1)
  }
}

// スクリプトが直接実行された場合のみテストを実行
if (require.main === module) {
  testNewEKYC()
}

module.exports = { testNewEKYC } 