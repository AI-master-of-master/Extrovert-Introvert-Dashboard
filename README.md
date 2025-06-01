# 外向性 vs. 内向性の行動ダッシュボード

このプロジェクトは、外向的な人と内向的な人の行動パターンの違いを視覚化するダッシュボードアプリケーションです。

## 機能

- 外向的/内向的な人の行動データの視覚化
- 様々な指標（一人で過ごす時間、社交イベント参加、外出頻度など）の比較
- ステージ恐怖症や社交後の疲労感などの特性比較
- データの検索とフィルタリング機能

## 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript, Bootstrap, Chart.js
- **バックエンド**: Node.js, Express
- **データ処理**: CSV解析

## インストールと実行方法

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/extrovert-vs-introvert-dashboard.git
cd extrovert-vs-introvert-dashboard

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください。

## プロジェクト構造

```
extrovert-vs-introvert-dashboard/
├── backend/               # バックエンドのソースコード
│   ├── server.js          # Expressサーバー
│   └── package.json       # バックエンド依存関係
├── frontend/              # フロントエンドのソースコード
│   ├── index.html         # メインのHTMLファイル
│   ├── css/               # スタイルシート
│   ├── js/                # JavaScriptファイル
│   └── package.json       # フロントエンド依存関係
├── Dateset/               # データセットファイル
│   └── 外向性 vs. 内向性の行動データ/
│       └── personality_dataset.csv
├── package.json           # プロジェクト全体の設定
└── README.md              # このファイル
```

## ライセンス

MIT 