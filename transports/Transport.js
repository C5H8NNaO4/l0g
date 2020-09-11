const {Formatter} = require('../formatters')
const fs = require('fs');

class Transport {
  constructor (options = {}) {
    const {formatter = new Formatter, features = []} = options;
    this.formatter = formatter;
    this.features = features;
  }

  log (options) {
    throw new Error('Not implemented');
  }

  transform (options) {
    if (this.formatter instanceof Formatter) {
      options.message = Formatter.format(this.formatter, options);
    }
    // if (this.transform)
    //   options = this.transform(options)
    return options;
  }

  send (options) {
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
    currentFeature: Symbol('currentFeature')
  }
}
 
module.exports = {
  Transport
}