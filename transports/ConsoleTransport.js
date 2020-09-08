const {Transport} = require('./Transport');

function bind(that, obj) {
  const ret = {};
  for (const key in obj)
    if(typeof obj[key] === 'function')
      ret[key] = obj[key].bind(that);
  return ret;
}
const _console = bind(console, console);

const supress = key => (...args) => {
  if (ConsoleTransport.supress === true) return;
  return _console[key].apply(console, args);
};

for (const key in console)
  console[key] = supress(key);

class TransportFeature {
  constructor () {

  }
  register () {

  }
}

class ConsoleTransportFeature extends TransportFeature {
  // static supports = [ConsoleTransport];
}
class Table extends ConsoleTransportFeature {
  register (Logger) {
    Logger.prototype.table = Table.prototype.run;
  }

  run (data) {
    this.meta.table = this.meta.table || {};
    this.meta.table.data = data;
    return this;
  }

  log (options) {
    //this actually refers to the Transport instance as its being .called to give access to its functions
    //this comment might be a sign of bad code, maybe it's better to give up having the same signature for the log
    //function and pass the Transport instance as second parameter
    if (!options.table) return this.log(options);
    const args = ConsoleTransport.getOptionalArgs(options)
    
    ConsoleTransport.unsurpressed(() => {
      console.groupCollapsed(...args);
      console.table(options.table.data);
      console.groupEnd();
    })
  }
}

class GroupFeature extends ConsoleTransportFeature {
  register (Logger) {
    Logger.prototype.group = Table.prototype.start;
    Logger.prototype.groupEnd = Table.prototype.end;
  }

  start (name) {
    this.meta.group = this.meta.group || {};
    this.meta.group.startGroup = true;
  }

  end () {
    this.meta.group = this.meta.group || {};
    this.meta.group.endGroup = true;
  }

  log (options) {
    if (!options.group) return this.log(options);
    const args = ConsoleTransport.getOptionalArgs(options)

    ConsoleTransport.unsurpressed(() => {
      if (options.group.startGroup)
        console.groupCollapsed(...args);
      this.log(options);
      if (options.group.endGroup)
        console.groupEnd();
    })   
  }
}
// class Highlight extends TransportFeature {
//   register (Logger) {
//     Logger.prototype.table = Table.prototype.run;
//   }

//   run (data) {
//     this.formatter.formatMap.set(data, v => )
//     return this;
//   }
// }
class ConsoleTransport extends Transport {
  constructor(options) {
    super(options)
  }
  
  log (options) {
    const {level} = options
    const logFn = ConsoleTransport.logFns[level] || _console.log;
    const args = ConsoleTransport.getOptionalArgs(options)
    if (logFn)
      logFn.apply(console, args);
  }

  static logFns = {
    warning: _console.warn,
    error: _console.error,
    debug: _console.debug,
    info: _console.info,
  };

  static supress = false;

  //Overriding console.log breaks console.table on node.js. This doesn't happen in the browser. If some code needs to use console.table, they can use this function.
  static unsurpressed = fn => {
    const {supress} = ConsoleTransport;
    ConsoleTransport.supress = false;
    fn();
    ConsoleTransport.supress = supress;
  }

  static getOptionalArgs = options => {
    const {console = {}, message} = options;
    const {args = [message]} = console;
    return args;
  }
}


module.exports = {ConsoleTransport, Table, GroupFeature};