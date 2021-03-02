const {
  Logger
} = require('../Logger');

const {
  ConsoleTransport
} = require('../transports');

const {
  Color
} = require('../formatters/Color'); // eslint-disable-next-line linebreak-style


const transports = [new ConsoleTransport({
  formatter: new Color()
})];
const logger = new Logger('debug', {
  transports
}); // logger.log`Hello World! Numbers: ${1234} Strings: ${'foo'} Objects: ${{foo:'bar'}}`;

const util = require('util');

logger.log`Hello World! Numbers: ${1234} Strings: ${'foo'} Objects: ${{
  foo: 'bar'
}}`;
Color.formatMap.get(Color.isObject).unshift(v => util.inspect(v, true, false, 12, true));
logger.log`Hello World! Numbers: ${1234} Strings: ${'foo'} Objects: ${{
  foo: 'bar'
}}`;