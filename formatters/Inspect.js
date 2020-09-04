class Inspect extends Formatter {
  transform (options) {
    if (options.tag) {
      const [strs, ...vals] = options.tag;
      options.tag = [strs, ...vals.map(val => util.inspect(val))]
    }
    return options;
  }
}

module.exports = {Inspect};