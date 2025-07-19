import IdVerifyChat from "@/components/id-verify-chat"

export default function IdVerifyChatPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">ID Verify 設定管理</h1>
        <p className="text-gray-600">
          チャットを通じてID verifyの認証条件を動的に変更できます。
          管理者権限を持つAPIキーが必要です。
        </p>
      </div>
      
      <IdVerifyChat />
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">使用方法</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>APIキーを入力して認証を行います</li>
          <li>チャットで自然言語で設定を変更できます</li>
          <li>クイックコマンドボタンでよく使う設定を素早く実行できます</li>
          <li>設定変更履歴で過去の変更を確認できます</li>
        </ul>
      </div>
    </div>
  )
} 