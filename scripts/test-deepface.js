/**
 * DeepFaceの動作テストスクリプト
 */

const { spawn } = require('child_process')
const path = require('path')

async function testDeepFace() {
  console.log('DeepFaceの動作テストを開始します...')
  
  // テスト用の画像パス（実際の画像パスに変更してください）
  const testImage1 = path.join(__dirname, '../input/001.png')
  const testImage2 = path.join(__dirname, '../input/002.png')
  
  // 画像ファイルの存在確認
  const fs = require('fs')
  if (!fs.existsSync(testImage1)) {
    console.error(`テスト画像1が見つかりません: ${testImage1}`)
    return
  }
  
  if (!fs.existsSync(testImage2)) {
    console.error(`テスト画像2が見つかりません: ${testImage2}`)
    return
  }
  
  console.log('テスト画像が見つかりました。')
  console.log(`画像1: ${testImage1}`)
  console.log(`画像2: ${testImage2}`)
  
  // Pythonスクリプトのパス
  const pythonScriptPath = path.join(__dirname, 'deepface-verify.py')
  
  console.log('DeepFace顔照合を実行中...')
  
  // Pythonプロセスを実行
  const pythonProcess = spawn('python3', [pythonScriptPath, testImage1, testImage2])
  
  let stdout = ''
  let stderr = ''
  
  pythonProcess.stdout.on('data', (data) => {
    stdout += data.toString()
  })
  
  pythonProcess.stderr.on('data', (data) => {
    stderr += data.toString()
  })
  
  pythonProcess.on('close', (code) => {
    console.log(`Pythonプロセスが終了コード ${code} で終了しました。`)
    
    if (code === 0) {
      try {
        const result = JSON.parse(stdout)
        console.log('DeepFace顔照合結果:')
        console.log(JSON.stringify(result, null, 2))
        
        if (result.success) {
          console.log('✅ DeepFaceの動作テストが成功しました！')
          console.log(`距離: ${result.distance}`)
          console.log(`認証結果: ${result.verified ? '成功' : '失敗'}`)
          console.log(`閾値: ${result.threshold}`)
          console.log(`モデル: ${result.model_name}`)
        } else {
          console.log('❌ DeepFaceの動作テストが失敗しました。')
          console.log(`エラー: ${result.error}`)
        }
      } catch (error) {
        console.error('結果の解析に失敗しました:', error)
        console.log('stdout:', stdout)
        console.log('stderr:', stderr)
      }
    } else {
      console.error('Pythonプロセスの実行に失敗しました。')
      console.log('stderr:', stderr)
    }
  })
  
  pythonProcess.on('error', (error) => {
    console.error('Pythonプロセスの実行エラー:', error.message)
  })
}

// テスト実行
testDeepFace().catch(console.error) 