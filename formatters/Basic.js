const {FnMap, oftype} = require('./Map');
const util = require('util');

class Basic extends FnMap {
  static formatMap = new Map([
    [oftype('string'), v => util.inspect(v)],
    [v => v instanceof Error, e => e.message],
    [oftype('object'), v => util.inspect(v)],
  ]);

  constructor (fn, opt = {}) {
    super(fn, opt);
    const {formatMap = Basic.formatMap} = opt;
    this.formatMap = formatMap;
  }
  transform (options) {
    super.transform(options);
    if (options.tag) {
      const {tag: [strs, ...vals]} = options;
      const error = vals.filter(v => v instanceof Error)[0];
      if (error) {
        const {message, stack} = error;
        options.error = {message, stack}
      }
    }
    return options;
  }
}

module.exports = {
  Basic
}