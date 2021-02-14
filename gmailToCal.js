function createGCalendarIssue() {
  
  // Spreadsheet
  let ss
  // Sheet
  let ws
  // Spreadsheetに記載した一覧
  let ruleList 

  // sheet layout
  let colTypeName = 1
  let colRule = 2
  let colKeyword = 3
  let colGamilLabel = 4
  let rowStart = 2
  
  //Spreadsheet.wsが読めること
  try{
    ss = SpreadsheetApp.openById(PROPERTIES.getProperty("SHEET_ID"))
    ws = ss.getSheetByName(PROPERTIES.getProperty("SHEET_NAME"))
    ruleList = ws.getRange(rowStart, colTypeName, ws.getLastRow() - rowStart + 1, colGamilLabel).getValues()
  }catch(e){
    console.error("Sheet not found. %s", e)
    return
  }
   
  for(const rules of ruleList){
    const gmailRule = rules[colRule - 1]
    const gmailThreads = GmailApp.search(gmailRule)
    const ruleTitle = rules[colTypeName -1]
    const keyword = rules[colKeyword -1]

    //required items
    if ((!ruleTitle) || (!gmailRule) || (!keyword) || (!rules[colGamilLabel - 1])){
      console.error("Missing required value: 'type_name' or 'rule' or 'keyword' or 'GamilLabel'")
      continue
    }

    const label = GmailApp.getUserLabelByName(rules[colGamilLabel - 1])
    
    //該当なし
    if(gmailThreads.length === 0){
      console.info("No match: %s", ruleTitle)
      continue
    }

    console.info("Title %s / Threads count: %d", ruleTitle, gmailThreads.length)

    let requests = []
    for(const th of gmailThreads){
      let msgs = GmailApp.getMessagesForThread(th)
      let msgBody = msgs[0].getPlainBody()
      let reg = new RegExp(keyword, "g")
      let values = msgBody.match(reg)
      
      //メール本文に変更があったかもしれないのでwarning
      if(!values){
        console.warn("keyword don't match: %s : %s", keyword, msgs[0].getDate())
        continue
      }
      //メールの受信時間を詳細に追加
      values.push("Received time:" + msgs[0].getDate())
      console.info("Added to request: %s - %s", ruleTitle, msgs[0].getDate())

      //API実行
      if(excuteAPI(ruleTitle, values, getCurrentDate(), getCurrentDate())){
        //ラベルを付けて処理済みとする
        th.addLabel(label)
      }
    }
  }
}

//====================================
//現在時刻取得
//====================================
function getCurrentDate(){
  const today = new Date()
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join('-')
}
 
//====================================
//API実行
//====================================
function excuteAPI(summary, description, startDatetime, endDatetime){
  try{
    var calendar = CalendarApp.getDefaultCalendar(); 
    calendar.createAllDayEvent(summary, new Date(startDatetime), {description: description.join("\n")});
    return true
  }catch(e){
    console.error(e)
    return false
  }
}
  
