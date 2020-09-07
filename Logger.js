const {getLine} = require('./util');
const {Transport, ConsoleTransport} = require('./transports')
const levels = require('./levels');
class Logger {
  constructor(level, options = {}) {
    const {features, transports, gather = null, levels = Logger.defaults.levels} = options;

    this.level = level;
    this.levels = Logger.levels[levels];

    if (gather) 
      this.gather = gather;

    if (transports)
      this.transports = transports;

    if (features)
      this.features = features;

    for (const level in this.levels) {
      this[level] = this.log.bind(this,level);
    }

    for (const feature of this.features) {
      feature.register.call(this, Logger);
    }

    for (const transport of this.transports) {
      for (const feature of transport.features)
      feature.register.call(this, Logger);
    }
    // return new Proxy(this, proxyHandler);
    this.meta = {};
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

    for (const feature of this.features) {
      // options = feature.run.call(this, options);
    }

    gather(this, options, {level, ...this.meta});
    broadcast.call(this, options);

    this.meta = {};
  }


}

function broadcast (options) {
  for (const transport of this.transports) {
    transport.send({...options});
  }
};

Logger.levels = levels;
Logger.defaults = {
  levels: 'rfc5424'
};

Logger.prototype[Symbol.toStringTag] = 'Hi'
Logger.prototype.transports = [new ConsoleTransport];
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

module.exports = {Logger};
