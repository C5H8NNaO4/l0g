const {Formatter} = require('./Formatter')
const {MapTag} = require('../tags/MapTag')

const oftype = t => v => t === typeof v;
const ofinstance = t => v => v instanceof t;
const key = key => (v,k) => k === key;


class MapFormatter extends Formatter {
  static isObject = oftype('object');
  static compose = (...fns) => v => fns.flat().reduce((v, fn) => fn.call(this, v), v);

  constructor (fn, options = {}) {
    super(fn)
    const {strFormatMap = new Map, formatMap = new Map, optionsMap = new Map} = options;
    this.formatMap = formatMap;
    this.strFormatMap = strFormatMap;
    this.optionsMap = optionsMap;
  }

  transformOptions (options) {
    const {optionsMap} = this;
    
    
    for (const key in options) {
      const val = options[key];
      inner:
      for (const [a, b] of optionsMap.entries()) {
        if (typeof a !== 'function') continue
        if (a(val, key)) {
          options[key] = b.call(this, val);
          break inner;
        }
      }
    }
    
    return options;
  }

  transform (options) {
    options = super.transform(options)
    options = this.transformOptions(options);
    return options;
  }

  tag (strs, ...vals) {
    return MapTag(this.formatMap, this.strFormatMap).call(this, strs, ...vals)
  }
}

module.exports = {
  MapFormatter, oftype, key, ofinstance,
}