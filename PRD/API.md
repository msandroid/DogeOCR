**APIリクエスト機能の実装：Python、TypeScript、Java、Go、Shellに対応したPRD**

---

# プロダクト要件定義書（PRD）

## 1. 概要

本ドキュメントは、アカウント登録済みユーザーが自分のAPIキーを使って、APIリクエストを行えるクライアントライブラリ/スニペットを各種言語（Python、TypeScript、Java、Go、Shell）向けに提供・実装するための機能要件を定義する。

---

## 2. 目的

* APIキーを用いた認証付きAPIアクセス機能を主要言語で提供
* ユーザーが自身の環境で簡単にAPIを呼び出せるサンプルコードを提示
* セキュアかつ拡張可能なAPI通信を実現する

---

## 3. 対象ユーザー

* アカウント登録済みユーザー
* APIキーを取得済みの開発者
* 開発言語として Python / TypeScript / Java / Go / Shell を使用している個人または法人開発者

---

## 4. 対応言語

| 言語         | バージョン要件           | ライブラリ要件                  |
| ---------- | ----------------- | ------------------------ |
| Python     | 3.8以上             | requests                 |
| TypeScript | ES6 / Node.js 16+ | axios                    |
| Java       | Java 11以上         | HttpClient (Java標準API)   |
| Go         | Go 1.16以上         | net/http + encoding/json |
| Shell      | curl 利用可能なUNIX環境  | curl                     |

---

## 5. 機能要件

### 5.1 共通仕様

* 認証は `Authorization: Bearer <API_KEY>` ヘッダにて行う
* エンドポイント例：

  * `POST https://api.example.com/v1/resource`
* リクエスト形式：JSON
* レスポンス形式：JSON
* エラーハンドリング：

  * 401 Unauthorized：APIキーが不正
  * 429 Too Many Requests：レート制限
  * 500 Internal Server Error：サーバーエラー

### 5.2 使用例コード（各言語）

#### Python

```python
# example.py
import requests

API_KEY = "your_api_key"
url = "https://api.example.com/v1/resource"
headers = {"Authorization": f"Bearer {API_KEY}"}
payload = {"input": "value"}

response = requests.post(url, headers=headers, json=payload)
print("Response:", response.json())
```

#### TypeScript (Node.js)

```ts
// example.ts
import axios from 'axios';

const API_KEY = "your_api_key";
const url = "https://api.example.com/v1/resource";

axios.post(url, { input: "value" }, {
  headers: { Authorization: `Bearer ${API_KEY}` }
})
.then(res => console.log("Response:", res.data))
.catch(err => console.error("Error:", err));
```

#### Java

```java
// Example.java
import java.net.URI;
import java.net.http.*;
import java.net.http.HttpRequest.BodyPublishers;
import java.util.Map;

public class Example {
  public static void main(String[] args) throws Exception {
    String apiKey = "your_api_key";
    String json = "{\"input\":\"value\"}";

    HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create("https://api.example.com/v1/resource"))
      .header("Authorization", "Bearer " + apiKey)
      .header("Content-Type", "application/json")
      .POST(BodyPublishers.ofString(json))
      .build();

    HttpResponse<String> response = HttpClient.newHttpClient()
      .send(request, HttpResponse.BodyHandlers.ofString());

    System.out.println("Response: " + response.body());
  }
}
```

#### Go

```go
// example.go
package main

import (
  "bytes"
  "encoding/json"
  "fmt"
  "net/http"
)

func main() {
  apiKey := "your_api_key"
  url := "https://api.example.com/v1/resource"

  body := map[string]string{"input": "value"}
  jsonData, _ := json.Marshal(body)

  req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
  req.Header.Set("Authorization", "Bearer "+apiKey)
  req.Header.Set("Content-Type", "application/json")

  client := &http.Client{}
  resp, _ := client.Do(req)
  defer resp.Body.Close()

  var result map[string]interface{}
  json.NewDecoder(resp.Body).Decode(&result)
  fmt.Println("Response:", result)
}
```

#### Shell (curl)

```sh
# example.sh
API_KEY="your_api_key"
curl -X POST https://api.example.com/v1/resource \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"value"}'
```

---

## 6. 非機能要件

* APIキーのセキュアな取り扱いをガイドとして提供
* サンプルコードはMITライセンスまたはCC0で提供
* GitHubリポジトリにて各言語サンプルを提供
* リクエストとレスポンスのログ出力例を含む
* CLIでの簡易テスト手順付きREADMEを付属

---

## 7. UI / UX（APIポータル側）

* APIキーの取得UI：マイページ内にキー生成ボタン
* コード生成：言語選択でコードスニペットが切り替え可能
* 利用状況表示：APIリクエスト数・エラーレートなど

---

## 8. セキュリティ

* HTTPS通信必須
* APIキーは暗号化保存
* APIキーは再生成・無効化可能
* レートリミット設定：1分間あたり60リクエスト
* IP制限設定オプション提供（任意）

---

