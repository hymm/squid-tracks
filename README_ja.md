# SquidTracks
スプラトゥーン2の統計データを閲覧したり、stat.inkにデータをアップロードするための非公式デスクトップアプリケーションです。
スプラトゥーン2は直近50試合のデータしか記録しません。このツールはより長い期間統計データにアクセスできるよう、stat.inkにデータを送信することが出来ます。
また、スプラトゥーン2には表示することが出来ないデータもありますが、このプログラムはそのようなデータにアクセスすることも出来ます。

## インストール
現在、Windows (exe)、OS X (dmg, mac.zip)そしてLinux (AppImage)に対応しています。ここからパッケージをダウンロードしてください。
https://github.com/hymm/squid-tracks/releases

#### Windowsへのインストール
インストーラー .exe を https://github.com/hymm/squid-tracks/releases からダウンロードしてください。
インストーラーを起動すると警告が表示されます。先に進むために「詳細情報」をクリックし、次に「実行」をクリックしてください。

#### Macへのインストール

#### Linuxへのインストール

## プロジェクトへの貢献

本プロジェクトに貢献することに興味をお持ちの方は、お気軽に私にお問い合わせいただくかプルリクエストを作成してください。[issues](https://github.com/hymm/squid-tracks/issues) をクリックし、あなたが作業したい項目があるかご覧ください。翻訳のお手伝いは特に助かります。 開発に関する情報は[こちら](./docs/en/development.md) をご覧ください。

## 使われているツール
* Electron
* create-react-app
* React
* Bootstrap
* Travis

## その他のstat.inkクライアント
* [splatnet2statink](https://github.com/frozenpandaman/splatnet2statink) Pythonによるコマンドライン・アップローダー
* [ikaLog](https://github.com/hasegaw/IkaLog) もしあなたがキャプチャーカードをお持ちなら、このツールはより多くの情報（どのようなブキで倒されたか、他の画面上のイベント、他）を提供できます。どの程度スプラトゥーン2をサポートしているかは不明です。
* [stat.ink](https://stat.ink/) 右上のボタンから手動でデータを入力することが出来ます。
* [ikaRec](https://play.google.com/store/apps/details?id=ink.pocketgopher.ikarec&hl=en) このアプリを使って手動でデータを入力できます。

## 作成者
* **[hymm](https://github.com/hymm)** *Maintainer* [@Wrong_Shoe](https://twitter.com/Wrong_Shoe) (Discord) WrongShoe#9733
* **[DanSyor](https://github.com/DanSyor)** *Schedule tab appearance*, fr Translations [@DanSyor](https://twitter.com/DanSyor) (Discord) BlueDan#8041
* **[okuRaku](https://github.com/okuRaku)** *League Tab, ja Translations* [@okuRaku](https://twitter.com/okuRakuu) (Discord) okuRaku#1417
* **[mcescalante](https://github.com/mcescalante)** *Mac Releases* [@mcescalante](https://twitter.com/mcescalante) (Discord) sofly#3729

## 謝辞
* [frozenpandaman](https://github.com/frozenpandaman/): 私はsplatnet-2からstat.inkに構文変換するために、彼の [python uploader](https://github.com/frozenpandaman/splatnet2statink) を参考にしました。
* [fetus hina](https://github.com/fetus-hina): [stat.ink](https://stat.ink) の作者であり、APIに関する私の質問に答えて頂きました。
* [Danny](https://github.com/Rapptz): 最初にsplatnet-2にログインする方法を見つけ、[R.Danny](https://github.com/Rapptz/RoboDanny)を作成しました。
* 私の彼女 [@Selkaine](https://twitter.com/Selkaine) が画像を作ってくれました。
