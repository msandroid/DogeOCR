"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import React from "react"
import Link from "next/link"
import { Copy, Key, Lock, Crown } from "lucide-react"
import { canUseApiKeys, getPlanName } from "@/lib/subscription-utils"
import { useRouter } from "next/navigation"

export default function ApiKeysPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showIssued, setShowIssued] = useState(false)
  const [showDelete, setShowDelete] = useState<string|null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [issuedKey, setIssuedKey] = useState<string|null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const userId = session?.user?.id || null
  
  // 仮実装: すべてのユーザーをFREEプランとして扱う
  const currentPlan = 'FREE' as const
  const canUseApi = canUseApiKeys(currentPlan)

  // サブスクリプション状態をチェックしてリダイレクト
  useEffect(() => {
    if (status === "authenticated" && !canUseApi) {
      // アクセス権限がない場合はダッシュボードにリダイレクト
      router.push('/dashboard')
      toast.error("APIキー機能はPROプラン以上が必要です")
    }
  }, [status, canUseApi, router])

  // APIキー一覧取得
  const fetchApiKeys = async () => {
    if (!userId) return
    setFetching(true)
    try {
      const res = await fetch("/api/auth/api-key", {
        headers: { "x-user-id": userId },
      })
      const data = await res.json()
      setApiKeys(data.apiKeys || [])
    } finally {
      setFetching(false)
    }
  }

  // 新規APIキー発行
  const handleCreate = async () => {
    if (!userId || !newKeyName) {
      console.log("Debug: userId =", userId, "newKeyName =", newKeyName)
      toast.error("ユーザーIDまたはAPIキー名が不足しています")
      return
    }
    
    if (!canUseApi) {
      toast.error("APIキー機能はPROプランまたはENTERPRISEプランでのみ利用可能です")
      return
    }
    
    setLoading(true)
    try {
      console.log("Debug: Sending request with userId =", userId)
      const res = await fetch("/api/auth/api-key", {
        method: "POST",
        headers: { "x-user-id": userId, "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      })
      const data = await res.json()
      console.log("Debug: Response =", data)
      if (data.apiKey) {
        toast.success("APIキーを発行しました")
        setIssuedKey(data.apiKey)
        setShowIssued(true)
        setShowCreate(false)
        setNewKeyName("")
        fetchApiKeys()
      } else {
        if (data.error && data.error.includes('PROプラン')) {
          toast.error("APIキー機能はPROプラン以上が必要です")
        } else {
          toast.error(data.error || "APIキー発行に失敗")
        }
      }
    } catch (error) {
      console.error("Debug: Error =", error)
      toast.error("APIキー発行中にエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  // APIキー削除
  const handleDelete = async (key: string, name: string) => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch("/api/auth/api-key", {
        method: "DELETE",
        headers: { "x-user-id": userId, "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("APIキーを削除しました")
        fetchApiKeys()
        setShowDelete(null)
        setDeleteConfirm("")
      } else {
        toast.error(data.error || "削除に失敗")
      }
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    console.log("Debug: Session =", session)
    console.log("Debug: userId =", userId)
    console.log("Debug: Session status =", status)
    if (userId) {
      console.log("Debug: Fetching API keys for userId =", userId)
      fetchApiKeys()
    } else {
      console.log("Debug: No userId available, session status =", status)
    }
  }, [userId, session, status])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>ログインが必要です</CardTitle>
            <div className="text-muted-foreground">APIキー管理ページを利用するにはログインしてください</div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/signin">ログイン</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // サブスクリプション状態をチェック
  if (!canUseApi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              {getPlanName('PRO')}以上が必要です
            </CardTitle>
            <div className="text-muted-foreground">
              APIキー機能は{getPlanName('PRO')}または{getPlanName('ENTERPRISE')}プランでのみ利用可能です。
              現在のプラン: {getPlanName(currentPlan)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">利用可能な機能:</h4>
              <ul className="text-sm space-y-1">
                <li>• APIキーの作成・管理</li>
                <li>• プログラムによるAPIアクセス</li>
                <li>• 優先サポート</li>
                <li>• カスタムテンプレート対応</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href="/pricing/new">プランをアップグレード</Link>
              </Button>
              <Button asChild variant="outDoge">
                <Link href="/dashboard">ダッシュボードに戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <div className="w-full max-w-3xl p-8">
        {/* Debug information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-sm">
            <div><strong>Debug Info:</strong></div>
            <div>Session Status: {status}</div>
            <div>User ID: {userId || 'null'}</div>
            <div>Session User: {session?.user?.name || 'null'}</div>
            <div>Session Email: {session?.user?.email || 'null'}</div>
            <div>Current Plan: {getPlanName(currentPlan)}</div>
            <div>Can Use API Keys: {canUseApi ? 'Yes' : 'No'}</div>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <div className="text-muted-foreground">Authenticate programmatically with Fireworks AI</div>
            {!canUseApi && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    APIキー機能は{getPlanName('PRO')}以上で利用可能です
                  </span>
                </div>
                <div className="mt-2">
                  <Button asChild size="sm" variant="outDoge">
                    <Link href="/pricing/new">プランをアップグレード</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Button 
            className="rounded-xl px-6 py-2 text-base font-semibold" 
            onClick={() => {
              console.log("Debug: Create API Key button clicked")
              console.log("Debug: Current session =", session)
              console.log("Debug: Current userId =", userId)
              setShowCreate(true)
            }}
            disabled={!canUseApi}
          >
            {canUseApi ? (
              "Create API Key"
            ) : (
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                PRO以上が必要
              </div>
            )}
          </Button>
        </div>
        <h2 className="text-xl font-semibold mb-4">Secure Keys</h2>
        <div className="space-y-4">
          {!canUseApi ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Crown className="h-16 w-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground">APIキー機能は{getPlanName('PRO')}以上で利用可能です</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    現在のプラン: {getPlanName(currentPlan)}
                  </p>
                </div>
                <Button asChild variant="outDoge">
                  <Link href="/pricing/new">プランをアップグレード</Link>
                </Button>
              </div>
            </div>
          ) : fetching ? (
            <div>読み込み中...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-muted-foreground">APIキーはありません</div>
          ) : (
            apiKeys.map((k:any) => (
              <div key={k.key} className="flex items-center justify-between border rounded-xl px-6 py-6 bg-white">
                <div className="flex items-center gap-4">
                  <Key className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <div className="text-lg font-semibold">{k.name}</div>
                    <div className="text-xs text-muted-foreground">Created: {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "-"}</div>
                  </div>
                </div>
                <Button variant="destructive" className="rounded-xl px-6 py-2 font-semibold" onClick={()=>{setShowDelete(k.key); setDeleteConfirm("")}}>
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* 作成ダイアログ */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new API Key</DialogTitle>
            <div className="text-muted-foreground mb-2">Add a name to your API key to help you identify it later.</div>
          </DialogHeader>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">API Key Name*</label>
            <Input placeholder="Enter a name" value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold" 
              onClick={() => {
                console.log("Debug: Create Key button in dialog clicked")
                console.log("Debug: newKeyName =", newKeyName)
                console.log("Debug: userId =", userId)
                console.log("Debug: loading =", loading)
                handleCreate()
              }} 
              disabled={!newKeyName || loading}
            >
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 1回のみ表示ダイアログ */}
      <Dialog open={showIssued} onOpenChange={v=>{setShowIssued(v); if(!v) setIssuedKey(null)}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy your API Key</DialogTitle>
            <div className="text-red-600 font-semibold mb-2">This value is viewable one time only</div>
            <div className="text-muted-foreground mb-2">Copy the below key to your clipboard and store it somewhere safe</div>
          </DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono bg-gray-100 rounded px-2 py-1 text-base">{issuedKey}</span>
            <Button variant="ghost" size="icon" onClick={()=>{navigator.clipboard.writeText(issuedKey||""); toast.success("Copied!")}}>
              <Copy className="w-5 h-5" />
            </Button>
          </div>
          <DialogFooter>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold" onClick={()=>{setShowIssued(false); setIssuedKey(null)}}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 削除確認ダイアログ */}
      <Dialog open={!!showDelete} onOpenChange={v=>{if(!v) setShowDelete(null)}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <div className="text-muted-foreground mb-2">Are you sure you want to delete this API key?</div>
            <div className="mb-2">Confirm by typing the name of the key: <span className="font-mono bg-gray-100 rounded px-2 py-1">{apiKeys.find(k=>k.key===showDelete)?.name}</span>
              <Button variant="ghost" size="icon" onClick={()=>{navigator.clipboard.writeText(apiKeys.find(k=>k.key===showDelete)?.name||""); toast.success("Copied!")}}>
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          <Input placeholder="API Key Name" value={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="destructive" className="rounded-xl px-6 py-2 font-semibold" disabled={deleteConfirm!==apiKeys.find(k=>k.key===showDelete)?.name} onClick={()=>handleDelete(showDelete!, deleteConfirm)}>
              Delete Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 