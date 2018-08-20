var apiUrl = "http://35.163.42.76:8080/submit/";

var sheet;
var headers;
var sheetToSend;

var miscSheet, miscDataUpdated, cityToUpdate;

/*
* main parses the edited sheet to the data as JSON to the ampas
* calendar server
* */
function main(e) {
  sheet     = e.source.getActiveSheet().getName();
  miscSheet = SpreadsheetApp.getActive().getSheetByName("Misc");

  if(sheet !== "Work in progress"){
    if (sheet !== "Misc") {
      miscDataUpdated = false;
      headers   = getHeaders(e, 1)[0]; // sets var sheetToSend
      var events      = getEvents(e);
      var miscData    = getMiscData(sheet, miscSheet)

    } else {
      miscDataUpdated = true;
      cityToUpdate    = getUpdatedMiscData(e);
      headers   = getHeaders(e, 1)[0]; // sets var sheetToSend
      var events      = getEvents(e);
      var miscData    = getMiscData(cityToUpdate, miscSheet)
    }

    var payload = {
      screenings: designData(events),
      misc: miscData
    };

    return sendEvents(payload);
  }
}

function getUpdatedMiscData(e) {
  var editedRow = e.source.getActiveRange().getRow();
  var city      = miscSheet.getRange("A" + editedRow).getValue();

  return city;
}

/*
* getHeaders parses the first row of the sheet and returns them as values
* */
function getHeaders(e, r) {
  var vs;

  if (!miscDataUpdated) {
    sheetToSend = e.source.getActiveSheet();
    vs          = sheetToSend.getRange("A" + r + ":O" + r).getValues();
  } else {
    sheetToSend = SpreadsheetApp.getActive().getSheetByName(cityToUpdate);
    vs          = sheetToSend.getRange("A" + r + ":O" + r).getValues()
  }

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

function stripHtml(html){
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
        if(f === "Description" || f === "Screening_Regulations"){
          value = stripHtml(value);
        }
        if (value === "") {
          obj[f] = ""
        } else {
          obj[f] = value
        }
      })
      vs = obj
    }
  })

  return vs;
}

/*
* designData parses the events into an object with each value being attached to its corresponding
* field and returns them in an array
* */
function designData(data) {
  return data.map(function (theEvent) {
    var event = {};
    theEvent[0].map(function (info, i) {
      var h = headers[i];
      var value = info;
      if(h !== "Synopsis"){
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
  console.log(JSON.stringify(payload))
  return UrlFetchApp.fetch(url, options);
}