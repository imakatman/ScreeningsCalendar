var apiUrl = "http://35.163.42.76:8080/submit/los_angeles";

var headers;
var request, response;
var activeSheet;

function main(e) {
  headers        = getHeaders(e, 1)[0];
  var events     = getValues(e);
  var parameters = designData(events);

  sendEvent(parameters);
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
  var events    = [];
  var eventInfo = data;

  console.log("headers", headers)
  console.log("eventInfo", eventInfo.length, eventInfo)
  eventInfo.map(function (theEvent) {
    console.log(theEvent)
    var event            = {};
    theEvent[0].map(function (info, i) {
      event[headers[i]] = info
    });
    var dateTime         = convertDateTime(event.Date, event.Time, event.Run_Time);
    event.startDateTime  = dateTime.start;
    event.endDateTime    = dateTime.end;

    console.log("event", event)
    events.push(event)
  })

  console.log("events", events)

  return events;
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

function sendEvent(payload) {
  //var calendarId = 153194017366433;
  //var eventDoesntExist = p.ID === "" || p.ID === undefined || p.ID === typeof 'undefined'
  //console.log("eventDoesntExist:", eventDoesntExist)
  //var methodType    = eventDoesntExist ? createEvent : saveEvent;

  // var postUrl = apiUrl + methodType + "?token=" + token + "&calendar_id=" + calendarId + "&title=" + p.Film_Title +
  // "&description=" + p.Synopsis + "&location=" + p.Venue_Name + " " + p.Venue_Address +
  // "&timezone=America/Los_Angeles" + "&start_date=" + p.startDateTime + "&end_date=" + p.endDateTime;

  request = function () {
    return response = UrlFetchApp.fetch(apiUrl, {
      "method": "post",
      "body": payload
    });
  }

  request();
}

// function checkEvent(){
//   // Check to see if an event with the same Title, Event, and Time exists?
// }

// function updateScreeningIfNeeded(timeout) {
//   var truncatedTime = timeout ? timeout : 1000;
//
//   Utilities.sleep(truncatedTime);
//   //@TODO: Write error handling code for response codes other than 200
//   if (response !== 'undefined' || response !== undefined) {
//     console.log("response: ", typeof response, response)
//     var id = JSON.parse(response).event.id;
//     activeSheet.getRange("A" + editedRow).setValue(id);
//   } else {
//     updateScreeningIfNeeded(timeout + 1000);
//   }
// }

// "https://www.calendarx.com/api/v1/calendars/events/create/?token=api1531940172LJDNgYHieIyvSu2ORGsx25545&calendar_id=153194017366433&title=SHOCK
// AND AWE&description=A group of journalists covering George Bush’s planned invasion of Iraq in 2003 are skeptical of
// the president’s claim that Saddam Hussein has “weapons of mass destruction.&location=Samuel Goldwyn
// Theater&timezone=America/Los_Angeles&start_date=7/18/18&end_date=7/19/18&all_day_event=true"