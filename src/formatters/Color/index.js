// const util = require('util');
const chalk = require('chalk');
const {MapFormatter, oftype, ofinstance, key} = require('../MapFormatter');

chalk.enabled = true;
chalk.level = 1;

class Color extends MapFormatter {
  constructor (fn, options = {}) {
    const {strFormatMap = Color.strFormatMap, formatMap = Color.formatMap, optionsMap = Color.optionsMap, colors = Color.colors} = options;
    super(fn, {...options, strFormatMap, formatMap, optionsMap});

    this.colors = colors;
  }
}

Color.colorByType = type => (v, formatter) => !formatter.colors.type[type]?v:chalk.keyword(formatter.colors.type[type])(v);
Color.formatMap = new Map([
  [Color.isString, [(value, formatter) => !formatter.colors.type.string?value:chalk.keyword(formatter.colors.type.string)(value)]],
  [oftype('number'), chalk.keyword('cyan')],
  [Color.isArray, [Color.colorByType('array')]],
  [Color.isError, (v, formatter) => Color.colorByType('error')(v.message, formatter)],
  [Color.isObject, [Color.colorByType('object')]],
  [/warning/i, (m, r) => m.replace(r, (val, formatter) => {
    const [bg, clr] = formatter.colors.highlight.split('.')
    return chalk.bgKeyword(bg).keyword(clr)(val)
  })]
]);

Color.strFormatMap = new Map([
  // [() => true, v => v]
])

//TODO Refactor using functions!
// () => test(), () => frmt();

Color.optionsMap = new Map([
  [key('ts'),function (v, formatter) {
    return chalk.keyword(formatter.colors.key.ts)(v)
  }],

  [key('scope'), function (v, formatter) {
    return chalk.keyword(formatter.colors.key.scope)(v)
  }],
  [key('level'), function (v, formatter) {
    return !formatter.colors.key.level[v]?v:chalk.keyword(formatter.colors.key.level[v]||formatter.colors.default)(v)
  }],
]);

Color.colors = {
  type: {
    string: 'green',
    number: 'yellow',
    array: 'green',
    object: 'blue',
    error: 'red',
    // object: 'white'
  },
  key: {
    scope: 'blue',
    ts: 'green',
    level: {
      info: 'green',
      notice: 'yellow',
      warning: 'orange',
      error: 'red',
      debug: 'blue',
    },
  },
  highlight: 'lime.black',
  default: 'white'
};
module.exports = {Color};