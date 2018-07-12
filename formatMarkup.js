function formatMarkup(type, data) {
    if (data !== null) {
        switch (type) {
            case '"':
                if (typeof data === 'string') {
                    if (data.indexOf('"') >= 0) {
                        const regExp = new RegExp('"', "g");
                        return data.replace(regExp, "");
                    }
                    if (data.indexOf('&quot;') >= 0) {
                        const regExp = new RegExp('&quot;', "g");
                        return data.replace(regExp, "");
                    }
                    return data;
                }
                return;
            case 'Notes':
                if (typeof data === 'string') {
                    let notes = data;
                    if (/\n/ig.test(notes)) {
                        notes = notes.replace(/\n/ig, "<br/>");
                    }
                    if (data.indexOf('"') >= 0) {
                        return formatMarkup('"', notes)
                    }
                    return notes;
                }
                return;
            case 'Youtube':
                if (typeof data === 'string') {
                    if (data.indexOf("watch?v=") >= 0) {
                        const id = data.split('v=').pop();
                        return `https://www.youtube.com/embed/${id}`
                    }
                    return data;
                }
                return;
            case 'Rsvp':
                if (typeof data === 'string') {
                    if (data.indexOf("@") >= 0) {
                        return `mailto:${data}`;
                    }
                    return data;
                }
                return;
            default:
                return;
        }
    }
    return;
}
