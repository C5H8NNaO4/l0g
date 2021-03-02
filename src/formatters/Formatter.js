const {tag} = require('../tags/tag');
const moment = require('moment');
const {Format} = require('../symbols');

class Formatter {
  constructor(fn) {
    if (typeof fn === 'function') {
      this._format = fn;
    }
    this.foo = 'bar';
  }

  transformTagArgs(options, strs, ...args) {
    const transformed = args.map((obj) => {
      if (obj && obj[Format]) return obj[Format]({formatter: this, ...options});
      return obj;
    });
    return [strs, ...transformed];
  }

  transform(options) {
    if (Array.isArray(options.tag) && options.tag[0].raw) {
      options.tag = this.transformTagArgs(options, ...options.tag);
      options.message = this.tag(...options.tag);
    }

    options.ts = this.constructor.timestamp(options.ts);

    return options;
  }

  format(options) {
    const {ts, level, message} = options;
    if (this._format) {
      return this._format(options);
    }
    return `${ts} ${level}: ${message}`;
  }

  static timestamp(ts, options) {
    return moment(ts).toISOString();
  }

  // static transform (instance, options) {
  //   // if (typeof instance.transformTag === 'function')
  //   //   options.tag =
  //   if (Array.isArray(options.tag) && options.tag[0].raw)
  //     options.message = instance.tag(...options.tag);

  //   if (typeof instance.transform === 'function')
  //     options = instance.transform(options);


  //   return options;
  // }

  static format(instance, options) {
    options = instance.transform(options); // Formatter.transform(instance, options);
    return instance.format(options);
  }
}

Formatter.prototype.tag = tag;

module.exports = {Formatter};
