"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Settings, RotateCcw, HelpCircle } from "lucide-react"

interface ChatMessage {
  id: string
  message: string
  isUser: boolean
  timestamp: Date
  settingsChanged?: boolean
  newSettings?: any
  action?: string
}

interface ChatResponse {
  response: string
  settingsChanged: boolean
  newSettings?: any
  action?: string
}

export default function IdVerifyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "ID verifyの設定管理チャットです。'ヘルプ'と入力すると利用可能なコマンドを確認できます。",
      isUser: false,
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 自動スクロール
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // メッセージ送信
  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/id-verify/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: "admin",
        }),
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.data.response,
          isUser: false,
          timestamp: new Date(),
          settingsChanged: data.data.settingsChanged,
          newSettings: data.data.newSettings,
          action: data.data.action,
        }

        setMessages(prev => [...prev, botMessage])
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: `エラー: ${data.error}`,
          isUser: false,
          timestamp: new Date(),
        }

        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: `通信エラー: ${error}`,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // クイックコマンド
  const quickCommands = [
    { label: "設定表示", command: "設定" },
    { label: "ヘルプ", command: "ヘルプ" },
    { label: "リセット", command: "リセット" },
    { label: "顔認証0.8", command: "顔認証承認0.8" },
    { label: "年齢20", command: "最小年齢20" },
  ]

  const executeQuickCommand = (command: string) => {
    setInputMessage(command)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          ID Verify 設定管理チャット
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* APIキー入力 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">APIキー</label>
          <Input
            type="password"
            placeholder="APIキーを入力してください"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* クイックコマンド */}
        <div className="space-y-2">
          <label className="text-sm font-medium">クイックコマンド</label>
          <div className="flex flex-wrap gap-2">
            {quickCommands.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => executeQuickCommand(cmd.command)}
                disabled={!apiKey.trim()}
              >
                {cmd.label}
              </Button>
            ))}
          </div>
        </div>

        {/* チャット履歴 */}
        <div className="border rounded-lg">
          <ScrollArea ref={scrollAreaRef} className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.message}</div>
                    {message.settingsChanged && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          設定変更済み
                        </Badge>
                      </div>
                    )}
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      処理中...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* メッセージ入力 */}
        <div className="flex gap-2">
          <Input
            placeholder="メッセージを入力してください..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            disabled={!apiKey.trim() || isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || !apiKey.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* 設定変更履歴 */}
        {messages.some(m => m.settingsChanged) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">設定変更履歴</label>
            <div className="space-y-2">
              {messages
                .filter(m => m.settingsChanged)
                .map((message, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                    <div className="font-medium">{message.action}</div>
                    <div className="text-gray-600">
                      {message.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 