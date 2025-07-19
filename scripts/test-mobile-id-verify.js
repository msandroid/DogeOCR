const fs = require('fs')
const path = require('path')

// テスト用の画像ファイルパス
const documentImagePath = path.join(__dirname, '../input/001.png')
const faceImagePath = path.join(__dirname, '../input/002.png')

async function testMobileIDVerify() {
  console.log('🚀 モバイルID Verify機能のテストを開始します...\n')

  try {
    // 1. セッション作成のテスト
    console.log('1. セッション作成のテスト')
    const sessionResponse = await fetch('http://localhost:3000/api/id-verify/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const sessionData = await sessionResponse.json()
    
    if (!sessionData.success) {
      throw new Error(`セッション作成に失敗: ${sessionData.error}`)
    }

    console.log('✅ セッション作成成功')
    console.log(`   セッションID: ${sessionData.data.id}`)
    console.log(`   モバイルURL: ${sessionData.data.mobileUrl}`)
    console.log(`   デスクトップURL: ${sessionData.data.desktopUrl}\n`)

    const sessionId = sessionData.data.id

    // 2. セッション情報取得のテスト
    console.log('2. セッション情報取得のテスト')
    const getSessionResponse = await fetch(`http://localhost:3000/api/id-verify/session/${sessionId}`)
    const getSessionData = await getSessionResponse.json()
    
    if (!getSessionData.success) {
      throw new Error(`セッション取得に失敗: ${getSessionData.error}`)
    }

    console.log('✅ セッション情報取得成功')
    console.log(`   ステータス: ${getSessionData.data.status}\n`)

    // 3. セッション更新のテスト
    console.log('3. セッション更新のテスト')
    const updateSessionResponse = await fetch(`http://localhost:3000/api/id-verify/session/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'active' }),
    })

    const updateSessionData = await updateSessionResponse.json()
    
    if (!updateSessionData.success) {
      throw new Error(`セッション更新に失敗: ${updateSessionData.error}`)
    }

    console.log('✅ セッション更新成功')
    console.log(`   新しいステータス: ${updateSessionData.data.status}\n`)

    // 4. 画像ファイルの読み込み
    console.log('4. 画像ファイルの読み込み')
    if (!fs.existsSync(documentImagePath) || !fs.existsSync(faceImagePath)) {
      throw new Error('テスト用の画像ファイルが見つかりません')
    }

    const documentImage = fs.readFileSync(documentImagePath)
    const faceImage = fs.readFileSync(faceImagePath)

    console.log('✅ 画像ファイル読み込み成功\n')

    // 5. モバイルID verify APIのテスト
    console.log('5. モバイルID verify APIのテスト')
    const formData = new FormData()
    formData.append('documentImage', new Blob([documentImage], { type: 'image/png' }), 'document.png')
    formData.append('faceImage', new Blob([faceImage], { type: 'image/png' }), 'face.png')
    formData.append('sessionId', sessionId)

    const verifyResponse = await fetch('http://localhost:3000/api/id-verify', {
      method: 'POST',
      body: formData,
    })

    const verifyData = await verifyResponse.json()
    
    if (!verifyData.success) {
      throw new Error(`ID verifyに失敗: ${verifyData.error}`)
    }

    console.log('✅ モバイルID verify成功')
    console.log(`   文書種別: ${verifyData.data.documentType}`)
    console.log(`   顔照合スコア: ${(verifyData.data.faceMatchScore * 100).toFixed(1)}%`)
    console.log(`   顔照合結果: ${verifyData.data.faceMatchResult}`)
    console.log(`   真贋判定: ${verifyData.data.documentAuthenticity}`)
    console.log(`   最終判定: ${verifyData.data.finalJudgement}`)
    console.log(`   処理時間: ${verifyData.data.processingTime}ms`)
    console.log(`   信頼度: ${(verifyData.data.confidence * 100).toFixed(1)}%\n`)

    // 6. セッション完了のテスト
    console.log('6. セッション完了のテスト')
    const completeSessionResponse = await fetch(`http://localhost:3000/api/id-verify/session/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status: 'completed',
        result: verifyData.data
      }),
    })

    const completeSessionData = await completeSessionResponse.json()
    
    if (!completeSessionData.success) {
      throw new Error(`セッション完了に失敗: ${completeSessionData.error}`)
    }

    console.log('✅ セッション完了成功')
    console.log(`   最終ステータス: ${completeSessionData.data.status}\n`)

    // 7. セッション統計のテスト
    console.log('7. セッション統計のテスト')
    const statsResponse = await fetch('http://localhost:3000/api/id-verify/session')
    const statsData = await statsResponse.json()
    
    if (!statsData.success) {
      throw new Error(`統計取得に失敗: ${statsData.error}`)
    }

    console.log('✅ セッション統計取得成功')
    console.log(`   総セッション数: ${statsData.data.stats.total}`)
    console.log(`   アクティブセッション数: ${statsData.data.activeSessions}\n`)

    console.log('🎉 すべてのテストが成功しました！')
    console.log('\n📱 モバイルテスト手順:')
    console.log(`1. ブラウザで http://localhost:3000/id-verify/qr にアクセス`)
    console.log('2. 表示されたQRコードをスマートフォンで読み取り')
    console.log('3. モバイルページで身分証明書と顔写真を撮影')
    console.log('4. デスクトップページで結果を確認')

  } catch (error) {
    console.error('❌ テストに失敗しました:', error.message)
    process.exit(1)
  }
}

// スクリプトが直接実行された場合のみテストを実行
if (require.main === module) {
  testMobileIDVerify()
}

module.exports = { testMobileIDVerify } 