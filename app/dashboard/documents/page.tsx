'use client'

import React, { useState } from "react"

const singleSamples: Record<string, string> = {
  Python:
    'import requests\n' +
    'import base64\n\n' +
    'API_KEY = "your_api_key"\n' +
    'url = "http://localhost:3000/api/ocr"\n' +
    'headers = {\n' +
    '    "Content-Type": "application/json",\n' +
    '    "Authorization": f"Bearer {API_KEY}"\n' +
    '}\n' +
    'with open("input/001.png", "rb") as f:\n' +
    '    img_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode()\n' +
    'payload = {"image": img_b64}\n' +
    'response = requests.post(url, headers=headers, json=payload)\n' +
    'print(response.json())',
  TypeScript:
    "import axios from 'axios'\n" +
    "import fs from 'fs'\n\n" +
    'const API_KEY = "your_api_key"\n' +
    'const url = "http://localhost:3000/api/ocr"\n' +
    "const image = fs.readFileSync('input/001.png').toString('base64')\n" +
    'const payload = { image: `data:image/png;base64,${image}` }\n' +
    'axios.post(url, payload, {\n' +
    '  headers: {\n' +
    "    'Content-Type': 'application/json',\n" +
    '    Authorization: `Bearer ${API_KEY}`\n' +
    '  }\n' +
    '}).then(res => console.log(res.data))',
  Java:
    'import java.net.URI;\n' +
    'import java.net.http.*;\n' +
    'import java.nio.file.Files;\n' +
    'import java.nio.file.Paths;\n' +
    'import java.util.Base64;\n\n' +
    'public class Example {\n' +
    '  public static void main(String[] args) throws Exception {\n' +
    '    String apiKey = "your_api_key";\n' +
    '    byte[] fileContent = Files.readAllBytes(Paths.get("input/001.png"));\n' +
    '    String base64Image = Base64.getEncoder().encodeToString(fileContent);\n' +
    '    String json = String.format("{\\"image\\":\\"data:image/png;base64,%s\\"}", base64Image);\n' +
    '    HttpRequest request = HttpRequest.newBuilder()\n' +
    '      .uri(URI.create("http://localhost:3000/api/ocr"))\n' +
    '      .header("Content-Type", "application/json")\n' +
    '      .header("Authorization", "Bearer " + apiKey)\n' +
    '      .POST(HttpRequest.BodyPublishers.ofString(json))\n' +
    '      .build();\n' +
    '    HttpResponse<String> response = HttpClient.newHttpClient()\n' +
    '      .send(request, HttpResponse.BodyHandlers.ofString());\n' +
    '    System.out.println(response.body());\n' +
    '  }\n' +
    '}',
  Go:
    'package main\n\n' +
    'import (\n' +
    '  "bytes"\n' +
    '  "encoding/base64"\n' +
    '  "encoding/json"\n' +
    '  "fmt"\n' +
    '  "io/ioutil"\n' +
    '  "net/http"\n' +
    ')\n\n' +
    'func main() {\n' +
    '  apiKey := "your_api_key"\n' +
    '  imgBytes, _ := ioutil.ReadFile("input/001.png")\n' +
    '  imgB64 := base64.StdEncoding.EncodeToString(imgBytes)\n' +
    '  payload := map[string]string{"image": "data:image/png;base64," + imgB64}\n' +
    '  jsonData, _ := json.Marshal(payload)\n' +
    '  req, _ := http.NewRequest("POST", "http://localhost:3000/api/ocr", bytes.NewBuffer(jsonData))\n' +
    '  req.Header.Set("Content-Type", "application/json")\n' +
    '  req.Header.Set("Authorization", "Bearer "+apiKey)\n' +
    '  client := &http.Client{}\n' +
    '  resp, _ := client.Do(req)\n' +
    '  defer resp.Body.Close()\n' +
    '  body, _ := ioutil.ReadAll(resp.Body)\n' +
    '  fmt.Println(string(body))\n' +
    '}',
  Shell:
    'curl -X POST http://localhost:3000/api/ocr \\n' +
    '  -H "Content-Type: application/json" \\\n' +
    '  -d "{\\"image\\": \\\"data:image/png;base64,$(base64 < input/001.png | tr -d \'\\n\')\\\"}"'
}

