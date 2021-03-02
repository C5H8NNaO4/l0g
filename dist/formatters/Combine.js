class Combine extends Formatter {
  constructor(...frmt) {
    super(null);
    const formatters = frmt.flat().filter(frmt => frmt instanceof Formatter);
    this.last = formatters.pop();
    this.formatters = formatters;
  }

  format(options) {
    options = this.formatters.reduce((opt, frm) => {
      return frm.transform(opt);
    }, options);
    return Formatter.format(this.last, options);
  }

}

module.exports = {
  Combine
};