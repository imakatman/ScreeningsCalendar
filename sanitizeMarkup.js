function sanitizeMarkup(type, data) {
  if (data !== null) {
    switch (type) {
      case 'contentEditor':
        if (typeof data === 'string') {
          let markup = data;
          /*
          If the markup has some special character's in it, it will be returned with
          quotes wrapping it
           */
          const dblApsLen = "&quot;".length;
          if (markup.substr(0, dblApsLen) === '&quot;' && markup.substr((markup.length - dblApsLen), markup.length) === '&quot;'){
            return markup.substr(dblApsLen, markup.length - (dblApsLen * 2));
          }
          /*
          Content editor is using a carriage return in Spreadsheet to create a linebreak,
          we are replacing that here into a <br/> tag
          */
          if (/\n/ig.test(markup)) {
            markup = markup.replace(/\n/ig, "<br/>");
          }
          /*
           Ampersand sign is coming back as &amp; so we need to replace any instance of that
           into an & for some browsers.
           */
          if (markup.indexOf('&amp;') >= 0){
            return markup.replace(/&amp;/g, "&");
          }
          return markup;
        }
        return;
     
      default:
        return data;
    }
  }
  return data;
}