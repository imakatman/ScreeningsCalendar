var apiUrl = "http://35.163.42.76:8080/submit/los_angeles";

var headers;
var activeSheet;

/*
* main parses the edited sheet to the data as JSON to the ampas
* calendar server
* */
function main(e) {
  headers      = getHeaders(e, 1)[0];
  var events   = getValues(e);
  var sheet    = e.source.getActiveSheet().getName();
  var miscData = getMiscData(sheet, SpreadsheetApp.getActive().getSheetByName("Misc"))
  var payload  = {
    screenings: designData(events),
    misc: miscData
  };

  sendEvents(payload);
}

/*
* getHeaders parses the first row of the sheet and returns them as values
* */
function getHeaders(e, r) {
  activeSheet = e.source.getActiveSheet();
  var vs      = activeSheet.getRange("A" + r + ":O" + r).getValues();

  return vs;
}

/*
* getValues parses each row, which is returned in an array, and pushes it into a daddy array
* */
function getValues(e) {
  activeSheet     = e.source.getActiveSheet();
  var numOfEvents = activeSheet.getLastRow();
  var vs          = [];

  console.log(numOfEvents)

  for (var i = 2; i <= numOfEvents; i++) {
    vs.push(activeSheet.getRange("A" + i + ":O" + i).getValues());
  }

  return vs;
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
        if (value === "") {
          obj[f] = ""
        } else {
          obj[f] = value
        }
      })
      vs[c] = obj
    }
  })

  return vs;
}

/*
* designData parses the events into an object with each value being attached to its corresponding
* field and returns them in an array
* */
function designData(data) {
  console.log(data)
  return data.map(function (theEvent) {
    var event = {};
    theEvent[0].map(function (info, i) {
      event[headers[i]] = info
    });

    var dateData = {
      date: event.Date,
      time: event.Time,
      runTime: event.Run_Time,
      tzAbbrev: event.Timezone_Abbrev
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

  // need to add the 0 for the seconds
  var formattedDateTime = new Date(dateValueObj.year, dateValueObj.month, dateValueObj.day, timeValueObj.hour, timeValueObj.minutes, 0);
  var startDateTimeMs   = formattedDateTime.getTime();
  var startDateTime     = Utilities.formatDate(formattedDateTime, dateData.tzAbbrev, "yyyy-MM-dd'T'HH:mm:ss'Z'")

  var endDateTimeMs        = startDateTimeMs + (dateData.runTime * 60000);
  // not totally sure why you have to add the (+) operator but you do
  var formattedEndDateTime = new Date(+endDateTimeMs);
  var endDateTime          = Utilities.formatDate(formattedEndDateTime, dateData.tzAbbrev, "yyyy-MM-dd'T'HH:mm:ss'Z'");

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
  var options = {
    "method": "post",
    "headers": {
      "token": "oN$lYb-ek5-rOw"
    },
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  }
  console.log(JSON.stringify(payload))
  return UrlFetchApp.fetch(apiUrl, options);
}