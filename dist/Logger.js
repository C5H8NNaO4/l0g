(function (exports, fs, moment, util, chalk, pgPromise) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
  var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
  var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
  var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
  var pgPromise__default = /*#__PURE__*/_interopDefaultLegacy(pgPromise);

  const levels = { 
    error: 0, 
    warn: 1, 
    info: 2, 
    http: 3,
    verbose: 4, 
    debug: 5, 
    silly: 6 
  };

  var npm = levels;

  const levels$1 = { 
    emerg: 0, 
    alert: 1, 
    crit: 2, 
    error: 3, 
    warning: 4, 
    notice: 5, 
    info: 6, 
    debug: 7
  };

  var rfc5424 = levels$1;

  var levels$2 = {
    npm: npm,
    rfc5424: rfc5424,
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  const Tag = (strs, ...vals) => {
    return strs.reduce((str, val, i) => {
      return str + vals[i-1] + val;
    })
  };


  // const TypeTag = colors => (strs, ...vals) => {
  //   return Tag(strs, ...vals.map(v => colors[typeof v]&&chalk.keyword(colors[typeof v])(v)||v))
  // }

  const TypeTag = (valCbs, strCbs) => (strs, ...vals) => {
    if (typeof cbs === 'object') {
      if (cbs.constructor === Object) {
        cbs = new Map(Object.entries(cbs));
      }
    }

    const mapVals = cbs => v => {
      const typeKey = `.${typeof v}`;
      let cb;
      for (const entry of cbs.entries()) {
        const [a,b] = entry;
        if (typeof a !== 'function') continue;
        if (a(v)) 
          v = b.call(undefined, v);
      }
      if (cbs.has(typeKey)) {
        cb = cbs.get(typeKey);
      } else if (cbs.has(v)) {
        cb = cbs.get(v);
      }
      if (typeof cb === 'function')
        v = cb.call(undefined, v);

      return v;
    };
    let message = Tag(strs.map(mapVals(strCbs || valCbs)), ...vals.map(mapVals(valCbs)));

    for (const entry of valCbs.entries()) {
      const [a,b] = entry;
      if (!(a instanceof RegExp)) continue;
      if (a.test(message)) 
        message = b(message, a);
    }

    return message;
  };

  class Formatter {
    constructor (fn) {
      if (typeof fn === 'function')
        this._format = fn;
    }

    transform (options) {
      options.ts = this.constructor.timestamp(options.ts);
      return options;
    }

    format ( options) {
      const {ts, level, message} = options;
      if (this._format)
        return this._format(options);
      return `${ts} ${level}: ${message}`;
    }

    static timestamp (ts, options) {
      return moment__default['default'](ts).toISOString();
    }

    static transform (instance, options) {
      // if (typeof instance.transformTag === 'function')
      //   options.tag = 
      if (Array.isArray(options.tag) && options.tag[0].raw)
        options.message = instance.tag(...options.tag);

      if (typeof instance.transform === 'function')
        options = instance.transform(options);


      return options;
    }

    static format (instance, options) {
      options = Formatter.transform(instance, options);
      return instance.format(options);
    }
  }

  Formatter.prototype.tag = Tag;

  class Inspect extends Formatter {
    transform (options) {
      if (options.tag) {
        const [strs, ...vals] = options.tag;
        options.tag = [strs, ...vals.map(val => util__default['default'].inspect(val))];
      }
      return options;
    }
  }
  class Combine extends Formatter {
    constructor (...frmt) {
      super(null);
      const formatters = frmt.flat().filter(frmt => frmt instanceof Formatter);
      this.last = formatters.pop();
      this.formatters = formatters;
    }

    format (options) {
      options = this.formatters.reduce((opt, frm) => {
        return frm.transform(opt);
      }, options);
      return Formatter.format(this.last, options);
    }
  }

  colors = {
    ts: 'green',
    info: 'yellow',
    message: 'white',
    level: {
      info: 'red',
      warning: 'orange',
      error:'red'
    },
    '.string': 'red'
  };


  const oftype = t => v => t === typeof v;
  const ofinstance = t => v => v instanceof t;
  const key = key => (v,k) => k === key;
  chalk__default['default'].level = 1;
  class Simple extends Formatter {
    static compose = (...fns) => v => fns.flat().reduce((v, fn) => fn.call(this, v), v);
    static formatMap = new Map([
      [oftype('string'), Simple.compose(util__default['default'].inspect,v => chalk__default['default'].keyword(this.colors.type.string)(v))],
      [oftype('number'), chalk__default['default'].keyword('cyan')],
      [ofinstance(Error), v => chalk__default['default'].keyword('red')(v.message)],
      [oftype('object'), Simple.compose(v => util__default['default'].inspect(v, {colors: true})/*,chalk.keyword('purple')*/)],
      [/warning/i, (m, r) => m.replace(r, (val) => {
        const [bg, clr] = this.colors.highlight.split('.');
        return chalk__default['default'].bgKeyword(bg).keyword(clr)(val)
      })]
    ]);
    static strFormatMap = new Map([
      [() => true, chalk__default['default'].white]
    ])
    static colors = {
      type: {
        string: 'lime',
        number: 'yellow',
        object: 'white'
      },
      key: {
        ts: 'green',
        level: {
          error: 'red'
        },
      },
      highlight: 'lime.black',
      default: 'white'
    };

    static optionsMap = new Map([
      [key('ts'), Simple.compose(chalk__default['default'].keyword(commonjsGlobal.colors.key.ts))],
      [key('level'), v => chalk__default['default'].keyword(this.colors.key.level[v]||this.colors.default)(v)],
    ]);

    constructor (fn, options = {}) {
      super(fn);
      const {strFormatMap = Simple.strFormatMap, formatMap = Simple.formatMap, optionsMap = Simple.optionsMap, colors = Simple.colors} = options;
      this.colors = colors;
      this.formatMap = formatMap;
      this.strFormatMap = strFormatMap;
      this.optionsMap = optionsMap;
    }

    transformOptions (options) {
      const {optionsMap} = this;
      
      
      for (const key in options) {
        const val = options[key];
        inner:
        for (const [a, b] of optionsMap.entries()) {
          if (typeof a !== 'function') continue
          if (a(val, key)) {
            options[key] = b.call(this, val);
            break inner;
          }
        }
      }
      
      return options;
    }

    transform (options) {
      // options.ts = this.constructor.timestamp(options.ts);
      options = super.transform(options);
      // options = colorize(options, colors);
      options = this.transformOptions(options);
      return options;
    }

    tag (strs, ...vals) {
      return TypeTag(this.formatMap, this.strFormatMap).call(this,strs, ...vals)
    }

    static timestamp (ts, options) {
      return moment__default['default'](ts).toISOString();
    }
  }



  // Simple.prototype.tag = TypeTag;

  var Format = {
    Simple, Formatter, Inspect, Combine, TypeTag, oftype
  };

  const {Formatter: Formatter$1} = Format;
  class Transport {
    constructor (options = {}) {
      this.formatter = options.formatter || new Formatter$1;
    }

    log (options) {

      throw new Error('Not implemented');
    }

    format (options) {
      if (this.formatter instanceof Formatter$1) {
        options.message = Formatter$1.format(this.formatter, options);
      }
      return options;
    }
  }



  // Transport.default = new ConsoleTransport;

  var Transport_1 = {
    Transport
  };

  const {Transport: Transport$1} = Transport_1;

  class ConsoleTransport extends Transport$1 {
    static logFns = {
      warning: console.warn,
    };

    constructor(options) {
      super(options);
    }
    
    log (options) {
      const {level, message} = this.format(options);
      const logFn = ConsoleTransport.logFns[level] || console.log;
      if (logFn)
        logFn.call(console, message);
    }
  }

  var ConsoleTransport_1 = {ConsoleTransport};

  const {Transport: Transport$2} = Transport_1;


  class FileTransport extends Transport$2 {
    constructor(filename, options = {}) {
      super(options);

      // if (!fs.existsSync(filename))
      this.options = options;
      this.fs = fs__default['default'].createWriteStream(filename, {
        flags: 'a'
      });
    }

    log (options) {
      options = this.format(options);
      this.fs.write(options.message + '\n');
    }
  }

  var FileTransport_1 = {FileTransport};

  const {Transport: Transport$3} = Transport_1;
  const {Formatter: Formatter$2, Simple: Simple$1, TypeTag: TypeTag$1, oftype: oftype$1} = Format;


  const pgp = pgPromise__default['default']();
  const {PreparedStatement: PS} = pgPromise__default['default'];

  class BasicFormatter extends Formatter$2 {
    transform (options) {
      super.transform(options);
      if (options.tag) {
        const {tag: [strs, ...vals]} = options;
        const error = vals.filter(v => v instanceof Error)[0];
        if (error) {
          const {message, stack} = error;
          options.error = {message, stack};
        }
      }
      return options;
    }
    tag (strs, ...vals) {
      const map = new Map([
        [oftype$1('string'), v => util__default['default'].format(v)],
        [v => v instanceof Error, e => e.message],
        [oftype$1('object'), v => util__default['default'].format(v)],
      ]);
      
      return TypeTag$1(map)(strs, ...vals);
    }
  }
  const createTable = new PS({
    name: 'init-table',
    text: `
    CREATE TABLE logs (
      ts TIMESTAMPTZ NOT NULL,
      level TEXT,
      message TEXT,
      options JSONB
    );
  `
  });
  const insert = new PS({
    name: 'insert',
    text: `INSERT INTO logs (ts, level, message, options) VALUES ($1, $2, $3, $4)`,
  });
  class PostgresTransport extends Transport$3 {
    constructor(conn, options = {}) {
      super(options);

      // if (!fs.existsSync(filename))
      this.formatter = new BasicFormatter((options) => options.message);

      this.options = options;
      this.cs = conn,
      this.client = pgp(conn);
    }

    log (options) {
      // this.client.any(createTable).then((...args) => {
      //   console.log(args)
      //   process.exit(0);
      // })
      // .catch ((err) => {
      //   console.log (err);
      //   process.exit(0);
      // })
      options = this.format(options);

      const log = {
        ...options,
        options: JSON.stringify(options)
      };
      const vals = ['ts', 'level', 'message', 'options'].map(k => log[k]);
      this.client.any(insert, vals).then((...args) => {
        process.exit(0);
      })
      .catch ((err) => {
        console.log (err);
        process.exit(0);
      });
      // this.fs.write(options.message);
    }
  }

  var PostgresTransport_1 = {PostgresTransport};

  const {Transport: Transport$4} = Transport_1;
  const {ConsoleTransport: ConsoleTransport$1} = ConsoleTransport_1;
  const {FileTransport: FileTransport$1} = FileTransport_1;
  const {PostgresTransport: PostgresTransport$1} = PostgresTransport_1;

  var transports = {
    Transport: Transport$4, ConsoleTransport: ConsoleTransport$1, FileTransport: FileTransport$1, PostgresTransport: PostgresTransport$1
  };

  const {Transport: Transport$5, FileTransport: FileTransport$2, ConsoleTransport: ConsoleTransport$2, PostgresTransport: PostgresTransport$2} = transports;
  const {Simple: Simple$2, Combine: Combine$1, Inspect: Inspect$1} = Format;

  const parseStack = (stack, o = 3) => {
    const lines = stack.toString().split('\n');
    const line = lines[o];
    const [,method] = line.match(/at (.+)? /);
    const [,file,row,col] = line.match(/.+\\(.+?\..+?):(\d+):(\d+)\)/);
    return {file, method, row, col}
  };
  const getLine = (offset = 0) => {
    try {
      throw new Error ('Test');
    } catch (e) {
      const info = parseStack (e.stack, offset + 2);
      return info;
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
        options.tag = [level, ...args];
        message = null;
        level = 'info';
      } else if (message.raw && args.length > 0) {
      

        options = {};
        options.tag = [message, ...args1];
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

  Logger.levels = levels$2;
  Logger.defaults = {
    levels: 'rfc5424'
  };

  Logger.prototype[Symbol.toStringTag] = 'Hi';
  Logger.prototype.transports = [Transport$5.default];
  Logger.prototype.gather = {
    ts: () => +new Date,
    loc: () => getLine(3),
  };

  function gather (instance, options, add) {
    for (const key in instance.gather) {
      options[key] = instance.gather[key]();
    }
    Object.assign(options, add);
  }
  const transports$1 = [
    new ConsoleTransport$2({formatter: new Simple$2}), 
    new FileTransport$2('test.log'),
    new PostgresTransport$2('psql://postgres:password@localhost/kruch')
  ];
  const logger = new Logger('debug', {transports: transports$1});

  logger.log`Hey ${"asd"} ${1234} ${{foo:'bar'}}`;
  logger.warning('Warning');
  logger.warning`Warning ${1234}`;
  logger.error`Custom Error (${new Error('TestException')})`;

  console.log(util__default['default'].inspect({a:'b'}));

  var Logger_1 = {Logger};

  const {Logger: Logger$1} = Logger_1;


  var _000Log = {
    Logger: Logger$1,
    Transports: transports
  };
  var _000Log_1 = _000Log.Logger;
  var _000Log_2 = _000Log.Transports;

  exports.Logger = _000Log_1;
  exports.Transports = _000Log_2;
  exports.default = _000Log;

  return exports;

}({}, fs, moment, util, chalk, pgPromise));
