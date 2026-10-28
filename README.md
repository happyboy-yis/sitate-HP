# MOE SHITATE — Website Design Study

仕立さんのHair & Makeupポートフォリオに向けた、操作できるA/Bデザインサンプルです。

- `/`：2つの方向性を比較する選択ページ
- `/alien/`：ALIEN OS。シルバーのデスクトップ、フォルダ、重ねられるウィンドウ
- `/editorial/`：DARK EDITORIAL。全面写真、雑誌の目次、余白と大小を組み合わせた作品構成

## ローカルで見る

必要な環境：Node.js 24、Python 3。アプリ本体に外部ランタイム依存はありません。

```sh
cd /workspace/sitate-HP
npm ci
npm run dev
```

開発サーバーは5173番ポートで起動します。URLのルートから比較ページへ入れます。HTMLを直接ダブルクリックするとES Modulesが動かないためHTTPサーバーを使用してください。クラウド環境では既存のチェックアウトを使用し、別worktreeは作成不要です。

## ビルド・動作確認

```sh
npm run build
npm test
npm run preview
```

`dist/`がデプロイ成果物です。別ターミナルから次を実行すると実ブラウザ検証ができます。

```sh
# Chromiumを利用。別のパスの場合はCHROMIUM_PATHを設定
npm run test:e2e
```

E2Eは375 / 390 / 430 / 768 / 1440pxの3ページを確認。画像読み込み、横スクロール、見出しの画面外へのはみ出し、Aのフォルダ・カテゴリ・前面切替・閉じる・ドラッグ・最大化、Bの目次からの3セクション移動、両案の作品拡大・画像切替・フォームのデモを検証します。390 / 1440pxの画面を`test-results/`に保存します。必要に応じて`BASE_URL`を指定できます。iOS実機による確認は別途必要です。

## 公開について

GitHub Pagesへ公開します。`main`へのプッシュで`.github/workflows/pages.yml`がテスト・ビルド・デプロイを実行します。リポジトリのSettings → PagesではSourceをGitHub Actionsに設定してください。初回のPages有効化に管理者権限が必要な場合があります。

公開先は通常 `https://happyboy-yis.github.io/sitate-HP/` です。公開ビルドはPages設定のベースパスを使い、画像と内部リンクもその配下に配置します。ローカルで同じ成果物を作る場合は `BASE_PATH=/sitate-HP npm run build` を実行します。通常の `npm run build` はルート配信用です。

`noindex`は検索除外の指示でありアクセス制御ではありません。

## 差し替える場所

| 内容 | 編集するファイル |
| --- | --- |
| 作品名・カテゴリ・年・代替テキスト・画像パス | `assets/js/works.js` |
| 8枚の仮画像 | `assets/images/work-01.webp`〜`work-08.webp` |
| プロフィール・コピー・SNSなど | `alien/index.html`、`editorial/index.html` |
| フォーム・モーダルの共通動作 | `assets/js/shared.js` |
| Aのウィンドウ／Bの目次・演出 | `assets/js/alien.js`、`assets/js/editorial.js` |
| 全体の見た目・画面幅ごとの調整 | `assets/css/style.css` |

作品情報は両案共通の配列で管理。Bは並び順だけを変更しています。CMS接続時はこの配列をAPIから受け取る構造へ置き換えられます。

## 仮素材と本番化

8枚のビジュアルは本提案用のAI生成画像です。本人の実作品・実績ではなく、ABOUTの人物も本人ではありません。サイト内と作品拡大ビューに明記しています。写真を取得した外部テンプレートの素材は採用していません。画像・フォントはローカルで完結し、第三者CDNへの接続は不要です。WebP合計約552KiB、画像ごとに約46〜94KiB。作品一覧は遅延読み込みします。

公開後もデザイン提案段階です。本番では実作品、正しいプロフィール、作品クレジット、連絡先、Instagram、フォーム送信先・プライバシー案内を差し替えてください。現在のフォームはHTML標準の必須・メール形式チェックを持ち、送信時にデモ完了を表示するだけで、入力値を外部送信・保存しません。

演出は控えめにし、`prefers-reduced-motion`に対応。作品拡大と目次はネイティブdialogを使用し、Escapeで閉じられます。作品拡大は左右矢印キーでも切り替え可能。Aのウィンドウはデスクトップでドラッグでき、モバイルでは固定位置のタップ操作へ切り替わります。