const batchSamples: Record<string, string> = {
  Python:
    'import requests\n' +
    'import base64\n' +
    'import glob\n' +
    'import os\n\n' +
    'API_KEY = "your_api_key"\n' +
    'url = "http://localhost:3000/api/ocr"\n' +
    'headers = {\n' +
    '    "Content-Type": "application/json",\n' +
    '    "Authorization": f"Bearer {API_KEY}"\n' +
    '}\n\n' +
    'for img_path in glob.glob("input/*.*"):\n' +
    '    ext = os.path.splitext(img_path)[1].lower()\n' +
    '    if ext in [".png", ".jpg", ".jpeg"]:\n' +
    '        with open(img_path, "rb") as f:\n' +
    '            mime = "image/png" if ext == ".png" else "image/jpeg"\n' +
    '            img_b64 = f"data:{mime};base64," + base64.b64encode(f.read()).decode()\n' +
    '        payload = {"image": img_b64}\n' +
    '        print(f"Sending {img_path} ...")\n' +
    '        response = requests.post(url, headers=headers, json=payload)\n' +
    '        print(response.json())',
  TypeScript:
    "import axios from 'axios'\n" +
    "import fs from 'fs'\n" +
    "import path from 'path'\n" +
    "import glob from 'glob'\n\n" +
    'const API_KEY = "your_api_key"\n' +
    'const url = "http://localhost:3000/api/ocr"\n\n' +
    'async function processImages() {\n' +
    '  const imageFiles = glob.sync("input/*.{png,jpg,jpeg,JPG}")\n' +
    '  for (const imgPath of imageFiles) {\n' +
    '    const ext = path.extname(imgPath).toLowerCase()\n' +
    '    const mime = ext === ".png" ? "image/png" : "image/jpeg"\n' +
    '    const image = fs.readFileSync(imgPath).toString("base64")\n' +
    '    const payload = { image: `data:${mime};base64,${image}` }\n' +
    '    console.log(`Sending ${imgPath} ...`)\n' +
    '    try {\n' +
    '      const response = await axios.post(url, payload, {\n' +
    '        headers: {\n' +
    "          'Content-Type': 'application/json',\n" +
    '          Authorization: `Bearer ${API_KEY}`\n' +
    '        }\n' +
    '      })\n' +
    '      console.log(response.data)\n' +
    '    } catch (error) {\n' +
    '      console.error(`Error processing ${imgPath}:`, error)\n' +
    '    }\n' +
    '  }\n' +
    '}\n\n' +
    'processImages()',
  Java:
    'import java.net.URI;\n' +
    'import java.net.http.*;\n' +
    'import java.nio.file.Files;\n' +
    'import java.nio.file.Paths;\n' +
    'import java.util.Base64;\n' +
    'import java.io.File;\n' +
    'import java.util.Arrays;\n\n' +
    'public class BatchExample {\n' +
    '  public static void main(String[] args) throws Exception {\n' +
    '    String apiKey = "your_api_key";\n' +
    '    File inputDir = new File("input");\n' +
    '    File[] imageFiles = inputDir.listFiles((dir, name) -> \n' +
    '      name.toLowerCase().endsWith(".png") || \n' +
    '      name.toLowerCase().endsWith(".jpg") || \n' +
    '      name.toLowerCase().endsWith(".jpeg"));\n\n' +
    '    if (imageFiles != null) {\n' +
    '      for (File imgFile : imageFiles) {\n' +
    '        byte[] fileContent = Files.readAllBytes(imgFile.toPath());\n' +
    '        String base64Image = Base64.getEncoder().encodeToString(fileContent);\n' +
    '        String ext = imgFile.getName().substring(imgFile.getName().lastIndexOf(".")).toLowerCase();\n' +
    '        String mime = ext.equals(".png") ? "image/png" : "image/jpeg";\n' +
    '        String json = String.format("{\\"image\\":\\"data:%s;base64,%s\\"}", mime, base64Image);\n\n' +
    '        HttpRequest request = HttpRequest.newBuilder()\n' +
    '          .uri(URI.create("http://localhost:3000/api/ocr"))\n' +
    '          .header("Content-Type", "application/json")\n' +
    '          .header("Authorization", "Bearer " + apiKey)\n' +
    '          .POST(HttpRequest.BodyPublishers.ofString(json))\n' +
    '          .build();\n\n' +
    '        System.out.println("Sending " + imgFile.getName() + " ...");\n' +
    '        HttpResponse<String> response = HttpClient.newHttpClient()\n' +
    '          .send(request, HttpResponse.BodyHandlers.ofString());\n' +
    '        System.out.println(response.body());\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}',
  Go:
    'package main\n\n' +
    'import (\n' +
    '  "bytes"\n' +
    '  "encoding/base64"\n' +
    '  "encoding/json"\n' +
    '  "fmt"\n' +
    '  "io/ioutil"\n' +
    '  "net/http"\n' +
    '  "path/filepath"\n' +
    '  "strings"\n' +
    ')\n\n' +
    'func main() {\n' +
    '  apiKey := "your_api_key"\n' +
    '  files, _ := filepath.Glob("input/*.*")\n\n' +
    '  for _, file := range files {\n' +
    '    ext := strings.ToLower(filepath.Ext(file))\n' +
    '    if ext == ".png" || ext == ".jpg" || ext == ".jpeg" {\n' +
    '      imgBytes, _ := ioutil.ReadFile(file)\n' +
    '      imgB64 := base64.StdEncoding.EncodeToString(imgBytes)\n' +
    '      mime := "image/png"\n' +
    '      if ext != ".png" {\n' +
    '        mime = "image/jpeg"\n' +
    '      }\n' +
    '      payload := map[string]string{"image": "data:" + mime + ";base64," + imgB64}\n' +
    '      jsonData, _ := json.Marshal(payload)\n' +
    '      req, _ := http.NewRequest("POST", "http://localhost:3000/api/ocr", bytes.NewBuffer(jsonData))\n' +
    '      req.Header.Set("Content-Type", "application/json")\n' +
    '      req.Header.Set("Authorization", "Bearer "+apiKey)\n' +
    '      client := &http.Client{}\n' +
    '      resp, _ := client.Do(req)\n' +
    '      defer resp.Body.Close()\n' +
    '      body, _ := ioutil.ReadAll(resp.Body)\n' +
    '      fmt.Printf("Sending %s ...\\n", file)\n' +
    '      fmt.Println(string(body))\n' +
    '    }\n' +
    '  }\n' +
    '}',
  Shell:
    'for img in input/*.{png,jpg,jpeg,JPG}; do\n' +
    '  echo "Sending $img ..."\n' +
    '  curl -X POST http://localhost:3000/api/ocr \\\n' +
    '    -H "Content-Type: application/json" \\\n' +
    '    -d "{\\"image\\": \\\"data:image/png;base64,$(base64 < \"$img\" | tr -d \'\\n\')\\\"}"\n' +
    '  echo ""\n' +
    'done'
}

