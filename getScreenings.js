var apiUrl      = "https://www.calendarx.com/api/v1/calendars/";
var createEvent = "events/create/";
var saveEvent   = "events/save/";
var token       = "api1531940172LJDNgYHieIyvSu2ORGsx25545";

var headers;
var request, response;
var activeSheet, editedRow;

function main(e) {
  headers        = getValues(e, 1);
  editedRow      = e.source.getActiveRange().getRow();
  var edits      = getValues(e, editedRow);
  var parameters = designData(edits);

  sendScreening(parameters);
  updateScreeningIfNeeded();
}

function getValues(e, r) {
  activeSheet = e.source.getActiveSheet();
  var vs      = activeSheet.getRange("A" + r + ":O" + r).getValues();

  return vs;
}

function designData(data) {
  var screening = {};
  var eventInfo = data[0];

  eventInfo.map(function (d, i) {
    screening[headers[0][i]] = encodeURIComponent(data[0][i])
  })

  var dateTime            = convertDateTime(screening.Date, screening.Time, screening.Run_Time);
  screening.startDateTime = dateTime.start;
  screening.endDateTime   = dateTime.end;

  return screening;
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
  var startDateTime     = Utilities.formatDate(formattedDateTime, "PST", "MM/dd/yyyy kk:mm")

  var endDateTimeMs        = startDateTimeMs + (runTime * 60000);
  // not totally sure why you have to add the (+) operator but you do
  var formattedEndDateTime = new Date(+endDateTimeMs);
  var endDateTime          = Utilities.formatDate(formattedEndDateTime, "PST", "MM/dd/yyyy kk:mm");

  return {
    start: startDateTime,
    end: endDateTime
  }
}

function sendScreening(p) {
  var calendarId = 153194017366433;
  var eventDoesntExist = p.ID === "" || p.ID === undefined || p.ID === typeof 'undefined'
  console.log("eventDoesntExist:", eventDoesntExist)
  var methodType    = eventDoesntExist ? createEvent : saveEvent;

  var postUrl = apiUrl + methodType + "?token=" + token + "&calendar_id=" + calendarId + "&title=" + p.Film_Title + "&description=" + p.Synopsis + "&location=" + p.Venue_Name + " " + p.Venue_Address + "&timezone=America/Los_Angeles" + "&start_date=" + p.startDateTime + "&end_date=" + p.endDateTime;

  request = function () {
    response = UrlFetchApp.fetch(postUrl, {
      "method": "post"
    });
    return response;
  }

  request();
}

// function checkEvent(){
//   // Check to see if an event with the same Title, Event, and Time exists?
// }

function updateScreeningIfNeeded(timeout) {
  var truncatedTime = timeout ? timeout : 1000;

  Utilities.sleep(truncatedTime);
  //@TODO: Write error handling code for response codes other than 200
  if (response !== 'undefined' || response !== undefined) {
    console.log("response: ", typeof response, response)
    var id = JSON.parse(response).event.id;
    activeSheet.getRange("A" + editedRow).setValue(id);
  } else {
    updateScreeningIfNeeded(timeout + 1000);
  }
}

// "https://www.calendarx.com/api/v1/calendars/events/create/?token=api1531940172LJDNgYHieIyvSu2ORGsx25545&calendar_id=153194017366433&title=SHOCK
// AND AWE&description=A group of journalists covering George Bush’s planned invasion of Iraq in 2003 are skeptical of
// the president’s claim that Saddam Hussein has “weapons of mass destruction.&location=Samuel Goldwyn
// Theater&timezone=America/Los_Angeles&start_date=7/18/18&end_date=7/19/18&all_day_event=true"