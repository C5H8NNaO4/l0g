var AU = require('ansi_up');
var ansi_up = new AU.default;

const {ConsoleTransport} = require('./ConsoleTransport');

function styledConsoleLog() {
  var argArray = [];

  if (arguments.length) {
      var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
      var endTagRe = /<\/span>/gi;

      var reResultArray;
      argArray.push(arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c'));
      while (reResultArray = startTagRe.exec(arguments[0])) {
          argArray.push(reResultArray[2]);
          argArray.push('');
      }

      // pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
      for (var j = 1; j < arguments.length; j++) {
          argArray.push(arguments[j]);
      }
  }

  return argArray;
  console.log.apply(console, argArray);
}

class ChromeTransport extends ConsoleTransport {
  transform (options) {
    const styled = ansi_up.ansi_to_html(options.message)
    const args = styledConsoleLog(styled);
    options.console = options.console || {};
    options.console.args = args;
    return options;
  }
  log (options) {
    console.log.apply(console, options.console.args);
  }
}

module.exports = {
  ChromeTransport
}