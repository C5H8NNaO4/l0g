const {
  Transport
} = require('./Transport');

const {
  Logger
} = require('..');

const util = require('util');

class SocketTransport extends Transport {
  constructor(io, event, options = {}) {
    super(options);
    this.io = io;
    this.event = event;
    this.scope = options.scope || /.*/;
    this.wtf = "foo";
    setTimeout(() => {
      Logger.base.error`Socket Transport initialized`;
    }, 0);
  }

  log(options) {
    const {
      event,
      io
    } = this;
    const {
      message,
      scope,
      level
    } = options;
    const {
      tag = [],
      ...rest
    } = options; // Logger.write(util.inspect(options));

    process.stdout.write('SCOPE' + scope + ' ' + level);

    if (scope && this.scope.test(scope)) {
      try {
        io.in(scope).emit(event, {
          message,
          scope,
          level,
          tag
        });
      } catch (e) {}
    } else {
      io.emit(event, {
        message,
        scope,
        level,
        tag
      });
    }
  }

}

module.exports = {
  SocketTransport
};