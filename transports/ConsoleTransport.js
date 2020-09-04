const {Transport} = require('./Transport');

class TransportFeature {
  constructor () {

  }
  register () {

  }
}

class Table extends TransportFeature {
  register (Logger) {
    Logger.prototype.table = Table.prototype.run;
  }

  run (data) {
    this.meta.group = this.meta.group || {};
    this.meta.group.table = {data};
    return this;
  }

  log (options) {
    if (!options.group) return this.log(options);
    const {level, message, console = {}} = this.format(options);
    const {args = []} = console;
    console.groupCollapsed(message, ...args);
    // console.log(options);
    console.table(options.group.table.data);
    // const logFn = ConsoleTransport.logFns[level] || console.log;
    // logFn.call(console, message);
    console.groupEnd();
  }
}

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


module.exports = {ConsoleTransport, Table};