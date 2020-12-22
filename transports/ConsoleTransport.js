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
  const err = new Error;
  _console.warn (`console.${key} called from ${err.stack.split('\n')[2]}`)

  if (ConsoleTransport.surpressed === true) return;
  return _console[key].apply(console, args);
};


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

  log (options, next) {
    //this actually refers to the Transport instance as its being .called to give access to its functions
    //maybe it's better to give up having the same signature for the log
    //function and pass the Transport instance as second parameter
    if (!options.table) return next()
    const args = ConsoleTransport.getOptionalArgs(options)
    
    ConsoleTransport.unsurpressed(() => {
      console.groupCollapsed(...args);
      console.table(options.table.data);
      console.groupEnd();
    })
  }
}

class GroupFeature extends ConsoleTransportFeature {
  constructor(options) {
    super(options);
    const {level} = options;
    this.level = level;
    this.currentLevel = 0;
  }

  register (Logger) {
    Logger.prototype.group = GroupFeature.prototype.start;
    Logger.prototype.groupEnd = GroupFeature.prototype.end;
  }

  start () {
    this.meta.group = this.meta.group || {};
    this.meta.group.startGroup = true;
    return this;
  }

  end () {
    this.meta.group = this.meta.group || {};
    this.meta.group.endGroup = true;
    return this;
  }

  log (options, next) {
    const {transport} = this;
    if (!options.group) {
      if (this.level >= this.currentLevel) {
        return transport.log(options);
      } else {
        return
      }
    }
    const args = ConsoleTransport.getOptionalArgs(options)
    ConsoleTransport.unsurpressed(() => {
      if (options.group.startGroup) {
        if (this.level >= this.currentLevel) {
          console.groupCollapsed(...args);
          this.currentLevel++;
        }
      }
      if (options.group.endGroup) {
        this.currentLevel--;
        console.groupEnd(...args);
      }
      if (!options.group.startGroup ) {
        if (this.level >= this.currentLevel) {
          transport.log(options);
        }
      } 
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
    // _console.log ('yo', options)
    const {level} = options
    const logFn = ConsoleTransport.logFns[level] || "log";
    const args = ConsoleTransport.getOptionalArgs(options)
    if (logFn)
      _console[logFn](...args);
  }

  static logFns = {
    warning: "warn",
    error: "error",
    debug: "debug",
    info: "info",
  };

  static surpressed = false;
  static surpress = () => {
    for (const key in console)
      console[key] = supress(key);
    _console.log("Console blocked")
  }

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