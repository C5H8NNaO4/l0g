// const util = require('util');
const chalk = require('chalk');
const {FnMap, oftype, ofinstance, key} = require('./Map');

chalk.enabled = true;
chalk.level = 3;

class Color extends FnMap {
  static formatMap = new Map([
    [oftype('string'), Color.compose(/*util.inspect,*/v => !this.colors.type.string?v:chalk.keyword(this.colors.type.string)(v))],
    [oftype('number'), chalk.keyword('cyan')],
    [ofinstance(Error), v => chalk.keyword('red')(v.message)],
    [oftype('object'), Color.compose(v => v /*util.inspect(v, {colors: true})*//*,chalk.keyword('purple')*/)],
    [/warning/i, (m, r) => m.replace(r, (val) => {
      const [bg, clr] = this.colors.highlight.split('.')
      return chalk.bgKeyword(bg).keyword(clr)(val)
    })]
  ]);

  static strFormatMap = new Map([
    // [() => true, v => v]
  ])

  static optionsMap = new Map([
    [key('ts'), Color.compose(v => chalk.keyword(this.colors.key.ts)(v))],
    [key('level'), v => !this.colors.key.level[v]?v:chalk.keyword(this.colors.key.level[v]||this.colors.default)(v)],
  ]);

  static colors = {
    type: {
      string: 'lime',
      number: 'yellow',
      object: 'white'
    },
    key: {
      ts: 'green',
      level: {
        info: 'green',
        warning: 'orange',
        error: 'red',
        debug: 'blue',
      },
    },
    highlight: 'lime.black',
    default: 'white'
  };

  constructor (fn, options = {}) {
    const {strFormatMap = Color.strFormatMap, formatMap = Color.formatMap, optionsMap = Color.optionsMap, colors = Color.colors} = options;
    super(fn, {...options, strFormatMap, formatMap, optionsMap});

    this.colors = colors;
  }
}

module.exports = {Color};