const {Logger} = require('./Logger');

const {Table} = require('./transports/ConsoleTransport');
const {ConsoleTransport} = require('./transports');
const {FileTransport}= require('./transports/FileTransport');
// const {PostgresTransport}= require('./transports/PostgresTransport')
const {Color} = require('./formatters/Color');
const {Inspect} = require('./formatters/Inspect');

const transports = [
  new ConsoleTransport({formatter: new Color, features: [
    new Table,
  ]}),
  new FileTransport('test.log', {formatter: new Inspect}),
  // new PostgresTransport('psql://postgres:password@localhost/kruch')
];
const logger = new Logger('debug', {transports});

// ConsoleTransport.supress = true;

const util = require('util');
logger.table(transports).log`Test`;
logger.log`Hey ${'asd'} ${1234} ${{foo: 'bar'}}`;
// logger.transports[0].formatter.formatMap.get(Color.isObject).unshift(v => util.inspect(v, false, 12, true));
Color.formatMap.get(Color.isObject).unshift((v) => util.inspect(v, false, 12, true));
logger.log`Hey ${'asd'} ${1234} ${{foo: 'bar'}}`;
logger.warning('Warning');
logger.warning`Warning ${1234}`;
logger.error`Custom Error (${new Error('TestException')})`;
