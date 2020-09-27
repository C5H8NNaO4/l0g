const {Formatter} = require('../formatters');
const fs = require('fs');

/**
 * @typedef TransportOptions
 * @type {Object}
 * @property {Formatter} [formatter=new Formatter] - The formatter, the transport uses.
 * @property {Feature[]} features - The features used by the transport
 */

/**
 * Transport class
 * @description A transport is used to *transport* log messages to various locations. Like a file or the console.
 */
class Transport {

  /**
   * 
   * @param {TransportOptions} options - Optional options
   */
  constructor(options = {}) {
    const {formatter = new Formatter, features = []} = options;
    this.formatter = formatter;
    this.features = features;
  }

  /**
   * @description The Transport.log function gets called on behalf the Logger.
   * @param {LogOptions} options - The metadata passed to Logger.log
   */
  log(options) {
    throw new Error('Not implemented');
  }

  transform(options) {
    if (this.formatter instanceof Formatter) {
      options.message = Formatter.format(this.formatter, options);
    }
    // if (this.transform)
    //   options = this.transform(options)
    return options;
  }

  send(options) {
    const currentFeatureSymbol = Transport.symbols.currentFeature;
    options = this.transform(options);
    if (this.features) {
      for (const feat of this.features) {
        this[currentFeatureSymbol] = feat;
        feat.transport = this;
        let next = false;
        if (feat.log) feat.log(options, () => next = true);
        if (!next) return;
      }
    }

    // console.log(this.transform.toString())

    return this.log(options);
  }

  static symbols = {
    currentFeature: Symbol('currentFeature'),
  }
}

module.exports = {
  Transport,
};
