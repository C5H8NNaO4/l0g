const {Formatter} = require('./Formatter')
const util = require('util');
class Inspect extends Formatter {
  transformTagArgs (strs, ...vals) {
    return [strs, ...vals.map(val => util.inspect(val))]
  }
  // transform (options) {
  //   if (options.tag) {
  //     const [strs, ...vals] = options.tag;
  //     options.tag = [strs, ...vals.map(val => util.inspect(val))]
  //   }
  //   options = super.transform(options);
  //   return options;
  // }
}

module.exports = {Inspect};