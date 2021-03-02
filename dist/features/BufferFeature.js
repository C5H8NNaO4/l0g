const {
  Feature,
  LoggerFeature
} = require('./Feature');

class BufferFeature extends LoggerFeature {
  register(Logger) {
    Logger.prototype.buffer = BufferFeature.prototype.buffer;
    Logger.prototype.flush = BufferFeature.prototype.flush;
    Logger.prototype.flushIf = BufferFeature.prototype.flushIf;
  }

  buffer(name) {
    this.context.buffer = this.context.buffer || {
      flush: {},
      logs: {}
    };
    this.context.buffer.name = name;
    this.context.buffer.logs[name] = this.context.buffer.logs[name] || [];
    return this;
  }

  flush(name) {
    if (!this.context.buffer) {
      throw new Error('Attempting to flush, but no buffers were found. You need to call .buffer before .flush');
    }

    this.context.buffer.name = name;
    this.context.buffer.flush[name] = true;
    return this;
  }

  flushIf(name, cond) {
    if (cond) return this.flush(name);else return this.buffer(name);
  }

  log(options, next) {
    const name = options?.buffer?.name;
    let res;
    if (!options.buffer || !name) return next();
    console.log("flushing msg", name, options.buffer, options.buffer.flush[name]);

    if (options.buffer.flush[name]) {
      options.buffer.logs[name].forEach(options => {
        res = this.transport.log(options);
      }); // res = this.transport.log(options);

      return next();
    } else if (name) {
      this.transport.logger.context.buffer.logs[name].push(options);
      console.log("buffering msg", this.transport.logger.context.buffer);
      delete this.transport.logger.context.buffer.name;
    }
  }

}

module.exports = {
  BufferFeature
};