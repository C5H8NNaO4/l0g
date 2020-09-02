const levels = require('./levels')
const {Transport, FileTransport, ConsoleTransport, PostgresTransport} = require('./transports')
const {Simple, Combine, Inspect} = require('./Format');

const parseStack = (stack, o = 3) => {
  const lines = stack.toString().split('\n');
  const line = lines[o];
  const [,method] = line.match(/at (.+)? /)
  const [,file,row,col] = line.match(/.+\\(.+?\..+?):(\d+):(\d+)\)/)
  return {file, method, row, col}
}
const getLine = (offset = 0) => {
  try {
    throw new Error ('Test');
  } catch (e) {
    const info = parseStack (e.stack, offset + 2)
    return info;
  }
}
const proxyHandler = {
  get: function(target, prop, receiver) {
    if (typeof target[prop] !== 'undefined') return target[prop];
    
    return prop.toString();
  }
};

class Logger {
  constructor(level, options = {}) {
    const {transports, gather = null, levels = Logger.defaults.levels} = options;

    this.level = level;
    this.levels = Logger.levels[levels];

    if (gather) 
      this.gather = gather;

    if (transports)
      this.transports = transports;

    for (const level in this.levels) {
      this[level] = this.log.bind(this,level);
    }
    // return new Proxy(this, proxyHandler);
  }

  log (level, ...args) {
    let [message, ...args1] = args;
    let [options = {}] = args1;
    if (level.raw && Array.isArray(message)) {
      message = level;
    }
    if (this.levels[level] > this.levels[this.level]) return;
    if (level.raw && Array.isArray(args)) {
      
      options = {};
      options.tag = [level, ...args]
      message = null;
      level = 'info';
    } else if (message.raw && args.length > 0) {
    

      options = {};
      options.tag = [message, ...args1]
      message = null;
      
    }
    options.message = message;
    gather(this, options, {level});
    this.broadcast(options);
  }

  broadcast (options) {
    for (const transport of this.transports) {
      transport.log({...options});
    }
  }
}

Logger.levels = levels;
Logger.defaults = {
  levels: 'rfc5424'
};

Logger.prototype[Symbol.toStringTag] = 'Hi'
Logger.prototype.transports = [Transport.default];
Logger.prototype.gather = {
  ts: () => +new Date,
  loc: () => getLine(3),
}

function gather (instance, options, add) {
  for (const key in instance.gather) {
    options[key] = instance.gather[key]();
  }
  Object.assign(options, add);
}
const transports = [
  new ConsoleTransport({formatter: new Simple}), 
  new FileTransport('test.log'),
  new PostgresTransport('psql://postgres:password@localhost/kruch')
]
const logger = new Logger('debug', {transports});

logger.log`Hey ${"asd"} ${1234} ${{foo:'bar'}}`
logger.warning('Warning')
logger.warning`Warning ${1234}`
logger.error`Custom Error (${new Error('TestException')})`
let util = require('util')
console.log(util.inspect({a:'b'}))

module.exports = {Logger};