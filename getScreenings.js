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
  // var p = {
  //   Credits:  "Starring Christine Baranski, Pierce Brosnan, Dominic Cooper, Colin Firth, Andy Garcia, Lily James,
  // Amanda Seyfried, Stellan Skarsgård, Julie Walters, Cher and Meryl Streep. Produced by Judy, Craymer and Gary
  // Goetzman. Story by Richard Curtis and Ol Parker and Catherine Johnson. Screenplay by Ol Parker. Directed by Ol
  // Parker.", Date:  "Sat Jul 21 00:00:00 GMT-07:00 2018", Film_Title:  "MAMMA MIA! HERE WE GO AGAIN!!!!", Guests:
  // "", Notes:  "", Rating:  "PG-13", Rsvp:  "", Run_Time:  "N/A", Series:  "", Studio:  "Universal Pictures",
  // Synopsis:  "In this sequel to Mamma Mia!, a pregnant Sophie learns about her mother’s past.", Time:  "Sat Dec 30
  // 19:30:00 GMT-08:00 1899", Venue_Address:  "8949 Wilshire Boulevard, Beverly Hills CA, 90211", Venue_Name:  "Samuel
  // Goldwyn Theater", Youtube:  "https://www.youtube.com/watch?v=XcSMdhfKga4" }

  var dateValue = new Date(p.Date);
  var month = dateValue.getMonth();
  var day = dateValue.getDate();
  var year = dateValue.getYear();

  var timeValue = new Date(p.Time);
  var hour = timeValue.getUTCHours();
  var minutes = timeValue.getUTCMinutes();

  var formattedDateTime = new Date(year, month, day, hour, minutes);

  console.log(formattedDateTime)

  var dateTime = Utilities.formatDate(formattedDateTime, "UTC", "MM/dd/yyyy HH:mm a")
  //var dateTime = Utilities.formatDate(formattedDateTime, "UTC", "MM/dd/yyyy")

  console.log(dateTime)

  UrlFetchApp.fetch(apiUrl + createEvent
    + "?token=" + token +
    "&calendar_id=153194017366433&title="
    + p.Film_Title
    + "&description=" + p.Synopsis +
    "&location=" + p.Venue_Name + " " + p.Venue_Address +
    "&timezone=America/Los_Angeles" +
    "&start_date=" + dateTime, {
    "method": "post",
    "payload": JSON.stringify(data)
  });

  Logger.log(UrlFetchApp.fetch(apiUrl + createEvent
    + "?token=" + token +
    "&calendar_id=153194017366433&title="
    + p.Film_Title
    + "&description=" + p.Synopsis +
    "&location=" + p.Venue_Name + " " + p.Venue_Address +
    "&timezone=America/Los_Angeles" +
    "&start_date=" + dateTime, {
    "method": "post",
    "payload": JSON.stringify(data)
  }).getResponseCode());
}

// "https://www.calendarx.com/api/v1/calendars/events/create/?token=api1531940172LJDNgYHieIyvSu2ORGsx25545&calendar_id=153194017366433&title=SHOCK
// AND AWE&description=A group of journalists covering George Bush’s planned invasion of Iraq in 2003 are skeptical of
// the president’s claim that Saddam Hussein has “weapons of mass destruction.&location=Samuel Goldwyn
// Theater&timezone=America/Los_Angeles&start_date=7/18/18&end_date=7/19/18&all_day_event=true"