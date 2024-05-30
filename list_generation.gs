const dayToNum = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const maxListLength = 24;

function buildListDraft() {
  const signupSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Bone Dry Comedy Hour (Responses)",
  );
  const currentListSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Current List");

  currentListSheet.clearContents();
  currentListSheet.appendRow([
    "Bumped Last Week",
    "Name",
    "Time",
    "Email",
    "Additional Info",
  ]);

  const searchRange = 120;

  const lastRow = signupSheet.getLastRow();

  const dates = signupSheet
    .getRange(signupSheet.getLastRow() - searchRange + 1, "1", searchRange)
    .getValues()
    .flat();
  const names = signupSheet
    .getRange(signupSheet.getLastRow() - searchRange + 1, "2", searchRange)
    .getValues()
    .flat();
  const emails = signupSheet
    .getRange(signupSheet.getLastRow() - searchRange + 1, "5", searchRange)
    .getValues()
    .flat();
  const wasBumped = signupSheet
    .getRange(signupSheet.getLastRow() - searchRange + 1, "8", searchRange)
    .getValues()
    .flat();
  const addlInfo = signupSheet
    .getRange(signupSheet.getLastRow() - searchRange + 1, "4", searchRange)
    .getValues()
    .flat();

  [startDate, endDate] = getStartEndDates("Sunday", "Tuesday");

  const lastWeekStartDate = new Date();
  lastWeekStartDate.setHours(0, 0, 0, 0);
  lastWeekStartDate.setDate(startDate.getDate() - 7);

  const lastWeekEndDate = new Date();
  lastWeekEndDate.setHours(0, 0, 0, 0);
  lastWeekEndDate.setDate(endDate.getDate() - 7);

  const prevBumpListNames = [];
  const prevBumpListEmails = [];

  for (let i = 0; i < wasBumped.length; i++) {
    let date = new Date(dates[i]);
    if (date > lastWeekStartDate && date < lastWeekEndDate) {
      if (wasBumped[i]) {
        prevBumpListNames.push(names[i]);
        prevBumpListEmails.push(emails[i]);
      }
    }
  }

  const guaranteedList = [];
  let regularList = [];

  for (let i = 0; i < dates.length; i++) {
    if (dates[i] > startDate && dates[i] < endDate) {
      if (
        prevBumpListNames.includes(names[i]) ||
        prevBumpListEmails.includes(emails[i])
      ) {
        guaranteedList.push([true, names[i], "", emails[i], addlInfo[i]]);
      } else {
        regularList.push([false, names[i], "", emails[i], addlInfo[i]]);
      }
    }
  }

  regularList = shuffle(regularList);

  currentListSheet.appendRow(["", "HOST", "", "", ""]);

  for (let i = 0; i < guaranteedList.length; i++) {
    currentListSheet.appendRow(guaranteedList[i]);
  }

  for (let i = 0; i < regularList.length; i++) {
    currentListSheet.appendRow(regularList[i]);
  }
}

function getStartEndDates(startDayOfWeek, endDayOfWeek) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  startDate = getPreviousDayOfWeek(startDayOfWeek);
  endDate = getPreviousDayOfWeek(endDayOfWeek);

  return [startDate, endDate];
}

function getPreviousDayOfWeek(dayOfWeek) {
  const today = new Date();
  const day = today.getDay();

  var diff =
    day < dayToNum[dayOfWeek]
      ? 7 - dayToNum[dayOfWeek] + day
      : day - dayToNum[dayOfWeek];

  var prevDayOfWeek = new Date();
  prevDayOfWeek.setHours(0, 0, 0, 0);
  prevDayOfWeek.setDate(today.getDate() - diff);

  console.log(day <= dayToNum[dayOfWeek]);
  console.log(prevDayOfWeek);

  return prevDayOfWeek;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
