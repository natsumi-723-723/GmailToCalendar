# Create Google calendar Issue

Gmailで受信したメールの内容をGoogleCalendarに登録

# Features

SpreadSheetで登録したいメールの条件を指定、カレンダーに登録したい本文を正規表現で指定可能。
登録したメールはラベルを付けて管理。

# Requirement

以下の形式のSpreadSheetを用意

|  type_name|  rule |  keyword |  GmailLabel|
| ---- | ---- |---- | ---- |
|  美容院予約|  subject:XXXXXX  | ご予約日時：.*| Hairdresser|
|  カード引き落とし|  subject:AAAAA | 詳細こちらから\r\n.*  | payment|

- type_name (タイトル。「カード支払い」など)
- rule (Gmailの検索ルール。「メールを検索」の内容をそのまま記載)
- keyword (本文から取得する文字を正規表現で記載。課題の詳細に反映)
- GmailLabel (課題登録処理後のメールにつけるラベル名 ※存在しているラベルが前提)

# Properties
プロジェクトのプロパティに以下を設定

|プロパティ|値|
| ---- | ---- |
|SHEET_ID|SpreadSheetのID|
|SHEET_NAME|SpreadSheet名|

