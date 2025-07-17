import React from "react";

export default function CommercialDisclosurePage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Doge Works 特定商取引法に基づく表記</h1>
      <table className="w-full border border-gray-300 text-sm mb-8">
        <tbody>
          <tr className="border-b">
            <th className="text-left p-2 w-1/3">事業者の名称</th>
            <td className="p-2">宮谷 歩</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">代表者</th>
            <td className="p-2">宮谷 歩</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">住所</th>
            <td className="p-2">〒105-0013 東京都港区浜松町2丁目2番15号 浜松町ダイヤビル２F</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">お問い合わせ</th>
            <td className="p-2">support@sparkapple.com<br />電話番号はご請求いただければ遅滞なく開示いたします。</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">販売価格・サービス提供の対価</th>
            <td className="p-2">各商品ページまたは利用契約にて表示</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">支払期限</th>
            <td className="p-2">利用規約に定めます。</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">支払方法</th>
            <td className="p-2">クレジットカード、銀行振込</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">サービス提供の時期</th>
            <td className="p-2">利用契約締結後または代金決済手続き完了後、速やかに提供</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">返品・キャンセル</th>
            <td className="p-2">トライアル期間中はいつでもキャンセルできます。<br />月額プランのご契約をキャンセルする場合は、未納分のご利用料金及び当該月のご利用料金をお支払い後にキャンセルが可能です。<br />年間プランでのご契約をキャンセルする場合は、未納分のご利用料金、当該月のご利用料金及び残余契約期間の契約料金をお支払い後にキャンセルが可能です。</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">動作環境</th>
            <td className="p-2">各サービスページに表示</td>
          </tr>
          <tr>
            <th className="text-left p-2">特別な販売・提供条件等</th>
            <td className="p-2">特別な条件がある場合は、各商品ページまたは利用契約にて表示</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
} 