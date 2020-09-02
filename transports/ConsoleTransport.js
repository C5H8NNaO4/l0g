const {Transport} = require('./Transport');

class ConsoleTransport extends Transport {
  static logFns = {
    warning: console.warn,
  };

  constructor(options) {
    super(options)
  }
  
  log (options) {
    const {level, message} = this.format(options);
    const logFn = ConsoleTransport.logFns[level] || console.log;
    if (logFn)
      logFn.call(console, message);
  }
}

module.exports = {ConsoleTransport};