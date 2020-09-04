const {Logger} = require('./Logger');

const {Transport, ConsoleTransport} = require('./transports')
const {Table} = require('./transports/ConsoleTransport')
const {FileTransport}= require('./transports/FileTransport')
const {PostgresTransport}= require('./transports/PostgresTransport')
const {Color} = require('./formatters/Color');

const transports = [
  new ConsoleTransport({formatter: new Color, features:[
    new Table
  ]}), 
  new FileTransport('test.log'),
  new PostgresTransport('psql://postgres:password@localhost/kruch')
]
const logger = new Logger('debug', {transports});

const util = require('util');
console.log(util.inspect(logger));
logger.table([{a:'b'}]).log`Test`;
logger.log`Hey ${"asd"} ${1234} ${{foo:'bar'}}`
logger.warning('Warning')
logger.warning`Warning ${1234}`
logger.error`Custom Error (${new Error('TestException')})`
