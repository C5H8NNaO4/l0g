function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  MapFormatter,
  oftype
} = require('./MapFormatter');

const util = require('util');

class Basic extends MapFormatter {
  constructor(fn, opt = {}) {
    super(fn, opt);
    const {
      formatMap = Basic.formatMap
    } = opt;
    this.formatMap = formatMap;
  }

  transform(options) {
    super.transform(options);

    if (options.tag) {
      const {
        tag: [strs, ...vals]
      } = options;
      const error = vals.filter(v => v instanceof Error)[0];

      if (error) {
        const {
          message,
          stack
        } = error;
        options.error = {
          message,
          stack
        };
      }
    }

    return options;
  }

}

_defineProperty(Basic, "formatMap", new Map([[oftype('string'), v => util.inspect(v)], [v => v instanceof Error, e => e.message], [oftype('object'), v => util.inspect(v)]]));

module.exports = {
  Basic
};