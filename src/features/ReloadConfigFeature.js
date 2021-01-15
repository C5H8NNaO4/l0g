const {LoggerFeature} = require('./Feature');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { Logger } = require('..');

const SCOPE = 'l0g.features.reload-config';

class ReloadConfigFeature extends LoggerFeature {
  constructor (options = {}) {
    const {file = 'l0g.conf.js', env = '.env'} = options;
    super(options);
    
    this.file = file;

    const absPathEnv = path.resolve(env);
    const absPathCfg = path.resolve(file);
    let absPath;
    if (fs.existsSync(absPathEnv)) {
      this.file  = absPathEnv;
      this.env = true;
      setTimeout(() => {
        this.logger.scope(SCOPE).debug`Found environment file.`
      }, 0);
    } else if (!fs.existsSync(absPathCfg)) {
      throw new Error(`Configuration file '${env}' not found`)
    } else {
      this.file = absPath = absPathCfg
    }

    setTimeout(() => {
      this.logger.scope(SCOPE).debug`Watching file ${this.file}`;
    },0);
    chokidar.watch(this.file).on('all', (...args) => this.reloadConfig(...args))
  }

  register (Logger, logger) {
    this.logger = logger;
    
    // setTimeout(() => {
      //   this.reloadConfig();
      // }, 0);
    }
    
    init (logger) {
      this.logger = logger;
      this.scoped = logger.scope(SCOPE)
    this.scoped.info`Initialized feature reload-config`
  }

  reloadConfig (ev, fp) {
    const cfgFile = path.resolve(__dirname, '..','config.js');
    const relPath = path.relative(__dirname,  fp);
    const relPath2 = path.relative(__dirname, cfgFile);
    delete require.cache[fp];
    delete require.cache[cfgFile];

    this.scoped.debug`Purging cache ${cfgFile}`
    let config;
    if (!this.env) {
      this.scoped.setNextLevel('info').info`Config file changed. Reloading.`
      config = require(relPath);
      const {level} = config;
      this.scoped.level = level;
    } else {
      this.logger.setNextLevel('info').info`Environment file changed. Reloading config.`
      delete process.env.LOG_LEVEL;
      delete process.env.LOG_SCOPE;
      delete process.env.LOG_FILTER;
      // require('dotenv').config()
      const {LOG_LEVEL, LOG_SCOPE, LOG_FILTER} = require(cfgFile);
      this.logger.setLevel(LOG_LEVEL);
      Logger.scope = new RegExp(LOG_SCOPE);
      Logger.filter = new RegExp(LOG_FILTER) || null;
      this.scoped.debug`Applying config: ${{LOG_LEVEL, LOG_SCOPE, LOG_FILTER}}`;
    }
  }
}

ReloadConfigFeature.symbol = Symbol('reloadConfig');

module.exports = {
  ReloadConfigFeature
}