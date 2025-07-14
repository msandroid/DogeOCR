import DemoClient from "@/components/demo-client"

export default function DemoPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* 重複しているタイトルを削除 */}
      <DemoClient />
    </div>
  )
}
