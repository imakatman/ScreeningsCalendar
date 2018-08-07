var apiUrl = "http://35.163.42.76:8080/submit/los_angeles";

var headers;
var request, response;
var activeSheet;

function main(e) {
  headers     = getHeaders(e, 1)[0];
  var events  = getValues(e);
  var payload = designData(events);

  console.log(payload[0])

  sendEvents(payload);
}

function getHeaders(e, r) {
  activeSheet = e.source.getActiveSheet();
  var vs      = activeSheet.getRange("A" + r + ":O" + r).getValues();

  return vs;
}

function getValues(e) {
  activeSheet     = e.source.getActiveSheet();
  var numOfEvents = activeSheet.getLastRow();
  var vs          = [];

  for (var i = 2; i < numOfEvents; i++) {
    vs.push(activeSheet.getRange("A" + i + ":O" + i).getValues());
  }

  return vs;
}

function designData(data) {
  return data.map(function (theEvent) {
    var event = {};
    theEvent[0].map(function (info, i) {
      event[headers[i]] = info
    });
    var dateTime        = convertDateTime(event.Date, event.Time, event.Run_Time);
    event.StartDateTime = dateTime.start;
    event.EndDateTime   = dateTime.end;
    console.log(event)
    return event;
  });
}

function convertDateTime(date, time, runTime) {
  var dateValue    = new Date(date);
  var dateValueObj = {
    month: dateValue.getMonth(),
    day: dateValue.getDate(),
    year: dateValue.getYear()
  }

  var timeValue    = new Date(time);
  var timeValueObj = {
    hour: timeValue.getHours(),
    minutes: timeValue.getMinutes()
  }

  // need to add the 0 for the seconds
  var formattedDateTime = new Date(dateValueObj.year, dateValueObj.month, dateValueObj.day, timeValueObj.hour, timeValueObj.minutes, 0);
  var startDateTimeMs   = formattedDateTime.getTime();
  var startDateTime     = Utilities.formatDate(formattedDateTime, "PST", "yyyy-MM-dd'T'HH:mm:ss'Z'")

  var endDateTimeMs        = startDateTimeMs + (runTime * 60000);
  // not totally sure why you have to add the (+) operator but you do
  var formattedEndDateTime = new Date(+endDateTimeMs);
  var endDateTime          = Utilities.formatDate(formattedEndDateTime, "PST", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  return {
    start: startDateTime,
    end: endDateTime
  }
}

function sendEvents(payload) {
  console.log("payload", payload)
  return UrlFetchApp.fetch(apiUrl, {
    "method": "post",
    "body": payload
  });
}