const {Transport} = require('./Transport');

const _console = {...console};
const swallow = key => (...args) => {
  if (ConsoleTransport.swallow === true) return;
  return _console[key].apply(console, args);
};
for (const key in console)
  console[key] = swallow(key);

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
    const {level, message} = this.format(options);
    const {args = [message]} = options.console || {};
    console.groupCollapsed(...args);
    // console.log(options);
    console.table(options.group.table.data);
    // const logFn = ConsoleTransport.logFns[level] || console.log;
    // logFn.call(console, message);
    console.groupEnd();
  }
}

class ConsoleTransport extends Transport {
  static logFns = {
    warning: _console.warn,
    error: _console.error,
    debug: _console.debug,
    info: _console.info,
  };

  constructor(options) {
    super(options)
  }
  
  log (options) {
    const {level, message} = this.format(options);
    const logFn = ConsoleTransport.logFns[level] || _console.log;
    if (logFn)
      logFn.call(console, message);
  }
}


module.exports = {ConsoleTransport, Table};