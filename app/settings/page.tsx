"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Monitor, Settings } from "lucide-react"
import Image from "next/image"

export default function SettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme()

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">設定</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            アプリケーションの表示設定をカスタマイズできます
          </p>
        </div>

        <div className="space-y-6">
          {/* テーマ設定 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentTheme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                テーマ設定
              </CardTitle>
              <CardDescription>
                アプリケーションの外観を変更できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={theme} 
                onValueChange={setTheme}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Light テーマ */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label 
                    htmlFor="light" 
                    className="flex-1 cursor-pointer"
                  >
                    <Card className={`transition-all duration-200 ${
                      theme === "light" 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:bg-accent/50"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-background rounded-md">
                            <Image src="/images/icon 2.png" alt="Light mode" width={16} height={16} className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">Light</div>
                            <div className="text-sm text-muted-foreground">
                              明るいテーマ
                            </div>
                          </div>
                        </div>
                        {/* プレビュー */}
                        <div className="mt-3 p-2 bg-white border rounded-md">
                          <div className="h-2 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>

                {/* Dark テーマ */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label 
                    htmlFor="dark" 
                    className="flex-1 cursor-pointer"
                  >
                    <Card className={`transition-all duration-200 ${
                      theme === "dark" 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:bg-accent/50"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-background rounded-md">
                            <Image src="/images/icon 1.png" alt="Dark mode" width={16} height={16} className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">Dark</div>
                            <div className="text-sm text-muted-foreground">
                              ダークテーマ
                            </div>
                          </div>
                        </div>
                        {/* プレビュー */}
                        <div className="mt-3 p-2 bg-gray-900 border border-gray-700 rounded-md">
                          <div className="h-2 bg-gray-700 rounded mb-1"></div>
                          <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>

                {/* System テーマ */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label 
                    htmlFor="system" 
                    className="flex-1 cursor-pointer"
                  >
                    <Card className={`transition-all duration-200 ${
                      theme === "system" 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:bg-accent/50"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-background rounded-md">
                            <Monitor className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">System</div>
                            <div className="text-sm text-muted-foreground">
                              システム設定に従う
                            </div>
                          </div>
                        </div>
                        {/* プレビュー */}
                        <div className="mt-3 p-2 bg-gradient-to-r from-white to-gray-900 border rounded-md">
                          <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded mb-1"></div>
                          <div className="h-2 bg-gradient-to-r from-gray-100 to-gray-600 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              </RadioGroup>

              {/* 現在のテーマ表示 */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <span className="text-sm text-muted-foreground">現在のテーマ:</span>
                <Badge variant="outline">
                  {currentTheme === "dark" ? "Dark" : "Light"}
                  {theme === "system" && " (システム設定)"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* その他の設定 (将来の拡張用) */}
          <Card>
            <CardHeader>
              <CardTitle>その他の設定</CardTitle>
              <CardDescription>
                今後追加予定の設定項目
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">言語設定</div>
                    <div className="text-sm text-muted-foreground">
                      表示言語を変更 (今後実装予定)
                    </div>
                  </div>
                  <Badge variant="secondary">準備中</Badge>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">通知設定</div>
                    <div className="text-sm text-muted-foreground">
                      プッシュ通知の設定 (今後実装予定)
                    </div>
                  </div>
                  <Badge variant="secondary">準備中</Badge>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">データ保存設定</div>
                    <div className="text-sm text-muted-foreground">
                      処理履歴の保存期間 (今後実装予定)
                    </div>
                  </div>
                  <Badge variant="secondary">準備中</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 