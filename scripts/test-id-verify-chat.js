const fs = require('fs')
const path = require('path')

// APIキー（環境変数から取得）
const API_KEY = process.env.FIREWORKS_API_KEY || 'your-api-key-here'

// テスト用のメッセージ
const testMessages = [
  "設定",
  "ヘルプ",
  "顔認証承認0.85",
  "最小年齢20",
  "文書SUSPICIOUS許可",
  "OCR信頼度0.8",
  "リセット"
]

async function testChatAPI() {
  console.log('🚀 ID Verify チャットAPI テスト開始\n')

  for (const message of testMessages) {
    console.log(`📝 テストメッセージ: "${message}"`)
    
    try {
      const response = await fetch('http://localhost:3000/api/id-verify/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          message: message,
          userId: 'test-user',
        }),
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ 成功')
        console.log(`📤 レスポンス: ${data.data.response}`)
        console.log(`🔄 設定変更: ${data.data.settingsChanged}`)
        if (data.data.action) {
          console.log(`🎯 アクション: ${data.data.action}`)
        }
      } else {
        console.log('❌ エラー')
        console.log(`💥 エラーメッセージ: ${data.error}`)
      }
    } catch (error) {
      console.log('❌ 通信エラー')
      console.log(`💥 エラー: ${error.message}`)
    }

    console.log('---\n')
    
    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('🏁 テスト完了')
}

async function testSettingsAPI() {
  console.log('🔧 設定API テスト開始\n')

  try {
    // 設定取得テスト
    console.log('📋 設定取得テスト')
    const getResponse = await fetch('http://localhost:3000/api/id-verify/settings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    })

    const getData = await getResponse.json()
    if (getData.success) {
      console.log('✅ 設定取得成功')
      console.log(`📊 顔認証承認閾値: ${getData.data.faceMatchThresholds.approved}`)
      console.log(`📊 最小年齢: ${getData.data.ageRestrictions.minimumAge}`)
    } else {
      console.log('❌ 設定取得失敗')
      console.log(`💥 エラー: ${getData.error}`)
    }

    console.log('---\n')

    // 設定更新テスト
    console.log('📝 設定更新テスト')
    const updateResponse = await fetch('http://localhost:3000/api/id-verify/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        settings: {
          faceMatchThresholds: {
            approved: 0.85
          }
        },
        updatedBy: 'test-user',
        description: 'テスト用設定更新'
      }),
    })

    const updateData = await updateResponse.json()
    if (updateData.success) {
      console.log('✅ 設定更新成功')
      console.log(`📊 新しい顔認証承認閾値: ${updateData.data.faceMatchThresholds.approved}`)
    } else {
      console.log('❌ 設定更新失敗')
      console.log(`💥 エラー: ${updateData.error}`)
    }

    console.log('---\n')

    // 設定リセットテスト
    console.log('🔄 設定リセットテスト')
    const resetResponse = await fetch('http://localhost:3000/api/id-verify/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        reset: true,
        updatedBy: 'test-user'
      }),
    })

    const resetData = await resetResponse.json()
    if (resetData.success) {
      console.log('✅ 設定リセット成功')
      console.log(`📊 リセット後の顔認証承認閾値: ${resetData.data.faceMatchThresholds.approved}`)
    } else {
      console.log('❌ 設定リセット失敗')
      console.log(`💥 エラー: ${resetData.error}`)
    }

  } catch (error) {
    console.log('❌ 通信エラー')
    console.log(`💥 エラー: ${error.message}`)
  }

  console.log('🏁 設定API テスト完了')
}

// メイン実行
async function main() {
  console.log('🧪 ID Verify チャット機能テスト\n')
  
  // サーバーが起動しているかチェック
  try {
    const healthCheck = await fetch('http://localhost:3000/api/id-verify')
    if (!healthCheck.ok) {
      console.log('❌ サーバーが起動していません。npm run dev を実行してください。')
      return
    }
  } catch (error) {
    console.log('❌ サーバーに接続できません。npm run dev を実行してください。')
    return
  }

  await testChatAPI()
  await testSettingsAPI()
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testChatAPI, testSettingsAPI } 