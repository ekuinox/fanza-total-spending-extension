# fanza-total-spending-extension

[![Actions Status](https://github.com/ekuinox/fanza-total-spending-extension/workflows/build/badge.svg)](https://github.com/ekuinox/fanza-total-spending-extension/actions)

[FANZA購入履歴](https://payment.dmm.co.jp/history/)からこれまでFANZAに費やしたお金の総額を調べることができます。

## 導入 (ブックマークレットとして)

1. [Releases](https://github.com/ekuinox/fanza-total-spending-extension/releases/)から最新のbookmarkletをダウンロードする。

2. ダウンロードしたbookmarkletファイルをテキストエディタで開き、テキスト内容をすべてコピーする。

3. ブラウザに新しいブックマークを作成し、URLとしてコピーしたテキスト内容をすべて貼り付ける。

## 導入 (ブラウザの拡張機能として)

1. [Releases](https://github.com/ekuinox/fanza-total-spending-extension/releases/)から最新のrelease.zipをダウンロードし展開する。

2. [chrome://extensions](chrome://extensions)で「デベロッパーモード」を有効化する。

3. 「パッケージ化されていない拡張機能を読み込む」から1で展開したフォルダを読み込む。

## 使い方

1. [FANZA購入履歴](https://payment.dmm.co.jp/history/)にアクセスする。

2. 追加したブックマークレット、または右上に追加された赤い字のボタンを押す。

3. 数秒後に結果が左下に表示される。

![result](./vivaldi_0of2i3TsFC.png)

---

chromeは右上の拡張昨日ボタンから一覧開いて、そこから起動する必要があるみたい。
![chrome](./chrome_UXe1usfMC6.png)

**シェアしてくれると嬉しい！！！！**

## 注意

1. FANZAの月別の購入履歴が存在するだけリクエストをかけているため、怒られるかもしれない
2. ボタン押した分リクエストが飛ぶ
3. 怒られてもおれは知りません
4. おれはvivaldiユーザなので、chromeではテストしていません（vivaldiは3.4.2066.106 ）

## 開発

1. `$ git clone git@github.com:ekuinox/fanza-total-spending-extension.git`

2. `$ npm i`

3. `$ npm run build`
