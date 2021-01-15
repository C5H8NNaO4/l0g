const {Feature, LoggerFeature} = require('./Feature');

class LevelFeature extends LoggerFeature {
  register (Logger) {
    Logger.prototype.label = LevelFeature.prototype.run;
  }

  run (level) {
    this.meta.level = level;
    return this;
  }
}

module.exports = {
  LevelFeature,
}