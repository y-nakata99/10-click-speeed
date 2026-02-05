# Vercel Setup & Deploy Rule

目的：
このリポジトリでは Vercel を使用して以下の運用を行う。

基本ルール：
・main ブランチは Production（本番）として扱う
・Pull Request は Preview Deployment として扱う

初期セットアップ手順：
1. Vercel に GitHub アカウントでログインする
2. 対象リポジトリを Import する
3. Framework は自動検出のまま進める
4. Build / Output 設定はデフォルトを使用する
5. Deploy を実行する

運用ルール：
・main にマージされた変更は自動で本番に反映される
・Pull Request 作成時は自動で Preview URL が発行される
・レビュー時は Preview URL を確認する

注意事項：
・main ブランチへの直接 commit は行わない
・本番確認は必ず main マージ後に行う
