import React from "react";

export default function DashboardCommercialDisclosurePage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">特定商取引法に基づく表記</h1>
      <table className="w-full border border-gray-300 text-sm mb-8">
        <tbody>
          <tr className="border-b">
            <th className="text-left p-2 w-1/3 bg-gray-50">事業者の名称</th>
            <td className="p-2">宮谷 歩</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">事業者の住所</th>
            <td className="p-2">〒105-0013 東京都港区浜松町2丁目2番15号 浜松町ダイヤビル２F</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">電話番号</th>
            <td className="p-2">（請求があれば遅滞なく開示します）</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">メールアドレス</th>
            <td className="p-2">support@sparkapple.com</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">運営責任者</th>
            <td className="p-2">宮谷 歩</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">販売価格</th>
            <td className="p-2">各商品ページに記載（消費税含む）</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">商品代金以外の必要料金</th>
            <td className="p-2">振込手数料・送料等が発生する場合は、各商品ページに記載</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">返品・交換・キャンセル</th>
            <td className="p-2">
              ＜お客様都合の場合＞未開封・未使用品に限り、商品到着後10日以内にご連絡いただいた場合に対応します。<br />
              ＜不良品の場合＞商品到着後10日以内にご連絡いただければ、送料当社負担で交換または返金いたします。
            </td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">引き渡し時期</th>
            <td className="p-2">ご注文後3～5営業日以内に発送、または注文後すぐにサービス提供</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2 bg-gray-50">支払方法</th>
            <td className="p-2">クレジットカード、銀行振込</td>
          </tr>
          <tr>
            <th className="text-left p-2 bg-gray-50">支払時期</th>
            <td className="p-2">クレジットカード：ご注文時／銀行振込：ご注文後3日以内</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-gray-500">本ページは、<a href="https://support.stripe.com/questions/how-to-create-and-display-a-commerce-disclosure-page" target="_blank" rel="noopener noreferrer" className="underline">Stripe公式ガイド</a>を参考に作成しています。</p>
    </main>
  );
} 