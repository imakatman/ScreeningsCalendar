var apiUrl = "http://35.163.42.76:8080/submit/";

var sheet;
var headers;
var sheetToSend;

var miscSheet, miscDataUpdated, sheetToUpdate;

/*
* main parses the edited sheet to the data as JSON to the ampas
* calendar server
*
* if the edited sheet is the Work in progress one, don't execute the function
* */
function main(e) {
  sheet = e.source.getActiveSheet().getName();

  // If the Misc sheet exists, make sure to parse it.
  if (SpreadsheetApp.getActive().getSheetByName("Misc")) {
    miscSheet = SpreadsheetApp.getActive().getSheetByName("Misc");

    if (sheet !== "Work in progress") {
      var msg = getEditedValueMessage(e);

      console.log(sheet, "sheet has been updated.");
      console.log(msg);

      if (sheet !== "Misc") {
        miscDataUpdated = false;
        headers         = getHeaders(e, 1)[0]; // sets var sheetToSend
        var events      = getEvents(e);
        var miscData    = getMiscData(sheet, miscSheet)

      } else {
        console.log("Misc data has been updated");
        miscDataUpdated = true;
        sheetToUpdate   = getUpdatedMiscData(e);
        headers         = getHeaders(e, 1)[0]; // sets var sheetToSend
        var events      = getEvents(e);
        var miscData    = getMiscData(sheetToUpdate, miscSheet)
      }

      var payload = {
        screenings: designData(events),
        misc: miscData
      };

      return sendEvents(payload);
    }
  } else {
    if (sheet !== "Work in progress") {
      miscDataUpdated = false;
      headers         = getHeaders(e, 1)[0]; // sets var sheetToSend
      var events      = getEvents(e);

      var payload = {
        screenings: designData(events),
      };

      return sendEvents(payload);
    }
  }
}

function getEditedValueMessage(e) {
  var activeCell  = e.source.getActiveCell(),
      rowIndex    = activeCell.getRowIndex(),
      columnIndex = activeCell.getColumnIndex(),
      value      = activeCell.getValue();

  return "Row " + rowIndex + " Column " + columnIndex + " was updated. Value is " + value;
}

function getUpdatedMiscData(e) {
  var editedRow = e.source.getActiveRange().getRow();
  var city      = miscSheet.getRange("A" + editedRow).getValue();

  return city;
}

/*
* getHeaders parses the first row of the sheet and returns them as values
*
* Line 83 and 86
* There is an assumption that the last column in a sheet provided is going to be O.
* This will have to be modified depending on the type of screening
* */
function getHeaders(e, r) {
  var vs;

  if (!miscDataUpdated) {
    sheetToSend = e.source.getActiveSheet();
    vs          = sheetToSend.getRange("A" + r + ":O" + r).getValues();
  } else {
    sheetToSend = SpreadsheetApp.getActive().getSheetByName(sheetToUpdate);
    vs          = sheetToSend.getRange("A" + r + ":O" + r).getValues()
  }

  console.log("Headers are:", vs);

  return vs;
}

/*
* getValues parses each row, which is returned in an array, and pushes it into a daddy array
* */
function getEvents() {
  var numOfEvents = sheetToSend.getLastRow();
  var vs          = [];

  for (var i = 2; i <= numOfEvents; i++) {
    vs.push(sheetToSend.getRange("A" + i + ":O" + i).getValues());
  }

  return vs;
}

function stripHtml(html) {
  return html.replace(/<(?:.|\n)*?>/gm, '');
}

function getMiscData(editedCity, data) {
  var lastRow = data.getLastRow()
  var fields  = data.getRange("B1:I1").getValues()[0];
  var cities  = data.getRange("A2:A" + lastRow).getValues().map(function (c) {
    return c[0]
  });

  var values = data.getRange("B2:I" + lastRow).getValues();
  var vs     = {};
  cities.map(function (c, i) {
    if (c === editedCity) {
      var obj = {};
      fields.map(function (f, x) {
        var value = values[i][x];
        if (f === "Description" || f === "Screening_Regulations") {
          value = stripHtml(value);
        }
        if (value === "") {
          obj[f] = ""
        } else {
          obj[f] = value
        }
      })
      vs = obj;
      console.log("Misc data is:", obj);
    }
  })

  return vs;
}

/*
* designData parses the events into an object with each value being attached to its corresponding
* field and returns them in an array
* */
function designData(data) {
  return data.map(function (theEvent, index) {
    var event = {};
    theEvent[0].map(function (info, i) {
      var h     = headers[i];
      var value = info;
      if (h !== "Synopsis") {
        event[h] = value
      } else {
        event[h] = stripHtml(value)
      }
    });

    var dateData = {
      date: event.Date,
      time: event.Time,
      runTime: event.Run_Time
    }

    var dateTime        = convertDateTime(dateData);
    event.StartDateTime = dateTime.start;
    event.EndDateTime   = dateTime.end;

    console.log(index, "event is", event);
    return event;
  });
}

/*
* convertDateTime takes a date, time, and run time of a screening and returns the start datetime and
* end datetime in the RFC 3339 extension of the ISO 8601 standard format
* */
function convertDateTime(dateData) {
  var dateValue    = new Date(dateData.date);
  var dateValueObj = {
    month: dateValue.getMonth(),
    day: dateValue.getDate(),
    year: dateValue.getYear()
  }

  var timeValue    = new Date(dateData.time);
  var timeValueObj = {
    hour: timeValue.getHours(),
    minutes: timeValue.getMinutes()
  }

  // * need to add the 0 for the seconds
  // * important to wrap properties in Date.UTC() function, otherwise the date will be created according
  // to the system settings for timezone offset
  var formattedDateTime = new Date(Date.UTC(dateValueObj.year, dateValueObj.month, dateValueObj.day, timeValueObj.hour, timeValueObj.minutes, 0));
  var startDateTimeMs   = formattedDateTime.getTime();
  var startDateTime     = Utilities.formatDate(formattedDateTime, "GMT", "EEE, dd MMM yyyy kk:mm:ss z");
  var endDateTimeMs;

  if (dateData.runTime !== "N/A" && dateData.runTime) {
    endDateTimeMs = startDateTimeMs + (dateData.runTime * 60000);
  } else {
    endDateTimeMs = startDateTimeMs + (60 * 60000);
  }

  // not totally sure why you have to add the (+) operator but you do
  var formattedEndDateTime = new Date(+endDateTimeMs);
  var endDateTime          = Utilities.formatDate(formattedEndDateTime, "GMT", "EEE, dd MMM yyyy kk:mm:ss z");

  return {
    start: startDateTime,
    end: endDateTime
  }
}

/*
* sendEvents makes a post request to the calendar server and sends a unique token
* as well as all of the events in the sheet that triggered the on edit or on change event
* */
function sendEvents(payload) {
  var city = sheetToSend.getName().toLowerCase().split(' ').join('_');
  var url  = apiUrl + city;

  var options = {
    "method": "post",
    // Headers have to be capitalized
    "headers": {
      "Token": "oN$lYb-ek5-rOw"
    },
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  }
  // console.log(JSON.stringify(payload))
  return UrlFetchApp.fetch(url, options);
}