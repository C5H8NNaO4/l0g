const {Formatter} = require('../formatters');

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
    this.logger.context.transport = this;
    if (this.formatter instanceof Formatter) {
      options.message = Formatter.format(this.formatter, {transport:this, ...options});
    }

    if (Array.isArray(options.tag))
      options.tag = this.formatter.transformTagArgs(options, ...options.tag);
    // if (this.transform)
    //   options = this.transform(options)
    return options;
  }

  send(options) {
    const {Logger} = this;
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
    if (Logger.filter && Logger.filter instanceof RegExp && !Logger.filter.test(options.message))
      return
    return this.log(options);
  }


}

Transport.symbols = {
  currentFeature: Symbol('currentFeature'),
}

module.exports = {
  Transport,
};
