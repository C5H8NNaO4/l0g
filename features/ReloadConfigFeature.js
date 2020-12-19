const {LoggerFeature} = require('./Feature');
const fs = require('fs');
const path = require('path');

class ReloadConfigFeature extends LoggerFeature {
  static reloadConfigSymbol = Symbol('reloadConfig');

  static test = function () {
    console.log (this);
  }

  constructor (options = {}) {
    const {file = 'l0g.conf.js'} = options;
    super(options);
    
    this.file = file;

    if (!fs.existsSync(file)) {
      throw new Error(`Configuration file '${file}' not found`)
    }

    fs.watchFile(file, () => this.reloadConfig());
  }

  register (Logger, logger) {
    this.logger = logger;
    setTimeout(() => {
      this.reloadConfig();
    }, 0);
  }

  init (logger) {
    this.logger = logger;
  }

  reloadConfig () {
    const absPath = path.resolve(this.file);
    const relPath = path.relative(__dirname, absPath);
    delete require.cache[absPath];
    const config = require(relPath);
    const {level} = config;

    this.logger.level = level;

    this.logger.warning`Config file changed. Config reloaded successful.`
    this.logger.debug`Config file: ${config}`;
  }
}

module.exports = {
  ReloadConfigFeature
}