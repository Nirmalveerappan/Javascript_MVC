export class ErrorHandler {
    constructor() {
        listenErrors();
    }
}

listenErrors = function () {
    window.onerror = function (message, source, lineno, colno, error) {
        var string = message.toLowerCase();
        console.log("message", message, "indexOf", string.indexOf(substring), 'error msg', error)
        var substring = "script error";
        if (string.indexOf(substring) > -1) {
            console.log('Script Error: See Browser Console for Detail');
        } else {
            var message = [
                'Message: ' + message,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Column: ' + columnNo,
                'Error object: ' + JSON.stringify(error)
            ].join(' - ');

            console.log(message);
        }

        return false;
    }
}