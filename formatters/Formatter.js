const {tag} = require('../tags/tag');
const moment = require('moment')
const util = require('util')
class Formatter {
  constructor (fn) {
    if (typeof fn === 'function')
      this._format = fn;
  }

  transform (options) {
    options.ts = this.constructor.timestamp(options.ts);
    return options;
  }

  format ( options) {
    const {ts, level, message} = options;
    if (this._format)
      return this._format(options);
    return `${ts} ${level}: ${message}`;
  }

  static timestamp (ts, options) {
    return moment(ts).toISOString();
  }

  static transform (instance, options) {
    // if (typeof instance.transformTag === 'function')
    //   options.tag = 
    if (Array.isArray(options.tag) && options.tag[0].raw)
      options.message = instance.tag(...options.tag);

    if (typeof instance.transform === 'function')
      options = instance.transform(options);


    return options;
  }

  static format (instance, options) {
    options = Formatter.transform(instance, options);
    return instance.format(options);
  }
}

Formatter.prototype.tag = tag;

module.exports = {Formatter};