const tabs = ["Python", "TypeScript", "Java", "Go", "Shell"]
const batchTabs = ["Python", "TypeScript", "Java", "Go", "Shell"]

export default function DocumentsPage() {
  const [mode, setMode] = useState<'single' | 'batch'>("single")
  const [activeTab, setActiveTab] = useState("Shell")
  const [copied, setCopied] = useState(false)

  const codeSet = mode === 'single' ? singleSamples : batchSamples
  const availableTabs = mode === 'single' ? tabs : batchTabs

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSet[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Doge OCR API ドキュメント</h1>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded font-medium text-sm border-2 transition-colors ${mode === 'single' ? 'border-primary text-primary bg-muted' : 'border-transparent text-muted-foreground bg-transparent hover:bg-muted'}`}
          onClick={() => setMode('single')}
        >
          Single
        </button>
        <button
          className={`px-4 py-2 rounded font-medium text-sm border-2 transition-colors ${mode === 'batch' ? 'border-primary text-primary bg-muted' : 'border-transparent text-muted-foreground bg-transparent hover:bg-muted'}`}
          onClick={() => setMode('batch')}
        >
          Batch
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex gap-2 mb-4">
          {availableTabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-t font-medium text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary bg-muted' : 'border-transparent text-muted-foreground bg-transparent hover:bg-muted'}`}
              onClick={() => setActiveTab(tab)}
              disabled={!(tab in codeSet)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <pre className="bg-black text-white rounded p-4 text-sm overflow-x-auto whitespace-pre-wrap min-h-[220px]">
            {codeSet[activeTab]}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-muted text-foreground px-3 py-1 rounded shadow hover:bg-accent text-xs font-medium"
            aria-label="Copy code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">エンドポイント</h2>
        <div className="bg-muted rounded p-4 text-sm">
          <code>POST /api/ocr</code>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">説明</h2>
        <p className="mb-2">このAPIは、Base64エンコードされた画像データをJSONで受け取り、OCR処理結果を返します。画像は4MB以下、<code>data:image/png;base64,</code> 形式で送信してください。</p>
        <p className="text-xs text-muted-foreground">※ 認証が必要な場合は <code>-H \"Authorization: Bearer &lt;API_KEY&gt;\"</code> を追加してください。</p>
      </section>
    </div>
  )
} 