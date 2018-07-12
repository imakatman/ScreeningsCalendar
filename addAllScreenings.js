function readSheets() {
    locations.map(function(item) {
        var label = item.label;

        // var response = Sheets.Spreadsheets.Values.batchGet({
        //     spreadsheetId: spreadsheetId,
        //     majorDimension: "ROWS",
        //     ranges: [
        //         label + '!A1:O1',
        //         label + '!A2:O'
        //     ]
        // })

        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(label);
        var fields = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(label).getRange(label + '!A1:O1').getValues();
        var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(label).getRange(label + '!A2:O').getValues();

		Logger.log(fields + " " + values);
    });
}

// function readRange(spreadsheetId) {
//     var response = Sheets.Spreadsheets.Values.get(spreadsheetId, 'Sheet1!A1:D5');
//     Logger.log(response.values);
// }

// // Creates an event for the mars landing and logs the ID.
// var event = CalendarApp.getCalendarById('4h8n7e9pvernebghcs52d23s44@group.calendar.google.com').createEvent('Falcon Heavy Landing',
//     new Date('July 28, 2018 20:00:00 UTC'),
//     new Date('July 28, 2018 21:00:00 UTC'),
//     {location: 'Mars'});

// function addEvents() {
//     Logger.log('Event ID: ' + event.getId());
// }
