const moment = require('moment');
const util = require('util');

const DefaultTag = (strs, ...vals) => {
  return strs.reduce((str, val, i) => {
    return str + vals[i-1] + val;
  })
}

const typeClr = {
  string: 'lightgreen',
  number: 'gold',
  object: 'purple'
}

const Tag = (strs, ...vals) => {
  return strs.reduce((str, val, i) => {
    return str + vals[i-1] + val;
  })
}


// const TypeTag = colors => (strs, ...vals) => {
//   return Tag(strs, ...vals.map(v => colors[typeof v]&&chalk.keyword(colors[typeof v])(v)||v))
// }

const TypeTag = (valCbs, strCbs) => (strs, ...vals) => {
  if (typeof cbs === 'object') {
    if (cbs.constructor === Object) {
      cbs = new Map(Object.entries(cbs));
    }
  }

  const mapVals = cbs => v => {
    const typeKey = `.${typeof v}`;
    const valKey = v;
    let cb;
    for (const entry of cbs.entries()) {
      const [a,b] = entry;
      if (typeof a !== 'function') continue;
      if (a(v)) 
        v = b.call(this, v);
    }
    if (cbs.has(typeKey)) {
      cb = cbs.get(typeKey);
    } else if (cbs.has(v)) {
      cb = cbs.get(v);
    }
    if (typeof cb === 'function')
      v = cb.call(this, v)

    return v;
  }
  let message = Tag(strs.map(mapVals(strCbs || valCbs)), ...vals.map(mapVals(valCbs)));

  for (const entry of valCbs.entries()) {
    const [a,b] = entry;
    if (!(a instanceof RegExp)) continue;
    if (a.test(message)) 
      message = b(message, a);
  }

  return message;
}

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

Formatter.prototype.tag = Tag;

class Inspect extends Formatter {
  transform (options) {
    if (options.tag) {
      const [strs, ...vals] = options.tag;
      options.tag = [strs, ...vals.map(val => util.inspect(val))]
    }
    return options;
  }
}
class Combine extends Formatter {
  constructor (...frmt) {
    super(null);
    const formatters = frmt.flat().filter(frmt => frmt instanceof Formatter);
    this.last = formatters.pop();
    this.formatters = formatters;
  }

  format (options) {
    options = this.formatters.reduce((opt, frm) => {
      return frm.transform(opt);
    }, options);
    return Formatter.format(this.last, options);
  }
}

colors = {
  ts: 'green',
  info: 'yellow',
  message: 'white',
  level: {
    info: 'red',
    warning: 'orange',
    error:'red'
  },
  '.string': 'red'
}
const chalk = require('chalk')
const colorize = (obj, opt) => {
  const n = {};
  for (const key in obj) {
    let clr;
    let val = obj[key];
    if (opt.hasOwnProperty(key)) {
      const type = typeof opt[key];
      if (type === 'function)')
        clr = opt[key](key, obj);
      else if (type === 'string')
        clr = opt[key];
      else if (type === 'object') 
        clr = opt[key][obj[key]];
      else 
        clr = 'white';
    } else if (opt.hasOwnProperty('.' + typeof val)) {
      clr = opt['.' + typeof val];
    } else {
      continue;
    }


    val = chalk.keyword(clr)(val);

    n[key] = val;
  }

  return n;
}


const oftype = t => v => t === typeof v;
const ofinstance = t => v => v instanceof t;
const key = key => (v,k) => k === key;
chalk.level = 1;
class Simple extends Formatter {
  static compose = (...fns) => v => fns.flat().reduce((v, fn) => fn.call(this, v), v);
  static formatMap = new Map([
    [oftype('string'), Simple.compose(util.inspect,v => chalk.keyword(this.colors.type.string)(v))],
    [oftype('number'), chalk.keyword('cyan')],
    [ofinstance(Error), v => chalk.keyword('red')(v.message)],
    [oftype('object'), Simple.compose(v => util.inspect(v, {colors: true})/*,chalk.keyword('purple')*/)],
    [/warning/i, (m, r) => m.replace(r, (val) => {
      const [bg, clr] = this.colors.highlight.split('.')
      return chalk.bgKeyword(bg).keyword(clr)(val)
    })]
  ]);
  static strFormatMap = new Map([
    [() => true, chalk.white]
  ])
  static colors = {
    type: {
      string: 'lime',
      number: 'yellow',
      object: 'white'
    },
    key: {
      ts: 'green',
      level: {
        error: 'red'
      },
    },
    highlight: 'lime.black',
    default: 'white'
  };

  static optionsMap = new Map([
    [key('ts'), Simple.compose(chalk.keyword(this.colors.key.ts))],
    [key('level'), v => chalk.keyword(this.colors.key.level[v]||this.colors.default)(v)],
  ]);

  constructor (fn, options = {}) {
    super(fn)
    const {strFormatMap = Simple.strFormatMap, formatMap = Simple.formatMap, optionsMap = Simple.optionsMap, colors = Simple.colors} = options;
    this.colors = colors;
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
    // options.ts = this.constructor.timestamp(options.ts);
    options = super.transform(options)
    // options = colorize(options, colors);
    options = this.transformOptions(options);
    return options;
  }

  tag (strs, ...vals) {
    return TypeTag(this.formatMap, this.strFormatMap).call(this,strs, ...vals)
  }

  static timestamp (ts, options) {
    return moment(ts).toISOString();
  }
}



// Simple.prototype.tag = TypeTag;

module.exports = {
  Simple, Formatter, Inspect, Combine, TypeTag, oftype
}