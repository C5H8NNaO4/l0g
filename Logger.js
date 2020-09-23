const {getLine} = require('./util');
const {ConsoleTransport} = require('./transports');
const levels = require('./levels');

/**
 * @typedef {"npm" | "rfc5424"} LogLevelSet
 * @type {string}
 */

 /**
  * @typedef LoggerOptions
  * @type {Object}
  * @property {Transport[]} transports - An array of transports
  * @property {LogLevelSet} [levels="rfc5424"] - The level set
  */

/**
 * The options that you can pass to a log message.
 * @typedef MessageOptions
 * @type {Object}
 */

/**
 * @description Logger class
 * @type {Logger}
 * @property {string} level - Static
 */
class Logger {
  /**
   * Logger constructor
   * @param {String} level - The desired log level for the logger.
   * @param {LoggerOptions} [options=Logger.defaults.options] - Optional options. 
   */
  constructor(level = Logger.defaults.level, options = {}) {
    const {transports, gather = null, levels = Logger.defaults.options.levels} = options;

    /**
     * The log level of the logger.
     * @type {string}
     */
    this.level = level;

    /**
     * The log level set used by the logger. See l0g/levels/*
     * @type {Object}
     * 
     */
    this.levels = Logger.levels[levels];

    if (gather) {
      this.gather = gather;
    }

    if (transports) {
      this.transports = transports;
    }

    for (const level in this.levels) {
      if (this.levels.hasOwnProperty(level)) {
        this[level] = this.log.bind(this, level);
      }
    }

    for (const transport of this.transports) {
      for (const feature of transport.features) {
        feature.register.call(this, Logger);
      }
    }
    // return new Proxy(this, proxyHandler);
    this.meta = {};
  }

  /**
   * 
   * @param {*} level 
   * @param  {...any} args 
   */
  log(message, ...args) {
    let [options] = args, level;
    // if (message.raw && Array.isArray(options)) {
    //   message = level;
    // }
    // if (this.levels[level] > this.levels[this.level]) return;
    if (message.raw && Array.isArray(args)) {
      options = {};
      options.tag = [message, ...args];
      message = null;
      level = 'info';
    } else {
      console.log("A", message, args)
      options.message = message;
    }

    
    gather(this, options, {level, ...this.meta});
    broadcast(this, options);

    this.meta = {};
  }
}

/**
 * Private method to broadcast a message to the transports.
 * @param {Logger} instance - The logger instance.
 * @param {MessageOptions} options - The options passed to the transports
 */
function broadcast(instance, options) {
  for (const transport of instance.transports) {
    transport.send({...options});
  }
};

Logger.levels = levels;
Logger.defaults = {
  level: 'info',
  options: {
    levels: 'rfc5424',
  },
};

Logger.prototype[Symbol.toStringTag] = 'Hi';
Logger.prototype.transports = [new ConsoleTransport];
Logger.prototype.gather = {
  ts: () => +new Date,
  loc: () => getLine(3),
};

function gather(instance, options, add) {
  for (const key in instance.gather) {
    options[key] = instance.gather[key]();
  }
  Object.assign(options, add);
}

module.exports = {Logger};
