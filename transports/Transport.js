const fs = require('fs');
const {Formatter} = require('../formatters')
class Transport {
  constructor (options = {}) {
    this.formatter = options.formatter || new Formatter;
  }

  log (options) {

    throw new Error('Not implemented');
  }

  format (options) {
    let {message} = options;
    if (this.formatter instanceof Formatter) {
      options.message = Formatter.format(this.formatter, options);
    }
    return options;
  }
}



// Transport.default = new ConsoleTransport;

module.exports = {
  Transport
}