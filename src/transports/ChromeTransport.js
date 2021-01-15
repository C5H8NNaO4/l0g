const AU = require('ansi_up').default;
const ansiUp = new AU;

const {ConsoleTransport} = require('./ConsoleTransport');

/**
 * @typedef any
 * @type {string|number|array|object} - Any type
 */

/**
 * @param {string} message - A HTML styled message.
 * @param {...any} args - Optional arguments passed to console.log.
 * @return {any[]} - An array of arguments for console.log, styled using css format strings.
 */
function getStyledConsoleLogArgs(message = '', ...args) {
  const argArray = [];

  if (arguments.length) {
    const startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
    const endTagRe = /<\/span>/gi;

    let reResultArray;
    argArray.push(message.replace(startTagRe, '%c').replace(endTagRe, '%c'));
    while (reResultArray = startTagRe.exec(message)) {
      argArray.push(reResultArray[2]);
      argArray.push('');
    }

    // pass through subsequent args since chrome dev tools does
    // not (yet) support console.log styling of the following
    // form:
    // console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
    for (const arg of args) {
      argArray.push(arg);
    }
  }

  return argArray;
}


/**
 * The return value of ConsoleTransport.prototype.transform
 * @typedef {object.<object, any>} ConsoleTransportTransformedOptions
 * @property {object} console - Additional options used by ConsoleTransports
 * @property {any[]} console.args - Arguments intended to be passed to console.log
 * @property {any} * - any
 */

/**
 * @typedef Person
 * @type {Object}
 * @property {number} age - the person's age
 * @property {string} hobby - the person's hobby
 */

/**
 * @typedef {Object.<string, Person>} Descriptor
 */

/** Chrome transport class. */
class ChromeTransport extends ConsoleTransport {
  /**
   * Transforms the options passed to the function.
   * Adds options.console.args
   * @param {object} options - An arbitrary object.
   * @return {ConsoleTransportTransformedOptions} - The transformed options.
   */
  transform(options) {
    options = super.transform(options);
    const styled = ansiUp.ansi_to_html(options.message);
    const args = getStyledConsoleLogArgs(styled);
    // console.log(styled);
    options.console = options.console || {};
    options.console.args = args;
    return options;
  }

  /**
   * @param {object} options - An arbitrary object.
   */
  log(options) {
    const {level} = options;
    const logFn = ConsoleTransport.logFns[level] || 'log';
    const args = ConsoleTransport.getOptionalArgs(options);
    if (logFn)
      console[logFn](...args);

    // console.log.call(console, ...options.console.args);
  }
}

module.exports = {
  ChromeTransport,
};