## 9. 成果物

* 言語別サンプルコード5種（ファイル名付き）
* READMEおよびドキュメント（Markdown形式）
* APIキー管理UIのモックアップ or 実装
* コードスニペット埋め込み可能なHTMLテンプレート

---

## 出力フォーマット

* Markdown形式
* コードブロック付き（ファイル名を先頭に明記）
* JSONレスポンス例付き（必要に応じて）

---

## 例

### 入力

* API\_KEY: `abc123`
* input: `hello`

### 出力

```json
{
  "status": "ok",
  "result": "Processed: hello"
}
```

---

必要であれば、それぞれの言語での単体テストコード、リクエスト検証ルール、OpenAPI仕様書なども追加で作成可能です。ご希望があればお知らせください。

---

## 10. Doge OCR API利用仕様

### 10.1 エンドポイント例

- 画像からテキスト抽出: `POST https://api.example.com/v1/ocr/extract`
- バッチ処理: `POST https://api.example.com/v1/ocr/batch`

### 10.2 認証

- `Authorization: Bearer <API_KEY>` ヘッダ必須

### 10.3 リクエスト例（Python）

```python
import requests
API_KEY = "your_api_key"
url = "https://api.example.com/v1/ocr/extract"
headers = {"Authorization": f"Bearer {API_KEY}"}
files = {"file": open("sample.png", "rb")}
response = requests.post(url, headers=headers, files=files)
print(response.json())
```

### 10.4 リクエスト例（curl）

```sh
API_KEY="your_api_key"
curl -X POST https://api.example.com/v1/ocr/extract \
  -H "Authorization: Bearer $API_KEY" \
  -F file=@sample.png
```

### 10.5 レスポンス例

```json
{
  "status": "success",
  "job_id": "uuid",
  "processing_time": 1.23,
  "result": {
    "text": "抽出されたテキスト",
    "confidence": 0.98
  }
}
```

### 10.6 利用手順
1. マイページでAPIキーを取得
2. 上記エンドポイントにAPIキー付きでリクエスト
3. レスポンスで抽出テキスト等を取得

---
API Key機能を実装する方法は「誰がどのAPIにアクセスできるかを管理し、認証と制限を行う」ことが目的です。以下のステップで整理して説明します。

---

# タスク

API Key 機能をサーバーサイドアプリケーションに実装する方法を説明してください。

## 目的

* 利用者ごとに発行されたAPI KeyによってAPIアクセスを認証する
* 無認可アクセスの防止
* 利用制限（レート制限や有効期限）の設定

---

## ステップ

### 1. **API Keyの生成**

* ランダムな文字列を生成（例: UUID, HMAC, Base64など）
* 可能であれば非対称署名も検討（JWTなど）

**例: Python**

```python
import secrets

def generate_api_key():
    return secrets.token_hex(32)
```

### 2. **保存**

* API Keyはハッシュ化してDBに保存（漏洩対策）
* 利用者と紐付け（User ID, アプリ名など）

**例: データベーススキーマ**

```sql
CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  key_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

### 3. **API Keyの検証**

* クライアントから送信されたAPI Keyをハッシュ化し、DBと照合
* 存在確認、無効化状態、期限切れなどもチェック

**例: Express + Node.js**

```javascript
app.use("/api", async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const hashedKey = hashFunction(apiKey);
  const keyRecord = await db.apiKeys.findOne({ key_hash: hashedKey, is_active: true });

  if (!keyRecord || keyRecord.expires_at < new Date()) {
    return res.status(403).json({ error: "Invalid or expired API key" });
  }

  req.user = keyRecord.user_id;
  next();
});
```

### 4. **レート制限（任意）**

* API Keyごとに制限（例: 100リクエスト/分）
* Redisなどのインメモリストアでカウントを管理

### 5. **管理画面/機能（任意）**

* 発行・停止・削除
* 使用履歴（ログ）
* 使用中APIや統計情報の表示

---

# 出力フォーマット

* 手順ごとの説明＋コード例（Python, Node.js中心）
* JSONスキーマやSQLも含めて構造的に記述

---

# 例：API Key発行レスポンス

**JSON**

```json
{
  "api_key": "abf84e7b1ef645cda1bbafe1e4e8d902",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

---

必要であれば、Go、Java、TypeScript、Shellなど他言語での具体例も追加できます。どの言語/フレームワークで実装する予定か教えてください。

### 10.4 リクエスト例（curl: macOSでのBase64画像送信）

```sh
curl -X POST http://localhost:3000/api/ocr \
  -H "Content-Type: application/json" \
  -d "{\"image\": \"data:image/png;base64,$(base64 < input/001.png | tr -d '\n')\"}"
```

- `base64 < input/001.png | tr -d '\n'` で改行なしのBase64文字列を生成します（macOS用）。
- 画像がJPEGの場合は `data:image/jpeg;base64,` に変更してください。
- サーバーが本番の場合はURLを `https://api.example.com/v1/ocr/extract` などに変更してください。
