var apiUrl      = "https://www.calendarx.com/api/v1/calendars/";
var createEvent = "events/create/";
var token       = "api1531940172LJDNgYHieIyvSu2ORGsx25545";
var calendar

var screenings    = {};
var children_data = {};

var data = JSON.stringify({
  calendar_id: 153194017366433,
  title: "SHOCK AND AWE",
  start_date: "7/18/18 4:00 PM",
})

// var e;
var headers;

function main(e) {
  headers = getValues(e, 1);

  var editedRow = e.source.getActiveRange().getRow();
  var edits     = getValues(e, editedRow);

  var parameters = designData(edits)

  sendScreenings(parameters)
}

function getValues(e, r) {
  var sh = e.source.getActiveSheet();
  var vs = sh.getRange("A" + r + ":O" + r).getValues();

  return vs;
}

function designData(data) {
  var screening = {};
  var eventInfo = data[0];

  eventInfo.map(function (d, i) {
    screening[headers[0][i]] = data[0][i]
  })

  return screening;
}

function sendScreenings(p) {
  var dateValue = new Date(p.Date);
  var month     = dateValue.getMonth();
  var day       = dateValue.getDate();
  var year      = dateValue.getYear();

  var timeValue = new Date(p.Time);
  var hour      = timeValue.getHours();
  var minutes   = timeValue.getMinutes();

  var formattedDateTime    = new Date(year, month, day, hour, minutes, 0); // need to add the 0 for the seconds
  var startDateTimeMs      = formattedDateTime.getTime();
  var duration             = p.Run_Time;
  var endDateTimeMs        = startDateTimeMs + (duration * 60000);

  var formattedEndDateTime = new Date(+endDateTimeMs); // i have no idea why you have to add the (+) operator but you do
  var startDateTime = Utilities.formatDate(formattedDateTime, "PST", "MM/dd/yyyy kk:mm")

  var endDateTime   = Utilities.formatDate(formattedEndDateTime, "PST", "MM/dd/yyyy kk:mm")

  console.log("endDateTime:", endDateTime)

  UrlFetchApp.fetch(apiUrl + createEvent
    + "?token=" + token +
    "&calendar_id=153194017366433&title="
    + p.Film_Title
    + "&description=" + p.Synopsis +
    "&location=" + p.Venue_Name + " " + p.Venue_Address +
    "&timezone=America/Los_Angeles" +
    "&start_date=" + startDateTime,
    "&end_date=" + endDateTime, {
      "method": "post",
      "payload": JSON.stringify(data)
    });
}

// "https://www.calendarx.com/api/v1/calendars/events/create/?token=api1531940172LJDNgYHieIyvSu2ORGsx25545&calendar_id=153194017366433&title=SHOCK
// AND AWE&description=A group of journalists covering George Bush’s planned invasion of Iraq in 2003 are skeptical of
// the president’s claim that Saddam Hussein has “weapons of mass destruction.&location=Samuel Goldwyn
// Theater&timezone=America/Los_Angeles&start_date=7/18/18&end_date=7/19/18&all_day_event=true"