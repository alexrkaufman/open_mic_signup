function sendTheList() {

  const showName = 'Bone Dry Comedy Hour';
  const fromAddress = 'openmic@bonedrycomedy.com';

  const currentListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Current List');
  const addlAnnouncementSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Additional Announcement');

  const lastRow = currentListSheet.getLastRow();

  const hostInfo = currentListSheet.getRange('A2:D2').getValues().flat();
  const addlAnnouncement = addlAnnouncementSheet.getRange('A2').getValues().flat();
  const theListNames = currentListSheet.getRange('B3:B26').getValues().flat();
  const theListTimes = currentListSheet.getRange('C3:C26').getValues().flat();
  const theList = [];
  const bumpList = currentListSheet.getRange('B27:B').getValues().flat();
  const emails = currentListSheet.getRange('D2:D').getValues().flat();
  const bumpListEmails = currentListSheet.getRange('D27:D').getValues().flat()

  for (let i = 0; i < theListNames.length; i++) {
    theList.push(theListNames[i] + ' (' + theListTimes[i] + ')')
  }

  emails.push("levin@lastbestcomedy.com")

  const listEmailInfo = {
    'host': hostInfo[1],
    'addlAnnouncement': addlAnnouncement,
    'theList': theList,
    'bumpList': bumpList,
  };

  var emailTemplate = HtmlService.createTemplateFromFile('Bone Dry Comedy Hour List Email');
  emailTemplate.listEmailInfo = listEmailInfo;
  const emailBody = emailTemplate.evaluate().getContent();

  const today = new Date().toLocaleDateString('es-PA');
  console.log(emails.join(','));

  GmailApp.sendEmail(
    fromAddress,
    `The List: ${showName} | ${today}`,
    '',
    {
      bcc: emails.join(','),
      from: fromAddress,
      name: showName,
      htmlBody: emailBody
    }
  );

  markBumped(bumpList, bumpListEmails, lastRow);
}

function markBumped(bumpListNames, bumpListEmails, toCheck) {
    const signupSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Bone Dry Comedy Hour (Responses)');
    const lastRow = signupSheet.getLastRow();

    const names = signupSheet.getRange('B' + (lastRow - toCheck + 1) + ':B' + lastRow).getValues().flat();
    const emails = signupSheet.getRange('E' + (lastRow - toCheck + 1) + ':E' + lastRow).getValues().flat();
    const wasBumped = new Array(names.length).fill(false);

    for (let i = 0; i < bumpListNames.length; i++) {
      let nameIndex = names.indexOf(bumpListNames[i]);

      if (nameIndex >= 0) {
        wasBumped[nameIndex] = true;
      }

    }
    for (let i = 0; i < bumpListEmails.length; i++) {
      let emailIndex = emails.indexOf(bumpListEmails[i]);

      if (emailIndex >= 0) {
        wasBumped[emailIndex] = true;
      }

    }

    const a = [];
    for (let i = 0; i < wasBumped.length; i++) {
      a.push([wasBumped[i]]);
    }

    signupSheet.getRange('H' + (lastRow - toCheck + 1) + ':H' + lastRow).setValues(a);
}
