function sendConfirmationEmail(e) {

  const showName = 'The Bone Dry Comedy Hour';
  let emailData = {};
  const fromAddress = 'openmic@bonedrycomedy.com';

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Bone Dry Comedy Hour (Responses)')

    const date = new Date(e.namedValues['Timestamp'])
    const signupName = e.namedValues['Name'].toString()
    const signupEmail = e.namedValues['Email Address'].toString()

    let validSignupString;

    emailData['name'] = signupName;

    if (date.getDay() == 0 || date.getDay() == 1) {
      console.log(date.getDay());
      validSignupString = 'Valid Signup';
    } else {
      validSignupString = 'Invalid Signup';
    }

    let emailTemplate = HtmlService.createTemplateFromFile(validSignupString + ' Email');
    emailTemplate.emailData = emailData;
    const emailBody = emailTemplate.evaluate().getContent();

    GmailApp.sendEmail(
      signupEmail,
      'Bone Dry Comedy Hour - ' + validSignupString,
      '',
      {
        from: fromAddress,
        name: showName,
        htmlBody: emailBody
      }
    )

  } catch (err) {
    Logger.log('Failed with error %s', err.message)
  }
}
