const {getLine, isVisible} = require('./util');
const {Transport, ConsoleTransport} = require('./transports')
const levels = require('./levels');
const {LOG_LEVEL, LOG_SCOPE, LOG_FILTER} = require('./config');

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
    const {transports, gather = null, levels = Logger.defaults.options.levels, features = [], extra = {}} = options;

    /**
     * The log level of the logger.
     * @type {string}
     */
    this.level = LOG_LEVEL || level;

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

    if (features)
      this.features = features;

    for (const level in this.levels) {
      if (this.levels.hasOwnProperty(level)) {
        this[level] = (...args) => this.setMessageLevel(level).log(...args);
      }
    }

    for (const feature of this.features) {
      if (!extra.scope) {
        Logger.base = this;
        feature.register(Logger, this);
        setTimeout(() => {
          feature.init(this);
        }, 0);
      }
    }

    for (const transport of this.transports) {
      transport.logger = this;
      for (const feature of transport.features)
        feature.register.call(this, Logger);
    }
    // return new Proxy(this, proxyHandler);
    
    if (LOG_SCOPE) {
      Logger.scope = new RegExp(process.env.LOG_SCOPE);
      !extra.scope && setTimeout(() => {
        this.info`Using LOG_SCOPE from environment. ${LOG_SCOPE}`
      }, 0)
    }
      
    if (LOG_FILTER) {
      Logger.filter = new RegExp(process.env.LOG_FILTER);
      !extra.scope && setTimeout(() => {
        this.info`Using LOG_FILTER from environment. ${LOG_FILTER}`
      }, 0)
    }

    if (LOG_LEVEL) {
      !extra.scope && setTimeout(() => {

        this.info`Using LOG_LEVEL from environment. ${LOG_LEVEL}`
      },0);
      // this.level = LOG_LEVEL;
    }

    this.scopes = new Map;
    this.extra = extra;
    this.options = options;
    this.context = {};
    this.meta = {...extra, loggerLevel: this.level};
  }

  addTransport (transport) {
    transport.logger = this;
    for (const feature of transport.features)
      feature.register.call(this, Logger);
    
    this.transports.push(transport)
  }
  setMessageLevel(level) {
    this.meta.level = level;
    return this;
  }

  setNextLevel (level) {
    this.meta.loggerLevel = level;
    return this;
  }

  setLevel (level) {
    this.level = level;
    this.scopes.forEach((logger) => {
      process.stdout.write("Setting level for logger " + logger.extra.scope + '\n')
      logger.setLevel(level);
    })
    return this;
  }
  /**
   * 
   * @param {*} level 
   * @param  {...any} args 
   */
  log(message, ...args) {
    let [options = {}] = args, level;
   
    if (message.raw && Array.isArray(args)) {
      options = {};
      options.tag = [message, ...args];
      message = null;
      level = 'info';
    } else {
      options.message = message;
    }

    options.message = message;

    for (const feature of this.features) {
      // options = feature.run.call(this, options);
    }

    gather(this, options, {level, ...this.meta});

    if (options.scope && Logger.scope instanceof RegExp && !Logger.scope.test(options.scope))
      return;
    
    if (Logger.filter && Logger.filter instanceof RegExp && !Logger.filter.test(options.message))
      return

    broadcast(this, options);

    // process.stdout.write('Resetting meta')
    this.meta = {...this.extra, loggerLevel: this.level};
  }

  /**
   * Returns a new Logger instance with the key set as its scope.
   * @param {string} key - The handle of the scope.
   */
  scope (key) {
    const nextScope = [this.extra.scope,key].filter(Boolean).join('.');
    if (this.scopes.has(nextScope))
      return this.scopes.get(nextScope);
    const scoped = new Logger(this.level, {...this.options, extra: {...this.extra, scope: nextScope}});
    this.scopes.set(nextScope,scoped);
    return scoped;
  }

}

Logger.scope = (/.*/);
Logger.write = (...msg) => {
  process.stdout.write(msg.join(' ') + '\n');
}
/**
 * Private method to broadcast a message to the transports.
 * @param {Logger} instance - The logger instance.
 * @param {MessageOptions} options - The options passed to the transports
 */
function broadcast (instance, options) {
  // process.stdout.write(instance.level + ' ' + instance.meta.level + '\n')
  if (!isVisible(options.level || 'info', instance.meta.loggerLevel, instance.levels)) return;
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
  scope: () => '*',
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
