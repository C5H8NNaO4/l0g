const fs = require('fs');
const {Formatter} = require('../formatters')
class Transport {
  constructor (options = {}) {
    const {formatter = new Formatter, features = []} = options;
    this.formatter = formatter;
    this.features = features;
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

  send (options) {
    if (this.features) {
      for (const feat of this.features) {
        this.currentFeature = feat;
        if (feat.log) return feat.log.call(this, options);
      }
    }
    return this.log(options);
  }
}



// Transport.default = new ConsoleTransport;

module.exports = {
  Transport
}